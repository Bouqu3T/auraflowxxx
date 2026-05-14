'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
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

const SHICHEN_TO_HOUR: Record<string, { start: number; end: number; zhiIndex: number }> = {
  '子时': { start: 23, end: 0, zhiIndex: 0 },
  '丑时': { start: 1, end: 2, zhiIndex: 1 },
  '寅时': { start: 3, end: 4, zhiIndex: 2 },
  '卯时': { start: 5, end: 6, zhiIndex: 3 },
  '辰时': { start: 7, end: 8, zhiIndex: 4 },
  '巳时': { start: 9, end: 10, zhiIndex: 5 },
  '午时': { start: 11, end: 12, zhiIndex: 6 },
  '未时': { start: 13, end: 14, zhiIndex: 7 },
  '申时': { start: 15, end: 16, zhiIndex: 8 },
  '酉时': { start: 17, end: 18, zhiIndex: 9 },
  '戌时': { start: 19, end: 20, zhiIndex: 10 },
  '亥时': { start: 21, end: 22, zhiIndex: 11 }
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

function calculateBazi(birthDate: string, birthTime: string): {
  year: string;
  month: string;
  day: string;
  hour: string;
  wuxing: Record<string, number>;
  missingWuxing: string[];
} {
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

const ReportPage = () => {
  const router = useRouter();
  const [isLogicChainOpen, setIsLogicChainOpen] = useState(false);
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
    
    // 优先推荐用户缺少的五行
    bazi.missingWuxing.forEach(el => {
      if (!used.has(el)) {
        used.add(el);
        result.push(el);
      }
    });
    
    // 如果缺少的五行不足2个，从场景推荐中补充（排除已有的）
    sceneElements.forEach(el => {
      if (!used.has(el) && result.length < 2) {
        used.add(el);
        result.push(el);
      }
    });
    
    // 如果还不足2个，补充第一个场景元素
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

  const radarChartData = useMemo(() => {
    if (!bazi) {
      return [
        { element: '木', value: 40, color: '#7C9B76' },
        { element: '火', value: 30, color: '#B56D59' },
        { element: '土', value: 20, color: '#B79A61' },
        { element: '金', value: 10, color: '#A7A9AE' },
        { element: '水', value: 20, color: '#6F8EA8' }
      ];
    }
    const { wuxing } = bazi;
    const colorMap: Record<string, string> = {
      '木': '#7C9B76',
      '火': '#B56D59',
      '土': '#B79A61',
      '金': '#A7A9AE',
      '水': '#6F8EA8'
    };
    return [
      { element: '木', value: wuxing['木'] || 20, color: colorMap['木'] },
      { element: '火', value: wuxing['火'] || 20, color: colorMap['火'] },
      { element: '土', value: wuxing['土'] || 20, color: colorMap['土'] },
      { element: '金', value: wuxing['金'] || 20, color: colorMap['金'] },
      { element: '水', value: wuxing['水'] || 20, color: colorMap['水'] }
    ];
  }, [bazi]);

  const summary = useMemo(() => {
    if (!bazi) return '正在分析你的能量场...';
    const missing = bazi.missingWuxing;
    const effect = questionnaireAnswers?.primary_effect || '事业';
    if (missing.length > 0) {
      return `你的能量场五行缺${missing.join('、')}，当前${effect}诉求权重最高，建议补充${recommendedElements.join('、')}元素来平衡能量。`;
    }
    return `你的五行分布相对均衡，当前${effect}诉求权重最高，建议以${recommendedElements.join('、')}元素为主进行调衡。`;
  }, [bazi, questionnaireAnswers?.primary_effect, recommendedElements]);

  const logicChain = useMemo(() => {
    if (!profile || !bazi) return [];
    return [
      {
        title: '生辰基础信息',
        summary: `出生于 ${profile.birth_date} ${profile.birth_time || ''}，性别 ${profile.gender}`,
        description: `系统根据你提供的出生信息，计算出你的八字命盘为：${bazi.year}年 ${bazi.month}月 ${bazi.day}日 ${bazi.hour}时`
      },
      {
        title: '五行分布判断',
        summary: `八字为 ${bazi.year}，五行缺 ${bazi.missingWuxing.join('、') || '无'}`,
        description: `通过分析你的八字命盘，发现 ${bazi.missingWuxing.length > 0 ? `你的五行中${bazi.missingWuxing.join('、')}元素相对较弱` : '你的五行分布相对平衡'}`
      },
      {
        title: '场景加权',
        summary: `当前以「${sceneName}」为最高优先级`,
        description: `你选择的场景是${sceneName}，系统会优先考虑有助于${questionnaireAnswers?.primary_effect || '事业'}发展的能量搭配`
      },
      {
        title: '匹配矿石方向',
        summary: `建议优先补 ${recommendedElements[0]}，再辅以 ${recommendedElements[1] || recommendedElements[0]} 元素`,
        description: `根据五行相生相克原理，${recommendedElements[0]}元素有助于${questionnaireAnswers?.primary_effect || '事业'}发展，${recommendedElements[1] || recommendedElements[0]}元素有助于智慧和表达`
      },
      {
        title: '推荐矿石组合',
        summary: `${recommendedCrystals.slice(0, 3).join(' + ')}`,
        description: `${recommendedCrystals[0] || '白水晶'}有助于整体能量净化，${recommendedCrystals[1] || '绿幽灵'}有助于事业发展，${recommendedCrystals[2] || '海蓝宝'}有助于表达和沟通`
      }
    ];
  }, [profile, bazi, questionnaireAnswers, sceneName, recommendedElements, recommendedCrystals]);

  const getWuxingColor = (element: string) => {
    const colorMap: Record<string, string> = {
      '木': 'bg-wu-wood',
      '火': 'bg-wu-fire',
      '土': 'bg-wu-earth',
      '金': 'bg-wu-metal',
      '水': 'bg-wu-water'
    };
    return colorMap[element] || 'bg-jade';
  };

  const getWuxingTextColor = (element: string) => {
    const colorMap: Record<string, string> = {
      '木': 'text-wu-wood',
      '火': 'text-wu-fire',
      '土': 'text-wu-earth',
      '金': 'text-wu-metal',
      '水': 'text-wu-water'
    };
    return colorMap[element] || 'text-jade';
  };

  const getWuxingBeadClass = (element: string) => {
    const beadMap: Record<string, string> = {
      '木': 'bead-wood',
      '火': 'bead-fire',
      '土': 'bead-earth',
      '金': 'bead-metal',
      '水': 'bead-water'
    };
    return beadMap[element] || 'bead-earth';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center bg-xuan">
        <div className="text-center scroll-enter">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full jade-bead animate-jade-glow">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-ink-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full animate-jade-breathe border border-jade/20" />
          </div>
          <p className="text-tea tracking-wide text-base">正在解析能量场...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center bg-xuan">
        <div className="text-center px-6 scroll-enter">
          <div className="w-16 h-16 rounded-full bg-mist flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-ash" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-tea mb-4">未检测到档案信息</p>
          <Button onClick={() => router.push('/profile')} className="btn-secondary">
            返回档案页
          </Button>
        </div>
      </div>
    );
  }

  const handleSavePoster = () => {
    router.push('/poster');
  };

  const handleViewPlans = () => {
    router.push('/plans');
  };

  return (
    <div className="min-h-screen bg-paper bg-xuan bg-cloud pb-24">
      <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-xl px-6 py-4 border-b border-border-ink/40">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="relative w-10 h-10 rounded-full bg-paper-white border border-border-ink shadow-card flex items-center justify-center text-tea hover:text-ink hover:border-jade/50 transition-all duration-300"
          >
            ←
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
          </button>
          <Logo size="small" showText={false} className="ml-4" />
          <h1 className="text-xl font-medium text-ink ml-2 tracking-wide">能量解析报告</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        <Card className="report-card mb-6 scroll-enter" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-medium text-ink tracking-wide">{profile.name}</h2>
                <span className="seal-stamp text-xs">专属命理档案</span>
              </div>
              <p className="text-tea text-sm">场景：{sceneName}</p>
              {bazi && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ash">八字：</span>
                    <span className="text-sm text-ink font-medium tracking-wider">
                      {bazi.year} {bazi.month} {bazi.day} {bazi.hour}
                    </span>
                  </div>
                  {profile.birth_time && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ash">出生时辰：</span>
                      <span className="text-xs text-tea">{profile.birth_time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-ash">五行属性：</span>
                    <div className="flex items-center gap-1.5">
                      {['木', '火', '土', '金', '水'].map((el) => (
                        <div key={el} className="flex items-center gap-1">
                          <div className={`w-3.5 h-3.5 rounded-full ${getWuxingColor(el)}`} />
                          <span className="text-xs text-ink">{el}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="w-14 h-14 rounded-lg border-2 border-jade/30 flex items-center justify-center bg-paper-white">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-jade-dark">
                <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        </Card>

        <Card className="chart-container mb-6 scroll-enter" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-jade/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-jade-dark">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ink">五行分布</h3>
            </div>
            <div className="flex items-center gap-2">
              {['木', '火', '土', '金', '水'].map((el) => (
                <div key={el} className="flex items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${getWuxingColor(el)}`} />
                  <span className="text-xs text-tea">{el}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarChartData}>
                <PolarGrid stroke="#D4CDC0" strokeWidth={0.8} />
                <PolarAngleAxis 
                  dataKey="element" 
                  tick={{ fill: '#2B2824', fontSize: 14, fontWeight: 600 }}
                  tickLine={{ stroke: '#D4CDC0', strokeWidth: 0.8 }}
                />
                <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#6E655B', fontSize: 11 }}
                    tickLine={{ stroke: '#D4CDC0', strokeWidth: 0.8 }}
                  />
                <Radar
                  name="能量值"
                  dataKey="value"
                  stroke="#9C7C53"
                  strokeWidth={2.5}
                  fill="#BFA478"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="card mb-6 scroll-enter" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-jade/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-jade">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-md font-medium text-ink tracking-wide">当前结论</h3>
              <p className="text-tea text-sm mt-1.5 leading-relaxed">{summary}</p>
            </div>
          </div>
        </Card>

        <Card className="card mb-6 scroll-enter" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium text-ink tracking-wide">五行建议</h3>
            <span className="text-xs text-ash">推荐补充</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedElements.map((element) => (
              <span key={element} className={`px-4 py-2 rounded-full ${getWuxingColor(element)}/10 ${getWuxingTextColor(element)} text-sm font-medium flex items-center gap-1.5`}>
                <div className={`w-2 h-2 rounded-full ${getWuxingColor(element)}`} />
                {element}元素
              </span>
            ))}
            {bazi?.missingWuxing.map((el) => (
              <span key={`missing-${el}`} className="px-4 py-2 rounded-full bg-wu-fire/10 text-wu-fire text-sm font-medium flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-wu-fire" />
                缺{el}元素
              </span>
            ))}
          </div>
        </Card>

        <Card className="card mb-6 scroll-enter" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium text-ink tracking-wide">推荐矿石关键词</h3>
            <span className="text-xs text-ash">能量对应</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedCrystals.map((crystal) => (
              <span key={crystal} className="px-4 py-2 rounded-full bg-jade/10 text-jade-dark text-sm font-medium flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full jade-bead" />
                {crystal}
              </span>
            ))}
          </div>
        </Card>

        <Card className="card overflow-hidden scroll-enter" style={{ animationDelay: '600ms' }}>
          <button
            onClick={() => setIsLogicChainOpen(!isLogicChainOpen)}
            className="w-full flex justify-between items-center p-5"
          >
            <div>
              <h3 className="text-md font-medium text-ink tracking-wide">查看推理路径</h3>
              <p className="text-sm text-ash mt-0.5">已根据生辰、八字五行与当前诉求生成</p>
            </div>
            <div className={`w-8 h-8 rounded-full bg-jade/10 flex items-center justify-center transition-transform duration-300 ${isLogicChainOpen ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4 text-jade" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {isLogicChainOpen && (
            <div className="px-5 pb-5 border-t border-border-ink">
              <div className="pt-5 space-y-0">
                {logicChain.map((step, index) => (
                  <div key={index} className="relative pl-8 pb-5">
                    {index < logicChain.length - 1 && (
                      <div className="absolute left-[15px] top-8 w-0.5 h-full bg-gradient-to-b from-jade/30 to-border-ink"></div>
                    )}
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-jade/10 flex items-center justify-center">
                      <span className="text-jade text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-ink tracking-wide">{step.title}</h4>
                      <p className="text-sm text-jade-dark mt-1 font-medium">{step.summary}</p>
                      <p className="text-sm text-tea mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-jade/5 rounded-elegant border border-jade/10">
                  <p className="text-sm font-medium text-jade-dark">推荐结论：适合以补 {recommendedElements.join('、')} 为主</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-paper-white/95 backdrop-blur-xl border-t border-border-ink/35 px-6 py-4 flex justify-between items-center z-20">
        <Button
          onClick={handleSavePoster}
          className="btn-secondary h-11 px-6"
        >
          保存报告海报
        </Button>
        <Button
          onClick={handleViewPlans}
          className="btn-primary h-11 px-6"
        >
          查看专属疗愈手串
        </Button>
      </div>
    </div>
  );
};

export default ReportPage;