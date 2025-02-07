import { motion } from 'framer-motion';
import { useLanguageStore } from '../stores/languageStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import blurMask from '../images/Blur Mask.svg';

export function WelcomeScreen() {
  const { currentLanguage } = useLanguageStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearCart } = useCartStore();

  const handleStartOrder = () => {
    clearCart();
    navigate(`kiosk`);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0 opacity-80">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/assets/bg-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Centered content */}
      <div
        className="relative flex flex-col items-center justify-center w-full max-w-lg px-4 text-center z-10 h-full"
        style={{ marginTop: '23%' }}
      >
        {/* Start Order Button */}
        <motion.button
          onClick={handleStartOrder}
          className="relative w-full max-w-[562px] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.3,
            type: 'spring',
            stiffness: 300,
            damping: 25
          }}
        >
          <img 
            src={blurMask} 
            alt={currentLanguage === 'en' ? 'Start Order' : 'Comenzar Orden'}
            className="w-full h-auto"
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default WelcomeScreen;
