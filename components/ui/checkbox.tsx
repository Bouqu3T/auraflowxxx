import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onCheckedChange, ...props }) => {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`w-4 h-4 rounded border border-[#E6DED0] text-[#D4C4A8] focus:ring-[#D4C4A8]`}
      {...props}
    />
  );
};
