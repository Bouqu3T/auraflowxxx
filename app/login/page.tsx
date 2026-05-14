'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [agreedSecond, setAgreedSecond] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSendCode = async () => {
    if (!phone) {
      setError('请输入手机号');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/phone/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '发送验证码失败');
      }

      alert('验证码已发送（开发环境使用mock验证码）');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送验证码失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!phone || !code) {
      setError('请输入手机号和验证码');
      return;
    }

    if (!agreed || !agreedSecond) {
      setError('请阅读并同意用户协议与隐私政策');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/phone/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }

      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const flowSteps = [
    { icon: '🌙', label: '场景探索' },
    { icon: '📋', label: '个人档案' },
    { icon: '🔮', label: '能量解析' },
    { icon: '💎', label: '专属推荐' },
  ];

  return (
    <div className="min-h-screen bg-warm-white flex flex-col relative overflow-hidden">
      {/* 背景彩光层 - 大面积柔焦彩光 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-aura-pink/40 blur-3xl animate-aura-pulse"></div>
        <div className="absolute top-1/4 -right-24 w-72 h-72 rounded-full bg-aura-apricot/35 blur-3xl animate-aura-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 -left-16 w-64 h-64 rounded-full bg-aura-blue/30 blur-3xl animate-aura-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full bg-aura-purple/25 blur-3xl animate-aura-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* 能量轨迹线 */}
      <div className="absolute top-16 right-8 opacity-20 pointer-events-none">
        <svg viewBox="0 0 200 300" className="w-40 h-60">
          <defs>
            <linearGradient id="energyLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B88F5A" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M100 0 Q150 50 100 100 Q50 150 100 200 Q150 250 100 300"
            fill="none"
            stroke="url(#energyLine)"
            strokeWidth="1"
          />
          <circle cx="100" cy="0" r="4" fill="#B88F5A" className="animate-pulse"></circle>
          <circle cx="100" cy="100" r="3" fill="#D3B787" className="animate-pulse" style={{ animationDelay: '0.5s' }}></circle>
          <circle cx="100" cy="200" r="3" fill="#B88F5A" className="animate-pulse" style={{ animationDelay: '1s' }}></circle>
          <circle cx="100" cy="300" r="4" fill="#D3B787" className="animate-pulse" style={{ animationDelay: '1.5s' }}></circle>
        </svg>
      </div>

      {/* 山形流线 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0 140 L0 90 Q50 50 100 80 Q150 110 200 60 Q250 25 300 70 Q350 110 400 60 L400 140 Z"
            fill="#B88F5A"
          />
          <path
            d="M0 140 L0 110 Q80 80 160 100 Q240 120 320 80 Q380 60 400 80 L400 140 Z"
            fill="#D3B787"
          />
        </svg>
      </div>

      {/* 弧线圈装饰 */}
      <div className="absolute top-1/3 left-8 opacity-15 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#B88F5A" strokeWidth="0.5"></circle>
          <circle cx="50" cy="50" r="30" fill="none" stroke="#D3B787" strokeWidth="0.5"></circle>
          <circle cx="50" cy="50" r="20" fill="none" stroke="#B88F5A" strokeWidth="0.5"></circle>
        </svg>
      </div>

      {/* 星点光斑 */}
      <div className="absolute top-24 left-1/3 w-2 h-2 rounded-full bg-aura-apricot/60 blur-sm animate-pulse pointer-events-none"></div>
      <div className="absolute top-40 right-1/3 w-1.5 h-1.5 rounded-full bg-aura-pink/50 blur-sm animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-aura-blue/40 blur-sm animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>

      {/* 顶部 Hero 区 - 能量主珠 */}
      <div className={`relative pt-20 pb-12 flex flex-col items-center justify-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <div className="relative">
          {/* 主珠光晕层 */}
          <div className="absolute inset-0 w-32 h-32 -ml-16 -mt-16 bg-gradient-to-br from-aura-pink/50 via-aura-apricot/40 to-aura-jade/45 rounded-full blur-3xl animate-breathe-soft"></div>
          <div className="absolute inset-0 w-40 h-40 -ml-20 -mt-20 bg-gradient-to-tr from-aura-blue/30 via-aura-purple/25 to-aura-pink/30 rounded-full blur-2xl animate-breathe-soft" style={{ animationDelay: '1s' }}></div>
          
          {/* 主珠 - 能量核心 */}
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="mainBeadGrad" cx="25%" cy="25%" r="80%">
                  <stop offset="0%" stopColor="#FFFCF8" />
                  <stop offset="30%" stopColor="#F8F5F0" />
                  <stop offset="60%" stopColor="#F7F4EF" />
                  <stop offset="100%" stopColor="#D3B787" />
                </radialGradient>
                <radialGradient id="mainBeadHighLight" cx="20%" cy="20%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <linearGradient id="crystalCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A8D8EA" stopOpacity="0.7" />
                  <stop offset="33%" stopColor="#F6DEC8" stopOpacity="0.6" />
                  <stop offset="66%" stopColor="#E3DDF0" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#D6E4D3" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              
              {/* 主珠本体 */}
              <circle cx="50" cy="50" r="42" fill="url(#mainBeadGrad)"></circle>
              
              {/* 高光 */}
              <circle cx="35" cy="38" r="18" fill="url(#mainBeadHighLight)"></circle>
              <circle cx="30" cy="32" r="8" fill="rgba(255,255,255,0.8)"></circle>
              
              {/* 水晶内核 - 灵韵彩光 */}
              <polygon
                points="50,18 68,40 63,55 68,70 50,82 32,70 37,55 32,40"
                fill="url(#crystalCoreGrad)"
                opacity="0.5"
              ></polygon>
              <polygon
                points="50,28 60,42 56,52 60,62 50,72 40,62 44,52 40,42"
                fill="url(#crystalCoreGrad)"
                opacity="0.4"
              ></polygon>
            </svg>
          </div>
          
          {/* 环绕小珠 - 沿弧线布局 */}
          <div className="absolute -top-6 -right-10 w-7 h-7 animate-float-slow">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <radialGradient id="smallBead1Grad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#F7F4EF" />
                  <stop offset="60%" stopColor="#F3D7D0" />
                  <stop offset="100%" stopColor="#E8D0C8" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="16" fill="url(#smallBead1Grad)"></circle>
              <circle cx="14" cy="15" r="6" fill="rgba(255,255,255,0.55)"></circle>
            </svg>
          </div>
          
          <div className="absolute -bottom-3 -left-12 w-6 h-6 animate-float-medium">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <radialGradient id="smallBead2Grad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#F8F5F0" />
                  <stop offset="60%" stopColor="#D7E4EE" />
                  <stop offset="100%" stopColor="#C5D3DD" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="14" fill="url(#smallBead2Grad)"></circle>
              <circle cx="13" cy="14" r="5" fill="rgba(255,255,255,0.5)"></circle>
            </svg>
          </div>
          
          <div className="absolute top-10 -right-14 w-5 h-5 animate-float-fast">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <radialGradient id="smallBead3Grad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFFCF8" />
                  <stop offset="60%" stopColor="#D6E4D3" />
                  <stop offset="100%" stopColor="#C3D4C0" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="12" fill="url(#smallBead3Grad)"></circle>
              <circle cx="14" cy="13" r="4" fill="rgba(255,255,255,0.55)"></circle>
            </svg>
          </div>
          
          <div className="absolute -top-3 -left-8 w-5 h-5 animate-float-slow" style={{ animationDelay: '2s' }}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <radialGradient id="smallBead4Grad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#F7F4EF" />
                  <stop offset="60%" stopColor="#F6DEC8" />
                  <stop offset="100%" stopColor="#E9D0B8" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="11" fill="url(#smallBead4Grad)"></circle>
              <circle cx="13" cy="14" r="4" fill="rgba(255,255,255,0.5)"></circle>
            </svg>
          </div>
          
          <div className="absolute bottom-12 -right-8 w-4.5 h-4.5 animate-float-medium" style={{ animationDelay: '1.5s' }}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <radialGradient id="smallBead5Grad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#F8F5F0" />
                  <stop offset="60%" stopColor="#E3DDF0" />
                  <stop offset="100%" stopColor="#D3CDDE" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="10" fill="url(#smallBead5Grad)"></circle>
              <circle cx="13" cy="13" r="3.5" fill="rgba(255,255,255,0.5)"></circle>
            </svg>
          </div>
        </div>

        {/* 品牌区 */}
        <div className="mt-10 text-center relative z-10">
          <h1 className="text-2xl font-semibold text-ink tracking-[0.28em]" style={{ fontFamily: 'serif' }}>
            AURA FLOW
          </h1>
          <p className="text-xs text-tea-gold tracking-[0.45em] mt-2" style={{ fontFamily: 'serif' }}>
            灵韵
          </p>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-light-gold to-transparent mx-auto mt-4"></div>
          <p className="text-sm text-ash tracking-[0.22em] mt-4">
            能量 · 连接 · 平衡
          </p>
        </div>
      </div>

      {/* 标题区 */}
      <div className={`text-center px-8 mb-8 relative z-10 transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h2 className="text-xl font-semibold text-ink leading-relaxed" style={{ fontFamily: 'serif' }}>
          为你定制专属能量手串
        </h2>
        <p className="text-sm text-tea mt-3 leading-relaxed max-w-xs mx-auto">
          让每一颗珠子，都回应你的能量节奏
        </p>
      </div>

      {/* 登录表单区 */}
      <div className={`flex-1 px-6 pb-12 relative z-10 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Card className="rounded-dreamy p-8 shadow-dreamy border-border-soft bg-paper-white/85 backdrop-blur-md border-t border-white/60">
          <div className="space-y-6">
            {/* 手机号输入框 */}
            <div>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-ash" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setActiveInput('phone')}
                  onBlur={() => setActiveInput(null)}
                  className={`h-14 rounded-soft pl-14 pr-4 text-ink placeholder-ash/60 outline-none transition-all duration-300 ${
                    activeInput === 'phone'
                      ? 'border-tea-gold shadow-jade-glow bg-white'
                      : 'border-border-soft bg-white hover:border-light-gold/60'
                  }`}
                />
                {activeInput === 'phone' && (
                  <div className="absolute inset-0 rounded-soft bg-aura-apricot/10 pointer-events-none animate-pulse"></div>
                )}
              </div>
            </div>

            {/* 验证码输入框 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-ash" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <Input
                    id="code"
                    type="text"
                    placeholder="验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onFocus={() => setActiveInput('code')}
                    onBlur={() => setActiveInput(null)}
                    className={`h-14 rounded-soft pl-14 pr-4 text-ink placeholder-ash/60 outline-none transition-all duration-300 ${
                      activeInput === 'code'
                        ? 'border-tea-gold shadow-jade-glow bg-white'
                        : 'border-border-soft bg-white hover:border-light-gold/60'
                    }`}
                  />
                  {activeInput === 'code' && (
                    <div className="absolute inset-0 rounded-soft bg-aura-blue/10 pointer-events-none animate-pulse"></div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleSendCode}
                disabled={isLoading || !phone}
                className="h-14 px-6 rounded-soft bg-gradient-to-r from-aura-apricot/60 to-light-gold/70 border border-tea-gold/40 text-tea-gold hover:from-light-gold/70 hover:to-tea-gold/60 hover:text-ink font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-card hover:shadow-jade-card active:scale-98"
              >
                {isLoading ? '发送中...' : '获取验证码'}
              </Button>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="text-error text-sm bg-red-50/80 rounded-soft p-4 border border-error/20 shadow-sm">
                {error}
              </div>
            )}

            {/* 用户协议勾选 */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreement1"
                checked={agreed}
                onCheckedChange={setAgreed}
                className="mt-1 border-border-soft data-[state=checked]:bg-tea-gold rounded-sm"
              ></Checkbox>
              <Label htmlFor="agreement1" className="text-sm text-ash leading-relaxed">
                我已阅读并同意
                <span className="text-tea-gold ml-1 font-medium">《用户协议》</span>
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreement2"
                checked={agreedSecond}
                onCheckedChange={setAgreedSecond}
                className="mt-1 border-border-soft data-[state=checked]:bg-tea-gold rounded-sm"
              ></Checkbox>
              <Label htmlFor="agreement2" className="text-sm text-ash leading-relaxed">
                我已阅读并同意
                <span className="text-tea-gold ml-1 font-medium">《隐私政策》</span>
              </Label>
            </div>

            {/* 登录按钮 */}
            <Button
              onClick={handleLogin}
              disabled={isLoading || !phone || !code || !agreed || !agreedSecond}
              className="w-full h-14 rounded-soft bg-gradient-to-r from-light-gold via-tea-gold to-tea-gold/90 hover:from-tea-gold hover:via-tea-gold/95 hover:to-jade-dark text-ink font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-jade-card hover:shadow-dreamy active:scale-98 relative overflow-hidden group"
            >
              <span className="relative z-10">{isLoading ? '登录中...' : '登录并开始体验'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>
            </Button>
          </div>
        </Card>
      </div>

      {/* 底部流程提示 - 串珠式 */}
      <div className={`px-6 pb-10 relative z-10 transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-center gap-3">
          {flowSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-paper-white border border-border-soft flex items-center justify-center shadow-card hover:shadow-jade-card transition-all duration-300 hover:scale-105">
                  <span className="text-lg">{step.icon}</span>
                </div>
                <span className="text-xs text-ash mt-2 whitespace-nowrap">{step.label}</span>
              </div>
              {index < flowSteps.length - 1 && (
                <div className="flex items-center mx-2">
                  <div className="w-8 h-px bg-gradient-to-r from-border-soft via-light-gold/40 to-border-soft relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-aura-pink to-aura-apricot border border-light-gold/30 animate-breathe-soft"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-tea-gold/40 animate-breathe-soft"></div>
        <div className="w-2 h-2 rounded-full bg-light-gold/30"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-jade/20"></div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-6px) translateX(2px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-4px) translateX(-2px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-3px) translateX(1px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
