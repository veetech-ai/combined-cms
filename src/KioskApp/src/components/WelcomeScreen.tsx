import { motion } from 'framer-motion';
import { useLanguageStore } from '../stores/languageStore';
import Maxikhana from '../images/maxikhana.png';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { currentLanguage } = useLanguageStore();

  const handleClick = () => {
    onStart();
  };

  const foodItems = [
    { emoji: '🍔', delay: 0 },
    { emoji: '🍕', delay: 0.1 },
    { emoji: '🌮', delay: 0.2 },
    { emoji: '🥤', delay: 0.3 },
    { emoji: '🍟', delay: 0.4 }
  ];

  return (
    <motion.div 
      className="fixed inset-0 bg-[#f8f8f8] flex flex-col items-center justify-center z-50 overflow-hidden overscroll-none touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-full max-w-lg mx-auto px-4 text-center">
        {/* Floating food emojis */}
        {foodItems.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              x: Math.sin(index) * 100 // Create a wave pattern
            }}
            transition={{
              delay: item.delay,
              duration: 0.6,
              y: { type: "spring", stiffness: 100 },
              opacity: { duration: 0.3 }
            }}
            style={{
              top: `${-100 + (index * 40)}px`,
              left: `${50 + (index * 15)}%`
            }}
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Logo */}
        <motion.img
          src={Maxikhana}
          alt="Foodistaan Logo"
          className="h-24 mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        {/* Welcome Text */}
        <motion.h1
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {currentLanguage === 'en' ? 'Welcome to Foodistaan' : 'Bienvenido a Foodistaan'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-600 text-lg mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {currentLanguage === 'en' 
            ? 'Order your favorite food in just a few taps' 
            : 'Ordena tu comida favorita con solo unos toques'}
        </motion.p>

        {/* Start Button */}
        <motion.button
          onClick={handleClick}
          className="bg-black text-white px-12 py-4 rounded-full text-xl font-medium shadow-lg relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.6,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        >
          <span className="relative z-10">
            {currentLanguage === 'en' ? 'Start Order' : 'Comenzar Orden'}
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary via-orange-500 to-primary"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 1 }}
          />
        </motion.button>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>
    </motion.div>
  );
}