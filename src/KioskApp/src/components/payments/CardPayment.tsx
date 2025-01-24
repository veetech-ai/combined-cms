import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CardPaymentProps {
  total: number;
  onBack: () => void;
  onComplete: () => void;
}

export function CardPayment({ total, onBack, onComplete }: CardPaymentProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'initial' | 'processing' | 'complete'>('initial');

  useEffect(() => {
    if (status === 'processing') {
      // Simulate card payment processing
      const timer = setTimeout(() => {
        setStatus('complete');
        setTimeout(onComplete, 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onComplete]);

  return (
    <div className="text-center">
      {status === 'initial' && (
        <>
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('payment.cardPayment')}</h3>
            <p className="text-gray-600 mb-4">{t('payment.amount')}: ${total.toFixed(2)}</p>
            <p className="text-gray-600">{t('payment.tapCard')}</p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onBack}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
            >
              {t('payment.back')}
            </button>
            <button
              onClick={() => setStatus('processing')}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              {t('payment.proceed')}
            </button>
          </div>
        </>
      )}

      {status === 'processing' && (
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 mx-auto flex items-center justify-center mb-4"
          >
            <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h3 className="text-xl font-bold mb-2">{t('payment.processing')}</h3>
          <p className="text-gray-600">{t('payment.doNotRemove')}</p>
        </div>
      )}

      {status === 'complete' && (
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
          <h3 className="text-xl font-bold mb-2">{t('payment.approved')}</h3>
          <p className="text-gray-600">{t('payment.removeCard')}</p>
        </div>
      )}
    </div>
  );
}