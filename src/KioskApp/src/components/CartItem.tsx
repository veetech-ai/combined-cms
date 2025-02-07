import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ModifiersModal } from './ModifiersModal';
import { useMenuStore } from '../stores/menuStore';
import { itemImageMap, DEFAULT_IMAGE } from '../utils/imageMap';

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
  customizations?: string[];
  beverages?: string[];
  sides?: string[];
  desserts?: string[];
  addOnPrices: { [key: string]: number };
  beveragePrices: { [key: string]: number };
  sidePrices: { [key: string]: number };
  dessertPrices: { [key: string]: number };
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemove: (cartId: string) => void;
  onUpdateInstructions: (cartId: string, instructions: string) => void;
  addOns: Array<{
    id: string;
    name: string;
    price: number; // Price in cents
  }>;
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
  customizations = [],
  beverages = [],
  sides = [],
  desserts = [],
  addOnPrices,
  beveragePrices,
  sidePrices,
  dessertPrices,
  onUpdateQuantity,
  onRemove,
  onUpdateInstructions,
  addOns: addOnsArray
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'es';
  const menuItem = useMenuStore((state) =>
    state.menuItems.find((item) => item.id === id)
  );
  const [imageError, setImageError] = useState(false);

  const [totalAmount, setTotalAmount] = useState();

  // Function to normalize item names for image mapping
  const normalizeItemName = (name: string) => {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
  };

  // Get the correct image URL
  const getImageUrl = () => {
    const normalizedName = normalizeItemName(name.en);
    const mappedImage = itemImageMap[normalizedName];

    if (mappedImage) {
      return mappedImage;
    }

    // Log missing image mappings during development
    console.log(
      'No image mapping found for:',
      name.en,
      'normalized as:',
      normalizedName
    );
    return DEFAULT_IMAGE;
  };
  const calculateAddOnsTotal = () => {
    let addOnsTotal = 0;

    // Add add-ons total (converting from cents to dollars)
    addOnsArray.forEach((addOn) => {
      addOnsTotal += (addOn.price || 0) / 100;
    });

    // Add beverages total
    beverages.forEach((bevId) => {
      addOnsTotal += beveragePrices[bevId] || 0;
    });

    // Add sides total
    sides.forEach((sideId) => {
      addOnsTotal += sidePrices[sideId] || 0;
    });

    // Add desserts total
    desserts.forEach((dessertId) => {
      addOnsTotal += dessertPrices[dessertId] || 0;
    });

    return addOnsTotal;
  };

  const calculateItemTotal = () => {
    const basePrice = price * quantity;
    const addOnsTotal = calculateAddOnsTotal() * quantity;

    const temp = basePrice + addOnsTotal;

    return temp;
  };

  const getAddOnName = (addOnId: string) => {
    const addOn = menuItem?.addOns?.find((a) => a.id === addOnId);
    return addOn?.name[currentLanguage] || addOnId;
  };

  const getBeverageName = (bevId: string) => {
    const beverage = menuItem?.recommendedBeverages?.find(
      (b) => b.id === bevId
    );
    return beverage?.name[currentLanguage] || bevId;
  };

  const [showInstructions, setShowInstructions] = useState(false);
  const [showModifiers, setShowModifiers] = useState(false);

  const handleModifierSave = (instructions: string, quantity: number) => {
    onUpdateInstructions(cartId, instructions);
    onUpdateQuantity(cartId, quantity);
    setShowModifiers(false);
  };

  // Get the actual menu item image or fall back to the provided imageUrl
  const actualImageUrl = menuItem?.imageUrl || imageUrl;

  const renderAddOns = (instructions: string) => {
    try {
      const parsed = JSON.parse(instructions);
      if (parsed.addOns && parsed.addOns.length > 0) {
        return (
          <div className="text-sm text-gray-500 mt-1">
            {parsed.addOns.map((addOn: any, index: number) => {
              return (
                <div key={index} className="flex justify-between">
                  <span>{addOn.name}</span>
                  {addOn.price > 0 && (
                    <span>+${(addOn.price / 100).toFixed(2)}</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
    } catch (e) {
      console.error('Error parsing add-ons:', e);
    }
    return null;
  };

  return (
    <div
      className="flex flex-col gap-2 mb-2 p-2 bg-gray-50 rounded-lg shadow-sm"
      role="listitem"
    >
      <div className="flex items-center gap-2">
        <img
          src={getImageUrl()}
          alt={name[currentLanguage]}
          className="w-16 h-16 rounded-md object-cover"
          onError={(e) => {
            console.log(
              'Image failed to load for:',
              name.en,
              'Using default image'
            );
            const img = e.target as HTMLImageElement;
            img.src = DEFAULT_IMAGE;
            setImageError(true);
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base text-gray-900 truncate">
            {name[currentLanguage]}
          </h3>
          {/* Rest of the component structure remains the same */}
          <div className="text-gray-700 text-sm">
            <p className="font-normal">${price.toFixed(2)}</p>

            <div className="text-sm text-gray-600 mt-1">
              {addOnsArray.map((addOn) => {
                console.log(addOn);
                return (
                  <div key={addOn.id} className="flex justify-between">
                    <span>+ {addOn.name}</span>
                    {addOn.price > 0 && (
                      <span>${(addOn.price / 100).toFixed(2)}</span>
                    )}
                  </div>
                );
              })}

              {beverages.map((bevId) => (
                <div key={bevId} className="flex justify-between">
                  <span>+ {getBeverageName(bevId)}</span>
                  <span>${beveragePrices[bevId].toFixed(2)}</span>
                </div>
              ))}

              {customizations.map((customization) => (
                <div key={customization} className="text-gray-500">
                  • {customization.name}
                </div>
              ))}
            </div>

            <div className="mt-2 text-right space-y-1">
              <p className="text-sm text-gray-500">
                Quantity: {quantity} × $
                {(price + calculateAddOnsTotal()).toFixed(2)}
              </p>
              <p className="font-semibold text-base">
                Total: ${calculateItemTotal()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onUpdateQuantity(cartId, quantity - 1)}
              disabled={quantity <= 1}
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${quantity <= 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              <span className="text-lg">−</span>
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(cartId, quantity + 1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
            >
              <span className="text-lg">+</span>
            </button>

            <button
              onClick={() => onRemove(cartId)}
              className="ml-auto text-black hover:text-black"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
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
              {renderAddOns(instructions)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModifiersModal
        isOpen={showModifiers}
        onClose={() => setShowModifiers(false)}
        onSave={handleModifierSave}
        item={
          menuItem || {
            id: id,
            name: name,
            price: price,
            category: category || '',
            imageUrl: getImageUrl(),
            sortOrder: 0,
            addOns: [],
            customizations: [],
            recommendedBeverages: [],
            recommendedSides: [],
            recommendedDesserts: []
          }
        }
        category={category || ''}
        existingInstructions={instructions}
      />
    </div>
  );
};
