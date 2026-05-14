'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

interface Profile {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  gender: string;
  location: string;
  is_default: boolean;
}

interface QuestionnaireAnswers {
  primary_effect: string;
  desired_effects: string[];
  color_preference: string[];
  style_preference: string;
  decoration_preference: string;
  bead_size: string;
}

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};
const DIZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

function getGanIndex(year: number): number {
  const baseYear = 1984;
  return ((year - baseYear) % 10 + 10) % 10;
}

function getZhiIndex(year: number): number {
  const baseYear = 1984;
  return ((year - baseYear) % 12 + 12) % 12;
}

function getMonthGan(yearGanIndex: number, month: number): number {
  const monthGanStart: Record<number, number> = {
    0: 6, 1: 8, 2: 0, 3: 2, 4: 4,
    5: 6, 6: 8, 7: 0, 8: 2, 9: 4
  };
  return (monthGanStart[yearGanIndex] + month - 1) % 10;
}

function getDayGanIndex(dateStr: string): number {
  const date = new Date(dateStr);
  const baseDate = new Date(2000, 0, 1);
  const daysSinceBase = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  return ((daysSinceBase + 6) % 10 + 10) % 10;
}

function getDayZhiIndex(dateStr: string): number {
  const date = new Date(dateStr);
  const baseDate = new Date(2000, 0, 1);
  const daysSinceBase = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  return ((daysSinceBase + 8) % 12 + 12) % 12;
}

function calculateBazi(birthDate: string, birthTime: string) {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const yearGanIndex = getGanIndex(year);
  const yearZhiIndex = getZhiIndex(year);
  const yearGan = TIANGAN[yearGanIndex];
  const yearZhi = DIZHI[yearZhiIndex];

  const monthGanIndex = getMonthGan(yearGanIndex, month);
  const monthGan = TIANGAN[monthGanIndex];
  const monthZhi = DIZHI[(month + 1) % 12];

  const dayGanIndex = getDayGanIndex(birthDate);
  const dayZhiIndex = getDayZhiIndex(birthDate);
  const dayGan = TIANGAN[dayGanIndex];
  const dayZhi = DIZHI[dayZhiIndex];

  let hourZhiIndex = 0;
  let hourGan = '';
  const SHICHEN_TO_HOUR: Record<string, { zhiIndex: number }> = {
    '子时': { zhiIndex: 0 }, '丑时': { zhiIndex: 1 }, '寅时': { zhiIndex: 2 },
    '卯时': { zhiIndex: 3 }, '辰时': { zhiIndex: 4 }, '巳时': { zhiIndex: 5 },
    '午时': { zhiIndex: 6 }, '未时': { zhiIndex: 7 }, '申时': { zhiIndex: 8 },
    '酉时': { zhiIndex: 9 }, '戌时': { zhiIndex: 10 }, '亥时': { zhiIndex: 11 }
  };

  if (birthTime && SHICHEN_TO_HOUR[birthTime]) {
    hourZhiIndex = SHICHEN_TO_HOUR[birthTime].zhiIndex;
    hourGan = TIANGAN[(dayGanIndex * 2 + hourZhiIndex) % 10];
  } else {
    const hour = date.getHours();
    hourZhiIndex = (Math.floor(hour / 2) + 1) % 12;
    hourGan = TIANGAN[(dayGanIndex * 2 + hourZhiIndex) % 10];
  }
  const hourZhi = DIZHI[hourZhiIndex];

  const wuxingCount: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  const stems = [yearGan, monthGan, dayGan, hourGan];
  const branches = [yearZhi, monthZhi, dayZhi, hourZhi];

  stems.forEach(s => { wuxingCount[WUXING[s]]++; });
  branches.forEach(b => { wuxingCount[DIZHI_WUXING[b]]++; });

  const totalScore = Object.values(wuxingCount).reduce((a, b) => a + b, 0);
  const wuxing: Record<string, number> = {};
  Object.keys(wuxingCount).forEach(w => {
    wuxing[w] = Math.round((wuxingCount[w] / totalScore) * 100);
  });

  const missingWuxing = Object.entries(wuxing)
    .filter(([_, v]) => v < 20)
    .map(([k, _]) => k);

  return {
    year: `${yearGan}${yearZhi}`,
    month: `${monthGan}${monthZhi}`,
    day: `${dayGan}${dayZhi}`,
    hour: `${hourGan}${hourZhi}`,
    wuxing,
    missingWuxing
  };
}

const PosterPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProfile = localStorage.getItem('selected_profile');
    const storedAnswers = localStorage.getItem('questionnaire_answers');

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
    if (storedAnswers) {
      setQuestionnaireAnswers(JSON.parse(storedAnswers));
    }
    setLoading(false);
  }, []);

  const bazi = useMemo(() => {
    if (!profile?.birth_date) return null;
    return calculateBazi(profile.birth_date, profile.birth_time || '');
  }, [profile?.birth_date, profile?.birth_time]);

  const sceneName = useMemo(() => {
    if (!questionnaireAnswers?.primary_effect) return '综合能量平衡';
    const sceneMap: Record<string, string> = {
      '事业': '事业运提升',
      '财运': '招财能量',
      '情感': '情感疗愈',
      '安神': '平静身心',
      '学业': '学业专注'
    };
    return sceneMap[questionnaireAnswers.primary_effect] || '综合能量平衡';
  }, [questionnaireAnswers?.primary_effect]);

  const recommendedElements = useMemo(() => {
    if (!bazi) return ['木', '水'];
    
    const effectElementMap: Record<string, string[]> = {
      '事业': ['木', '水'],
      '财运': ['土', '金'],
      '情感': ['火', '木'],
      '安神': ['水', '土'],
      '学业': ['水', '木']
    };
    const effect = questionnaireAnswers?.primary_effect || '';
    const sceneElements = effectElementMap[effect] || ['木', '水'];
    
    const result: string[] = [];
    const used = new Set<string>();
    
    bazi.missingWuxing.forEach(el => {
      if (!used.has(el)) {
        used.add(el);
        result.push(el);
      }
    });
    
    sceneElements.forEach(el => {
      if (!used.has(el) && result.length < 2) {
        used.add(el);
        result.push(el);
      }
    });
    
    if (result.length === 0) {
      result.push(sceneElements[0], sceneElements[1] || sceneElements[0]);
    } else if (result.length === 1) {
      result.push(sceneElements[0] === result[0] ? sceneElements[1] || '木' : sceneElements[0]);
    }
    
    return result;
  }, [bazi, questionnaireAnswers?.primary_effect]);

  const recommendedCrystals = useMemo(() => {
    const elements = recommendedElements;
    const crystalMap: Record<string, string[]> = {
      '木': ['绿幽灵', '翡翠', '东陵玉'],
      '火': ['红玛瑙', '石榴石', '红碧玺'],
      '土': ['黄水晶', '虎眼石', '金发晶'],
      '金': ['白水晶', '银饰', '钛晶'],
      '水': ['海蓝宝', '蓝月光', '黑曜石']
    };
    const crystals: string[] = [];
    const seen = new Set<string>();
    elements.forEach(el => {
      if (crystalMap[el]) {
        crystalMap[el].forEach(crystal => {
          if (!seen.has(crystal)) {
            seen.add(crystal);
            crystals.push(crystal);
          }
        });
      }
    });
    return crystals.slice(0, 4);
  }, [recommendedElements]);

  const summary = useMemo(() => {
    if (!bazi) return '';
    const missing = bazi.missingWuxing;
    if (missing.length > 0) {
      const elementDesc: Record<string, string> = {
        '木': '木气',
        '火': '火气',
        '土': '土气',
        '金': '金气',
        '水': '水气'
      };
      return `${missing.map(m => elementDesc[m]).join('与')}略弱，以${recommendedElements.map(r => elementDesc[r]).join('与')}调和为宜`;
    }
    return `五行均衡，以${recommendedElements.join('、')}元素为主调衡`;
  }, [bazi, recommendedElements]);

  const getWuxingColor = (element: string) => {
    const colorMap: Record<string, string> = {
      '木': '#7C9B76',
      '火': '#B56D59',
      '土': '#B79A61',
      '金': '#A7A9AE',
      '水': '#6F8EA8'
    };
    return colorMap[element] || '#BFA478';
  };

  const crystalDesc = useMemo(() => {
    if (!bazi || recommendedElements.length === 0) return '';
    const descMap: Record<string, string> = {
      '木': '以温润木气疏通停滞',
      '火': '以温暖火气点燃激情',
      '土': '以沉稳土气稳固根基',
      '金': '以锐利金气提升决断',
      '水': '以柔和水意平衡内在流动'
    };
    return recommendedElements.map(e => descMap[e]).join('，');
  }, [bazi, recommendedElements]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#BFA478]/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#9C7C53]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[#6E655B]">生成海报中...</p>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    alert('海报已保存到相册');
  };

  const handleOrder = () => {
    router.push('/plans');
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-[#E6DED2] flex items-center justify-center text-[#6E655B] hover:text-[#2B2824] transition-colors"
          >
            ←
          </button>
          <span className="text-[#9C7C53] font-medium">海报预览</span>
          <div className="w-10" />
        </div>

        <div id="poster" className="bg-[#FCFAF6] rounded-3xl shadow-lg overflow-hidden">
          <div className="relative bg-gradient-to-b from-[#F7F4EE] to-[#FCFAF6] p-8 pb-6">
            <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                <path 
                  d="M0,60 Q100,20 200,60 T400,60" 
                  fill="none" 
                  stroke="#E6DED2" 
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              </svg>
            </div>

            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <Logo size="small" showText={false} />
                <span className="text-lg font-semibold text-[#2B2824] tracking-[0.15em]">AURA FLOW</span>
              </div>
              <p className="text-xs text-[#9D9387] tracking-[0.3em]">专属能量海报</p>
              <div className="w-12 h-px bg-[#E6DED2] mx-auto mt-3" />
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-[#E6DED2] mb-6">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-[#2B2824]">{profile?.name || '用户'}的专属能量档案</h2>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#BFA478]/10 text-[#9C7C53] text-xs">
                  {sceneName}
                </span>
              </div>

              {bazi && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9D9387]">八字命盘</span>
                    <span className="text-[#2B2824] font-medium tracking-wider">
                      {bazi.year} {bazi.month} {bazi.day} {bazi.hour}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9D9387]">五行状态</span>
                    <div className="flex items-center gap-1.5">
                      {['木', '火', '土', '金', '水'].map((el) => (
                        <div key={el} className="flex items-center gap-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getWuxingColor(el) }}
                          />
                          <span className="text-xs text-[#6E655B]">{el}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/40 rounded-2xl p-5 mb-6">
              <p className="text-center text-[#6E655B] leading-relaxed text-sm">
                {summary}
              </p>
              {crystalDesc && (
                <p className="text-center text-[#9D9387] text-xs mt-2 italic">
                  {crystalDesc}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-center text-sm text-[#9D9387] mb-3">推荐矿石</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {recommendedCrystals.map((crystal) => (
                  <span 
                    key={crystal} 
                    className="px-4 py-2 rounded-full bg-white/60 text-[#9C7C53] text-sm border border-[#E6DED2]"
                  >
                    {crystal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border-t border-[#E6DED2] p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#BFA478]" />
              <div className="w-2 h-2 rounded-full bg-[#7C9B76]" />
              <div className="w-2 h-2 rounded-full bg-[#6F8EA8]" />
            </div>
            <div className="text-center">
              <p className="text-xs text-[#9D9387] tracking-wider">能量 · 连接 · 平衡</p>
            </div>
          </div>

          <div className="bg-[#2B2824] p-4 text-center">
            <p className="text-white/60 text-xs tracking-wider">AURA FLOW · 灵韵能量</p>
            <p className="text-white/40 text-xs mt-0.5">www.auraflow.com</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleDownload}
            className="flex-1 h-12 rounded-full bg-white border border-[#E6DED2] text-[#6E655B] hover:bg-[#F7F4EE] transition-colors"
          >
            保存海报
          </Button>
          <Button
            onClick={handleOrder}
            className="flex-1 h-12 rounded-full bg-[#9C7C53] text-white hover:bg-[#BFA478] transition-colors"
          >
            立即下单
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PosterPage;
