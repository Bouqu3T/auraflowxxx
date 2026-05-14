import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E6DED0] shadow-sm ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};
