import React from 'react';
import { Bead } from './Bead';

interface JewelryCardProps {
  title: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
  wuxingColor?: 'wood' | 'fire' | 'earth' | 'metal' | 'water' | 'gold';
  children?: React.ReactNode;
}

export const JewelryCard: React.FC<JewelryCardProps> = ({
  title,
  description,
  isSelected,
  onClick,
  wuxingColor = 'gold',
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full p-5 text-left rounded-2xl transition-all duration-500 ease-out overflow-hidden border backdrop-blur-md
        ${isSelected
          ? 'bg-aura-gold/5 border-aura-gold/40 shadow-tray-hover'
          : 'bg-white/80 border-white/60 shadow-tray hover:shadow-tray-hover hover:-translate-y-[1px]'
        }
      `}
    >
      <div
        className={`
          absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-700 ease-out
          ${isSelected ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-4'}
        `}
      >
        <Bead wuxing={wuxingColor} isFloating={isSelected} />
      </div>

      <div className="relative z-10 pr-10">
        <h3 className={`text-lg transition-colors duration-300 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700 font-normal'}`}>
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-400">
            {description}
          </p>
        )}
        {children}
      </div>

      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-breath pointer-events-none" />
      )}
    </button>
  );
};
