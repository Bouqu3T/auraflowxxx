'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';

interface AnimatedBead {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  colorClass: string;
  delay: number;
  arcHeight: number;
}

interface HoldBead {
  id: number;
  x: number;
  y: number;
  size: number;
  colorClass: string;
  delay: number;
}

interface BeadAnimationProps {
  beads: AnimatedBead[];
  holdBeads: HoldBead[];
  isAnimating: boolean;
  isDeactivating: boolean;
  onAnimationComplete?: () => void;
}

const ELEMENT_COLORS: Record<string, { main: string; secondary: string; class: string; softClass: string }> = {
  wood: { main: '#91A87C', secondary: '#C8D7B8', class: 'bead-wood', softClass: 'bead-wood-soft' },
  fire: { main: '#C97B63', secondary: '#E7B09A', class: 'bead-fire', softClass: 'bead-fire-soft' },
  earth: { main: '#C8A66A', secondary: '#E4CCA3', class: 'bead-earth', softClass: 'bead-earth-soft' },
  metal: { main: '#B8BDC7', secondary: '#E5E7EC', class: 'bead-metal', softClass: 'bead-metal-soft' },
  water: { main: '#7D9BB5', secondary: '#C8D9E8', class: 'bead-water', softClass: 'bead-water-soft' },
  gold: { main: '#CBB995', secondary: '#C1AD87', class: 'bead-gold', softClass: 'bead-gold-soft' },
};

export function BeadAnimationContainer({
  beads,
  holdBeads,
  isAnimating,
  isDeactivating,
  onAnimationComplete
}: BeadAnimationProps) {
  const [visibleBeads, setVisibleBeads] = useState<AnimatedBead[]>([]);
  const [showHoldBeads, setShowHoldBeads] = useState<HoldBead[]>([]);
  const [localDeactivating, setLocalDeactivating] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAnimating && beads.length > 0) {
      setVisibleBeads(beads);
      setShowHoldBeads([]);
      setLocalDeactivating(false);

      const timer = setTimeout(() => {
        setVisibleBeads([]);
        setShowHoldBeads(holdBeads);
        onAnimationComplete?.();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, beads, holdBeads, onAnimationComplete]);

  useEffect(() => {
    if (isDeactivating && holdBeads.length > 0) {
      setLocalDeactivating(true);
      const timer = setTimeout(() => {
        setShowHoldBeads([]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isDeactivating, holdBeads.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {visibleBeads.map((bead) => (
        <div
          key={`bead-${bead.id}`}
          className={`bead-trajectory ${bead.colorClass}`}
          style={{
            '--start-x': `${bead.startX}px`,
            '--start-y': `${bead.startY}px`,
            '--end-x': `${bead.endX}px`,
            '--end-y': `${bead.endY}px`,
            '--arc-h': `${bead.arcHeight}px`,
            '--bead-size': `${bead.size}px`,
            '--delay': `${bead.delay}ms`,
          } as React.CSSProperties}
        />
      ))}

      {showHoldBeads.map((bead) => (
        <div
          key={`hold-${bead.id}`}
          className={`bead-hold ${bead.colorClass} ${localDeactivating ? 'bead-scatter-out' : 'bead-hold-breathe'}`}
          style={{
            '--hold-x': `${bead.x}px`,
            '--hold-y': `${bead.y}px`,
            '--hold-size': `${bead.size}px`,
            '--hold-delay': `${bead.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function useBeadAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [beads, setBeads] = useState<AnimatedBead[]>([]);
  const [holdBeads, setHoldBeads] = useState<HoldBead[]>([]);
  const [elementType, setElementType] = useState<'wood' | 'fire' | 'earth' | 'metal' | 'water' | 'gold'>('gold');
  const cardRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const generateBeads = useCallback((
    clickX: number,
    clickY: number,
    targetX: number,
    targetY: number,
    element: 'wood' | 'fire' | 'earth' | 'metal' | 'water' | 'gold',
    count: number = 4
  ) => {
    const elementConfig = ELEMENT_COLORS[element];
    const newBeads: AnimatedBead[] = [];
    const dx = targetX - clickX;
    const dy = targetY - clickY;

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const baseX = clickX + dx * progress * 0.3;
      const baseY = clickY + dy * progress * 0.3;
      const arcHeight = 20 + Math.random() * 25;

      newBeads.push({
        id: i,
        startX: clickX + (Math.random() - 0.5) * 30,
        startY: clickY + (Math.random() - 0.5) * 30,
        endX: targetX + (i - count / 2) * 6,
        endY: targetY + i * 2,
        size: 6 + i * 0.8,
        colorClass: i === 0 ? elementConfig.class : elementConfig.softClass,
        delay: i * 50,
        arcHeight,
      });
    }

    const newHoldBeads: HoldBead[] = [];
    for (let i = 0; i < Math.min(3, count); i++) {
      newHoldBeads.push({
        id: i,
        x: targetX + (i - 1) * 8,
        y: targetY + i * 1.5,
        size: 5 + i * 1.2,
        colorClass: i === 0 ? elementConfig.class : elementConfig.softClass,
        delay: i * 0.4,
      });
    }

    setBeads(newBeads);
    setHoldBeads(newHoldBeads);
    setElementType(element);
    setIsAnimating(true);
    setIsDeactivating(false);
  }, []);

  const triggerSelectAnimation = useCallback((
    cardId: string,
    element: 'wood' | 'fire' | 'earth' | 'metal' | 'water' | 'gold' = 'gold'
  ) => {
    const card = cardRef.current[cardId];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;
    const targetX = rect.right - 40;
    const targetY = rect.top + 30;

    generateBeads(clickX, clickY, targetX, targetY, element, 4);
  }, [generateBeads]);

  const triggerDeselectAnimation = useCallback(() => {
    setIsDeactivating(true);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const setCardRef = useCallback((cardId: string, el: HTMLDivElement | null) => {
    cardRef.current[cardId] = el;
  }, []);

  const getElementTypeFromProfile = useCallback((profile: { birth_date?: string; birth_time?: string }): 'wood' | 'fire' | 'earth' | 'metal' | 'water' | 'gold' => {
    if (!profile.birth_date) return 'gold';
    const month = new Date(profile.birth_date).getMonth() + 1;
    if (month >= 3 && month <= 5) return 'wood';
    if (month >= 6 && month <= 8) return 'fire';
    if (month >= 9 && month <= 11) return 'metal';
    return 'water';
  }, []);

  return {
    isAnimating,
    isDeactivating,
    beads,
    holdBeads,
    elementType,
    triggerSelectAnimation,
    triggerDeselectAnimation,
    handleAnimationComplete,
    setCardRef,
    getElementTypeFromProfile,
    BeadAnimationComponent: () => (
      <BeadAnimationContainer
        beads={beads}
        holdBeads={holdBeads}
        isAnimating={isAnimating}
        isDeactivating={isDeactivating}
        onAnimationComplete={handleAnimationComplete}
      />
    ),
  };
}

export function SelectedBeadDecoration({
  elementType = 'gold',
  count = 3,
  className = '',
  size = 'normal'
}: {
  elementType?: string;
  count?: number;
  className?: string;
  size?: 'small' | 'normal' | 'large';
}) {
  const element = ELEMENT_COLORS[elementType] || ELEMENT_COLORS.gold;
  const sizeMap = {
    small: 4,
    normal: 6,
    large: 8,
  };

  return (
    <div className={`relative flex items-center gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bead-base ${index === 0 ? element.class : element.softClass} bead-hold-breathe`}
          style={{
            width: sizeMap[size] + index * 1.5,
            height: sizeMap[size] + index * 1.5,
            animationDelay: `${index * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingBead({
  elementType = 'gold',
  size = 8,
  className = '',
  delay = 0
}: {
  elementType?: string;
  size?: number;
  className?: string;
  delay?: number;
}) {
  const element = ELEMENT_COLORS[elementType] || ELEMENT_COLORS.gold;

  return (
    <div
      className={`bead-base ${element.softClass} bead-hold-breathe ${className}`}
      style={{
        width: size,
        height: size,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default BeadAnimationContainer;
