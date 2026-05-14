'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

// 水晶数据接口
interface Crystal {
  id: string;
  name: string;
  color: string;
  element: '金' | '木' | '水' | '火' | '土';
  effects: string[];
  description: string;
  price: number;
  imageUrl: string;
}

interface SelectedBead {
  instanceId: string;
  crystal: Crystal;
  size: string;
  position: number;
}

const DiyReportPage = () => {
  const router = useRouter();
  const [crystals, setCrystals] = useState<Crystal[]>([]);
  const [planName, setPlanName] = useState('我的自定义方案');

  useEffect(() => {
    // 从 localStorage 获取已选水晶
    const saved = localStorage.getItem('diy_crystals');
    const savedName = localStorage.getItem('diy_plan_name');
    
    if (saved) {
      const selectedBeads: SelectedBead[] = JSON.parse(saved);
      // 提取 crystal 属性
      const crystalList = selectedBeads.map(bead => bead.crystal);
      setCrystals(crystalList);
    }
    if (savedName) {
      setPlanName(savedName);
    }
    if (!saved) {
      router.push('/diy');
    }
  }, [router]);

  // 计算总价格
  const totalPrice = crystals.reduce((sum, crystal) => sum + crystal.price, 0);

  // 计算五行统计
  const calculateElementStats = () => {
    const stats: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
    crystals.forEach(c => stats[c.element]++);
    return stats;
  };

  const elementStats = calculateElementStats();

  // 生成能量建议
  const generateEnergySuggestion = () => {
    const maxElement = Object.entries(elementStats).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const suggestions: Record<string, string> = {
      '金': '金气旺盛，适合事业和财运发展，建议保持心态平和',
      '木': '木气充足，代表生机与成长，适合开拓新局面',
      '水': '水气流畅，智慧和直觉增强，适合学习和思考',
      '火': '火气充盈，热情和行动力提升，适合展示自我',
      '土': '土气稳重，稳定感和包容力增强，适合团队合作'
    };
    return suggestions[maxElement] || '五行平衡，能量状态良好';
  };

  // 处理下单
  const handleCheckout = () => {
    const planData = {
      id: Date.now().toString(),
      price_tier: 'DIY 定制',
      price: totalPrice,
      crystals: crystals.map(c => c.name),
      image_url: crystals[0]?.imageUrl || '',
      reason_summary: '用户自定义搭配'
    };
    localStorage.setItem('selected_plan', JSON.stringify(planData));
    router.push('/order/confirm');
  };

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm px-6 py-4 border-b border-border-light">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            ←
          </button>
          <Logo size="small" showText={false} className="ml-4" />
          <h1 className="text-xl font-medium text-text-primary ml-2">DIY 能量报告</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* 报告头部卡片 */}
        <Card className="p-5 rounded-2xl border border-border-light bg-gradient-to-br from-gold/10 to-gold/5">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8.5 12a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">你的专属能量手串</h2>
            <p className="text-text-secondary text-sm">根据你选择的水晶生成的能量分析报告</p>
          </div>
        </Card>

        {/* 水晶组成展示 */}
        <Card className="p-5 rounded-2xl border border-border-light bg-white">
          <h3 className="text-md font-medium text-text-primary mb-4">水晶组成</h3>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {crystals.map((crystal, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-border-light overflow-hidden shadow-soft">
                  <img
                    src={crystal.imageUrl}
                    alt={crystal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-text-primary mt-1">{crystal.name}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {crystals.map((crystal, index) => (
              crystal.effects.map((effect, effectIndex) => (
                <span key={`${index}-${effectIndex}`} className="px-3 py-1.5 rounded-full bg-gold/10 text-gold-text text-xs">
                  {effect}
                </span>
              ))
            ))}
          </div>
        </Card>

        {/* 五行分析 */}
        <Card className="p-5 rounded-2xl border border-border-light bg-white">
          <h3 className="text-md font-medium text-text-primary mb-4">五行能量分布</h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {Object.entries(elementStats).map(([element, count], index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-full bg-border-light rounded-t-md">
                  <div 
                    className="w-full rounded-t-md transition-all"
                    style={{ 
                      height: `${count * 40}px`,
                      minHeight: '20px',
                      backgroundColor: 
                        element === '金' ? '#FFFFFF' :
                        element === '木' ? '#4CAF50' :
                        element === '水' ? '#2196F3' :
                        element === '火' ? '#FF5722' : '#FFC107',
                      border: '1px solid #E6DED0'
                    }}
                  />
                </div>
                <span className="text-xs text-text-secondary mt-1">{element}</span>
                <span className="text-xs font-medium text-text-primary">{count}颗</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 能量建议 */}
        <Card className="p-5 rounded-2xl border border-border-light bg-white">
          <h3 className="text-md font-medium text-text-primary mb-3 flex items-center gap-2">
            <span className="text-gold">✨</span>
            能量建议
          </h3>
          <div className="p-4 bg-gold/5 rounded-xl border border-gold/20 mb-4">
            <p className="text-text-primary text-sm leading-relaxed">{generateEnergySuggestion()}</p>
          </div>
          
          <h4 className="text-sm font-medium text-text-secondary mb-2">水晶功效详解</h4>
          <div className="space-y-3">
            {crystals.map((crystal, index) => (
              <div key={index} className="p-3 bg-cream rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-text-primary">{crystal.name}</span>
                  <span className="text-xs text-gold-text bg-gold/10 px-2 py-0.5 rounded-full">{crystal.element}</span>
                </div>
                <p className="text-sm text-text-secondary">{crystal.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 价格信息 */}
        <Card className="p-5 rounded-2xl border border-border-light bg-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-text-secondary">定制价格</p>
              <p className="text-2xl font-semibold text-text-primary">¥{totalPrice}</p>
            </div>
            <p className="text-sm text-text-muted">{crystals.length}颗水晶</p>
          </div>
        </Card>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light px-6 py-4">
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/diy')}
            className="flex-1 h-11 rounded-xl bg-white border border-border-light text-text-primary font-medium hover:bg-cream transition-colors"
          >
            继续编辑
          </Button>
          <Button
            onClick={handleCheckout}
            className="flex-1 h-11 rounded-xl bg-gold hover:bg-gold-dark text-text-primary font-medium"
          >
            下单定制
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiyReportPage;
