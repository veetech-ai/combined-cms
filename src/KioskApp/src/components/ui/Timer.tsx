import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerState {
  timeLeft: number;
  isActive: boolean;
}

interface TimerProps {
  seconds: number;
  onComplete: () => void;
  onStartOver: () => void;
}

export function Timer({ seconds, onComplete, onStartOver }: TimerProps) {
  const [state, setState] = useState<TimerState>({
    timeLeft: seconds,
    isActive: true
  });
  const timerRef = useRef<NodeJS.Timeout>();
  const percentage = (state.timeLeft / seconds) * 100;

  // Reset timer when user interacts with any part of the screen
  useEffect(() => {
    const handleInteraction = () => {
      if (state.isActive) {
        setState(prev => ({
          ...prev,
          timeLeft: seconds
        }));
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [seconds, state.isActive]);

  useEffect(() => {
    if (state.timeLeft <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setState(prev => ({ ...prev, isActive: false }));
      onComplete();
      return;
    }

    timerRef.current = setInterval(() => {
      if (state.isActive) {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.timeLeft, state.isActive, onComplete]);

  const handleStartOver = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState({
      timeLeft: seconds,
      isActive: true
    });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onStartOver();
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Timer Circle */}
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            className="stroke-[#f0f0f0]"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            className="stroke-black"
            strokeWidth="6"
            fill="none"
            strokeDasharray={175.93}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 175.93 * (1 - percentage / 100) }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        
        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            key={state.timeLeft}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-lg font-medium"
          >
            {state.timeLeft}
          </motion.span>
        </div>
      </div>

      {/* Reset Button */}
      <AnimatePresence>
        <motion.button
          onClick={handleStartOver}
          className="mt-2 px-4 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M12 3l-9 9 9 9" />
          </svg>
          Start Over
        </motion.button>
      </AnimatePresence>
    </div>
  );
}