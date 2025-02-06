import React from 'react';

interface TimerProps {
  seconds: number;
  isActive: boolean;
  variant?: 'light' | 'dark';
  onStartOver: () => void;
}

export function Timer({ 
  seconds, 
  isActive,
  variant = 'light',
  onStartOver 
}: TimerProps) {
  if (!isActive) return null;

  const isWarning = seconds <= 10;
  const progress = (seconds / 30) * 100;

  return (
    <div 
      className={`
        fixed bottom-6 left-6 transition-all duration-500 ease-in-out
        ${variant === 'dark' ? 'text-white' : 'text-gray-600'}
      `}
    >
      <div className={`
        relative rounded-full p-3 pr-5 flex items-center gap-3
        ${variant === 'dark' 
          ? isWarning ? 'bg-red-500/20' : 'bg-white/10'
          : isWarning ? 'bg-red-50' : 'bg-gray-50'
        }
        ${isWarning ? 'animate-pulse' : ''}
      `}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium tabular-nums">
              {seconds}
            </span>
          </div>
          <svg className="w-8 h-8 -rotate-90">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="opacity-20"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={88}
              strokeDashoffset={88 - (88 * progress) / 100}
              className={`
                transition-all duration-1000 ease-linear
                ${isWarning ? 'stroke-red-500' : ''}
              `}
            />
          </svg>
        </div>
        
        <div className="flex items-center gap-3">
          <div>
            <p className={`
              text-sm font-medium
              ${variant === 'dark' 
                ? isWarning ? 'text-red-300' : 'text-white/90'
                : isWarning ? 'text-red-600' : 'text-gray-600'
              }
            `}>
              {isWarning ? 'Session expiring' : 'Session active'}
            </p>
          </div>

          <button 
            onClick={() => onStartOver()}
            className={`
              text-sm font-medium transition-colors
              ${variant === 'dark'
                ? 'text-white/70 hover:text-white'
                : 'text-gray-500 hover:text-gray-900'
              }
            `}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}