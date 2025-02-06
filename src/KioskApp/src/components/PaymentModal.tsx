import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { BackButton } from './ui/BackButton';
import { Timer } from './ui/Timer';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import { useNavigate, useParams } from 'react-router-dom';
import { ApplePayLogo } from './ui/ApplePayLogo';
import { GooglePayLogo } from  './ui/GooglePayLogo';

import { useCartStore } from '../stores/cartStore';

export function PaymentModal() {
  const [qrCode, setQrCode] = useState('');
  const [step, setStep] = useState('initial');
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearCart } = useCartStore();

  // Missing Props
  // const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // const onDigitalPayment = () => { /* handle digital payment */ };
  // const onCashPayment = () => { /* handle cash payment */ };

  useEffect(() => {
    QRCode.toDataURL('https://payment.example.com/order/123')
      .then((url) => setQrCode(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, []);

  const handleGotIt = () => {
    navigate(`/kiosk/${id}/feedback`);
  };

  const handleSuccess = () => {
    navigate(`/kiosk/${id}/success`);
  };

  const handleClose = () => {
    navigate(`/kiosk/${id}/details`);
  };

  const handleStartOver = () => {
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-white">
      {step === 'initial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left Side - Order Summary */}
          <div className="p-6 border-r border-gray-100">
            <h2 className="text-2xl font-medium">Order Summary</h2>
            {/* Add Order Summary Component Here */}
          </div>

          {/* Right Side - Payment Options */}
          <div className="flex flex-col p-6">
            <div className="flex justify-between items-start">
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
              <Timer
                seconds={60}
                onComplete={handleClose}
                onStartOver={handleStartOver}
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
                onClick={() => setStep('cash')}
                className="w-full h-14 bg-black text-white text-lg font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200 mt-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Pay by Cash or Card
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {step === 'cash' && (
        <div className="h-full flex flex-col">
          <div className="flex items-center p-8">
            <button
              type="button"
              onClick={() => setStep('initial')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <h2 className="text-3xl font-bold mb-4">Customer,</h2>
              <p className="text-xl mb-12">
                Give your name at the cashier and pay.
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
              seconds={30}
              onComplete={handleClose}
              onStartOver={handleStartOver}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentModal;