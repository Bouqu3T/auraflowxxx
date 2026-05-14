import { NextRequest, NextResponse } from 'next/server';
import { Solar } from 'lunar-javascript';

export async function POST(request: NextRequest) {
  try {
    const { birthDate, gender, location } = await request.json();

    // 解析出生日期
    const date = new Date(birthDate);
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    // 模拟八字计算结果
    // 实际项目中可以使用lunar-javascript库进行更详细的计算
    const favorableElements = ['火', '土'];
    const bodyStrength = 'strong';

    return NextResponse.json({
      favorableElements,
      bodyStrength
    });
  } catch (error) {
    return NextResponse.json(
      { error: '计算失败' },
      { status: 500 }
    );
  }
}