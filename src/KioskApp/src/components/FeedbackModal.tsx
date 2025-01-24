import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface FeedbackModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function FeedbackModal({ isOpen, onComplete }: FeedbackModalProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [showThankYou, setShowThankYou] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const resetState = useCallback(() => {
    setRating(0);
    setHoveredRating(0);
    setSelectedFeatures([]);
    setCountdown(10);
    setShowThankYou(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  useEffect(() => {
    if (showThankYou) {
      let isActive = true;
      timerRef.current = setInterval(() => {
        if (isActive) {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              onComplete();
              return 10;
            }
            return prev - 1;
          });
          }
      }, 1000);

      return () => {
        isActive = false;
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [showThankYou, onComplete]);

  const features = [
    { id: 'order', label: t('feedback.easyOrder') },
    { id: 'payment', label: t('feedback.easyPayment') },
    { id: 'lines', label: t('feedback.noLines') },
    { id: 'all', label: t('feedback.allAbove') }
  ];

  const handleSubmit = () => {
    setShowThankYou(true);
  };

  const handleStartNewOrder = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onComplete();
  };

  const toggleFeature = (id: string) => {
    if (id === 'all') {
      setSelectedFeatures(prev => 
        prev.includes('all') ? [] : ['all']
      );
    } else {
      setSelectedFeatures(prev => {
        const newFeatures = prev.filter(f => f !== 'all' && f !== id);
        if (!prev.includes(id)) {
          newFeatures.push(id);
        }
        return newFeatures;
      });
    }
  };

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-12 h-12 transition-colors ${
        filled ? 'text-yellow-400' : 'text-gray-300'
      }`}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

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
            {!showThankYou ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">{t('feedback.howWasExperience')}</h2>
                
                <div className="mb-8">
                  <p className="text-lg mb-4 text-center">{t('feedback.rateExperience')}</p>
                  <div className="flex gap-4 justify-center" role="group" aria-label={t('feedback.ratingStars')}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-2 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
                        aria-label={t('feedback.rateStars', { stars: star })}
                      >
                        <StarIcon filled={hoveredRating ? star <= hoveredRating : star <= rating} />
                      </button>
                    ))}
                  </div>
                  <p className="text-center mt-2 text-gray-600">
                    {rating ? t('feedback.youRated', { rating }) : t('feedback.clickToRate')}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-lg mb-4 text-center">{t('feedback.whatDidYouLike')}</p>
                  <div className="space-y-2">
                    {features.map((feature) => (
                      <button
                        key={feature.id}
                        onClick={() => toggleFeature(feature.id)}
                        className={`w-full p-3 rounded-lg transition text-lg ${
                          selectedFeatures.includes(feature.id)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {feature.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!rating}
                  className={`w-full py-3 text-lg font-semibold rounded-lg transition ${
                    rating
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {t('feedback.submitFeedback')}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-32 h-32 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4"
                >
                  <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{t('feedback.thankYou')}</h3>
                <p className="text-gray-600">{t('feedback.helpImprove')}</p>
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-gray-500">
                    {t('feedback.autoReturn', { seconds: countdown })}
                  </p>
                  <button
                    onClick={handleStartNewOrder}
                    className="w-full bg-orange-500 text-white rounded-lg py-3 text-lg hover:bg-orange-600 transition"
                  >
                    {t('feedback.startNewOrder')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}