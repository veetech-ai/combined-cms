import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  ChevronLeft,
  ShoppingCart,
  CreditCard,
  Check
} from 'lucide-react';
import { BackButton } from './ui/BackButton';
import { Timer } from './ui/Timer';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ApplePayLogo } from './ui/ApplePayLogo';
import { GooglePayLogo } from './ui/GooglePayLogo';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";

import { useCartStore } from '../stores/cartStore';
import { useCustomerStore } from '../stores/customerStore';
import { useOrder } from '../../../contexts/OrderContext';
import { io } from 'socket.io-client';
import { orderService } from '../../../services/orderService';

const BASE_URL = import.meta.env.VITE_HOST_URL || 'http://localhost:4000'; //5173 on localhost

// Add dummy data
const dummyCartItems = [
  { name: 'Cappuccino', price: 4.5, quantity: 1 },
  { name: 'Chocolate Croissant', price: 3.75, quantity: 2 },
  { name: 'Iced Latte', price: 5.0, quantity: 1 },
  { name: 'Blueberry Muffin', price: 3.25, quantity: 1 }
];

const WS_URL = import.meta.env.VITE_WS_URL;

const socket = io(WS_URL, {
  autoConnect: false
});

export function PaymentModal() {
  const { orderItems } = useOrder();
  const [qrCode, setQrCode] = useState('');
  const [step, setStep] = useState('initial');
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearCart } = useCartStore();
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isUserActive, setIsUserActive] = useState(true);
  const { customerName } = useCustomerStore();
  const [orderTotal, setOrderTotal] = useState();
  const [isQRScanned, setIsQRScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTimeout, setProcessingTimeout] = useState<NodeJS.Timeout | null>(null);

  const total = dummyCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to socket server - payment modal');
    });

    socket.on('orderStatusUpdated', (data) => {
      console.log('Order status updated:', data);
      if (data.orderId === orderItems?.orderId) {
        if (processingTimeout) {
          clearTimeout(processingTimeout);
        }

        if (data.status === 'payment_processing') {
          setStep('payment_processing');
        } else if (data.status === 'completed') {
          setStep('card_paid');
        } else if (data.status === 'failed_retry') {
          setStep('initial_retry');
        } else if (data.status === 'payment_failed') {
          setStep('payment_retry');
        }
      }
    });

    socket.on('qrCodeScanned', (data) => {
      if (data.orderId === orderItems?.orderId) {
        setIsQRScanned(true);
        setStep('payment_processing');
      }
    });

    return () => {
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
      socket.disconnect();
    };
  }, [orderItems?.orderId, processingTimeout]);

  // Update QR code generation when orderId changes
  useEffect(() => {
    if (orderItems?.orderId) {
      const summaryUrl = `${BASE_URL}/kiosk/${id}/summary?orderId=${orderItems.orderId}`;

      QRCode.toDataURL(summaryUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then((url) => setQrCode(url))
        .catch((err) => {
          console.error('Failed to generate QR code:', err);
          toast.error('Failed to generate QR code');
        });
    }
  }, [orderItems?.orderId, id]);

  // Track user activity
  const handleUserActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsUserActive(true);

    if (showTimer) {
      setShowTimer(false);
      setTimeLeft(120);
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
    setTimeLeft(120);
    setIsTimerActive(true);
    handleUserActivity();
  };

  // Update handlers to track activity
  const handleGotIt = () => {
    resetTimer();
    handleUserActivity();
    navigate(`/kiosk/${id}/feedback`);
  };

  const handleSuccess = () => {
    resetTimer();
    const summaryUrl = `/kiosk/${id}/summary?orderId=${orderItems?.orderId}`;
    console.log('Navigating to:', summaryUrl);
    navigate(summaryUrl);
  };

  const handleClose = () => {
    // Navigate back to phone number step with state to prevent auto-submission
    navigate(`/kiosk/${id}/details`, {
      state: {
        step: 'phone',
        fromPayment: true  // Add this flag
      }
    });
  };

  const handleStartOver = () => {
    setIsTimerActive(false);
    setShowTimer(false);
    setTimeLeft(120); // Reset timer
    setIsTimerActive(true); // Restart timer
    setLastActivity(Date.now()); // Reset activity timestamp
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  const handleQRCodeClick = () => {
    // Reset any previous errors
    setError(null);

    // Clear any existing timeout
    if (processingTimeout) {
      clearTimeout(processingTimeout);
    }

    // Set processing state
    setStep('payment_processing');

    // Emit socket event to notify server that QR was scanned
    socket.emit('qrCodeScanned', {
      orderId: orderItems?.orderId,
      status: 'payment_processing',
      isRetry: true // Flag to indicate this is a retry attempt
    });
  };

  // Update handler for order button click - remove clearCart
  const handleOrderClick = () => {
    navigate(`/kiosk/${id}/kiosk`);
  };
  // I added this functionality to check failed payment screen but we can use it for timeout failure as well.
  // Add useEffect to handle processing timeout
  useEffect(() => {
    // Clear any existing timeout when step changes
    if (processingTimeout) {
      clearTimeout(processingTimeout);
    }

    // Set new timeout when entering processing state
    if (step === 'payment_processing') {
      const timeout = setTimeout(() => {
        // Update order status to failed
        if (orderItems?.orderId) {
          socket.emit('orderStatusUpdated', {
            orderId: orderItems.orderId,
            status: 'payment_failed'
          });
        }
        setStep('payment_retry');
      }, 120000); // 120 seconds

      setProcessingTimeout(timeout);
    }

    // Cleanup timeout on unmount or step change
    return () => {
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    };
  }, [step, orderItems?.orderId]);

  return (
    <div className="fixed inset-0 bg-white">
      {step === 'initial' && (
        <>
          <div className="h-screen flex flex-col lg:flex-row">
            {/* Left Side - Order Summary */}
            <div className="w-full lg:w-1/2 lg:border-r border-gray-100 flex flex-col order-2 lg:order-1 h-full overflow-auto">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="p-6 flex justify-between">
                  <Button
                    onClick={handleClose}
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
                    <span>${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}</span>
                  </button>
                </div>

                {/* Order Summary Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-medium">Order Summary</h2>
                    <span className="text-gray-500 text-sm sm:text-base">
                      ({orderItems && orderItems.items.length}{' '}
                      {orderItems.items.length === 1 ? 'Item' : 'Items'})
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {orderItems && orderItems.orderId}
                  </div>
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
                            <span className="text-gray-500">
                              {item.quantity}x
                            </span>
                            <span className="font-medium">{item.name.en}</span>
                          </div>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Addons */}
                        {item.addons && item.addons.length > 0 && (
                          <div className="ml-8 text-sm text-gray-500">
                            {item.addons.map((addon, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center"
                              >
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
                              <div
                                key={idx}
                                className="flex justify-between items-center"
                              >
                                <div className="flex items-center gap-2">
                                  <span>+</span>
                                  <span>{extra.name}</span>
                                </div>
                                <span>${extra.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Customizations */}
                        {Array.isArray(item.customization) && item.customization.length > 0 && (
                          <div className="ml-8 text-sm text-gray-500">
                            {item.customization.map((customization) => (
                              <div key={customization.id} className="flex items-center gap-2">
                                <span>•</span>
                                <span>{customization.name}</span>
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
                        <span>
                          $
                          {orderItems &&
                            parseFloat(orderItems.totalBill).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>
                          $
                          {orderItems &&
                            parseFloat(orderItems.totalBill).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Payment Options */}
            <div className="w-full lg:w-1/2 flex flex-col order-1 lg:order-2 h-full overflow-auto">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="max-w-lg mx-auto space-y-6">
                  <h2 className="text-xl sm:text-2xl font-medium mb-4 text-center">
                    Select Payment Method
                  </h2>

                  {/* Digital Payment */}
                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg relative overflow-hidden border border-gray-100 group">
                    <div className="flex flex-col items-center text-center mb-3">
                      <h3 className="text-xl sm:text-2xl font-medium mb-1">Quick Pay</h3>
                      {/* <p className="text-gray-500 text-sm sm:text-base">
                        Scan with your phone to view order summary
                      </p> */}
                    </div>

                    <div className="flex justify-center gap-4 mb-3">
                      <div className="flex items-center justify-center transform transition-transform group-hover:scale-105">
                        <ApplePayLogo />
                        <span className=' font-semi text-lg'>Pay</span>
                      </div>
                      <div className="flex items-center gap-1 justify-center transform transition-transform group-hover:scale-105">
                        <GooglePayLogo />
                        <span className=' font-semi text-lg'>Pay</span>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    {orderItems?.orderId ? (
                      <div className="flex flex-col items-center justify-center relative bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-100 cursor-pointer hover:border-gray-200 transition-colors">
                        {qrCode && (
                          <>
                            <img
                              src={qrCode}
                              alt="Order Summary QR Code"
                              className="w-32 h-32 sm:w-40 sm:h-40"
                            />
                            <p className="text-sm sm:text-base font-medium text-gray-600 mt-3">
                              Scan to Pay
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-4 text-gray-500">
                        Loading order details...
                      </div>
                    )}
                  </div>

                  {/* Cash/Card Payment */}
                  <motion.button
                    onClick={() => {
                      setStep('cash');
                      resetTimer();
                    }}
                    className="w-full bg-black text-white rounded-2xl p-4 flex items-center justify-center hover:bg-black/90 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-medium mb-1">
                        Pay with Cash or Card
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70">Pay at the counter</p>
                    </div>
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 ml-3 sm:ml-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {step === 'initial_retry' && (
        <>
          <div className="p-6 flex justify-between">
            <Button
              onClick={handleClose}
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

          <div className="h-[100dvh] flex flex-col lg:flex-row items-stretch">
            {/* Left Side - Order Summary */}
            <div className="w-full lg:w-[45%] lg:border-r border-gray-100 flex flex-col order-2 lg:order-1 h-full">
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-medium">Order Summary</h2>
                    <span className="text-gray-500">
                      ({orderItems && orderItems.items.length}{' '}
                      {orderItems.items.length === 1 ? 'Item' : 'Items'})
                    </span>
                  </div>
                  <div className="text-gray-500">
                    {orderItems && orderItems.orderId}
                  </div>
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
                            <span className="text-gray-500">
                              {item.quantity}x
                            </span>
                            <span className="font-medium">{item.name.en}</span>
                          </div>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Customizations */}
                        {item.customization &&
                          Object.keys(item.customization).length > 0 && (
                            <div className="ml-8 text-sm text-gray-500">
                              {Object.entries(item.customization).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2"
                                  >
                                    <span>•</span>
                                    <span>{value}</span>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                        {/* Addons */}
                        {item.addons && item.addons.length > 0 && (
                          <div className="ml-8 text-sm text-gray-500">
                            {item.addons.map((addon, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center"
                              >
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
                              <div
                                key={idx}
                                className="flex justify-between items-center"
                              >
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
                        <span>
                          $
                          {orderItems &&
                            parseFloat(orderItems.totalBill).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>
                          $
                          {orderItems &&
                            parseFloat(orderItems.totalBill).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Payment Options */}
            <div className="flex-1 p-6 order-1 lg:order-2 overflow-auto">
              <div className="max-w-lg mx-auto space-y-6">
                <h1 className="text-3xl mx-auto space-y-4 text-red-500">
                  Retry Payment
                </h1>
                <h2 className="text-2xl font-medium mb-4">
                  Select Payment Method
                </h2>

                {/* Digital Payment */}
                <div className="bg-white rounded-2xl p-4 shadow-lg relative overflow-hidden border border-gray-100 group">
                  <div className="flex flex-col items-center text-center mb-3">
                    <h3 className="text-2xl font-medium mb-1">Quick Pay</h3>
                    {/* <p className="text-gray-500">
                      Scan with your phone to view order summary
                    </p> */}
                  </div>

                  <div className="flex justify-center gap-4 mb-3">
                    <div className="transform transition-transform group-hover:scale-105">
                      <GooglePayLogo />
                    </div>
                    <div className="transform transition-transform group-hover:scale-105">
                      <ApplePayLogo />
                    </div>
                  </div>

                  {orderItems?.orderId ? (
                    <div
                      className="flex flex-col items-center justify-center relative bg-white rounded-xl p-4 border-2 border-gray-100 cursor-pointer hover:border-gray-200 transition-colors"
                      onClick={handleQRCodeClick}
                    >
                      {qrCode && (
                        <>
                          <img
                            src={qrCode}
                            alt="Order Summary QR Code"
                            className="w-40 h-40"
                          />
                          <p className="text-sm sm:text-base font-medium text-gray-600 mt-3">
                            Scan to Pay
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-500">
                      Loading order details...
                    </div>
                  )}
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
                    <h3 className="text-lg font-medium mb-1">
                      Pay with Cash or Card
                    </h3>
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
          
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto flex flex-col items-center"
            >
              <div className="mt-3">
                <p className="text-6xl font-semibold">
                  {customerName || 'Hi there'}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-500 mb-10">
                  {'OrderID: ' + (orderItems && orderItems.orderId) ||
                    'Order #23423423'}
                </p>
              </div>

              <p className="text-lg text-black font-medium mt-5 ">
                Give your name at the cashier
              </p>
              <p className="text-sm text-gray-500  mb-10">
                The cashier will help you complete your payment
              </p>

              <motion.button
                onClick={handleStartOver}
                className="w-full bg-black text-white py-4 text-xl font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start New Order
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
      {step === 'card_paid' && (
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 overflow-y-auto pb-[100px]">
            <div className="w-32 h-32 bg-[#06C167] rounded-2xl flex items-center justify-center mb-12 shadow-xl animate-scaleIn">
              <Check className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-center">You've Paid</h2>
            <div className="text-6xl font-bold tracking-tight">
              ${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-10">
              Order #{(orderItems && orderItems.orderId) || 'Order #23423423'}
            </p>
            <p className="text-xl text-gray-600 text-center">
              Thanks, {customerName || 'Customer'}! We'll text you when your
              order is ready.
            </p>
            <motion.div>
              <motion.button
                onClick={handleStartOver}
                className="w-full bg-black text-white py-4 text-xl font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200 px-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start New Order
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
      {step === 'payment_processing' && (
        <div className="h-full flex flex-col items-center justify-center bg-black text-white">
          <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="loader mb-8"></div>
            <h2 className="text-3xl font-bold mb-4">Processing Payment...</h2>
            <p className="text-lg text-gray-300 mb-8">
              Please don't close this window
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-400">
                Securely processing your payment
              </p>
            </div>
          </div>
        </div>
      )}
      {step === 'payment_retry' && (
        <div className="h-full flex flex-col items-center justify-center bg-black text-white">
          <div className="flex flex-col items-center justify-center text-center p-8">
            {/* Order Details Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Payment Failed</h2>
              <p className="text-lg text-gray-300 mt-2">
                Order #{orderItems?.orderId}
              </p>
              <p className="text-2xl font-semibold mt-4">
                ${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}
              </p>
            </div>

            {/* QR Code Section */}
            {orderItems?.orderId && qrCode ? (
              <div
                className="flex flex-col items-center justify-center relative bg-white rounded-xl p-6 border-2 border-gray-700 cursor-pointer hover:border-gray-500 transition-colors"
                onClick={handleQRCodeClick}
              >
                <img
                  src={qrCode}
                  alt="Order Payment QR Code"
                  className="w-48 h-48 mb-4"
                />
                <div className="text-black">
                  <p className="font-medium mb-1">Scan to Retry Payment</p>
                  <p className="text-sm text-gray-500">
                    Use your phone's camera to scan and complete payment
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 text-gray-400">
                Loading payment details...
              </div>
            )}

            {/* Alternative Payment Options */}
            <div className="mt-8">
              <p className="text-gray-400 mb-4">Or pay using</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('initial')}
                  className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Other Payment Methods
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      /* Add this CSS for the circular loader */
      <style>
        {`
  .loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}
      </style>
    </div>
  );
}

export default PaymentModal;
