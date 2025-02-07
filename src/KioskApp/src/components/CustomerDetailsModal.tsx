import React, { useState, useEffect, useCallback } from 'react';
import { useCustomerStore } from '../stores/customerStore';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { Timer } from './ui/Timer';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { CheckoutLayout } from '../components/CheckoutLayout';
import { useOrder } from '../../../contexts/OrderContext';
type Step = 'name' | 'phone';

export function CustomerDetailsModal() {
  const { orderItems } = useOrder();
  const location = useLocation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<Step>(
    location.state?.step === 'phone' ? 'phone' : 'name'
  );
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isUserActive, setIsUserActive] = useState(true);
  useCustomerStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearCart } = useCartStore();
  const { setCustomerName } = useCustomerStore();

  // Add cleanup reference
  const timerRef = React.useRef<NodeJS.Timeout>();

  // Track user activity
  const handleUserActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsUserActive(true);
    
    if (showTimer) {
      setShowTimer(false);
      setTimeLeft(30); // Reset countdown when user becomes active
    }
  }, [showTimer]);

  // Set up activity listeners
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity]);

  // Check for inactivity
  useEffect(() => {
    const inactivityCheck = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      if (timeSinceLastActivity > 10000) { // 10 seconds
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
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive, showTimer]);

  // Handle timer expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      handleStartOver();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (step === 'phone') {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length === 10 && /^[2-9]\d{9}$/.test(cleanPhone)) {
        handlePhoneSubmit();
      }
    }
  }, [phone, step]);

  const resetTimer = () => {
    setTimeLeft(30);
    setIsTimerActive(true);
    handleUserActivity();
  };

  const handleNameSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setStep('phone');
  };

  const handleBack = () => {
    if (step === 'phone') {
      setStep('name');
    } else {
      navigate(`/kiosk/${id}/kiosk`);
    }
  };

  const handleStartOver = () => {
    setIsTimerActive(false);
    setShowTimer(false);
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  // Update input handlers to use handleUserActivity
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    handleUserActivity();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    handleUserActivity();

    let formattedValue = '';
    if (numericValue.length <= 3) {
      formattedValue = numericValue;
    } else if (numericValue.length <= 6) {
      formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
    } else {
      formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(
        3,
        6
      )}-${numericValue.slice(6, 10)}`;
    }

    if (numericValue.length >= 1 && !/[2-9]/.test(numericValue[0])) {
      return;
    }

    if (numericValue.length <= 10) {
      setPhone(formattedValue);
    }
  };

  const handlePhoneSubmit = async () => {
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      const orderDetails = {
        customerName: name,
        customerPhone: phone,
        timestamp: new Date().toISOString()
      };
      setCustomerName(name);
      navigate(`/kiosk/${id}/payment`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save customer data'
      );
    }
  };

  // Update component cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update handler for order button click - remove clearCart
  const handleOrderClick = () => {
    navigate(`/kiosk/${id}/kiosk`);
  };

  return (
    <div 
      className="min-h-screen bg-white"
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
    >
      <div className="p-6 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors 
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
            disabled:pointer-events-none disabled:opacity-50
            hover:bg-gray-100 h-9 px-4 py-2 
            text-gray-900"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleOrderClick}
          className="flex items-center space-x-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{orderItems && orderItems.items.length} items</span>
          <span>|</span>
          <span>${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}</span>
        </button>
      </div>

      <div className="flex-1 px-6 relative">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-2 gap-12 items-center">
          {step === 'name' ? (
            <>
              <div>
                <h1 className="text-4xl font-medium mb-4">What's your name?</h1>
                <p className="text-gray-500 text-lg max-w-sm">
                  We will call your name when your order is ready
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full text-5xl bg-transparent focus:outline-none placeholder-gray-300 py-4 focus:ring-0"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) {
                      handleNameSubmit();
                      resetTimer();
                    }
                  }}
                />
                <div className="absolute left-0 right-0 h-0.5 bg-gray-200 bottom-0" />
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-4xl font-medium mb-4">
                  What's your phone number?
                </h1>
                <p className="text-gray-500 text-lg max-w-sm">
                  We will also text you when your order is ready
                </p>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="(XXX) XXX-XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full text-5xl bg-transparent focus:outline-none placeholder-gray-300 py-4 focus:ring-0"
                  maxLength={14}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && phone.trim()) {
                      handlePhoneSubmit();
                      resetTimer();
                    }
                  }}
                />
                <div className="absolute left-0 right-0 h-0.5 bg-gray-200 bottom-0" />
              </div>
            </>
          )}
        </div>
      </div>

      {showTimer && (
        <Timer
          seconds={timeLeft}
          isActive={isTimerActive}
          onStartOver={resetTimer}
          onComplete={handleStartOver}
        />
      )}
    </div>
  );
}
