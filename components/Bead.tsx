import React from 'react';

interface BeadProps {
  wuxing?: 'wood' | 'fire' | 'earth' | 'metal' | 'water' | 'gold';
  size?: string;
  isFloating?: boolean;
  className?: string;
}

export const Bead: React.FC<BeadProps> = ({
  wuxing = 'gold',
  size = 'w-6 h-6',
  isFloating = false,
  className = '',
}) => {
  const bgMap = {
    wood: 'bg-gradient-to-br from-[#C8D7B8] to-[#91A87C]',
    fire: 'bg-gradient-to-br from-[#E7B09A] to-[#C97B63]',
    earth: 'bg-gradient-to-br from-[#E4CCA3] to-[#C8A66A]',
    metal: 'bg-gradient-to-br from-[#E5E7EC] to-[#B8BDC7]',
    water: 'bg-gradient-to-br from-[#C8D9E8] to-[#7D9BB5]',
    gold: 'bg-gradient-to-br from-[#E8DCC4] to-[#D4C3A3]',
  };

  return (
    <div
      className={`
        ${size} rounded-full shadow-bead ${bgMap[wuxing]}
        ${isFloating ? 'animate-float' : ''}
        ${className}
      `}
    />
  );
};
