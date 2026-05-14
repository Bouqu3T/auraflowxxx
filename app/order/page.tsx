'use client';

import { useState } from 'react';
import { Button, Input, Toast } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import BottomNavbar from '../../components/BottomNavbar';

// 模拟选中的方案
const selectedPlan = {
  tier: '均衡档',
  crystals: [
    { id: '002', name: '黄水晶', size: '10mm', quantity: 8 },
    { id: '003', name: '紫水晶', size: '10mm', quantity: 6 },
    { id: '007', name: '红玛瑙', size: '10mm', quantity: 2 }
  ],
  totalPrice: 399,
  imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yellow%20and%20purple%20crystal%20bracelet%20balanced&image_size=square_hd',
  description: '提升事业运，增强人际关系'
};

export default function OrderPage() {
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const router = useRouter();

  const handleSubmitOrder = () => {
    if (!address || !contact) {
      Toast.show('请填写收货地址和联系方式');
      return;
    }
    // 模拟支付
    Toast.show('模拟支付中...');
    setTimeout(() => {
      Toast.show('支付成功');
      router.push('/order/list');
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <button className="mr-4" onClick={() => router.back()}>
            ←
          </button>
          <h1 className="text-2xl font-bold text-primary">订单确认</h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <img src={selectedPlan.imageUrl} alt={selectedPlan.tier} className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">{selectedPlan.tier}</h3>
            <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">总价</span>
              <span className="text-primary font-bold">¥{selectedPlan.totalPrice}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">收货信息</h3>
          <Input
            placeholder="请输入收货地址"
            value={address}
            onChange={(value) => setAddress(value)}
            className="w-full p-3 border border-gray-200 rounded-lg mb-3"
          />
          <Input
            placeholder="请输入联系电话"
            value={contact}
            onChange={(value) => setContact(value)}
            className="w-full p-3 border border-gray-200 rounded-lg"
          />
        </div>
        
        <div className="bg-white rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">订单金额</span>
            <span className="text-primary font-bold text-xl">¥{selectedPlan.totalPrice}</span>
          </div>
        </div>
        
        <Button className="w-full py-3 font-medium bg-gradient-to-r from-[#FFB6C1] to-[#D8BFD8] text-white rounded-lg" onClick={handleSubmitOrder}>
          提交订单
        </Button>
      </div>
      <BottomNavbar />
    </div>
  );
}