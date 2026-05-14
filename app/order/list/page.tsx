'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  price_tier: string;
  price: number;
  crystals: string[];
  status: string;
  created_at: string;
  image_url: string;
}

const OrderListPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);

  // 从 localStorage 读取订单数据
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders: Order[] = JSON.parse(savedOrders);
      setOrders(parsedOrders);
    } else {
      // 默认模拟数据
      setOrders([
        {
          id: '1',
          price_tier: '均衡档',
          price: 399,
          crystals: ['绿幽灵', '海蓝宝', '白阿塞'],
          status: '待制作',
          created_at: '2026-04-15 18:22',
          image_url: '/mock-images/crystal-1.png'
        },
        {
          id: '2',
          price_tier: '经济档',
          price: 199,
          crystals: ['绿玛瑙', '白水晶'],
          status: '已完成',
          created_at: '2026-04-10 14:30',
          image_url: '/mock-images/crystal-2.png'
        }
      ]);
    }
  }, []);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待付款' },
    { key: 'processing', label: '待制作' },
    { key: 'shipped', label: '已发货' },
    { key: 'completed', label: '已完成' }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'processing' && order.status === '待制作') return true;
    if (activeTab === 'completed' && order.status === '已完成') return true;
    return false;
  });

  const handleViewDetail = (orderId: string) => {
    router.push(`/order/detail/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4">
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-medium text-[#333333]">我的订单</h1>
      </div>

      <div className="flex overflow-x-auto mb-6 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 mr-2 whitespace-nowrap rounded-full text-sm ${activeTab === tab.key ? 'bg-[#D4C4A8] text-[#333333]' : 'bg-[#F4EFE7] text-[#6C6254]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="p-4 border-[#E6DED0]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-[#333333]">{order.price_tier}</h3>
                  <p className="text-[#777777] mt-1">{order.crystals.join(' + ')}</p>
                  <p className="text-xl font-semibold text-[#333333] mt-2">¥{order.price}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-sm px-3 py-1 rounded-full ${order.status === '待制作' ? 'bg-[#F4EFE7] text-[#6C6254]' : 'bg-[#E6DED0] text-[#777777]'}`}>
                    {order.status}
                  </span>
                  <Button
                    onClick={() => handleViewDetail(order.id)}
                    className="mt-3 bg-white border border-[#DDD3C2] text-[#333333] text-sm px-3 py-1"
                  >
                    查看详情
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 border-[#E6DED0] text-center">
            <p className="text-[#777777]">暂无订单</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
