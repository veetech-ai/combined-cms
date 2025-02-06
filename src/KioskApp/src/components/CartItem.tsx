import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ModifiersModal } from './ModifiersModal';
import { useMenuStore } from '../stores/menuStore';
import { itemImageMap, DEFAULT_IMAGE } from '../utils/imageMap';
import { Minus, Plus, X } from 'lucide-react';

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
    price: number;
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
    return mappedImage || DEFAULT_IMAGE;
  };

  const calculateAddOnsTotal = () => {
    let addOnsTotal = 0;
    addOnsArray.forEach((addOn) => {
      addOnsTotal += (addOn.price || 0) / 100;
    });
    beverages.forEach((bevId) => {
      addOnsTotal += beveragePrices[bevId] || 0;
    });
    sides.forEach((sideId) => {
      addOnsTotal += sidePrices[sideId] || 0;
    });
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
    <>
      <div className="flex items-center gap-4 py-4 border-b border-gray-100">
        <img
          src={getImageUrl()}
          alt={name[currentLanguage]}
          className="w-20 h-20 object-cover rounded-lg"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = DEFAULT_IMAGE;
            setImageError(true);
          }}
        />
        
          
            
            <div className="flex-1">
          <h3 className="font-medium text-gray-900">{name[currentLanguage]}</h3>
          <p className="text-sm text-gray-500">${(price + calculateAddOnsTotal()).toFixed(2)}</p>
          
          {/* Add-ons and customizations section with improved layout */}
          
          </div>
            
            
            <div className=" items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(cartId, quantity - 1)}
            className="p-1 hover:bg-gray-100 rounded"
            >
            <Minus className="w-4 h-4" />
            </button>
          <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(cartId, quantity + 1)}
            className="p-1 hover:bg-gray-100 rounded"
            >
            <Plus className="w-4 h-4" />
            </button>
        </div>

            <button
              onClick={() => onRemove(cartId)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4" />
            </button>
      
      </div>
      
      {(addOnsArray.length > 0 || beverages.length > 0 || customizations.length > 0) && (
            <div className="mt-2 space-y-1.5">
              {/* Add-ons with prices */}
              {addOnsArray.map((addOn) => (
                <div key={addOn.id} className="flex items-start text-sm">
                  <span className="text-gray-400 mr-1.5">+</span>
                  <div className="flex-1 flex justify-between items-baseline">
                    <span className="text-gray-600 leading-tight break-words pr-2" style={{ wordBreak: 'break-word' }}>
                      {addOn.name}
                    </span>
                    {addOn.price > 0 && (
                      <span className="text-gray-500 whitespace-nowrap ml-1">
                        ${(addOn.price / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Beverages with prices */}
              {beverages.map((bevId) => (
                <div key={bevId} className="flex items-start text-sm">
                  <span className="text-gray-400 mr-1.5">+</span>
                  <div className="flex-1 flex justify-between items-baseline">
                    <span className="text-gray-600 leading-tight break-words pr-2" style={{ wordBreak: 'break-word' }}>
                      {getBeverageName(bevId)}
                    </span>
                    <span className="text-gray-500 whitespace-nowrap ml-1">
                      ${beveragePrices[bevId].toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Customizations without prices */}
              {customizations.map((customization) => (
                <div key={customization} className="flex items-start text-sm">
                  <span className="text-gray-400 mr-1.5">•</span>
                  <span className="text-gray-500 leading-tight break-words" style={{ wordBreak: 'break-word' }}>
                    {customization.name}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          

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
    </>
  );
};
