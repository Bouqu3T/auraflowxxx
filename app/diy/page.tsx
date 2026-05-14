'use client';
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// ============ 类型定义 ============
type ElementType = '金' | '木' | '水' | '火' | '土';
type BeadSize = 'small' | 'medium' | 'large';
type DecorationLevel = 'none' | 'minimal' | 'elegant';
type StyleTendency = 'simple' | 'balanced' | 'designed';
type PriceLevel = 'low' | 'mid' | 'high';

interface Crystal {
  id: string;
  name: string;
  color: string;
  element: ElementType;
  effects: string[];
  price: number;
  priceLevel: PriceLevel;
  imageUrl: string;
  description: string;
}

interface SelectedBead {
  instanceId: string;
  crystal: Crystal;
  size: BeadSize;
  position: number;
}

interface StyleConfig {
  beadSize: BeadSize;
  decoration: DecorationLevel;
  style: StyleTendency;
}

interface ElementScore {
  element: ElementType;
  score: number;
  count: number;
  color: string;
}

// ============ 水晶数据 ============
const crystalData: Crystal[] = [
  {
    id: '1',
    name: '白水晶',
    color: '白色',
    element: '金',
    effects: ['净化', '增强专注'],
    price: 39,
    priceLevel: 'low',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20crystal%20gemstone%20elegant%20minimalist&image_size=square',
    description: '白水晶是最纯净的水晶，有助于净化能量，增强专注力'
  },
  {
    id: '2',
    name: '绿幽灵',
    color: '绿色',
    element: '木',
    effects: ['招财', '事业运'],
    price: 89,
    priceLevel: 'mid',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=green%20phantom%20crystal%20gemstone&image_size=square',
    description: '绿幽灵能吸引正财和事业运，有助于事业发展'
  },
  {
    id: '3',
    name: '海蓝宝',
    color: '蓝色',
    element: '水',
    effects: ['平静', '沟通力'],
    price: 69,
    priceLevel: 'mid',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20aquamarine%20crystal%20gemstone&image_size=square',
    description: '海蓝宝有助于平静情绪，增强沟通能力'
  },
  {
    id: '4',
    name: '红纹石',
    color: '红色',
    element: '火',
    effects: ['情感', '自信'],
    price: 79,
    priceLevel: 'mid',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20rhodochrosite%20crystal%20gemstone&image_size=square',
    description: '红纹石能温暖心灵，增强自信和魅力'
  },
  {
    id: '5',
    name: '黄水晶',
    color: '黄色',
    element: '土',
    effects: ['招财', '自信'],
    price: 59,
    priceLevel: 'low',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yellow%20citrine%20crystal%20gemstone&image_size=square',
    description: '黄水晶是招财的代表，能增强财运和自信'
  },
  {
    id: '6',
    name: '紫水晶',
    color: '紫色',
    element: '火',
    effects: ['直觉', '智慧'],
    price: 69,
    priceLevel: 'mid',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=purple%20amethyst%20crystal%20gemstone&image_size=square',
    description: '紫水晶能增强灵性和直觉，带来平静与智慧'
  },
  {
    id: '7',
    name: '粉晶',
    color: '粉色',
    element: '火',
    effects: ['桃花', '人缘'],
    price: 49,
    priceLevel: 'low',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pink%20rose%20quartz%20crystal%20gemstone&image_size=square',
    description: '粉晶是爱情之石，能增强桃花和人际关系'
  },
  {
    id: '8',
    name: '黑曜石',
    color: '黑色',
    element: '水',
    effects: ['护身', '辟邪'],
    price: 45,
    priceLevel: 'low',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20obsidian%20crystal%20gemstone&image_size=square',
    description: '黑曜石是强力的护身符，能辟邪挡煞'
  }
];

// ============ 元素颜色映射 ============
const elementColors: Record<ElementType, string> = {
  '金': '#E6DED0',
  '木': '#81C784',
  '水': '#64B5F6',
  '火': '#FF8A65',
  '土': '#FFD54F'
};

// ============ 主组件 ============
const DiyPage = () => {
  const router = useRouter();
  
  // 状态
  const [selectedBeads, setSelectedBeads] = useState<SelectedBead[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [planName, setPlanName] = useState('我的自定义方案');
  
  // 筛选状态
  const [elementFilter, setElementFilter] = useState<ElementType | 'all'>('all');
  const [effectFilter, setEffectFilter] = useState<string | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<PriceLevel | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 风格配置
  const [styleConfig, setStyleConfig] = useState<StyleConfig>({
    beadSize: 'medium',
    decoration: 'minimal',
    style: 'balanced'
  });

  // ============ 计算属性 ============
  const totalPrice = useMemo(() => {
    return selectedBeads.reduce((sum, bead) => sum + bead.crystal.price, 0);
  }, [selectedBeads]);

  const elementScores = useMemo((): ElementScore[] => {
    const counts: Record<ElementType, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
    selectedBeads.forEach(bead => {
      counts[bead.crystal.element]++;
    });
    const max = Math.max(...Object.values(counts), 1);
    return (['金', '木', '水', '火', '土'] as ElementType[]).map(element => ({
      element,
      count: counts[element],
      score: Math.round((counts[element] / max) * 100),
      color: elementColors[element]
    }));
  }, [selectedBeads]);

  const dominantElements = useMemo(() => {
    const sorted = [...elementScores].sort((a, b) => b.count - a.count);
    return sorted.slice(0, 2).filter(s => s.count > 0).map(s => s.element);
  }, [elementScores]);

  const energySuggestion = useMemo(() => {
    if (selectedBeads.length === 0) return null;
    
    const suggestions: string[] = [];
    if (selectedBeads.length < 4) {
      suggestions.push('建议继续添加水晶，使五行更加平衡');
    }
    
    const hasWood = selectedBeads.some(b => b.crystal.element === '木');
    const hasFire = selectedBeads.some(b => b.crystal.element === '火');
    const hasWater = selectedBeads.some(b => b.crystal.element === '水');
    
    if (hasWood && hasFire) {
      suggestions.push('木火相生，能量较为充足');
    }
    if (hasWater && !hasWood) {
      suggestions.push('建议搭配木元素，增强生生不息之力');
    }
    
    return suggestions.length > 0 ? suggestions : ['五行搭配较为平衡，能量状态良好'];
  }, [selectedBeads]);

  // ============ 筛选后的水晶 ============
  const filteredCrystals = useMemo(() => {
    return crystalData.filter(crystal => {
      if (elementFilter !== 'all' && crystal.element !== elementFilter) return false;
      if (priceFilter !== 'all' && crystal.priceLevel !== priceFilter) return false;
      if (effectFilter !== 'all' && !crystal.effects.includes(effectFilter)) return false;
      if (searchKeyword && !crystal.name.includes(searchKeyword)) return false;
      return true;
    });
  }, [elementFilter, effectFilter, priceFilter, searchKeyword]);

  // ============ 操作函数 ============
  const handleAddBead = (crystal: Crystal) => {
    const instanceId = `${crystal.id}_${Date.now()}`;
    setSelectedBeads([...selectedBeads, {
      instanceId,
      crystal,
      size: styleConfig.beadSize,
      position: selectedBeads.length
    }]);
  };

  const handleRemoveBead = (instanceId: string) => {
    setSelectedBeads(selectedBeads.filter(b => b.instanceId !== instanceId));
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const newBeads = [...selectedBeads];
    [newBeads[index - 1], newBeads[index]] = [newBeads[index], newBeads[index - 1]];
    setSelectedBeads(newBeads.map((b, i) => ({ ...b, position: i })));
  };

  const handleMoveRight = (index: number) => {
    if (index >= selectedBeads.length - 1) return;
    const newBeads = [...selectedBeads];
    [newBeads[index], newBeads[index + 1]] = [newBeads[index + 1], newBeads[index]];
    setSelectedBeads(newBeads.map((b, i) => ({ ...b, position: i })));
  };

  const handleSavePlan = () => {
    if (selectedBeads.length === 0) return;
    const planData = {
      id: Date.now().toString(),
      name: planName,
      beads: selectedBeads,
      totalPrice,
      styleConfig,
      createdAt: new Date().toISOString()
    };
    const savedPlans = JSON.parse(localStorage.getItem('saved_diy_plans') || '[]');
    localStorage.setItem('saved_diy_plans', JSON.stringify([...savedPlans, planData]));
    alert('方案已保存');
  };

  const handleGenerateReport = () => {
    if (selectedBeads.length === 0) return;
    localStorage.setItem('diy_crystals', JSON.stringify(selectedBeads));
    localStorage.setItem('diy_plan_name', planName);
    router.push('/diy/report');
  };

  const handleGeneratePoster = () => {
    if (selectedBeads.length === 0) return;
    localStorage.setItem('diy_crystals', JSON.stringify(selectedBeads));
    localStorage.setItem('diy_plan_name', planName);
    router.push('/diy/report');
  };

  const handleCheckout = () => {
    if (selectedBeads.length === 0) return;
    const planData = {
      id: Date.now().toString(),
      price_tier: 'DIY 定制',
      price: totalPrice,
      crystals: selectedBeads.map(b => b.crystal.name),
      image_url: selectedBeads[0]?.crystal.imageUrl || '',
      reason_summary: '用户自定义搭配'
    };
    localStorage.setItem('selected_plan', JSON.stringify(planData));
    router.push('/order/confirm');
  };

  // ============ 渲染 ============
  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm px-6 py-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            >
              ←
            </button>
            <h1 className="text-xl font-medium text-text-primary ml-4">DIY 手串</h1>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-gold"
          >
            {isEditing ? '完成' : '编辑'}
          </button>
        </div>
        <p className="text-sm text-text-secondary mt-1">自由搭配你的专属能量手串</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* ============ 手串预览区 ============ */}
        <Card className="p-5 rounded-2xl border border-border-light bg-white">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="text-lg font-medium text-text-primary bg-transparent border-none outline-none"
              placeholder="点击输入方案名称"
            />
            <span className="text-xl font-semibold text-gold">¥{totalPrice}</span>
          </div>
          
          {/* 手串可视化 */}
          <div className="bg-cream/50 rounded-2xl p-4 min-h-[100px] flex items-center justify-center overflow-x-auto">
            {selectedBeads.length === 0 ? (
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-3 opacity-30">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-dashed border-border-light" />
                  ))}
                </div>
                <p className="text-text-muted text-sm">开始你的专属手串设计</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {selectedBeads.map((bead, index) => (
                  <React.Fragment key={bead.instanceId}>
                    <div className="relative group">
                      <div 
                        className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all ${
                          isEditing ? 'border-gold cursor-pointer' : 'border-border-light'
                        }`}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                      >
                        <img
                          src={bead.crystal.imageUrl}
                          alt={bead.crystal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isEditing && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center text-xs"
                          onClick={() => handleRemoveBead(bead.instanceId)}
                        >
                          ×
                        </div>
                      )}
                    </div>
                    {index < selectedBeads.length - 1 && (
                      <div className="w-3 h-0.5 bg-border-light" />
                    )}
                  </React.Fragment>
                ))}
                {isEditing && (
                  <>
                    <div className="w-3 h-0.5 bg-border-light" />
                    <button
                      onClick={() => {/* scroll to selector */}}
                      className="w-10 h-10 rounded-full border-2 border-dashed border-gold flex items-center justify-center text-gold text-xl hover:bg-gold/10 transition-colors"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* 五行分布条 */}
          {selectedBeads.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">五行分布</span>
                <span className="text-xs text-text-muted">
                  {dominantElements.length > 0 ? `${dominantElements.join('、')}为主` : '请添加水晶'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {elementScores.map((score) => (
                  <div key={score.element} className="flex flex-col items-center">
                    <div className="w-full bg-border-light rounded-t-md overflow-hidden" style={{ minHeight: '24px' }}>
                      <div 
                        className="w-full rounded-t-md transition-all"
                        style={{ 
                          height: `${Math.max(score.score, 20)}px`,
                          backgroundColor: score.color,
                          opacity: score.count > 0 ? 1 : 0.3
                        }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary mt-1">{score.element}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ============ 珠子编辑区 ============ */}
        {selectedBeads.length > 0 && (
          <Card className="p-5 rounded-2xl border border-border-light bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-text-primary">已选水晶</h3>
              <span className="text-sm text-text-secondary">{selectedBeads.length}颗</span>
            </div>
            
            <div className="space-y-2">
              {selectedBeads.map((bead, index) => (
                <div 
                  key={bead.instanceId}
                  className="flex items-center gap-3 p-3 bg-cream/50 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-full border border-border-light overflow-hidden">
                    <img src={bead.crystal.imageUrl} alt={bead.crystal.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{bead.crystal.name}</p>
                    <p className="text-xs text-text-secondary">¥{bead.crystal.price} · {bead.crystal.element}</p>
                  </div>
                  {isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveLeft(index)}
                        disabled={index === 0}
                        className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => handleMoveRight(index)}
                        disabled={index === selectedBeads.length - 1}
                        className="w-8 h-8 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ============ 属性调整区 ============ */}
        <Card className="p-5 rounded-2xl border border-border-light bg-white">
          <h3 className="text-md font-medium text-text-primary mb-4">风格偏好</h3>
          
          <div className="space-y-4">
            {/* 珠子尺寸 */}
            <div>
              <p className="text-sm text-text-secondary mb-2">珠子尺寸</p>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as BeadSize[]).map(size => (
                  <button
                    key={size}
                    onClick={() => setStyleConfig({ ...styleConfig, beadSize: size })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      styleConfig.beadSize === size
                        ? 'bg-gold text-text-primary'
                        : 'bg-cream text-text-secondary hover:bg-border-light'
                    }`}
                  >
                    {size === 'small' ? '小珠' : size === 'medium' ? '中珠' : '大珠'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 装饰点缀 */}
            <div>
              <p className="text-sm text-text-secondary mb-2">装饰点缀</p>
              <div className="flex gap-2">
                {(['none', 'minimal', 'elegant'] as DecorationLevel[]).map(dec => (
                  <button
                    key={dec}
                    onClick={() => setStyleConfig({ ...styleConfig, decoration: dec })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      styleConfig.decoration === dec
                        ? 'bg-gold text-text-primary'
                        : 'bg-cream text-text-secondary hover:bg-border-light'
                    }`}
                  >
                    {dec === 'none' ? '无' : dec === 'minimal' ? '少量' : '精致'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 风格倾向 */}
            <div>
              <p className="text-sm text-text-secondary mb-2">风格倾向</p>
              <div className="flex gap-2">
                {(['simple', 'balanced', 'designed'] as StyleTendency[]).map(style => (
                  <button
                    key={style}
                    onClick={() => setStyleConfig({ ...styleConfig, style })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      styleConfig.style === style
                        ? 'bg-gold text-text-primary'
                        : 'bg-cream text-text-secondary hover:bg-border-light'
                    }`}
                  >
                    {style === 'simple' ? '简约' : style === 'balanced' ? '均衡' : '设计感'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ============ 能量建议区 ============ */}
        <Card className="p-5 rounded-2xl border border-border-light bg-white">
          <h3 className="text-md font-medium text-text-primary mb-3 flex items-center gap-2">
            <span className="text-gold">💡</span>
            能量建议
          </h3>
          
          {selectedBeads.length === 0 ? (
            <p className="text-text-muted text-sm">添加水晶后获取能量建议</p>
          ) : (
            <div className="space-y-3">
              {energySuggestion?.map((suggestion, index) => (
                <div key={index} className="p-3 bg-gold/5 rounded-xl border border-gold/20">
                  <p className="text-sm text-gold-text">{suggestion}</p>
                </div>
              ))}
              <button
                onClick={handleGenerateReport}
                className="w-full py-3 text-sm text-gold border border-gold/30 rounded-xl hover:bg-gold/5 transition-colors"
              >
                查看完整能量报告 →
              </button>
            </div>
          )}
        </Card>

        {/* ============ 珠子选择区 ============ */}
        <div>
          <h3 className="text-md font-medium text-text-primary mb-4">选择水晶</h3>
          
          {/* 搜索框 */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索水晶名称..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border-light bg-white text-sm focus:outline-none focus:border-gold"
            />
            <svg className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* 筛选标签 */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            <button
              onClick={() => setElementFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                elementFilter === 'all'
                  ? 'bg-gold text-text-primary'
                  : 'bg-white border border-border-light text-text-secondary'
              }`}
            >
              全部
            </button>
            {(['金', '木', '水', '火', '土'] as ElementType[]).map(el => (
              <button
                key={el}
                onClick={() => setElementFilter(el)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  elementFilter === el
                    ? 'bg-gold text-text-primary'
                    : 'bg-white border border-border-light text-text-secondary'
                }`}
              >
                {el}性
              </button>
            ))}
          </div>
          
          {/* 价格筛选 */}
          <div className="flex gap-2 mb-4">
            {(['all', 'low', 'mid', 'high'] as (PriceLevel | 'all')[]).map(level => (
              <button
                key={level}
                onClick={() => setPriceFilter(level as PriceLevel | 'all')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  priceFilter === level
                    ? 'bg-gold/10 text-gold-text border border-gold/30'
                    : 'bg-cream text-text-secondary'
                }`}
              >
                {level === 'all' ? '全部价格' : level === 'low' ? '入门' : level === 'mid' ? '中档' : '高端'}
              </button>
            ))}
          </div>
          
          {/* 水晶网格 */}
          {filteredCrystals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted text-sm">暂无符合条件的水晶</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredCrystals.map((crystal) => (
                <Card
                  key={crystal.id}
                  className="p-3 rounded-2xl border border-border-light bg-white hover:border-gold/50 transition-all cursor-pointer"
                  onClick={() => handleAddBead(crystal)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3">
                    <img
                      src={crystal.imageUrl}
                      alt={crystal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-text-primary text-sm mb-1">{crystal.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: elementColors[crystal.element] }}
                    />
                    <span className="text-xs text-text-secondary">{crystal.element}性</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gold">¥{crystal.price}</span>
                    <button className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-white text-sm">
                      +
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light px-6 py-4">
        <div className="flex gap-3">
          <Button
            onClick={handleSavePlan}
            disabled={selectedBeads.length === 0}
            className="h-11 px-4 rounded-xl bg-white border border-border-light text-text-primary font-medium hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            保存方案
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={selectedBeads.length === 0}
            className="h-11 px-4 rounded-xl bg-gold/10 text-gold-text font-medium hover:bg-gold hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            生成报告
          </Button>
          <Button
            onClick={handleGeneratePoster}
            disabled={selectedBeads.length === 0}
            className="h-11 px-4 rounded-xl bg-gold/10 text-gold-text font-medium hover:bg-gold hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            海报
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={selectedBeads.length === 0}
            className="h-11 px-6 rounded-xl bg-gold hover:bg-gold-dark text-text-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下单
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiyPage;
