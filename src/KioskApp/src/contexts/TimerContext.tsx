import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface TimerContextType {
  timeLeft: number;
  isTimerActive: boolean;
  showTimer: boolean;
  resetTimer: () => void;
  handleUserActivity: () => void;
  startTimer: () => void;
  stopTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const handleUserActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (showTimer) {
      setShowTimer(false);
      setTimeLeft(120);
    }
  }, [showTimer]);

  const resetTimer = useCallback(() => {
    setTimeLeft(120);
    setIsTimerActive(true);
    handleUserActivity();
  }, [handleUserActivity]);

  const startTimer = useCallback(() => {
    setIsTimerActive(true);
    setShowTimer(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerActive(false);
    setShowTimer(false);
  }, []);

  // Check for inactivity
  useEffect(() => {
    const inactivityCheck = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity > 10000) { // 10 seconds
        setShowTimer(true);
        setIsTimerActive(true);
      }
    }, 1000);

    return () => clearInterval(inactivityCheck);
  }, [lastActivity]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || !showTimer || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive, showTimer]);

  return (
    <TimerContext.Provider 
      value={{
        timeLeft,
        isTimerActive,
        showTimer,
        resetTimer,
        handleUserActivity,
        startTimer,
        stopTimer
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 