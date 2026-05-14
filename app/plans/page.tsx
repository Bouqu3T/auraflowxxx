'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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

interface PlanDetail {
  id: string;
  price_tier: string;
  price: number;
  crystals: string[];
  image_url: string;
  reason_summary: string;
  description: string;
  effects: string[];
}

interface Plan {
  id: string;
  price_tier: string;
  price: number;
  crystals: string[];
  image_url: string;
  reason_summary: string;
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

const PlansPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanDetail | null>(null);
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
    return effectElementMap[effect] || ['木', '水'];
  }, [bazi, questionnaireAnswers?.primary_effect]);

  const crystalDatabase = useMemo(() => ({
    '木': [
      { name: '绿幽灵', level: 'premium', desc: '吸引财富和成功' },
      { name: '翡翠', level: 'premium', desc: '增强智慧和幸福' },
      { name: '东陵玉', level: 'budget', desc: '带来好运和繁荣' },
      { name: '绿玛瑙', level: 'budget', desc: '提升事业运和创造力' },
      { name: '绿碧玺', level: 'luxury', desc: '激发潜能和创造力' }
    ],
    '火': [
      { name: '红玛瑙', level: 'budget', desc: '增强活力和勇气' },
      { name: '石榴石', level: 'budget', desc: '提升生命力和激情' },
      { name: '红碧玺', level: 'premium', desc: '增强自信和魅力' },
      { name: '红兔毛', level: 'premium', desc: '温暖心灵和情感' },
      { name: '红纹石', level: 'luxury', desc: '强化爱情和感情' }
    ],
    '土': [
      { name: '黄水晶', level: 'budget', desc: '招财进宝和提升自信' },
      { name: '虎眼石', level: 'budget', desc: '增强勇气和自信' },
      { name: '金发晶', level: 'premium', desc: '带来好运和财富' },
      { name: '黄兔毛', level: 'premium', desc: '稳定情绪和平衡' },
      { name: '钛晶', level: 'luxury', desc: '强化能量和财富' }
    ],
    '金': [
      { name: '白水晶', level: 'budget', desc: '净化能量和增强专注力' },
      { name: '白阿塞', level: 'premium', desc: '增强灵性和直觉' },
      { name: '钛晶', level: 'luxury', desc: '提升个人魅力和领导力' },
      { name: '月光石', level: 'premium', desc: '增强直觉和情感' },
      { name: '银饰', level: 'budget', desc: '净化和平衡能量' }
    ],
    '水': [
      { name: '海蓝宝', level: 'budget', desc: '平静情绪和增强沟通' },
      { name: '蓝月光', level: 'premium', desc: '增强直觉和情感平衡' },
      { name: '黑曜石', level: 'budget', desc: '保护和净化能量' },
      { name: '海纹石', level: 'luxury', desc: '平静情绪和增强沟通能力' },
      { name: '蓝玉髓', level: 'premium', desc: '增强表达和沟通' }
    ]
  }), []);

  const effectDescriptionMap = useMemo(() => ({
    '事业': ['提升事业运', '增强创造力', '带来机遇', '增强领导力'],
    '财运': ['招财进宝', '带来好运', '增强自信', '稳定财富'],
    '情感': ['增强爱情运', '提升魅力', '稳定感情', '增强吸引力'],
    '安神': ['平静情绪', '缓解焦虑', '改善睡眠', '净化能量'],
    '学业': ['提升专注力', '增强记忆力', '带来智慧', '稳定情绪']
  }), []);

  const generatePlans = useMemo((): Plan[] => {
    const primaryEffect = questionnaireAnswers?.primary_effect || '事业';
    
    const element1 = recommendedElements[0];
    const element2 = recommendedElements[1] || element1;
    
    const element1Crystals = crystalDatabase[element1] || [];
    const element2Crystals = crystalDatabase[element2] || [];
    
    const budgetCrystals1 = element1Crystals.filter(c => c.level === 'budget');
    const budgetCrystals2 = element2Crystals.filter(c => c.level === 'budget');
    const premiumCrystals1 = element1Crystals.filter(c => c.level === 'premium');
    const premiumCrystals2 = element2Crystals.filter(c => c.level === 'premium');
    const luxuryCrystals1 = element1Crystals.filter(c => c.level === 'luxury');
    const luxuryCrystals2 = element2Crystals.filter(c => c.level === 'luxury');
    
    const getCrystal = (arr: any[], fallback: string) => arr.length > 0 ? arr[0].name : fallback;
    
    const missingStr = bazi?.missingWuxing && bazi.missingWuxing.length > 0 ? `补${bazi.missingWuxing.join('、')}` : '平衡能量';
    
    return [
      {
        id: '1',
        price_tier: '灵韵入门',
        price: 168,
        crystals: [
          getCrystal(budgetCrystals1, '绿玛瑙'),
          getCrystal(budgetCrystals2, '白水晶')
        ],
        image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20minimalist%20crystal%20bracelet%20jade%20style&image_size=square_hd`,
        reason_summary: `优先${missingStr}，兼顾${primaryEffect}`
      },
      {
        id: '2',
        price_tier: '灵韵臻选',
        price: 299,
        crystals: [
          getCrystal(premiumCrystals1, '绿幽灵'),
          getCrystal(premiumCrystals2, '海蓝宝'),
          '白阿塞'
        ],
        image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20crystal%20bracelet%20with%20jade%20elements&image_size=square_hd`,
        reason_summary: `更适合${primaryEffect}，${missingStr}`
      },
      {
        id: '3',
        price_tier: '灵韵尊享',
        price: 599,
        crystals: [
          getCrystal(luxuryCrystals1, '绿碧玺'),
          getCrystal(luxuryCrystals2, '海纹石'),
          '金钛晶'
        ],
        image_url: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20jade%20crystal%20bracelet%20elegant%20oriental&image_size=square_hd`,
        reason_summary: `强化行动力与能量场，${missingStr}`
      }
    ];
  }, [recommendedElements, bazi, questionnaireAnswers?.primary_effect, crystalDatabase]);

  const generatePlanDetails = useMemo((): PlanDetail[] => {
    const plans = generatePlans;
    const primaryEffect = questionnaireAnswers?.primary_effect || '事业';
    const effects = effectDescriptionMap[primaryEffect] || effectDescriptionMap['事业'];
    
    return plans.map((plan, index) => {
      const descriptions = [
        '灵韵入门级手串，适合初次接触水晶能量的探索者，以基础能量平衡为主。',
        '灵韵臻选级手串，适合希望深度调衡能量的进阶者，兼顾多方面能量提升。',
        '灵韵尊享级手串，适合追求高阶能量加持的修行者，强化整体能量场。'
      ];
      
      return {
        ...plan,
        description: `${descriptions[index]}${plan.crystals.map((c, i) => `${c}有助于${effects[i % effects.length]}`).join('，')}。`,
        effects: effects.slice(0, 4)
      };
    });
  }, [generatePlans, questionnaireAnswers?.primary_effect, effectDescriptionMap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center bg-xuan">
        <div className="text-center scroll-enter">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full jade-bead animate-jade-glow">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-ink-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-tea tracking-wide">正在生成专属方案...</p>
        </div>
      </div>
    );
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleGeneratePoster = () => {
    router.push('/poster');
  };

  const handleCheckout = () => {
    if (selectedPlan) {
      const plan = generatePlans.find(p => p.id === selectedPlan);
      if (plan) {
        localStorage.setItem('selected_plan', JSON.stringify(plan));
        router.push('/order/confirm');
      }
    }
  };

  const handleViewDetail = (planId: string) => {
    const plan = generatePlanDetails.find(p => p.id === planId);
    if (plan) {
      setCurrentPlan(plan);
      setShowDetailModal(true);
    }
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
          <h1 className="text-xl font-medium text-ink ml-4 tracking-wide">专属疗愈手串</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="text-tea text-sm mb-6 tracking-wide">
          根据你的能量报告，为你生成 3 套专属方案
        </div>

        <div className="space-y-4">
          {generatePlans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`p-5 rounded-soft transition-all cursor-pointer overflow-hidden border ${
                selectedPlan === plan.id
                  ? 'card-selected'
                  : 'card card-hover'
              }`}
              onClick={() => handleSelectPlan(plan.id)}
              style={{ animationDelay: `${index * 100 + 100}ms` }}
            >
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={plan.image_url}
                    alt={`${plan.price_tier}手串`}
                    className="w-full h-full object-cover rounded-elegant"
                  />
                  {selectedPlan === plan.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full jade-bead flex items-center justify-center shadow-jade-glow">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-ink tracking-wide">{plan.price_tier}</h3>
                    {selectedPlan === plan.id && (
                      <span className="seal-stamp text-xs">已选中</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-semibold text-ink">¥{plan.price}</span>
                    <span className="text-xs text-ash">/套</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {plan.crystals.map((crystal) => (
                      <span key={crystal} className="px-3 py-1 rounded-full bg-jade/10 text-jade-dark text-xs font-medium">
                        {crystal}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-tea">{plan.reason_summary}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(plan.id);
                  }}
                  className="self-start px-4 py-2 rounded-full border border-jade/50 text-jade-dark text-sm font-medium hover:bg-jade/10 transition-all duration-300"
                >
                  查看详情
                </button>
              </div>
            </Card>
          ))}
        </div>

        <Card 
          className="mt-6 p-5 rounded-soft border border-border-ink/60 bg-paper-white/90 hover:border-jade/30 transition-all cursor-pointer scroll-enter"
          style={{ animationDelay: '400ms' }}
          onClick={() => router.push('/diy')}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-elegant bg-jade/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-jade" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"/>
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor"/>
              </svg>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-ink tracking-wide mb-2">DIY 专属搭配</h3>
              <div className="grid grid-cols-3 gap-2 text-sm text-tea">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-jade" />
                  自由搭配
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-jade" />
                  实时预览
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-jade" />
                  能量建议
                </div>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-jade/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-jade" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-paper-white/95 backdrop-blur-xl border-t border-border-ink/35 px-6 py-4 flex justify-between items-center z-20">
        <Button
          onClick={handleGeneratePoster}
          className="btn-secondary h-11 px-6"
        >
          生成专属海报
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={!selectedPlan}
          className={`h-11 px-6 rounded-full font-medium transition-all duration-300 ${
            selectedPlan
              ? 'btn-primary'
              : 'bg-border-ink/50 text-ash cursor-not-allowed'
          }`}
        >
          选择并下单
        </Button>
      </div>

      {showDetailModal && currentPlan && (
        <div className="fixed inset-0 bg-ink/30 flex items-end z-50">
          <div className="bg-paper-white w-full rounded-t-soft max-h-[85vh] overflow-y-auto animate-scroll-in">
            <div className="relative h-48">
              <img
                src={currentPlan.image_url}
                alt={`${currentPlan.price_tier}手串`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper-white via-paper-white/50 to-transparent"></div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper-white/90 flex items-center justify-center text-tea hover:text-ink transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-ink tracking-wide">{currentPlan.price_tier}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-ink">¥{currentPlan.price}</span>
                  <span className="text-xs text-ash">/套</span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-medium text-ash mb-2">水晶组成</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPlan.crystals.map((crystal) => (
                      <span key={crystal} className="px-4 py-2 rounded-full bg-jade/10 text-jade-dark text-sm font-medium flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full jade-bead" />
                        {crystal}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-ash mb-2">推荐理由</h4>
                  <p className="text-ink">{currentPlan.reason_summary}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-ash mb-2">方案描述</h4>
                  <p className="text-tea text-sm leading-relaxed">{currentPlan.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-ash mb-2">功效说明</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {currentPlan.effects.map((effect, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-mist/50 rounded-elegant">
                        <svg className="w-4 h-4 text-jade" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-ink">{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 h-11 rounded-full btn-secondary"
                >
                  关闭
                </Button>
                {selectedPlan === currentPlan.id ? (
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 h-11 rounded-full btn-primary"
                  >
                    立即下单
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedPlan(currentPlan.id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 h-11 rounded-full bg-jade/10 text-jade-dark font-medium hover:bg-jade/20 transition-all"
                  >
                    选择此方案
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansPage;