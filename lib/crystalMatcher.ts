import crystalsData from '../data/crystals.json';

interface Crystal {
  crystal_id: string;
  name: string;
  color: string;
  elements: string[];
  effects: string[];
  price_level: 'low' | 'medium' | 'high';
  bead_sizes: number[];
  image_url: string;
  matchScore?: number;
}

interface UserProfile {
  favorable_elements: string[];
  body_strength: 'strong' | 'weak';
  preferences: {
    desired_effects: string[];
    budget: 'low' | 'medium' | 'high';
    bead_size: number;
  };
}

interface Plan {
  price_tier: 'low' | 'medium' | 'high';
  crystals: Crystal[];
  total_price: number;
  image_url: string;
  description: string;
  reason_summary: string;
}

// 核心匹配算法
export function matchCrystals(user: UserProfile): Crystal[] {
  const allCrystals: Crystal[] = crystalsData as Crystal[];
  
  // 步骤一：硬性过滤
  let candidateCrystals = allCrystals;
  if (user.favorable_elements.length > 0) {
    candidateCrystals = allCrystals.filter(crystal => 
      crystal.elements.some(el => user.favorable_elements.includes(el))
    );
  }

  // 步骤二：多维度权重打分
  let scoredCrystals = candidateCrystals.map(crystal => {
    let score = 0;

    // 规则A：功效匹配加分
    if (user.preferences.desired_effects.length > 0) {
      const matchedEffects = crystal.effects.filter(effect => 
        user.preferences.desired_effects.some(pref => effect.includes(pref))
      );
      score += matchedEffects.length * 10;
    }

    // 规则B：身强/身弱玄学微调
    const weakKeywords = ['护身', '净化', '安神', '吸收负能量', '缓解焦虑'];
    const strongKeywords = ['招财', '事业', '决断力', '表达力', '行动力'];

    if (user.body_strength === 'weak') {
      const hasWeakMatch = crystal.effects.some(effect => weakKeywords.some(kw => effect.includes(kw)));
      if (hasWeakMatch) score += 5;
    } else if (user.body_strength === 'strong') {
      const hasStrongMatch = crystal.effects.some(effect => strongKeywords.some(kw => effect.includes(kw)));
      if (hasStrongMatch) score += 5;
    }

    // 规则C：珠子尺寸匹配
    if (user.preferences.bead_size && crystal.bead_sizes.includes(user.preferences.bead_size)) {
      score += 8;
    }

    // 规则D：预算倾向匹配
    if (user.preferences.budget && crystal.price_level === user.preferences.budget) {
      score += 5;
    }

    return { ...crystal, matchScore: score };
  });

  // 步骤三：排序输出
  scoredCrystals.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  
  return scoredCrystals;
}

// 生成三档方案
export function generateThreeTierPlans(crystals: Crystal[]): Plan[] {
  // 按价格等级分组
  const lowPriceCrystals = crystals.filter(c => c.price_level === 'low');
  const mediumPriceCrystals = crystals.filter(c => c.price_level === 'medium');
  const highPriceCrystals = crystals.filter(c => c.price_level === 'high');
  
  // 生成经济档方案
  const economicPlan: Plan = {
    price_tier: 'low',
    crystals: lowPriceCrystals.slice(0, 2),
    total_price: 199,
    image_url: lowPriceCrystals[0]?.image_url || '',
    description: '经济实惠的能量手串，适合入门级用户',
    reason_summary: '优先选择低价位水晶，满足基本能量需求'
  };
  
  // 生成均衡档方案
  const balancedPlan: Plan = {
    price_tier: 'medium',
    crystals: [...mediumPriceCrystals.slice(0, 2), ...lowPriceCrystals.slice(0, 1)],
    total_price: 399,
    image_url: mediumPriceCrystals[0]?.image_url || '',
    description: '性价比均衡的能量手串，适合大多数用户',
    reason_summary: '结合中价位水晶和少量低价位水晶，平衡效果与价格'
  };
  
  // 生成尊享档方案
  const premiumPlan: Plan = {
    price_tier: 'high',
    crystals: [...highPriceCrystals.slice(0, 2), ...mediumPriceCrystals.slice(0, 1)],
    total_price: 799,
    image_url: highPriceCrystals[0]?.image_url || '',
    description: '高端尊享的能量手串，适合追求品质的用户',
    reason_summary: '使用高价位水晶和特殊配饰，提供最强能量支持'
  };
  
  return [economicPlan, balancedPlan, premiumPlan];
}
