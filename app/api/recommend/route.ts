import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crystals } from '@/drizzle/schema';

export async function POST(request: NextRequest) {
  try {
    const { profileId, answers } = await request.json();

    // 从数据库获取水晶数据
    const crystalData = await db.query.crystals.findMany();

    // 模拟生成方案
    const plans = [
      {
        tier: '经济档',
        crystals: [
          { id: '001', name: '粉晶', size: '8mm', quantity: 12 },
          { id: '004', name: '白水晶', size: '8mm', quantity: 4 }
        ],
        totalPrice: 199,
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=affordable%20crystal%20bracelet&image_size=square_hd',
        description: '温和招财，平复情绪'
      },
      {
        tier: '均衡档',
        crystals: [
          { id: '002', name: '黄水晶', size: '10mm', quantity: 8 },
          { id: '003', name: '紫水晶', size: '10mm', quantity: 6 },
          { id: '007', name: '红玛瑙', size: '10mm', quantity: 2 }
        ],
        totalPrice: 399,
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=balanced%20crystal%20bracelet&image_size=square_hd',
        description: '提升事业运，增强人际关系'
      },
      {
        tier: '尊享档',
        crystals: [
          { id: '005', name: '绿幽灵', size: '12mm', quantity: 8 },
          { id: '009', name: '金钛晶', size: '12mm', quantity: 4 },
          { id: '010', name: '绿碧玺', size: '12mm', quantity: 2 }
        ],
        totalPrice: 899,
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20crystal%20bracelet&image_size=square_hd',
        description: '强力招财，提升领导力'
      }
    ];

    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json(
      { error: '生成方案失败' },
      { status: 500 }
    );
  }
}