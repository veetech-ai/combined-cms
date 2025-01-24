import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ModifiersModal } from './ModifiersModal';
import { useMenuStore } from '../stores/menuStore';

interface CartItemProps {
  cartId: string;
  name: {
    en: string;
    es: string;
  };
  price: number;
  quantity: number;
  imageUrl: string;
  instructions?: string;
  category?: string;
  id: number;
  addOns?: string[];
  addOnPrices?: {
    [key: string]: number;
  };
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemove: (cartId: string) => void;
  onUpdateInstructions: (cartId: string, instructions: string) => void;
}

export const CartItem: FC<CartItemProps> = ({ 
  cartId,
  name, 
  price, 
  quantity, 
  imageUrl,
  instructions,
  category,
  id,
  addOns = [],
  addOnPrices = {},
  onUpdateQuantity, 
  onRemove,
  onUpdateInstructions
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'es';
  const [showInstructions, setShowInstructions] = useState(false);
  const [showModifiers, setShowModifiers] = useState(false);
  const menuItem = useMenuStore(state => state.menuItems.find(item => item.id === id));

  const handleModifierSave = (instructions: string, quantity: number) => {
    onUpdateInstructions(cartId, instructions);
    onUpdateQuantity(cartId, quantity);
    setShowModifiers(false);
  };

  return (
    <div className="flex flex-col gap-2 mb-2 p-2 bg-gray-50 rounded-lg shadow-sm" role="listitem">
      <div className="flex items-center gap-2">
        <img 
          src={imageUrl} 
          alt={name[currentLanguage]}
          className="w-16 h-16 rounded-md object-cover"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base text-gray-900 truncate">
            {name[currentLanguage]}
          </h3>
          <div className="text-gray-700 text-base">
            <p className="font-semibold">
              ${(price + addOns.reduce((sum, addOnId) => sum + (addOnPrices[addOnId] || 0), 0)).toFixed(2)}
            </p>
            {addOns.map(addOnId => (
              <p key={addOnId} className="text-sm text-gray-500">
                + ${addOnPrices[addOnId]?.toFixed(2)} {addOnId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => onUpdateQuantity(cartId, quantity - 1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
            >
              <span className="text-lg">−</span>
            </button>
            <span className="w-8 text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(cartId, quantity + 1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
            >
              <span className="text-lg">+</span>
            </button>
            {instructions && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModifiers(true)}
                  className="ml-2 w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center"
                  title="Edit item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            )}
            <button
              onClick={() => onRemove(cartId)}
              className="ml-auto text-red-500 hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none rounded-full p-1 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInstructions && instructions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 border-t mt-2">
              <p className="text-sm text-gray-600">
                {instructions}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModifiersModal
        isOpen={showModifiers}
        onClose={() => setShowModifiers(false)}
        onSave={handleModifierSave}
        item={menuItem || {
          id: id,
          name: name,
          price: price,
          category: category || '',
          imageUrl: imageUrl,
          sortOrder: 0,
          addOns: [],
          customizations: [],
          recommendedBeverages: [],
          recommendedSides: [],
          recommendedDesserts: []
        }}
        category={category || ''}
        existingInstructions={instructions}
      />
    </div>
  );
};