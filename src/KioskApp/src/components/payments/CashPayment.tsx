import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CashPaymentProps {
  total: number;
  onBack: () => void;
  onComplete: () => void;
}

export function CashPayment({ total, onBack, onComplete }: CashPaymentProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'initial' | 'processing' | 'complete'>('initial');
  const [orderId] = useState(() => Math.floor(1000 + Math.random() * 9000));

  const handleProceed = () => {
    setStatus('processing');
    // Simulate SMS sending and processing
    setTimeout(() => {
      setStatus('complete');
      setTimeout(onComplete, 2000);
    }, 2000);
  };

  return (
    <div className="text-center">
      {status === 'initial' && (
        <>
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('payment.cashPayment')}</h3>
            <p className="text-gray-600 mb-4">{t('payment.amount')}: ${total.toFixed(2)}</p>
            <p className="text-gray-600">{t('payment.proceedToCashier')}</p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onBack}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
            >
              {t('payment.back')}
            </button>
            <button
              onClick={handleProceed}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              {t('payment.proceed')}
            </button>
          </div>
        </>
      )}

      {status === 'processing' && (
        <div className="text-center">
          <div className="w-32 h-32 mx-auto flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">{t('payment.sendingOrder')}</h3>
          <p className="text-gray-600">{t('payment.pleaseWait')}</p>
        </div>
      )}

      {status === 'complete' && (
        <div className="text-center">
          <div className="w-32 h-32 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">{t('payment.orderNumber', { number: orderId })}</h3>
          <p className="text-gray-600 mb-2">{t('payment.smsConfirmation')}</p>
          <p className="text-gray-600">{t('payment.proceedToCounter')}</p>
        </div>
      )}
    </div>
  );
}