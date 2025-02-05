import { useEffect, useMemo,useState } from 'react';
import MenuSection from './MenuSection';
import { CartSection } from './CartSection';
import { LanguageToggle } from './LanguageToggle';
import { Toaster } from 'react-hot-toast';
// import { useMenuStore } from './stores/menuStore';
import { useWebSocket } from '../hooks/useWebSocket';
import Maxikhana from '../images/maxikhana.png';
import { AnimatePresence } from 'framer-motion';
import { WelcomeScreen } from './WelcomeScreen';

export function KioskApp() {
  // const { loadMenuItems } = useMenuStore();
  // const { clearCart } = useCartStore();
  const [showWelcome, setShowWelcome] = useState(true);
  const wsUrl = useMemo(() => {
    try {
      const apiUrl = (import.meta as any).env.VITE_API_URL;
      // Only enable WebSocket if we have a specific flag
      if (!apiUrl || !(import.meta as any).env.VITE_ENABLE_WEBSOCKET) {
        return null;
      }
      return apiUrl.replace(/^http/, 'ws') + '/ws';
    } catch {
      return null;
    }
  }, []);

  // Initialize WebSocket connection
  useWebSocket(wsUrl);

  // useEffect(() => {
  //   loadMenuItems();
  // }, [loadMenuItems]);

  const handleStartOver = () => {
    // clearCart();
    // Ensure we reset all state before showing welcome screen
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


  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f8f8f8]">
      {/* <AnimatePresence>
        {showWelcome && <WelcomeScreen onStart={handleStart} />}
      </AnimatePresence> */}
      
      {/* Header - Fixed height */}
      <header
        className="bg-white shadow-sm h-16 flex items-center justify-between px-4 relative"
        role="banner"
      >
        <div className="flex-1" /> {/* Spacer */}
        <img
          src={Maxikhana}
          alt="MexiKhana Logo"
          className="h-12 object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="flex-1 flex justify-end">
          <LanguageToggle />
        </div>
      </header>

      {/* Main Content - Fills remaining height */}
      <main
        className="flex-1 flex flex-col md:flex-row gap-4 p-4 max-w-[1440px] mx-auto w-full min-h-0"
        role="main"
      >
        {/* Menu Section - 75% width on desktop */}
        <div className="w-full md:w-2/3 lg:w-3/4 overflow-hidden flex flex-col">
          <MenuSection />
        </div>

        {/* Cart Section - 25% width on desktop */}
        <div className="w-full md:w-1/3 lg:w-1/4 overflow-hidden flex flex-col">
          <CartSection onStartOver={handleStartOver}/>
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
