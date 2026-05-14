import React from 'react';

interface BeadStepperProps {
  steps: number;
  currentStep: number;
}

export const BeadStepper: React.FC<BeadStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto my-6">
      {Array.from({ length: steps }).map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={index}>
            <div className="relative flex items-center justify-center">
              <div
                className={`
                  w-4 h-4 rounded-full transition-all duration-500
                  ${isCompleted ? 'bg-aura-gold shadow-bead' : ''}
                  ${isCurrent ? 'bg-aura-gold shadow-bead ring-4 ring-aura-gold/20 animate-breath' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-white border border-gray-200 shadow-sm opacity-50' : ''}
                `}
              />
            </div>

            {index < steps - 1 && (
              <div
                className={`
                  flex-1 h-[1px] mx-2 transition-all duration-500
                  ${stepNum < currentStep ? 'bg-aura-gold/50' : 'bg-gray-200/50'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
