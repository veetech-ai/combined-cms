import { useLanguageStore } from '../stores/languageStore';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { currentLanguage, setLanguage } = useLanguageStore();

  return (
    <div className="fixed top-4 right-4 bg-white rounded-full shadow-lg p-1">
      <div className="relative flex items-center">
        <motion.div
          className="absolute top-1 bottom-1 rounded-full bg-gray-100"
          initial={false}
          animate={{
            x: currentLanguage === 'en' ? 0 : '100%',
            width: '50%',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button
          onClick={() => setLanguage('en')}
          className={`relative z-10 px-4 py-2 flex items-center gap-2 rounded-full transition-colors ${
            currentLanguage === 'en' ? 'text-primary' : 'text-gray-500'
          }`}
          aria-label="Switch to English"
        >
          <span className="text-2xl">🇺🇸</span>
          <span className="font-medium text-sm">EN</span>
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`relative z-10 px-4 py-2 flex items-center gap-2 rounded-full transition-colors ${
            currentLanguage === 'es' ? 'text-primary' : 'text-gray-500'
          }`}
          aria-label="Cambiar a Español"
        >
          <span className="text-2xl">🇲🇽</span>
          <span className="font-medium text-sm">ES</span>
        </button>
      </div>
    </div>
  );
}