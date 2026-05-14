'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const QuestionnairePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    primary_effect: '',
    desired_effects: [] as string[],
    color_preference: [] as string[],
    style_preference: '',
    decoration_preference: '',
    bead_size: ''
  });
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handlePrimaryEffectChange = (effect: string) => {
    setAnswers({ ...answers, primary_effect: effect });
  };

  const handleEffectChange = (effect: string) => {
    if (answers.desired_effects.includes(effect)) {
      setAnswers({ ...answers, desired_effects: answers.desired_effects.filter(e => e !== effect) });
    } else if (answers.desired_effects.length < 3) {
      setAnswers({ ...answers, desired_effects: [...answers.desired_effects, effect] });
    }
  };

  const handleColorChange = (color: string) => {
    if (answers.color_preference.includes(color)) {
      setAnswers({ ...answers, color_preference: answers.color_preference.filter(c => c !== color) });
    } else if (answers.color_preference.length < 3) {
      setAnswers({ ...answers, color_preference: [...answers.color_preference, color] });
    }
  };

  const handleStyleChange = (style: string) => {
    setAnswers({ ...answers, style_preference: style });
  };

  const handleDecorationChange = (decoration: string) => {
    setAnswers({ ...answers, decoration_preference: decoration });
  };

  const handleBeadSizeChange = (size: string) => {
    setAnswers({ ...answers, bead_size: size });
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: return answers.primary_effect !== '';
      case 2: return answers.desired_effects.length > 0;
      case 3: return answers.color_preference.length > 0;
      case 4: return answers.style_preference !== '';
      case 5: return answers.decoration_preference !== '';
      case 6: return answers.bead_size !== '';
      default: return true;
    }
  };

  const handleSubmit = () => {
    localStorage.setItem('questionnaire_answers', JSON.stringify(answers));
    router.push('/report');
  };

  const JadeBeadRadio = ({ selected, className = '' }: { selected: boolean; className?: string }) => (
    <div className={`relative w-8 h-8 rounded-full transition-all duration-500 ease-out flex items-center justify-center ${selected ? 'scale-110' : ''} ${className}`}>
      <div className={`
        absolute inset-0 rounded-full transition-all duration-500
        ${selected
          ? 'jade-bead shadow-jade-glow animate-jade-glow'
          : 'bg-paper-white border-2 border-border-ink'
        }
      `} />
      {selected && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/60 to-transparent" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-white/85 top-1 left-1" />
          <div className="absolute w-1 h-1 rounded-full bg-white/40 bottom-1.5 right-1.5" />
        </>
      )}
      {!selected && (
        <div className="absolute w-3 h-3 rounded-full bg-border-ink/30" />
      )}
    </div>
  );

  const StepBadge = ({ current, total }: { current: number; total: number }) => (
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white via-jade-light to-jade shadow-jade-card flex items-center justify-center">
        <span className="text-xs font-semibold text-ink-gray tracking-tight">{current}/{total}</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/65 to-transparent" />
        <div className="absolute w-3 h-3 rounded-full bg-white/80 top-1 left-1" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/40 bottom-1.5 right-1.5" />
      </div>
    </div>
  );

  const JadeBeadStepper = ({ current, total }: { current: number; total: number }) => (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < current;
        const isCurrent = stepNum === current;
        
        return (
          <React.Fragment key={index}>
            <div className="relative">
              <div className={`
                w-3.5 h-3.5 rounded-full transition-all duration-700 ease-out
                ${isCompleted 
                  ? 'jade-bead shadow-jade-glow'
                  : ''
                }
                ${isCurrent 
                  ? 'w-4.5 h-4.5 jade-bead shadow-jade-glow ring-2 ring-jade/30 animate-jade-glow'
                  : ''
                }
                ${!isCompleted && !isCurrent 
                  ? 'bg-border-ink/50 border border-border-ink/70'
                  : ''
                }
              `} />
              {isCurrent && (
                <>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/60 to-transparent" />
                  <div className="absolute w-2 h-2 rounded-full bg-white/70 top-0.5 left-0.5" />
                </>
              )}
              {isCompleted && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
              )}
            </div>
            {index < total - 1 && (
              <div className={`
                w-7 h-[1px] mx-0.5 transition-all duration-700
                ${stepNum < current ? 'bg-gradient-to-r from-jade/40 to-jade-dark/40' : 'bg-border-ink/40'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="card p-6 scroll-enter" style={{ animationDelay: '100ms' }}>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <StepBadge current={1} total={6} />
          <h2 className="text-lg font-medium text-ink tracking-wide leading-relaxed">你当下最希望在哪方面获得能量加持？</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3.5">
          {[
            { value: '事业', label: '事业运提升', icon: '💼' },
            { value: '财运', label: '招财能量', icon: '💰' },
            { value: '情感', label: '情感疗愈', icon: '❤️' },
            { value: '安神', label: '平静身心', icon: '🧘' },
            { value: '学业', label: '学业专注', icon: '📚' }
          ].map((effect) => {
            const isSelected = answers.primary_effect === effect.value;
            return (
              <button
                key={effect.value}
                onClick={() => handlePrimaryEffectChange(effect.value)}
                className={`
                  relative p-4.5 rounded-elegant text-left transition-all duration-500 ease-out overflow-hidden
                  ${isSelected
                    ? 'card-selected'
                    : 'card card-hover'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <div className="w-5 h-5 rounded-full jade-bead jade-breathe">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/50 to-transparent" />
                    </div>
                  </div>
                )}
                <div className="text-2xl mb-2.5">{effect.icon}</div>
                <h3 className={`font-medium ${isSelected ? 'text-ink' : 'text-tea'}`}>{effect.label}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="card p-6 scroll-enter" style={{ animationDelay: '100ms' }}>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <StepBadge current={2} total={6} />
          <h2 className="text-lg font-medium text-ink tracking-wide leading-relaxed">是否有额外期望功效？（可多选，最多3个）</h2>
        </div>
        
        <div className="text-sm text-ash mb-4 tracking-wide">
          已选择：{answers.desired_effects.length}/3
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          {['招财', '桃花', '健康', '事业', '情绪', '人际沟通', '提升魅力', '增强直觉', '专注心力', '学业专注', '睡眠改善', '能量保护', '净化平衡', '创造力', '专注力', '其他'].map((effect) => {
            const isSelected = answers.desired_effects.includes(effect);
            const isDisabled = !isSelected && answers.desired_effects.length >= 3;
            return (
              <button
                key={effect}
                onClick={() => handleEffectChange(effect)}
                disabled={isDisabled}
                className={`
                  relative px-4.5 py-2.5 rounded-full text-sm font-medium transition-all duration-400
                  ${isSelected
                    ? 'bg-gradient-to-r from-jade-light to-jade text-ink-gray shadow-jade-glow'
                    : isDisabled
                    ? 'bg-mist/60 text-ash cursor-not-allowed'
                    : 'bg-paper-white border border-border-ink text-tea hover:border-jade/50 hover:bg-selected-bg/50'
                  }
                `}
              >
                {isSelected && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/60 mr-1.5 text-jade-dark text-xs">✓</span>
                )}
                {effect}
                {isSelected && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="card p-6 scroll-enter" style={{ animationDelay: '100ms' }}>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <StepBadge current={3} total={6} />
          <h2 className="text-lg font-medium text-ink tracking-wide leading-relaxed">喜欢的色系浓度？（可多选，最多3个）</h2>
        </div>
        
        <div className="text-sm text-ash mb-4 tracking-wide">
          已选择：{answers.color_preference.length}/3
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          {['偏浓', '偏透', '适中', '混搭'].map((color) => {
            const isSelected = answers.color_preference.includes(color);
            const isDisabled = !isSelected && answers.color_preference.length >= 3;
            return (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                disabled={isDisabled}
                className={`
                  relative px-5 py-3 rounded-full text-sm font-medium transition-all duration-400
                  ${isSelected
                    ? 'bg-gradient-to-r from-jade-light to-jade text-ink-gray shadow-jade-glow'
                    : isDisabled
                    ? 'bg-mist/60 text-ash cursor-not-allowed'
                    : 'bg-paper-white border border-border-ink text-tea hover:border-jade/50 hover:bg-selected-bg/50'
                  }
                `}
              >
                {isSelected && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/60 mr-1.5 text-jade-dark text-xs">✓</span>
                )}
                {color}
                {isSelected && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="card p-6 scroll-enter" style={{ animationDelay: '100ms' }}>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <StepBadge current={4} total={6} />
          <h2 className="text-lg font-medium text-ink tracking-wide leading-relaxed">更喜欢的搭配？</h2>
        </div>
        
        <div className="space-y-3.5">
          {[
            { value: 'simple', label: '简单素净（1~2 款水晶）' },
            { value: 'regular', label: '常规设计（3~4 款水晶）' },
            { value: 'bold', label: '大胆撞色（多宝风格）' }
          ].map((style) => {
            const isSelected = answers.style_preference === style.value;
            return (
              <button
                key={style.value}
                onClick={() => handleStyleChange(style.value)}
                className={`
                  relative w-full flex items-center gap-4.5 p-4.5 rounded-elegant text-left transition-all duration-500 ease-out overflow-hidden
                  ${isSelected
                    ? 'card-selected'
                    : 'option-card'
                  }
                `}
              >
                <JadeBeadRadio selected={isSelected} />
                <span className={`font-medium ${isSelected ? 'text-ink' : 'text-tea'}`}>
                  {style.label}
                </span>
                {isSelected && (
                  <div className="ml-auto">
                    <div className="w-5 h-5 rounded-full jade-bead jade-breathe">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/50 to-transparent" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="card p-6 scroll-enter" style={{ animationDelay: '100ms' }}>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <StepBadge current={5} total={6} />
          <h2 className="text-lg font-medium text-ink tracking-wide leading-relaxed">是否喜欢装饰点缀？</h2>
        </div>
        
        <div className="space-y-3.5">
          {[
            { value: 'yes', label: '喜欢精致特别的' },
            { value: 'moderate', label: '适度点缀即可' },
            { value: 'no', label: '不要任何非天然装饰' }
          ].map((decoration) => {
            const isSelected = answers.decoration_preference === decoration.value;
            return (
              <button
                key={decoration.value}
                onClick={() => handleDecorationChange(decoration.value)}
                className={`
                  relative w-full flex items-center gap-4.5 p-4.5 rounded-elegant text-left transition-all duration-500 ease-out overflow-hidden
                  ${isSelected
                    ? 'card-selected'
                    : 'option-card'
                  }
                `}
              >
                <JadeBeadRadio selected={isSelected} />
                <span className={`font-medium ${isSelected ? 'text-ink' : 'text-tea'}`}>
                  {decoration.label}
                </span>
                {isSelected && (
                  <div className="ml-auto">
                    <div className="w-5 h-5 rounded-full jade-bead jade-breathe">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/50 to-transparent" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="card p-6 scroll-enter" style={{ animationDelay: '100ms' }}>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <StepBadge current={6} total={6} />
          <h2 className="text-xl font-medium text-ink tracking-wide leading-relaxed">珠子大小偏好？</h2>
        </div>
        
        <div className="space-y-3.5">
          {[
            { value: 'small', label: '小珠（6~8mm）', desc: '精致秀气', beads: [2.5, 3] },
            { value: 'medium', label: '中珠（8~10mm）', desc: '适中百搭', beads: [3, 3.5] },
            { value: 'large', label: '大珠（10~12mm）', desc: '气场强大', beads: [3.5, 4] }
          ].map((size) => {
            const isSelected = answers.bead_size === size.value;
            return (
              <button
                key={size.value}
                onClick={() => handleBeadSizeChange(size.value)}
                className={`
                  relative w-full flex items-center gap-4.5 p-4.5 rounded-elegant text-left transition-all duration-500 ease-out overflow-hidden
                  ${isSelected
                    ? 'card-selected'
                    : 'option-card'
                  }
                `}
              >
                <div className="relative">
                  <JadeBeadRadio selected={isSelected} />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1.5">
                      <div className="w-4 h-4 rounded-full jade-bead">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/50 to-transparent" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <span className={`font-medium block ${isSelected ? 'text-ink' : 'text-tea'}`}>
                    {size.label}
                  </span>
                  <span className="text-sm text-ash">{size.desc}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {size.beads.map((beadSize, i) => (
                    <div 
                      key={i}
                      className={`rounded-full jade-bead ${isSelected ? 'opacity-100' : 'opacity-40'}`}
                      style={{ width: `${beadSize * 3.5}px`, height: `${beadSize * 3.5}px` }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/50 to-transparent" />
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const steps = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6];

  return (
    <div className="min-h-screen bg-paper bg-xuan bg-cloud relative overflow-hidden">
      <div className="relative z-10">
        <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-xl px-6 py-5 border-b border-border-ink/40">
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="relative w-10.5 h-10.5 rounded-full bg-paper-white border border-border-ink shadow-card flex items-center justify-center text-tea hover:text-ink hover:border-jade/50 transition-all duration-400"
              >
                <span className="text-base font-medium">←</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
              </button>
              <h1 className="text-xl font-medium text-ink tracking-wide">个性化问卷</h1>
            </div>
            
            <div className="mt-5">
              <JadeBeadStepper current={currentStep} total={6} />
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className={`transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {steps[currentStep - 1]()}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/95 to-transparent h-24 pointer-events-none" />
          
          <div className="relative bg-paper-white/95 backdrop-blur-xl border-t border-border-ink/35 px-6 py-4.5">
            <div className="flex gap-3.5">
              <button
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className={`
                  flex-1 h-12.5 rounded-full font-medium transition-all duration-400
                  ${currentStep === 1
                    ? 'bg-mist/60 text-ash cursor-not-allowed'
                    : 'btn-secondary'
                  }
                `}
              >
                上一步
              </button>
              
              {currentStep < 6 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid(currentStep)}
                  className={`
                    flex-1 h-12.5 rounded-full font-medium transition-all duration-400
                    ${isStepValid(currentStep)
                      ? 'btn-primary'
                      : 'bg-mist/60 text-ash cursor-not-allowed'
                    }
                  `}
                >
                  下一步
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep)}
                  className={`
                    flex-1 h-12.5 rounded-full font-medium transition-all duration-400
                    ${isStepValid(currentStep)
                      ? 'btn-primary'
                      : 'bg-mist/60 text-ash cursor-not-allowed'
                    }
                  `}
                >
                  生成报告
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="h-28"></div>
      </div>
    </div>
  );
};

export default QuestionnairePage;