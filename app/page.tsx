'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

interface SceneCardProps {
  icon: string;
  title: string;
  value: 'career' | 'wealth' | 'love' | 'study' | 'calm';
  selected: boolean;
  onClick: (value: 'career' | 'wealth' | 'love' | 'study' | 'calm') => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ icon, title, value, selected, onClick }) => {
  return (
    <button
      onClick={() => {
        console.log('Scene clicked:', value);
        onClick(value);
      }}
      className={`
        relative w-full p-5 rounded-soft text-left transition-all duration-500 ease-out overflow-hidden border backdrop-blur-md
        ${selected
          ? 'card-selected'
          : 'card card-hover'
        }
      `}
      style={{ userSelect: 'none' }}
    >
      <div
        className={`
          absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full jade-bead
          transition-all duration-500 ease-out
          ${selected ? 'opacity-100 scale-100 jade-breathe' : 'opacity-0 scale-50 translate-x-4'}
        `}
      />

      <div className="relative z-10 pr-6">
        <div className="text-2xl mb-2.5">{icon}</div>
        <h3 className={`text-base font-medium transition-colors duration-300 ${selected ? 'text-ink' : 'text-tea'}`}>
          {title}
        </h3>
      </div>
    </button>
  );
};

const HomePage = () => {
  const router = useRouter();
  const [selectedScene, setSelectedScene] = useState<'career' | 'wealth' | 'love' | 'study' | 'calm' | null>(null);

  const scenes = [
    { icon: '💼', title: '事业运提升', value: 'career' as const },
    { icon: '💰', title: '招财能量', value: 'wealth' as const },
    { icon: '❤️', title: '情感疗愈', value: 'love' as const },
    { icon: '📘', title: '学业专注', value: 'study' as const },
    { icon: '🧘', title: '平静身心', value: 'calm' as const },
  ];

  const handleSceneSelect = (scene: 'career' | 'wealth' | 'love' | 'study' | 'calm') => {
    setSelectedScene(scene);
  };

  const handleStartCustomize = () => {
    if (selectedScene) {
      localStorage.setItem('currentScene', selectedScene);
      router.push('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-paper p-5 bg-xuan bg-cloud">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="relative">
            <Logo size="small" />
            <div className="absolute -top-1 -right-3 w-4 h-4 rounded-full" 
                 style={{ 
                   background: 'radial-gradient(circle at 35% 35%, #FEFEFC 0%, #D4C59A 30%, #BFA478 60%, #9C7C53 100%)',
                   boxShadow: '0 1px 3px rgba(156, 124, 83, 0.2)'
                 }} />
          </div>
          <button
            onClick={() => router.push('/start')}
            className="w-10 h-10 rounded-full bg-jade/20 flex items-center justify-center cursor-pointer hover:bg-jade/30 transition-all duration-300"
          >
            <span className="text-ink">👤</span>
          </button>
        </div>

        <div className="mb-10 scroll-enter">
          <h2 className="text-xl font-medium text-ink mb-3 tracking-wide">你当下最想获得哪一种能量加持？</h2>
          <p className="text-tea">选择一个主题，系统会优先为你推荐。</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {scenes.map((scene, index) => (
            <div key={scene.value} className="scroll-enter" style={{ animationDelay: `${index * 100 + 100}ms` }}>
              <SceneCard
                icon={scene.icon}
                title={scene.title}
                value={scene.value}
                selected={selectedScene === scene.value}
                onClick={handleSceneSelect}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 scroll-enter" style={{ animationDelay: '600ms' }}>
          <button
            onClick={() => router.push('/profile')}
            className="flex-1 h-12 rounded-full font-medium transition-all duration-300 btn-secondary"
          >
            查看档案
          </button>
          <button
            onClick={handleStartCustomize}
            disabled={!selectedScene}
            className={`flex-1 h-12 rounded-full font-medium transition-all duration-300 ${
              selectedScene ? 'btn-primary' : 'bg-border-ink/50 text-ash cursor-not-allowed'
            }`}
          >
            开始定制
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
