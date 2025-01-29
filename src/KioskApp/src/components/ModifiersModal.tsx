import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, useTranslation as useI18next } from 'react-i18next';
import { MenuItem, ItemAddOn, ItemCustomization, RecommendedItem } from '../types';

interface ModifiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instructions: string, quantity: number) => void;
  item: MenuItem;
  category: string;
  existingInstructions?: string;
}

export function ModifiersModal({
  isOpen,
  onClose,
  onSave,
  item,
  category,
  existingInstructions = ''
}: ModifiersModalProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'es';
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDesserts, setSelectedDesserts] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unavailablePreference, setUnavailablePreference] = useState('merchant-recommendation');

  useEffect(() => {
    if (isOpen && existingInstructions) {
      const instructions = existingInstructions.split(', ');
      try {
        const parsed = JSON.parse(instructions);
        setSelectedAddOns(parsed.addOns || []);
        setSelectedCustomizations(parsed.customizations || []);
        setSelectedBeverages(parsed.beverages || []);
        setSelectedSides(parsed.sides || []);
        setSelectedDesserts(parsed.desserts || []);
        setCustomNote(parsed.specialInstructions || '');
        setUnavailablePreference(parsed.unavailablePreference || 'merchant-recommendation');
      } catch {
        // If not JSON, treat as legacy format
        const options = getOptionsForCategory().map(opt => opt.value);
        const selectedOpts = instructions.filter(instr => options.includes(instr));
        const customNotes = instructions.filter(instr => !options.includes(instr)).join(', ');
        setSelectedOptions(selectedOpts);
        setCustomNote(customNotes);
      }
    } else if (isOpen && !existingInstructions) {
      setSelectedAddOns([]);
      setSelectedCustomizations([]);
      setSelectedBeverages([]);
      setSelectedSides([]);
      setSelectedDesserts([]);
      setSelectedOptions([]);
      setCustomNote('');
      setUnavailablePreference('merchant-recommendation');
      setQuantity(1);
    }
  }, [isOpen, existingInstructions, category]);

  const getOptionsForCategory = () => {
    switch (category) {
      case 'burgers':
        return [
          { label: t('modifiers.noOnions'), value: 'No Onions' },
          { label: t('modifiers.noTomatoes'), value: 'No Tomatoes' },
          { label: t('modifiers.noLettuce'), value: 'No Lettuce' },
          { label: t('modifiers.extraCheese'), value: 'Extra Cheese' },
          { label: t('modifiers.wellDone'), value: 'Well Done' },
          { label: t('modifiers.mediumWell'), value: 'Medium Well' },
          { label: t('modifiers.medium'), value: 'Medium' },
          { label: t('modifiers.addBacon'), value: 'Add Bacon' },
        ];
      case 'pizzas':
        return [
          { label: t('modifiers.extraCheese'), value: 'Extra Cheese' },
          { label: t('modifiers.noCheese'), value: 'No Cheese' },
          { label: t('modifiers.wellDone'), value: 'Well Done' },
          { label: t('modifiers.lightlyCrispy'), value: 'Lightly Crispy' },
          { label: t('modifiers.extraSauce'), value: 'Extra Sauce' },
          { label: t('modifiers.lightSauce'), value: 'Light Sauce' },
        ];
      case 'drinks':
        return [
          { label: t('modifiers.noIce'), value: 'No Ice' },
          { label: t('modifiers.lightIce'), value: 'Light Ice' },
          { label: t('modifiers.extraIce'), value: 'Extra Ice' },
          { label: t('modifiers.lessSweet'), value: 'Less Sweet' },
          { label: t('modifiers.extraSweet'), value: 'Extra Sweet' },
        ];
      default:
        return [];
    }
  };

  const toggleOption = (value: string) => {
    setSelectedOptions(prev =>
      prev.includes(value)
        ? prev.filter(o => o !== value)
        : [...prev, value]
    );
  };

  const calculateTotal = () => {
    let total = item.price;
    
    // Add selected add-ons
    selectedAddOns.forEach(addOnId => {
      const addOn = item.addOns?.find(a => a.id === addOnId);
      console.log(addOn);
      if (addOn) total += addOn.price;
    });

    // Add selected beverages
    selectedBeverages.forEach(bevId => {
      const bev = item.recommendedBeverages?.find(b => b.id === bevId);
      if (bev) total += bev.price;
    });
    console.log(total);
    // Add selected sides
    selectedSides.forEach(sideId => {
      const side = item.recommendedSides?.find(s => s.id === sideId);
      if (side) total += side.price;
    });

    // Add selected desserts
    selectedDesserts.forEach(dessertId => {
      const dessert = item.recommendedDesserts?.find(d => d.id === dessertId);
      if (dessert) total += dessert.price;
    });
    return total * quantity;
  };

  const handleSave = () => {
    if (!item) {
      console.error('No item selected');
      return;
    }

    const allSelections = {
      addOns: selectedAddOns,
      customizations: selectedCustomizations,
      beverages: selectedBeverages,
      sides: selectedSides,
      desserts: selectedDesserts,
      specialInstructions: customNote,
      unavailablePreference,
      quantity
    };

    const instructions = [
      ...selectedOptions,
      customNote
    ].filter(Boolean).join(', ');
    
    onSave(JSON.stringify(allSelections), quantity);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg w-full max-w-md my-8"
          >
            <div className="sticky top-0 bg-white border-b p-4 flex items-center z-10">
              <button
                onClick={onClose}
                className="absolute left-4 p-2 hover:bg-gray-100 rounded-full text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-center flex-1">
                {item.name[currentLanguage]}
              </h2>
            </div>

            <div className="p-4 space-y-6">
              {/* Add-Ons Section */}
              {item.addOns && item.addOns.length > 0 && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-base font-semibold">{t('modifiers.addOns')}</h3>
                    <p className="text-xs text-gray-500">({t('modifiers.optional')})</p>
                  </div>
                  <div className="space-y-2">
                    {item.addOns.map(addOn => (
                      <label key={addOn.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAddOns.includes(addOn.id)}
                            onChange={() => {
                              setSelectedAddOns(prev =>
                                prev.includes(addOn.id)
                                  ? prev.filter(id => id !== addOn.id)
                                  : [...prev, addOn.id]
                              );
                            }}
                            className="w-4 h-4 mr-3 accent-primary"
                          />
                          <span className="text-sm">{addOn.name[currentLanguage]}</span>
                        </div>
                        <span className="text-sm text-gray-600">+${addOn.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Customizations Section */}
              {item.customizations && item.customizations.length > 0 && (
                <div>
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold">{t('modifiers.customize')}</h3>
                    <p className="text-sm text-gray-500">({t('modifiers.optional')})</p>
                  </div>
                  <div className="space-y-2">
                    {item.customizations.map(customization => (
                      <label key={customization.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedCustomizations.includes(customization.id)}
                          onChange={() => {
                            setSelectedCustomizations(prev =>
                              prev.includes(customization.id)
                                ? prev.filter(id => id !== customization.id)
                                : [...prev, customization.id]
                            );
                          }}
                          className="mr-2"
                        />
                        <span>{customization.name[currentLanguage]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Beverages Section */}
              {item.recommendedBeverages && item.recommendedBeverages.length > 0 && (
                <div>
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold">{t('modifiers.recommendedBeverages')}</h3>
                    <p className="text-sm text-gray-500">
                      {t('modifiers.optional')} • {t('modifiers.chooseUpTo', { count: 4 })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {item.recommendedBeverages.map(beverage => (
                      <label key={beverage.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedBeverages.includes(beverage.id)}
                            onChange={() => {
                              if (selectedBeverages.length < 4 || selectedBeverages.includes(beverage.id)) {
                                setSelectedBeverages(prev =>
                                  prev.includes(beverage.id)
                                    ? prev.filter(id => id !== beverage.id)
                                    : [...prev, beverage.id]
                                );
                              }
                            }}
                            className="mr-2"
                          />
                          <span>{beverage.name[currentLanguage]}</span>
                        </div>
                        <span className="text-gray-600">+${beverage.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  {t('modifiers.additionalNotes')}
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={t('modifiers.notesPlaceholder')}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  rows={2}
                />
              </div>

              {/* Unavailable Item Preference */}
              <div>
                <label className="block text-lg font-semibold mb-2">
                  {t('modifiers.ifUnavailable')}
                </label>
                <select
                  value={unavailablePreference}
                  onChange={(e) => setUnavailablePreference(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option value="merchant-recommendation">{t('modifiers.merchantRecommendation')}</option>
                  <option value="refund">{t('modifiers.refundItem')}</option>
                  <option value="contact">{t('modifiers.contactMe')}</option>
                  <option value="cancel">{t('modifiers.cancelOrder')}</option>
                </select>
              </div>
            </div>

            {/* Fixed bottom bar with quantity and add to cart */}
            <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <span className="w-8 text-center text-base font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(99, prev + 1))}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
                <button
                  onClick={handleSave}
                  className="flex-1 ml-4 h-12 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium text-base"
                >
                  {t('modifiers.addToCart')} - ${calculateTotal().toFixed(2)}
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                {t('modifiers.priceNote')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}