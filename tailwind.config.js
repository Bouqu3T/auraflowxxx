/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色 - 暖白基底
        'warm-white': '#F8F5F0',
        'paper': '#F7F4EE',
        'paper-white': '#FFFCF8',
        'mist': '#F7F4EF',
        
        // 文字色
        'ink': '#2F2A26',
        'tea': '#6F665E',
        'ash': '#9C9185',
        
        // 骨架色 - 浅金茶金
        'light-gold': '#D3B787',
        'tea-gold': '#B88F5A',
        'jade': '#BFA478',
        'jade-dark': '#9C7C53',
        'jade-light': '#D4C59A',
        
        // 边框色
        'border-ink': '#E7DDD0',
        'border-soft': '#E7DDD0',
        
        // 灵韵彩光 - 辅助色（新增）
        'aura-pink': '#F3D7D0',
        'aura-apricot': '#F6DEC8',
        'aura-jade': '#D6E4D3',
        'aura-blue': '#D7E4EE',
        'aura-purple': '#E3DDF0',
        'aura-white': '#F7F4EF',
        
        // 五行色
        'wu-wood': '#7C9B76',
        'wu-fire': '#B56D59',
        'wu-earth': '#B79A61',
        'wu-metal': '#A7A9AE',
        'wu-water': '#6F8EA8',
        
        // 状态色
        'success': '#7C9B76',
        'warning': '#B79A61',
        'error': '#B56D59',
        'info': '#6F8EA8',
        
        // 选中态
        'selected-bg': '#F5F0E8',
        'selected-border': '#BFA478',
      },
      fontFamily: {
        'sans': ['PingFang SC', 'Noto Sans SC', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'elegant': '12px',
        'soft': '16px',
        'gentle': '20px',
        'dreamy': '24px',
      },
      boxShadow: {
        'paper': '0 2px 8px rgba(47, 42, 38, 0.04)',
        'card': '0 4px 16px rgba(47, 42, 38, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        'card-hover': '0 8px 28px rgba(47, 42, 38, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)',
        'jade-glow': '0 0 16px rgba(191, 164, 120, 0.25), 0 2px 10px rgba(47, 42, 38, 0.06)',
        'jade-card': '0 4px 20px rgba(191, 164, 120, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
        'aura-pink': '0 0 24px rgba(243, 215, 208, 0.4)',
        'aura-apricot': '0 0 24px rgba(246, 222, 200, 0.4)',
        'aura-jade': '0 0 24px rgba(214, 228, 211, 0.4)',
        'aura-blue': '0 0 24px rgba(215, 228, 238, 0.4)',
        'aura-purple': '0 0 24px rgba(227, 221, 240, 0.4)',
        'stamp': '0 2px 8px rgba(47, 42, 38, 0.12)',
        'dreamy': '0 8px 32px rgba(47, 42, 38, 0.08), 0 0 40px rgba(243, 215, 208, 0.15)',
      },
      animation: {
        'scroll-in': 'scrollIn 0.8s ease-out forwards',
        'jade-breathe': 'jadeBreathe 5s ease-in-out infinite',
        'jade-glow': 'jadeGlow 4s ease-in-out infinite',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'float-medium': 'floatMedium 4s ease-in-out infinite',
        'float-fast': 'floatFast 3s ease-in-out infinite',
        'ink-spread': 'inkSpread 2s ease-out forwards',
        'fade-soft': 'fadeSoft 0.6s ease-out forwards',
        'unfold': 'unfold 0.8s ease-out forwards',
        'aura-flow': 'auraFlow 8s ease-in-out infinite',
        'sweep-glow': 'sweepGlow 3s ease-in-out infinite',
        'breathe-soft': 'breatheSoft 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'aura-pulse': 'auraPulse 6s ease-in-out infinite',
      },
      keyframes: {
        scrollIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        jadeBreathe: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.02)' },
        },
        jadeGlow: {
          '0%, 100%': { opacity: '0.4', boxShadow: '0 0 12px rgba(191, 164, 120, 0.2)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 20px rgba(191, 164, 120, 0.35)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-6px) translateX(2px)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-4px) translateX(-2px)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-3px) translateX(1px)' },
        },
        inkSpread: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeSoft: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        unfold: {
          '0%': { opacity: '0', transform: 'scaleY(0.95)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        auraFlow: {
          '0%': { backgroundPosition: '0% 50%', opacity: '0.3' },
          '50%': { backgroundPosition: '100% 50%', opacity: '0.5' },
          '100%': { backgroundPosition: '0% 50%', opacity: '0.3' },
        },
        sweepGlow: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        breatheSoft: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.03)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        auraPulse: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '33%': { opacity: '0.35', transform: 'scale(1.05)' },
          '66%': { opacity: '0.25', transform: 'scale(0.98)' },
        },
      },
    },
  },
  plugins: [],
}
