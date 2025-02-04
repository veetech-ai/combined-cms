import { useState, useEffect } from 'react';
import { BackButton } from './ui/BackButton';
import { Timer } from './ui/Timer';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  customerName: string;
  total: number;
  orderDetails?: any;
  onStartOver: () => void;
}

export function PaymentModal({ isOpen, onClose, onComplete, customerName,orderDetails, onStartOver }: PaymentModalProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [step, setStep] = useState<'initial' | 'cash' | 'success'>('initial');

  useEffect(() => {
    if (isOpen) {
      // Generate QR code for payment
      QRCode.toDataURL('https://payment.example.com/order/123')
        .then(url => setQrCode(url))
        .catch(err => console.error('Failed to generate QR code:', err));
    }
  }, [isOpen]);

  const handleGotIt = () => {
    onComplete();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-white flex flex-col h-screen">
        <>
          <div className="flex items-center p-4">
            {step === 'initial' && <BackButton onClick={onClose} />}
          </div>

          {step === 'initial' && (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl mb-12 text-center"
              >
                Scan to pay with
              </motion.h2>
          
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-8 mb-16"
              >
                <motion.div 
                  className="flex justify-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-[120px] h-10 border border-[#e8e8e8] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#1a1f71] transition-colors duration-200"
                  >
                    <img src="/apple-pay.svg" alt="Apple Pay" className="h-6" />
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-[120px] h-10 border border-[#e8e8e8] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#1a1f71] transition-colors duration-200"
                  >
                    <img src="/google-pay.svg" alt="Google Pay" className="h-6" />
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="w-[240px] h-[240px] p-4 border border-[#e8e8e8] rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {qrCode && (
                    <img src={qrCode} alt="Payment QR Code" className="w-full h-full" />
                  )}
                </motion.div>
              </motion.div>

              <div className="flex items-center gap-4 mb-12 w-full max-w-md">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <motion.button
                onClick={() => setStep('cash')}
                className="w-full max-w-md h-14 bg-black text-white text-lg font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Pay by Cash or Card
              </motion.button>
            </div>
          )}

          {step === 'cash' && (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md mx-auto"
              >
                <h2 className="text-3xl mb-4">{customerName},</h2>
                <p className="text-xl mb-12">Give your name at the cashier and pay.</p>
              
                <motion.button
                  onClick={handleGotIt}
                  className="w-full bg-black text-white py-4 text-xl font-medium rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Got it
                </motion.button>
              </motion.div>
            </div>
          )}

          <div className="absolute top-4 right-4">
            <Timer seconds={30} onComplete={onClose} onStartOver={onStartOver} />
          </div>
        </>
      </div>
    )
  );
}