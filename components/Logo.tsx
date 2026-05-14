'use client';
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true, className = '' }) => {
  const iconSizes = {
    small: 32,
    medium: 48,
    large: 64
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const iconSize = iconSizes[size];
  const halfSize = iconSize / 2;
  const quarterSize = iconSize / 4;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="relative"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="crystalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8D8EA" />
              <stop offset="50%" stopColor="#8EC3B8" />
              <stop offset="100%" stopColor="#5B8C85" />
            </linearGradient>
            <linearGradient id="crystalGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DBA8A1" />
              <stop offset="50%" stopColor="#F5D0C5" />
              <stop offset="100%" stopColor="#E8B4B8" />
            </linearGradient>
            <linearGradient id="crystalGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#C9A7D8" />
              <stop offset="100%" stopColor="#8B73A6" />
            </linearGradient>
            <linearGradient id="crystalGrad4" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F0D9E7" />
              <stop offset="100%" stopColor="#D4A5C4" />
            </linearGradient>
            <linearGradient id="crystalHighLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          
          <polygon
            points="50,15 70,40 65,55 70,70 50,85 30,70 35,55 30,40"
            fill="url(#crystalGrad1)"
          />
          
          <polygon
            points="50,25 60,40 55,50 60,60 50,70 40,60 45,50 40,40"
            fill="url(#crystalGrad2)"
            opacity="0.85"
          />
          
          <polygon
            points="50,35 55,45 52,55 55,65 50,70 45,65 48,55 45,45"
            fill="url(#crystalGrad4)"
            opacity="0.7"
          />
          
          <polygon
            points="50,15 55,30 50,40 45,30"
            fill="url(#crystalHighLight)"
          />
          
          <polygon
            points="55,30 70,40 65,55 55,50"
            fill="url(#crystalHighLight)"
            opacity="0.5"
          />
          
          <polygon
            points="30,40 45,30 50,40 45,50"
            fill="rgba(255,255,255,0.3)"
          />
          
          <polygon
            points="50,40 55,50 52,55 48,55 45,50"
            fill="rgba(255,255,255,0.4)"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-semibold text-[#2B2824] tracking-[0.2em] ${textSizeClasses[size]}`} style={{ fontFamily: 'serif' }}>
            AURA FLOW
          </span>
          <span className="text-xs text-[#6E655B] tracking-[0.35em]" style={{ fontFamily: 'serif' }}>灵韵</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
