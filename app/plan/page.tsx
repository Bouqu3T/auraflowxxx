'use client';

import { useState } from 'react';
import { Button, Toast } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import BottomNavbar from '../../components/BottomNavbar';

// 模拟方案数据
const mockPlans = [
  {
    id: '1',
    tier: '经济档',
    crystals: [
      { id: '001', name: '粉晶', size: '8mm', quantity: 12 },
      { id: '005', name: '白水晶', size: '8mm', quantity: 4 }
    ],
    totalPrice: 199,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pink%20crystal%20bracelet%20affordable&image_size=square_hd',
    description: '温和招财，平复情绪'
  },
  {
    id: '2',
    tier: '均衡档',
    crystals: [
      { id: '002', name: '黄水晶', size: '10mm', quantity: 8 },
      { id: '003', name: '紫水晶', size: '10mm', quantity: 6 },
      { id: '007', name: '红玛瑙', size: '10mm', quantity: 2 }
    ],
    totalPrice: 399,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yellow%20and%20purple%20crystal%20bracelet%20balanced&image_size=square_hd',
    description: '提升事业运，增强人际关系'
  },
  {
    id: '3',
    tier: '尊享档',
    crystals: [
      { id: '004', name: '绿幽灵', size: '12mm', quantity: 8 },
      { id: '009', name: '钛晶', size: '12mm', quantity: 4 },
      { id: '010', name: '月光石', size: '12mm', quantity: 2 }
    ],
    totalPrice: 899,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20crystal%20bracelet%20with%20green%20and%20gold&image_size=square_hd',
    description: '强力招财，提升领导力'
  }
];

export default function PlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleConfirm = () => {
    if (!selectedPlan) {
      Toast.show('请选择一个方案');
      return;
    }
    router.push('/order');
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <button className="mr-4" onClick={() => router.back()}>
            ←
          </button>
          <h1 className="text-2xl font-bold text-primary">您的专属定制方案</h1>
        </div>
        
        <div className="bg-white rounded-xl p-4 mb-6">
          <p className="text-gray-600">契合您的五行：火、土 | 偏好：招财</p>
        </div>
        
        <div className="flex space-x-2 mb-6">
          {mockPlans.map((plan) => (
            <button
              key={plan.id}
              className={`flex-1 py-2 rounded-full text-center ${selectedPlan === plan.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.tier}
            </button>
          ))}
        </div>
        
        <div className="space-y-6">
          {mockPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-sm p-4 ${selectedPlan === plan.id ? 'border-2 border-primary' : ''}`}
            >
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <img src={plan.imageUrl} alt={plan.tier} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{plan.tier}</h3>
                  <p className="text-primary font-bold">¥{plan.totalPrice}</p>
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <h4 className="font-bold mb-2">📿 手串组成：</h4>
                <ul className="text-gray-600 space-y-1">
                  {plan.crystals.map((crystal, index) => (
                    <li key={index}>- {crystal.name} ({crystal.size}) x {crystal.quantity}</li>
                  ))}
                </ul>
              </div>
              <Button 
                className="w-full py-3 font-medium bg-gradient-to-r from-[#FFB6C1] to-[#D8BFD8] text-white rounded-lg"
                onClick={() => {
                  setSelectedPlan(plan.id);
                  router.push('/order');
                }}
              >
                立即购买
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center text-gray-400 text-sm">
          <p>* 提示：支付成功后进入待制作状态</p>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}
