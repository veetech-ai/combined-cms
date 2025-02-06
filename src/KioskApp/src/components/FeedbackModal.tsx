import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Timer } from './ui/Timer';
import { BackButton } from './ui/BackButton';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { useCartStore } from '../stores/cartStore';

export function FeedbackModal() {
  const { t } = useTranslation();
  const { clearCart } = useCartStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { id } = useParams(); // Extract the `id` from the URL

  const handleStartOrder = () => {
    clearCart();
    navigate(`/kiosk/${id}`); // This will resolve to `/kiosk/:id`
  };

  const resetState = () => {
    setRating(0);
    setHoveredRating(0);
    setSelectedFeatures([]);
    setShowThankYou(false);
  };
  const handleClose = () => {
    navigate(-1); // Go back to the previous route
  };

  useEffect(() => {
    resetState();
  }, []);

  const features = [
    { id: 'order', label: t('feedback.easyOrder') },
    { id: 'payment', label: t('feedback.easyPayment') },
    { id: 'lines', label: t('feedback.noLines') },
    { id: 'all', label: t('feedback.allAbove') }
  ];

  const handleSubmit = () => {
    setShowThankYou(true);
  };

  const toggleFeature = (id: string) => {
    if (id === 'all') {
      setSelectedFeatures((prev) => (prev.includes('all') ? [] : ['all']));
    } else {
      setSelectedFeatures((prev) => {
        const newFeatures = prev.filter((f) => f !== 'all' && f !== id);
        if (!prev.includes(id)) {
          newFeatures.push(id);
        }
        return newFeatures;
      });
    }
  };

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-16 h-16 transition-colors ${
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
      <div className="fixed inset-0 bg-white flex flex-col h-screen">
        <div className="flex items-center p-4">
          {/* <BackButton onClick={handleClose} /> */}
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        <div className="flex-1 p-4">
          {!showThankYou ? (
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl mb-8">
                {t('feedback.howWasExperience')}
              </h2>

              <div className="mb-12">
                <div
                  className="flex gap-4 justify-center"
                  role="group"
                  aria-label={t('feedback.ratingStars')}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-2 rounded-full hover:bg-gray-100 transition focus:outline-none"
                      aria-label={t('feedback.rateStars', { stars: star })}
                    >
                      <StarIcon
                        filled={
                          hoveredRating ? star <= hoveredRating : star <= rating
                        }
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center mt-2 text-gray-600">
                  {rating
                    ? t('feedback.youRated', { rating })
                    : t('feedback.clickToRate')}
                </p>
              </div>

              <div className="mb-12">
                <h3 className="text-xl mb-6">{t('feedback.whatDidYouLike')}</h3>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`w-full p-3 rounded-lg transition text-lg ${
                        selectedFeatures.includes(feature.id)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-black'
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
                className={`w-full py-4 text-lg font-medium transition ${
                  rating
                    ? 'bg-black hover:bg-gray-900 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('feedback.submitFeedback')}
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-32 h-32 mx-auto bg-[#E2E2E2] rounded-full flex items-center justify-center mb-8"
              >
                <svg
                  className="w-16 h-16 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h3 className="text-xl font-bold mb-2">
                {t('feedback.thankYou')}
              </h3>
              <p className="text-gray-600">{t('feedback.helpImprove')}</p>
              <div className="mt-6 space-y-4">
                <button
                  onClick={handleStartOrder} // Use the updated handleStartOrder function
                  className="w-full bg-black text-white py-4 text-lg font-medium hover:bg-gray-900 transition"
                >
                  {t('feedback.startNewOrder')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4">
          <Timer
            seconds={30}
            onComplete={handleClose}
            onStartOver={handleStartOrder}
          />
        </div>
      </div>
    </AnimatePresence>
  );
}
