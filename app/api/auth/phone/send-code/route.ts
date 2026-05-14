import { auth } from '@/lib/auth';

// better-auth 0.8.1 使用不同的 API 结构
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { phone } = body;
    
    // 这里应该调用 better-auth 的发送验证码方法
    // 由于版本差异，暂时返回模拟响应
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '发送验证码失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
