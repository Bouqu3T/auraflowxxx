'use client';
import React, { useState, useEffect, useRef } from 'react';
import Logo from '@/components/Logo';

const StartPage = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    phoneInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const validatePhone = (phone: string) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const handleSendCode = () => {
    if (!phone) {
      setError('请输入手机号');
      return;
    }
    if (!validatePhone(phone)) {
      setError('请输入正确的手机号');
      return;
    }
    if (!agreed) {
      setError('请先阅读并同意用户协议');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      alert('验证码已发送，验证码为：11111');
      setIsLoading(false);
      setCountdown(60);
    }, 500);
  };

  const handleLogin = () => {
    setError('');

    if (!phone) {
      setError('请输入手机号');
      return;
    }
    if (!validatePhone(phone)) {
      setError('请输入正确的手机号');
      return;
    }
    if (!code) {
      setError('请输入验证码');
      return;
    }
    if (!agreed) {
      setError('请先阅读并同意用户协议');
      return;
    }
    if (code !== '11111') {
      setError('验证码错误，请输入 11111');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 800);
  };

  const handleAgreementChange = (checked: boolean) => {
    setAgreed(checked === true);
    if (checked && error === '请先阅读并同意用户协议') {
      setError('');
    }
  };

  const canSendCode = phone.length > 0 && validatePhone(phone) && agreed && countdown === 0 && !isLoading;
  const canLogin = phone.length > 0 && validatePhone(phone) && code.length > 0 && agreed && !isLoading;

  return (
    <div className="min-h-screen bg-paper flex flex-col relative overflow-hidden bg-xuan bg-mountain bg-cloud">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.02]" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="xuan-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M0 60 Q30 45 60 60 T120 60" fill="none" stroke="#BFA478" strokeWidth="0.3"/>
              <path d="M0 75 Q30 60 60 75 T120 75" fill="none" stroke="#BFA478" strokeWidth="0.2"/>
              <path d="M0 90 Q30 75 60 90 T120 90" fill="none" stroke="#BFA478" strokeWidth="0.12"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#xuan-pattern)" />
        </svg>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-jade/[0.06] to-transparent blur-3xl" style={{ animation: 'jadeGlowPulse 6s ease-in-out infinite' }} />
          <div className="absolute top-40 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-mist/[0.04] to-transparent blur-2xl" />
          <div className="absolute top-56 right-1/4 w-56 h-56 rounded-full bg-gradient-to-tl from-jade/[0.03] to-transparent blur-xl" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="h-11 flex items-center justify-center">
          <span className="text-xs text-ash tracking-[0.3em]">{currentTime}</span>
        </div>

        <div className="flex-1 px-6 flex flex-col">
          <div className="pt-12 pb-4 text-center scroll-enter">
            <div className="relative inline-block">
              <div className="absolute inset-0 w-44 h-44 -m-11 rounded-full bg-gradient-to-br from-jade/[0.07] via-transparent to-border-ink/[0.05] blur-3xl" style={{ animation: 'jadeGlowPulse 6s ease-in-out infinite' }} />
              <div className="absolute inset-0 w-36 h-36 -m-7 rounded-full bg-gradient-to-t from-jade/[0.05] via-transparent to-jade/[0.02] blur-2xl" />
              <Logo size="large" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1.5 rounded-full bg-jade/6 blur-sm" />
              
              <div className="absolute -top-2 -right-6 w-7 h-7 rounded-full" 
                   style={{ 
                     background: 'radial-gradient(circle at 35% 35%, #FEFEFC 0%, #D4C59A 25%, #BFA478 50%, #9C7C53 85%, #8B6B48 100%)',
                     boxShadow: '0 2px 6px rgba(156, 124, 83, 0.25), inset 0 2px 4px rgba(255,255,255,0.55), inset 0 -2px 4px rgba(0,0,0,0.12)'
                   }} />
              <div className="absolute -top-6 -left-4 w-5 h-5 rounded-full" 
                   style={{ 
                     background: 'radial-gradient(circle at 35% 35%, #FEFEFD 0%, #F2EFE9 30%, #E8E4DC 70%, #DDD8CF 100%)',
                     boxShadow: '0 1.5px 4px rgba(0,0,0,0.08), inset 0 1.5px 3px rgba(255,255,255,0.8), inset 0 -1.5px 3px rgba(0,0,0,0.04)'
                   }} />
            </div>
            <p className="text-tea text-sm mt-3 tracking-[0.4em]">能量 · 连接 · 平衡</p>
          </div>

          <div className="text-center mb-8 scroll-enter" style={{ animationDelay: '150ms' }}>
            <h2 className="text-3xl font-medium text-ink mb-4 leading-tight tracking-wide">
              为你定制专属能量手串
            </h2>
            <p className="text-tea text-base leading-relaxed px-6 max-w-sm mx-auto">
              通过场景选择、个人档案与能量解析，生成可解释、可分享的专属推荐
            </p>
          </div>

          <div className="w-full max-w-md mx-auto scroll-enter" style={{ animationDelay: '250ms' }}>
            <div className="relative p-8 bg-paper-white/95 backdrop-blur-md border border-border-ink/60 rounded-soft shadow-card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-paper-white/95 via-paper-white/85 to-mist/50 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jade/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-ink/35 to-transparent" />
              <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-jade/[0.02] to-transparent blur-2xl pointer-events-none" />

              <div className="relative space-y-6">
                <div>
                  <label htmlFor="phone" className="text-ink font-medium text-base mb-2.5 block tracking-wide">
                    手机号
                  </label>
                  <div className="relative">
                    <input
                      ref={phoneInputRef}
                      id="phone"
                      type="tel"
                      placeholder="请输入手机号"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (error) setError('');
                      }}
                      onFocus={() => setIsFocused('phone')}
                      onBlur={() => setIsFocused(null)}
                      maxLength={11}
                      className={`h-12 w-full rounded-elegant border bg-paper-white/80 backdrop-blur-sm px-5 text-base text-ink placeholder:text-ash transition-all duration-300 ${
                        error && !phone
                          ? 'border-wu-fire ring-2 ring-wu-fire/12'
                          : isFocused === 'phone'
                          ? 'border-jade ring-2 ring-jade/15 shadow-sm'
                          : 'border-border-ink hover:border-jade/50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="code" className="text-ink font-medium text-base mb-2.5 block tracking-wide">
                    验证码
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="code"
                      type="text"
                      placeholder="请输入验证码"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        if (error) setError('');
                      }}
                      onFocus={() => setIsFocused('code')}
                      onBlur={() => setIsFocused(null)}
                      maxLength={6}
                      className={`flex-1 h-12 rounded-elegant border bg-paper-white/80 backdrop-blur-sm px-5 text-base text-ink placeholder:text-ash transition-all duration-300 ${
                        error && !code
                          ? 'border-wu-fire ring-2 ring-wu-fire/12'
                          : isFocused === 'code'
                          ? 'border-jade ring-2 ring-jade/15 shadow-sm'
                          : 'border-border-ink hover:border-jade/50'
                      }`}
                    />
                    <button
                      onClick={handleSendCode}
                      disabled={!canSendCode}
                      className={`h-12 px-5 rounded-full font-medium text-base transition-all duration-300 min-w-[96px] ${
                        canSendCode
                          ? 'btn-primary'
                          : 'bg-mist/60 text-ash cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-2 text-wu-fire text-sm bg-wu-fire/5 backdrop-blur-sm rounded-elegant p-3.5 text-center">
                    {error}
                  </div>
                )}

                <div className="mb-2 flex items-start space-x-2.5">
                  <input
                    id="agreement"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => handleAgreementChange(e.target.checked)}
                    className="w-[18px] h-[18px] mt-0.5 rounded border-border-ink accent-jade cursor-pointer transition-all hover:border-jade/50"
                  />
                  <label htmlFor="agreement" className="text-sm text-tea leading-snug cursor-pointer">
                    我已阅读并同意
                    <span className="text-jade font-medium">《用户协议》</span>
                    <span className="mx-0.5">与</span>
                    <span className="text-jade font-medium">《隐私政策》</span>
                  </label>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={!canLogin || isLoading}
                  className={`w-full h-[52px] rounded-full text-lg font-semibold transition-all duration-300 ${
                    canLogin && !isLoading
                      ? 'btn-primary'
                      : 'bg-border-ink/50 text-ash cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      登录中...
                    </span>
                  ) : '登录并开始体验'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-10 pb-6 text-center scroll-enter" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full" 
                   style={{ 
                     background: 'radial-gradient(circle at 35% 35%, #FEFEFC 0%, #D4C59A 25%, #BFA478 50%, #9C7C53 85%, #8B6B48 100%)',
                     boxShadow: '0 1px 3px rgba(156, 124, 83, 0.2)'
                   }} />
              <div className="w-8 h-px bg-[#E6DED2]" />
              <div className="w-3 h-3 rounded-full" 
                   style={{ 
                     background: 'radial-gradient(circle at 35% 35%, #FEFEFC 0%, #D4C59A 25%, #BFA478 50%, #9C7C53 85%, #8B6B48 100%)',
                     boxShadow: '0 1px 3px rgba(156, 124, 83, 0.2)'
                   }} />
              <div className="w-8 h-px bg-[#E6DED2]" />
              <div className="w-3 h-3 rounded-full" 
                   style={{ 
                     background: 'radial-gradient(circle at 35% 35%, #FEFEFC 0%, #D4C59A 25%, #BFA478 50%, #9C7C53 85%, #8B6B48 100%)',
                     boxShadow: '0 1px 3px rgba(156, 124, 83, 0.2)'
                   }} />
            </div>
            <p className="text-ash text-sm leading-relaxed">
              登录后即可体验：场景化测试 → 能量报告 → 三档方案推荐
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 h-8 flex items-center justify-center pb-2">
        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-border-ink/50 to-transparent rounded-full" />
      </div>
    </div>
  );
};

export default StartPage;
