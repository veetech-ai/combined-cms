import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCustomerStore } from '../stores/customerStore';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Timer } from './ui/Timer';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { CheckoutLayout } from '../components/CheckoutLayout';
import { useOrder } from '../../../contexts/OrderContext';
import { orderService } from '../../..//services/orderService';
import { Button } from '@/components/ui/button';
type Step = 'name' | 'phone';

export function CustomerDetailsModal() {
  const { orderItems, setOrder } = useOrder();
  const location = useLocation();

  const [step, setStep] = useState<Step>(
    location.state?.fromPayment
      ? 'name'
      : location.state?.step === 'phone'
        ? 'phone'
        : 'name'
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
  const { setCustomerName, customerName } = useCustomerStore();

  const [name, setName] = useState(orderItems?.customerName || '');
  const [phone, setPhone] = useState(orderItems?.customerPhone || '');

  // Add cleanup reference
  const timerRef = React.useRef<NodeJS.Timeout>();

  // Add refs for the inputs
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const phoneInputRef = React.useRef<HTMLInputElement>(null);

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

  const resetTimer = () => {
    setTimeLeft(30);
    setIsTimerActive(true);
    handleUserActivity();
  };

  // Add name validation function
  const validateName = (input: string) => {
    return /^[A-Za-z\s]+$/.test(input) || input === '';
  };

  // Update handleNameChange with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (validateName(newName)) {
      setName(newName);
      handleUserActivity();
    }
  };

  // Update handleNameSubmit with better validation
  const handleNameSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Please enter your name');
      return;
    }
    if (trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters long');
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

  const generateOrderId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';

    // Generate a 6-character random string
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Get current date in YYYYMMDD format
    const now = new Date();
    const datePart =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');

    return `${datePart}-${randomPart}`;
  };

  const handlePhoneSubmit = async () => {
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      let orderData;

      if (location.state?.fromPayment && orderItems?.orderId) {
        // Update existing order
        const orderDetails = {
          customerName: name,
          customerPhone: phone
        };

        console.log('Updating order:', {
          orderId: orderItems.orderId,
          orderDetails
        });

        orderData = await orderService.updateOrder(
          orderItems.orderId,
          orderDetails
        );
      } else {
        // Create new order
        const orderDetails: Order = {
          status: 'pending',
          orderId: generateOrderId(),
          customerName: name,
          customerPhone: phone,
          timestamp: new Date().toISOString(),
          items: orderItems?.items || [],
          totalBill: orderItems?.totalBill || '0'
        };

        orderData = await orderService.createOrder(orderDetails);
      }

      // Update both customer name and order context with the response data
      setCustomerName(name);
      setOrder(orderData); // Update the entire order object with server response

      navigate(`/kiosk/${id}/payment`);
    } catch (error) {
      console.error('Error in handlePhoneSubmit:', error);
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

  // Add effect to focus inputs when step changes
  useEffect(() => {
    // Small delay to ensure the input is mounted and keyboard shows up
    const timer = setTimeout(() => {
      if (step === 'name' && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (step === 'phone' && phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [step]);

  // Add effect to update form when orderItems changes
  useEffect(() => {
    if (orderItems) {
      setName(orderItems.customerName || '');
      setPhone(orderItems.customerPhone || '');
    }
  }, [orderItems]);

  // Add back the phone input effect but with the fromPayment check

  const isValidPhone = useMemo(() => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10 && /^[2-9]\d{9}$/.test(cleanPhone);
  }, [phone]);
  

  // Update the name input keydown handler to work in both cases
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && name.trim()) {
      handleNameSubmit();
      resetTimer();
    }
  };

  // Update the phone input keydown handler to work in both cases
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && phone.trim()) {
      handlePhoneSubmit();
      resetTimer();
    }
  };

  return (
    <div
      className="min-h-screen bg-white relative"
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
    >
      <div className="p-6 flex justify-between">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="lg"
          className="flex items-center text-lg"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </Button>

        <button
          type="button"
          onClick={handleOrderClick}
          className="flex items-center space-x-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{orderItems && orderItems.items.length} items</span>
          <span>|</span>
          <span>
            ${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}
          </span>
        </button>
      </div>

      <div className="flex-1 px-6">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-2 gap-12 items-start">
          {' '}
          {/* Changed items-center to items-start */}
          {step === 'name' ? (
            <>
              <div>
                <h1 className="text-4xl font-medium mb-4">What's your name?</h1>
                <p className="text-gray-500 text-lg max-w-sm">
                  We will call your name when your order is ready
                </p>
              </div>
              <div className="space-y-4">
                {' '}
                {/* Added container with spacing */}
                <div className="relative">
                  <input
                    ref={nameInputRef}
                    type="text"
                    inputMode="text"
                    pattern="[A-Za-z\s]*"
                    placeholder="Your name"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full text-5xl bg-transparent focus:outline-none placeholder-gray-300 py-4 focus:ring-0"
                    autoFocus
                    autoComplete="off"
                    onKeyDown={handleNameKeyDown}
                  />
                  <div className="absolute left-0 right-0 h-0.5 bg-gray-200 bottom-0" />

                </div>
                <div className='flex justify-end w-full'>
                  <Button disabled={name == ""} onClick={handleNameSubmit} className='text-3xl h-30 px-10 pb-3'>
                    Next
                  </Button>
                </div>
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
              <div className="space-y-4">
                {' '}
                {/* Added container with spacing */}
                <div className="relative">
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="(XXX) XXX-XXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full text-5xl bg-transparent focus:outline-none placeholder-gray-300 py-4 focus:ring-0"
                    maxLength={14}
                    autoFocus
                    autoComplete="off"
                    onKeyDown={handlePhoneKeyDown}
                  />
                  <div className="absolute left-0 right-0 h-0.5 bg-gray-200 bottom-0" />
                </div>
                <div className='flex justify-end w-full'>
                  <Button disabled={!isValidPhone} onClick={handlePhoneSubmit} className='text-3xl h-30 px-10 pb-3'>
                    Next
                  </Button>
                </div>
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
