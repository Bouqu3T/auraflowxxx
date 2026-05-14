import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
}

export const Input: React.FC<InputProps> = ({ id, className, ...props }) => {
  return (
    <input
      id={id}
      className={`w-full px-3 py-2 border border-[#E6DED0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C4A8] ${className || ''}`}
      {...props}
    />
  );
};
