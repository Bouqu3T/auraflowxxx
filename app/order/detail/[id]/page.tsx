'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

interface Order {
  id: string;
  price_tier: string;
  price: number;
  crystals: string[];
  status: string;
  created_at: string;
  image_url: string;
  address: {
    name: string;
    phone: string;
    address: string;
  };
  notes: string;
}

const mockOrders: Record<string, Order> = {
  'ORD001': {
    id: 'ORD001',
    price_tier: '灵韵臻选',
    price: 299,
    crystals: ['蓝月光', '绿幽灵', '白阿塞'],
    status: '待制作',
    created_at: '2026-04-15 18:22',
    image_url: '/mock-images/crystal-2.png',
    address: {
      name: 'Amelia',
      phone: '138****1234',
      address: '杭州市西湖区 XXXXX'
    },
    notes: '请尽快发货'
  },
  'ORD002': {
    id: 'ORD002',
    price_tier: '灵韵尊享',
    price: 599,
    crystals: ['海纹石', '绿碧玺', '金钛晶'],
    status: '制作中',
    created_at: '2026-04-14 10:15',
    image_url: '/mock-images/crystal-1.png',
    address: {
      name: 'Sophia',
      phone: '139****5678',
      address: '上海市浦东新区 XXXXX'
    },
    notes: ''
  },
  'ORD003': {
    id: 'ORD003',
    price_tier: '灵韵入门',
    price: 168,
    crystals: ['海蓝宝', '东陵玉'],
    status: '已发货',
    created_at: '2026-04-13 14:30',
    image_url: '/mock-images/crystal-1.png',
    address: {
      name: 'Olivia',
      phone: '137****9012',
      address: '北京市朝阳区 XXXXX'
    },
    notes: '送朋友的礼物'
  }
};

const OrderDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const order = mockOrders[orderId] || mockOrders['ORD001'];

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4">
      <div className="flex items-center mb-8">
        <button
          onClick={handleBack}
          className="mr-4 text-[#777777]"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-[#333333]">订单详情</h1>
      </div>

      <Card className="p-4 mb-6 border-[#E6DED0]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#333333]">{order.price_tier}</h2>
          <span className="text-sm px-3 py-1 rounded-full bg-[#F4EFE7] text-[#6C6254]">
            {order.status}
          </span>
        </div>
        <div className="mb-4">
          <img
            src={order.image_url}
            alt={`${order.price_tier}手串`}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
        <p className="text-[#777777] mb-2">{order.crystals.join(' + ')}</p>
        <p className="text-xl font-semibold text-[#333333]">¥{order.price}</p>
      </Card>

      <Card className="p-4 mb-6 border-[#E6DED0]">
        <h2 className="text-lg font-medium text-[#333333] mb-4">收货信息</h2>
        <p className="text-[#777777] mb-1">收货人：{order.address.name}</p>
        <p className="text-[#777777] mb-1">手机号：{order.address.phone}</p>
        <p className="text-[#777777]">地址：{order.address.address}</p>
      </Card>

      <Card className="p-4 mb-6 border-[#E6DED0]">
        <h2 className="text-lg font-medium text-[#333333] mb-4">订单信息</h2>
        <p className="text-[#777777] mb-1">订单编号：{order.id}</p>
        <p className="text-[#777777] mb-1">下单时间：{order.created_at}</p>
        <p className="text-[#777777]">备注：{order.notes || '无'}</p>
      </Card>

      <Card className="p-4 mb-6 border-[#E6DED0]">
        <h2 className="text-lg font-medium text-[#333333] mb-4">订单进度</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-[#D4C4A8] flex items-center justify-center text-white text-sm mr-3 flex-shrink-0">
              ✓
            </div>
            <div>
              <p className="text-[#333333]">订单已创建</p>
              <p className="text-sm text-[#777777]">{order.created_at}</p>
            </div>
          </div>
          <div className="w-0.5 h-4 bg-[#D4C4A8] ml-3"></div>
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-[#D4C4A8] flex items-center justify-center text-white text-sm mr-3 flex-shrink-0">
              ✓
            </div>
            <div>
              <p className="text-[#333333]">支付成功</p>
              <p className="text-sm text-[#777777]">{order.created_at}</p>
            </div>
          </div>
          <div className="w-0.5 h-4 bg-[#E6DED0] ml-3"></div>
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-[#D4C4A8] flex items-center justify-center text-white text-sm mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-[#333333]">正在制作</p>
              <p className="text-sm text-[#777777]">预计 3-5 个工作日完成</p>
            </div>
          </div>
          <div className="w-0.5 h-4 bg-[#E6DED0] ml-3"></div>
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-[#E6DED0] flex items-center justify-center text-white text-sm mr-3 flex-shrink-0">
              4
            </div>
            <div>
              <p className="text-[#999999]">已发货</p>
              <p className="text-sm text-[#999999]">待发货</p>
            </div>
          </div>
          <div className="w-0.5 h-4 bg-[#E6DED0] ml-3"></div>
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-[#E6DED0] flex items-center justify-center text-white text-sm mr-3 flex-shrink-0">
              5
            </div>
            <div>
              <p className="text-[#999999]">已完成</p>
              <p className="text-sm text-[#999999]">待收货</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="fixed bottom-4 left-4 right-4 flex justify-center">
        <Button
          onClick={handleBack}
          className="bg-white border border-[#DDD3C2] text-[#333333] w-full"
        >
          返回订单列表
        </Button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
