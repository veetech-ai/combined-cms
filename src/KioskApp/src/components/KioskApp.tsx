import { useEffect, useMemo, useState, useCallback } from 'react';
import MenuSection from './MenuSection';
import { CartSection } from './CartSection'; // Updated import
import { LanguageToggle } from './LanguageToggle';
import { Toaster } from 'react-hot-toast';
import { useWebSocket } from '../hooks/useWebSocket';
import Maxikhana from '../images/maxikhana.png';
import { AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './WelcomeScreen';

//--------------------------------------------

import { Timer } from './ui/Timer';
import QRCode from 'qrcode';
import { useNavigate, useParams } from 'react-router-dom';

import { useCartStore } from '../stores/cartStore';

//--------------------------------------------

export function KioskApp() {
  const [showWelcome, setShowWelcome] = useState(true);
  const wsUrl = useMemo(() => {
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL;
      if (!apiUrl || !(import.meta as any).env.VITE_ENABLE_WEBSOCKET) {
        return null;
      }
      return apiUrl.replace(/^http/, 'ws') + '/ws';
    } catch {
      return null;
    }
  }, []);

  useWebSocket(wsUrl);

  const handleStartOver = () => {
    setTimeout(() => {
      setShowWelcome(true);
    }, 0);
    setShowWelcome(true);
  };

  const handleStart = () => {
    if (showWelcome) {
      setShowWelcome(false);
    }
    setShowWelcome(false);
  };

  //------------------------------------------ Fix me baby

  const navigate = useNavigate();
  const { id } = useParams();
  const { clearCart } = useCartStore();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isUserActive, setIsUserActive] = useState(true);
  // useEffect(() => {
  //   QRCode.toDataURL('https://payment.example.com/order/123')
  //     .then((url) => setQrCode(url))
  //     .catch((err) => console.error('Failed to generate QR code:', err));
  // }, []);

  // Track user activity
  const handleUserActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsUserActive(true);

    if (showTimer) {
      setShowTimer(false);
      setTimeLeft(60); // Reset countdown when user becomes active
    }
  }, [showTimer]);

  // Set up activity listeners
  useEffect(() => {
    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll'
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity]);

  // Check for inactivity
  useEffect(() => {
    const inactivityCheck = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;

      if (timeSinceLastActivity > 10000) {
        // 10 seconds
        setIsUserActive(false);
        setShowTimer(true);
        setIsTimerActive(true);
      }
    }, 1000);

    return () => clearInterval(inactivityCheck);
  }, [lastActivity]);

  // Countdown timer
  useEffect(() => {
    if (!isTimerActive || !showTimer || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive, showTimer]);

  // Handle timer expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      handleStartOver();
    }
  }, [timeLeft]);

  const handleStartOverFromStart = () => {
    setIsTimerActive(false);
    setShowTimer(false);
    setTimeLeft(60); // Reset timer
    setIsTimerActive(true); // Restart timer
    setLastActivity(Date.now()); // Reset activity timestamp
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  //------------------------------------------

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f8f8f8]">
      <header
        className="bg-white shadow-sm h-16 flex items-center justify-between px-4 relative"
        role="banner"
      >
        <div className="flex-1" />
        <img
          src={Maxikhana}
          alt="MexiKhana Logo"
          className="h-12 object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="flex-1 flex justify-end">
          <LanguageToggle />
        </div>
      </header>

      <main
        className="flex-1 flex flex-col md:flex-row gap-4 p-4 max-w-[1440px] mx-auto w-full min-h-0"
        role="main"
      >
        <div className="w-full md:w-2/3 lg:w-3/4 overflow-hidden flex flex-col">
          <MenuSection />
        </div>

        <div className="w-full md:w-1/3 lg:w-1/4 overflow-hidden flex flex-col">
          <CartSection onStartOver={handleStartOver} />
        </div>
      </main>
      {showTimer && (
        <div className="absolute top-4 right-4">
          <Timer
            seconds={timeLeft}
            isActive={isTimerActive}
            variant="light"
            onStartOver={handleStartOverFromStart}
            onComplete={handleStartOverFromStart}
          />
        </div>
      )}
      <Toaster position="top-center" />
    </div>
  );
}
