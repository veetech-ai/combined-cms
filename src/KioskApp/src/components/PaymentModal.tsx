import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCustomerStore } from '../stores/customerStore';
import { useCartStore } from '../stores/cartStore';
import { toast } from 'react-hot-toast';
import { CardPayment } from './payments/CardPayment';
import { CashPayment } from './payments/CashPayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  customerName: string;
  total: number;
}

export function PaymentModal({ isOpen, onClose, onComplete, customerName, total }: PaymentModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'method' | 'card' | 'cash' | 'confirmation'>('method');
  const { customer } = useCustomerStore();
  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep('method');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handlePaymentComplete = async (paymentMethod: 'cash' | 'card') => {
    if (!customer) {
      toast.error('Customer information not found');
      return;
    }

    setIsProcessing(true);
    try {
      // Here you would typically process the payment
      // For now, we'll just simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('confirmation');
      clearCart();
      
      // Show success message
      toast.success('Payment processed successfully!');
      
      // Complete the payment flow after a delay
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Payment processing failed:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4"
          >
            {step === 'method' && (
              <div>
                <h2 className="text-2xl font-bold text-center mb-8">{t('payment.selectMethod')}</h2>
                <div className="grid grid-cols-2 gap-6">
                  {/* Cash Payment Option */}
                  <button
                    onClick={() => setStep('cash')}
                    className="p-6 border-2 rounded-lg hover:border-green-500 transition-colors group relative overflow-hidden"
                  >
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-24 h-24 mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <svg className="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-green-700">{t('payment.cash')}</h3>
                      <p className="text-gray-600 text-center">{t('payment.cashDescription')}</p>
                    </div>
                  </button>

                  {/* Card Payment Option */}
                  <button
                    onClick={() => setStep('card')}
                    className="p-6 border-2 rounded-lg hover:border-gray-900 transition-colors group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{t('payment.card')}</h3>
                      <p className="text-gray-600 text-center">{t('payment.cardDescription')}</p>
                    </div>
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                  >
                    {t('payment.cancel')}
                  </button>
                </div>
              </div>
            )}

            {step === 'card' && (
              <CardPayment
                total={total}
                onBack={() => setStep('method')}
                onComplete={handlePaymentComplete}
              />
            )}

            {step === 'cash' && (
              <CashPayment
                total={total}
                onBack={() => setStep('method')}
                onComplete={handlePaymentComplete}
              />
            )}

            {step === 'confirmation' && (
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="w-32 h-32 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4"
                >
                  <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">
                  {t('payment.thankYouName', { name: customerName })}
                </h3>
                <p className="text-gray-600">{t('payment.notificationReady')}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}