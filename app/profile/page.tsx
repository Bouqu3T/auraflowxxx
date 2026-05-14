'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  gender: string;
  location: string;
  is_default: boolean;
}

const ProfilePage = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const previousSelectedRef = useRef<string | null>(null);

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

  useEffect(() => {
    const storedProfiles = localStorage.getItem('auraflow_profiles');
    if (storedProfiles) {
      const parsed = JSON.parse(storedProfiles);
      setProfiles(parsed);
      const defaultProfile = parsed.find((p: Profile) => p.is_default);
      if (defaultProfile) {
        setSelectedProfile(defaultProfile.id);
        previousSelectedRef.current = defaultProfile.id;
        localStorage.setItem('selected_profile', JSON.stringify(defaultProfile));
      }
    } else {
      const defaultProfiles: Profile[] = [
        {
          id: '1',
          name: '自己',
          birth_date: '1998-08-18',
          birth_time: '辰时',
          gender: '女',
          location: '杭州西湖区',
          is_default: true
        },
        {
          id: '2',
          name: '妈妈',
          birth_date: '1972-03-12',
          birth_time: '丑时',
          gender: '女',
          location: '温州鹿城区',
          is_default: false
        }
      ];
      setProfiles(defaultProfiles);
      localStorage.setItem('auraflow_profiles', JSON.stringify(defaultProfiles));
      setSelectedProfile('1');
      previousSelectedRef.current = '1';
      localStorage.setItem('selected_profile', JSON.stringify(defaultProfiles[0]));
    }
  }, []);

  const getElementTypeFromProfile = (profile: Profile): string => {
    const year = new Date(profile.birth_date).getFullYear();
    const ganIndex = ((year - 1984) % 10 + 10) % 10;
    const wuxingOrder = ['木', '火', '土', '金', '水'];
    return wuxingOrder[ganIndex % 5] || '土';
  };

  const getWuxingBeadClass = (elementType: string): string => {
    const beadMap: Record<string, string> = {
      '木': 'bead-wood',
      '火': 'bead-fire',
      '土': 'bead-earth',
      '金': 'bead-metal',
      '水': 'bead-water'
    };
    return beadMap[elementType] || 'bead-earth';
  };

  const handleSelect = useCallback((id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return;

    if (previousSelectedRef.current === id) {
      return;
    }

    setSelectedProfile(id);
    previousSelectedRef.current = id;
    localStorage.setItem('selected_profile', JSON.stringify(profile));
  }, [profiles]);

  const handleContinue = () => {
    if (selectedProfile) {
      const profile = profiles.find(p => p.id === selectedProfile);
      if (profile) {
        localStorage.setItem('selected_profile', JSON.stringify(profile));
        router.push('/questionnaire');
      }
    }
  };

  const formatBirthInfo = (profile: Profile) => {
    const parts = [profile.birth_date];
    if (profile.birth_time) {
      parts.push(profile.birth_time);
    }
    parts.push(profile.gender);
    parts.push(profile.location);
    return parts.join(' / ');
  };

  const getGenderIcon = (gender: string) => {
    return gender === '女' ? '♀' : '♂';
  };

  return (
    <div className="min-h-screen bg-paper bg-xuan bg-cloud relative overflow-hidden">
      <div className="relative z-10">
        <div className="h-11 flex items-center justify-center">
          <span className="text-xs text-ash tracking-[0.3em]">{currentTime}</span>
        </div>

        <div className="px-6 pt-4">
          <div className="text-center mb-8 scroll-enter">
            <h1 className="text-3xl font-medium text-ink mb-2 tracking-wide">我的档案</h1>
            <p className="text-tea text-base">选择本次体验的档案对象</p>
          </div>

          <div className="space-y-4 mb-8">
            {profiles.map((profile, index) => {
              const isSelected = selectedProfile === profile.id;
              const isHovered = hoveredId === profile.id;
              const elementType = getElementTypeFromProfile(profile);

              return (
                <div
                  key={profile.id}
                  onClick={() => handleSelect(profile.id)}
                  onMouseEnter={() => setHoveredId(profile.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative cursor-pointer scroll-enter ${isSelected ? 'card-selected' : ''}`}
                  style={{ animationDelay: `${index * 100 + 100}ms` }}
                >
                  <div className={`relative p-5 rounded-soft transition-all duration-500 ${
                    isSelected
                      ? 'bg-selected-bg border-2 border-jade'
                      : isHovered
                      ? 'bg-paper-white border border-jade/50 shadow-card'
                      : 'bg-paper-white/95 border border-border-ink/70 shadow-paper'
                  }`}>
                    {isSelected && (
                      <div className="absolute inset-0 rounded-soft overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-jade/[0.03] via-transparent to-jade/[0.02]" />
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jade/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jade/20 to-transparent" />
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-lg font-medium transition-colors duration-200 ${
                            isSelected ? 'text-ink' : 'text-ink'
                          }`}>
                            {profile.name}
                          </span>
                          {profile.is_default && (
                            <span className={`px-2.5 py-0.5 text-xs rounded-full transition-all duration-250 ${
                              isSelected
                                ? 'bg-jade/20 text-ink-gray'
                                : 'bg-mist/60 text-tea'
                            }`}>
                              默认
                            </span>
                          )}
                          <span className={`text-sm transition-colors duration-200 ${
                            isSelected ? 'text-jade' : 'text-ash'
                          }`}>
                            {getGenderIcon(profile.gender)}
                          </span>
                        </div>
                        <p className="text-tea text-sm leading-relaxed">
                          {formatBirthInfo(profile)}
                        </p>
                        {profile.birth_time && (
                          <p className="text-ash text-xs mt-1">
                            时辰：{profile.birth_time}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {isSelected && (
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`w-4 h-4 rounded-full ${getWuxingBeadClass(elementType)} jade-breathe`}
                                style={{ animationDelay: `${i * 0.3}s` }}
                              >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
                              </div>
                            ))}
                          </div>
                        )}
                        <div className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'border-jade bg-jade shadow-jade-glow'
                            : 'border-border-ink bg-paper-white'
                        }`}>
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-jade/20 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-jade animate-jade-breathe" />
                          <span className="text-jade-dark text-xs font-medium">已选中</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/profile/edit/${profile.id}`);
                          }}
                          className="text-tea text-xs hover:text-jade transition-colors duration-200"
                        >
                          编辑
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div
              onClick={() => router.push('/profile/new')}
              onMouseEnter={() => setHoveredId('new')}
              onMouseLeave={() => setHoveredId(null)}
              className="scroll-enter"
              style={{ animationDelay: `${profiles.length * 100 + 100}ms` }}
            >
              <div className={`p-5 cursor-pointer transition-all duration-300 rounded-soft ${
                hoveredId === 'new'
                  ? 'bg-paper-white border-2 border-dashed border-jade shadow-card'
                  : 'bg-paper-white/60 border-2 border-dashed border-border-ink'
              }`}>
                <div className="flex items-center justify-center gap-2 py-2">
                  <svg
                    className={`w-5 h-5 transition-colors duration-250 ${hoveredId === 'new' ? 'text-jade' : 'text-ash'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className={`text-base font-medium transition-colors duration-250 ${
                    hoveredId === 'new' ? 'text-jade' : 'text-ash'
                  }`}>
                    新建档案
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-paper-white/95 backdrop-blur-xl border-t border-border-ink/35 px-6 py-4 z-20">
        <button
          onClick={handleContinue}
          disabled={!selectedProfile}
          className={`w-full h-[52px] rounded-full text-lg font-semibold transition-all duration-300 ${
            selectedProfile
              ? 'btn-primary'
              : 'bg-border-ink/50 text-ash cursor-not-allowed'
          }`}
        >
          继续下一步
        </button>
      </div>
      <div className="h-20" />
    </div>
  );
};

export default ProfilePage;