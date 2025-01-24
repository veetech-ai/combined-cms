import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface DiscountModalProps {
  isOpen: boolean;
  onResponse: (accepted: boolean) => void;
}

export function DiscountModal({ isOpen, onResponse }: DiscountModalProps) {
  const { t } = useTranslation();

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
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <div className="mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-32 h-32 mx-auto bg-orange-100 rounded-lg flex items-center justify-center mb-4"
                >
                  <svg className="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{t('discount.specialAvailable')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('discount.eligibleMessage')}
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => onResponse(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                >
                  {t('discount.noThanks')}
                </button>
                <button
                  onClick={() => onResponse(true)}
                  className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                >
                  {t('discount.yesApply')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}