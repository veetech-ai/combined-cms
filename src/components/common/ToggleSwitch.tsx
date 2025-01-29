import React, { useEffect } from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  size?: 'sm' | 'md';
}

export default function ToggleSwitch({
  enabled,
  onChange,
  size = 'md'
}: ToggleSwitchProps) {
  const baseClasses =
    'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const sizeClasses = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses} ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`${
          enabled ? 'translate-x-full' : 'translate-x-0'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          size === 'sm' ? 'h-3 w-3 translate-x-0.5' : 'h-4 w-4 translate-x-1'
        }`}
      />
    </button>
  );
}
