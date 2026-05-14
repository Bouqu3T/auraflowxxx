'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  price_tier: string;
  price: number;
  crystals: string[];
  image_url: string;
  reason_summary: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [address, setAddress] = useState({
    name: 'Amelia',
    phone: '138****1234',
    address: '杭州市西湖区 XXXXX'
  });
  const [notes, setNotes] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan>({
    id: '2',
    price_tier: '均衡档',
    price: 399,
    crystals: ['绿幽灵', '海蓝宝', '白阿塞'],
    image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=green%20crystal%20bracelet%20with%20ghost%20pattern&image_size=square_hd',
    reason_summary: '更适合事业 + 焦虑缓解'
  });

  // 从 localStorage 读取数据
  useEffect(() => {
    const savedAddress = localStorage.getItem('user_address');
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
    
    const storedPlan = localStorage.getItem('selected_plan');
    if (storedPlan) {
      setSelectedPlan(JSON.parse(storedPlan));
    }
  }, []);

  const handlePaymentChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleSubmit = () => {
    // 保存地址到 localStorage
    localStorage.setItem('user_address', JSON.stringify(address));
    
    // 创建完整订单信息
    const orderData = {
      id: Date.now().toString(),
      price_tier: selectedPlan.price_tier,
      price: selectedPlan.price,
      crystals: selectedPlan.crystals,
      image_url: selectedPlan.image_url,
      reason_summary: selectedPlan.reason_summary,
      status: '待制作',
      created_at: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      address: {
        name: address.name,
        phone: address.phone,
        address: address.address
      },
      notes: notes,
      paymentMethod: paymentMethod
    };
    
    // 保存订单到 localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([orderData, ...savedOrders]));
    
    // 跳转到订单列表页面
    router.push('/order/list');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="mr-4 text-[#777777]"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-[#333333]">确认订单</h1>
      </div>

      <Card className="p-4 mb-6 border-[#E6DED0]">
        <h2 className="text-lg font-medium text-[#333333] mb-4">已选方案：{selectedPlan.price_tier}</h2>
        <div className="flex items-center mb-4">
          <img
            src={selectedPlan.image_url}
            alt={`${selectedPlan.price_tier}手串`}
            className="w-20 h-20 object-cover rounded-lg mr-4"
          />
          <div>
            <p className="text-[#777777]">{selectedPlan.crystals.join(' + ')}</p>
            <p className="text-xl font-semibold text-[#333333] mt-2">¥{selectedPlan.price}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-6 border-[#E6DED0]">
        <h2 className="text-lg font-medium text-[#333333] mb-4">收货地址</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">收货人</Label>
            <Input
              id="name"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">手机号</Label>
            <Input
              id="phone"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="address">详细地址</Label>
            <Input
              id="address"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-6 border-[#E6DED0]">
        <h2 className="text-lg font-medium text-[#333333] mb-4">备注信息</h2>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="请输入备注信息"
        />
      </Card>

      <Card className="p-4 mb-20 border-[#E6DED0]">
        <h2 className="text-lg font-medium text-[#333333] mb-4">支付方式</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="radio"
              id="wechat"
              name="payment"
              value="wechat"
              checked={paymentMethod === 'wechat'}
              onChange={() => handlePaymentChange('wechat')}
              className="mr-3"
            />
            <label htmlFor="wechat" className="text-[#333333]">微信支付</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="alipay"
              name="payment"
              value="alipay"
              checked={paymentMethod === 'alipay'}
              onChange={() => handlePaymentChange('alipay')}
              className="mr-3"
            />
            <label htmlFor="alipay" className="text-[#333333]">支付宝</label>
          </div>
        </div>
      </Card>

      <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center">
        <div>
          <span className="text-[#777777]">合计：</span>
          <span className="text-xl font-semibold text-[#333333]">¥{selectedPlan.price}</span>
        </div>
        <Button
          onClick={handleSubmit}
          className="bg-[#D4C4A8] hover:bg-[#C9B897] text-[#333333]"
        >
          立即支付
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
