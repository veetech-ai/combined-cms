import { useState, useEffect } from 'react';
import { CheckCircle, ChevronLeft, ShoppingCart } from 'lucide-react';
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
  const [isTimerActive, setIsTimerActive] = useState(true);
  const { customerName } = useCustomerStore();
  const [orderTotal, setOrderTotal] = useState();

  const total = dummyCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    console.log(orderItems);
  }, [orderItems]);

  useEffect(() => {
    QRCode.toDataURL('https://payment.example.com/order/123')
      .then((url) => setQrCode(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, []);

  useEffect(() => {
    setIsTimerActive(true);
    setTimeLeft(60);

    return () => {
      setIsTimerActive(false);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleStartOver();
    }
  }, [timeLeft]);

  const resetTimer = () => {
    setTimeLeft(60);
  };

  const handleGotIt = () => {
    resetTimer();
    navigate(`/kiosk/${id}/feedback`);
  };

  const handleSuccess = () => {
    resetTimer();
    navigate(`/kiosk/${id}/success`);
  };

  const handleClose = () => {
    resetTimer();
    navigate(`/kiosk/${id}/details`);
  };

  const handleStartOver = () => {
    setIsTimerActive(false);
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-white">
      {step === 'initial' && (
        <>
          <div className="p-6 flex justify-between">
            <button
              type="button"
              onClick={() => {
                handleClose();
                resetTimer();
              }}
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
              className="flex items-center space-x-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{orderItems && orderItems.items.length} items</span>
              <span>|</span>
              <span>${orderItems && orderItems.totalBill}</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(100%-5rem)]">
            {/* Left Side - Order Summary */}
            <div className="lg:w-1/2 p-6 border-r border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <p>{orderItems && orderItems.orderId}</p>
              <ul className="space-y-4 bg-gray-100 p-4 rounded-lg mt-3">
                {orderItems.items.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{item.quantity}x</span>
                        <span>{item.name.en}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between font-semibold text-xs text-gray-600">
                  <span>Subtotal:</span>
                  <span>
                    ${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total:</span>
                  <span>
                    ${orderItems && parseFloat(orderItems.totalBill).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Payment Options */}
            <div className="lg:w-1/2 flex flex-col p-6">
              <div className="absolute top-4 right-4">
                <Timer
                  seconds={timeLeft}
                  isActive={isTimerActive}
                  variant="light"
                  onStartOver={handleStartOver}
                  onComplete={handleStartOver}
                />
              </div>

              <div className="flex flex-col items-center mt-8">
                <h2 className="text-3xl font-bold mb-4">Scan to pay with</h2>
                <div className="flex items-center gap-4 mb-4">
                  <GooglePayLogo />
                  <ApplePayLogo />
                </div>

                <div
                  className="w-[200px] h-[200px] bg-white p-2 rounded-lg shadow-md cursor-pointer"
                  onClick={handleSuccess}
                >
                  {qrCode && (
                    <img
                      src={qrCode}
                      alt="Payment QR Code"
                      className="w-full h-full"
                    />
                  )}
                </div>

                <motion.button
                  onClick={() => {
                    setStep('cash');
                    resetTimer();
                  }}
                  className="w-full h-14 bg-black text-white text-lg font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200 mt-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Pay by Cash or Card
                </motion.button>
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

          <div className="absolute top-4 right-4">
            <Timer
              seconds={timeLeft}
              isActive={isTimerActive}
              variant="light"
              onStartOver={handleStartOver}
              onComplete={handleStartOver}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentModal;
