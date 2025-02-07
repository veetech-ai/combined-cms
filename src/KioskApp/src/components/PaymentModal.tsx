import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, ChevronLeft, ShoppingCart, CreditCard } from 'lucide-react';
import { BackButton } from './ui/BackButton';
import { Timer } from './ui/Timer';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import { useNavigate, useParams } from 'react-router-dom';
import { ApplePayLogo } from './ui/ApplePayLogo';
import { GooglePayLogo } from './ui/GooglePayLogo';

import { useCartStore } from '../stores/cartStore';
import { useCustomerStore } from '../stores/customerStore';
import { useOrder } from '../../../contexts/OrderContext';

// Add dummy data
const dummyCartItems = [
  { name: 'Cappuccino', price: 4.5, quantity: 1 },
  { name: 'Chocolate Croissant', price: 3.75, quantity: 2 },
  { name: 'Iced Latte', price: 5.0, quantity: 1 },
  { name: 'Blueberry Muffin', price: 3.25, quantity: 1 }
];

export function PaymentModal() {
  const { orderItems } = useOrder();
  const [qrCode, setQrCode] = useState('');
  const [step, setStep] = useState('initial');
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearCart } = useCartStore();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isUserActive, setIsUserActive] = useState(true);
  const { customerName } = useCustomerStore();
  const [orderTotal, setOrderTotal] = useState();

  const total = dummyCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    QRCode.toDataURL('https://payment.example.com/order/123')
      .then((url) => setQrCode(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, []);

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

  const resetTimer = () => {
    setTimeLeft(60);
    setIsTimerActive(true);
    handleUserActivity(); // Register this as user activity
  };

  // Update handlers to track activity
  const handleGotIt = () => {
    resetTimer();
    handleUserActivity();
    navigate(`/kiosk/${id}/feedback`);
  };

  const handleSuccess = () => {
    resetTimer();
    navigate(`/kiosk/${id}/summary`);
    // navigate(`/kiosk/${id}/success`);
  };

  const handleClose = () => {
    // Navigate back to phone number step without clearing cart
    navigate(`/kiosk/${id}/details`, { 
      state: { step: 'phone' } // Pass step information
    });
  };

  const handleStartOver = () => {
    setIsTimerActive(false);
    setShowTimer(false);
    setTimeLeft(60); // Reset timer
    setIsTimerActive(true); // Restart timer
    setLastActivity(Date.now()); // Reset activity timestamp
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  const handleQRCodeClick = () => {
    resetTimer();
    handleUserActivity();
  };

  // Update handler for order button click - remove clearCart
  const handleOrderClick = () => {
    navigate(`/kiosk/${id}/kiosk`);
  };

  return (
    <div className="fixed inset-0 bg-white">
      {step === 'initial' && (
        <>
          <div className="p-6 flex justify-between">
            <button
              type="button"
              onClick={handleClose}
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

          <div className="h-[100dvh] flex flex-col lg:flex-row items-stretch">
            {/* Left Side - Order Summary */}
            <div className="w-full lg:w-[45%] lg:border-r border-gray-100 flex flex-col order-2 lg:order-1 h-full">
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-medium">Order Summary</h2>
                  <div className="text-gray-500">{orderItems && orderItems.orderId}</div>
                </div>
                
                {/* Order Details Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  {/* Order Items List */}
                  <div className="p-4 space-y-4">
                    {orderItems.items.map((item, index) => (
                      <div key={index} className="space-y-1">
                        {/* Main Item */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{item.quantity}x</span>
                            <span className="font-medium">{item.name.en}</span>
                          </div>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Customizations */}
                        {item.customization && Object.keys(item.customization).length > 0 && (
                          <div className="ml-8 text-sm text-gray-500">
                            {Object.entries(item.customization).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2">
                                <span>•</span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Addons */}
                        {item.addons && item.addons.length > 0 && (
                          <div className="ml-8 text-sm text-gray-500">
                            {item.addons.map((addon, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span>+</span>
                                  <span>{addon.name}</span>
                                </div>
                                <span>${addon.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Extras */}
                        {item.extras && item.extras.length > 0 && (
                          <div className="ml-8 text-sm text-gray-500">
                            {item.extras.map((extra, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                                  <span>+</span>
                                  <span>{extra.name}</span>
                                </div>
                                <span>${extra.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Divider except for last item */}
                        {index < orderItems.items.length - 1 && (
                          <div className="border-b border-gray-100 my-2" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="border-t border-gray-100">
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}</span>
                </div>

                      <div className="flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Payment Options */}
            <div className="flex-1 p-6 order-1 lg:order-2 overflow-auto">
              <div className="max-w-lg mx-auto space-y-6">
                <h2 className="text-2xl font-medium mb-4">Select Payment Method</h2>

                {/* Digital Payment */}
                <div className="bg-white rounded-2xl p-4 shadow-lg relative overflow-hidden border border-gray-100 group">
                  <div className="flex flex-col items-center text-center mb-3">
                    <h3 className="text-2xl font-medium mb-1">Quick Pay</h3>
                    <p className="text-gray-500">Scan with your phone</p>
              </div>

                  <div className="flex justify-center gap-4 mb-3">
                    <div className="transform transition-transform group-hover:scale-105">
                  <GooglePayLogo />
                    </div>
                    <div className="transform transition-transform group-hover:scale-105">
                  <ApplePayLogo />
                    </div>
                </div>

                <div
                    className="flex justify-center relative bg-white rounded-xl p-4 border-2 border-gray-100 cursor-pointer"
                    onClick={() => {
                      handleQRCodeClick();
                      handleSuccess();
                    }}
                >
                  {qrCode && (
                    <img
                      src={qrCode}
                      alt="Payment QR Code"
                        className="w-40 h-40 transition-transform hover:scale-105"
                    />
                  )}
                  </div>
                </div>

                {/* Cash/Card Payment */}
                <motion.button
                  onClick={() => {
                    setStep('cash');
                    resetTimer();
                  }}
                  className="w-full bg-black text-white rounded-2xl p-4 flex items-center justify-between hover:bg-black/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div>
                    <h3 className="text-lg font-medium mb-1">Pay with Cash or Card</h3>
                    <p className="text-white/70 text-sm">Pay at the counter</p>
                  </div>
                  <CreditCard className="w-6 h-6" />
                </motion.button>

                {showTimer && (
                  <div className="absolute top-4 right-4">
                    <Timer
                      seconds={timeLeft}
                      isActive={isTimerActive}
                      variant="light"
                      onStartOver={handleStartOver}
                      onComplete={handleStartOver}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'cash' && (
        <div className="h-full flex flex-col">
          <div className="p-6">
            <button
              type="button"
              onClick={() => setStep('initial')}
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                disabled:pointer-events-none disabled:opacity-50
                hover:bg-gray-100 h-9 px-4 py-2 
                text-gray-900"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto flex flex-col items-center"
            >
              {/* Centering CheckCircle */}
              <div className="flex items-center justify-center">
                <CheckCircle className="h-14 w-14 text-green-500" />
              </div>

              <div className="mt-3">
                <p className="text-lg font-semibold">You've Paid</p>
                <p className="text-3xl font-semibold">
                  ${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-500">
                  {orderItems && orderItems.orderId}
                </p>
              </div>

              <p className="text-lg font-normal text-gray-500 mt-5 mb-5">
                Thanks, {customerName}! We will text you when your order is
                ready.
              </p>

              <motion.button
                onClick={handleGotIt}
                className="w-full bg-black text-white py-4 text-xl font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Got it
              </motion.button>
            </motion.div>
          </div>

          {showTimer && (
          <div className="absolute top-4 right-4">
            <Timer
              seconds={timeLeft}
              isActive={isTimerActive}
              variant="light"
              onStartOver={handleStartOver}
                onComplete={handleStartOver}
            />
          </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentModal;

