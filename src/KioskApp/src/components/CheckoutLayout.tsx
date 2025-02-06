import React from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Timer } from './ui/Timer';
// import { useActivityTimer } from '../hooks/useActivityTimer';
// import { useCheckout } from '../contexts/CheckoutContext';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutLayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  onStartOver?: () => void;
  cartItems?: CartItem[];
  onViewCart?: () => void;
  timer?: number;
  dark?: boolean;
  onTimeout?: () => void;
}

export function CheckoutLayout({
  children,
  title,
  onBack,
  onStartOver,
  cartItems = [],
  onViewCart,
  timer = 30,
  dark = false,
  onTimeout
}: CheckoutLayoutProps) {
  const { clearSession } = useCheckout();
  // const { timeLeft, isActive } = useActivityTimer({
  //   initialTime: timer,
  //   onTimeout: () => {
  //     clearSession();
  //     onStartOver?.();
  //   }
  // });

  const handleStartOver = () => {
    clearSession();
    onStartOver?.();
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number((item.price * item.quantity).toFixed(2));
    return Number((acc + price).toFixed(2));
  }, 0);
  const total = subtotal;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`h-[100dvh] flex flex-col ${dark ? 'bg-black text-white' : 'bg-white'}`}>
      {timer > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Timer
            seconds={timeLeft}
            isActive={isActive}
            variant={dark ? 'dark' : 'light'}
            onStartOver={handleStartOver}
            onComplete={() => {
              clearSession();
              onStartOver?.();
            }}
          />
        </div>
      )}
      
      <div className="fixed top-0 left-0 right-0 p-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {onBack && (
            <button 
              onClick={onBack} 
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg
                ${dark 
                  ? 'text-white/60 hover:text-white hover:bg-white/10' 
                  : 'text-black/60 hover:text-black hover:bg-black/5'
                } 
                transition-colors
              `}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}
          
          {onViewCart && cartItems.length > 0 && (
            <button
              onClick={onViewCart}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-full
                ${dark 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-black/5 hover:bg-black/10'
                }
                transition-all transform hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm font-medium">{itemCount} items</span>
              </div>
              <div className={`h-4 w-px ${dark ? 'bg-white/20' : 'bg-black/20'}`} />
              <span className="text-sm font-medium">
                ${total.toFixed(2)}
              </span>
            </button>
          )}
        </div>
      </div>
      
      <main className="flex-1 overflow-hidden pt-16">
        {children}
      </main>
    </div>
  );
}