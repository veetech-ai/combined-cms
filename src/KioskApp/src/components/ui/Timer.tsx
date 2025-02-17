import React from 'react';

interface TimerProps {
  seconds: number;
  isActive: boolean;
  variant?: 'light' | 'dark';
  onStartOver: () => void;
  onComplete?: () => void;
}

export function Timer({ 
  seconds, 
  isActive,
  variant = 'light',
  onStartOver,
  onComplete 
}: TimerProps) {
  const [showResetButton, setShowResetButton] = React.useState(false);

  React.useEffect(() => {
    if (isActive && seconds === 0) {
      setShowResetButton(true);
    } else {
      setShowResetButton(false);
    }
  }, [seconds, isActive]);

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
              {showResetButton ? 'Session expired' : isWarning ? 'Session expiring' : 'Session active'}
            </p>
          </div>

          {showResetButton ? (
            <button 
              onClick={() => {
                onStartOver();
                setShowResetButton(false);
              }}
              className={`
                text-sm font-medium px-4 py-1 rounded-full
                ${variant === 'dark'
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-black text-white hover:bg-gray-800'
                }
                transition-colors
              `}
            >
                    Start Over
            </button>
          ) : (
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
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  );
}