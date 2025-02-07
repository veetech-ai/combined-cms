import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchModifierGroup } from '../api/cloverApi';

interface Modifier {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

interface ModifierGroup {
  id: string;
  name: string;
  modifiers: {
    elements: Modifier[];
  };
}

interface ModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  modifierGroupId: string;
  onModifierSelect: (modifiers: string[]) => void;
  selectedModifiers?: string[];
}

export const ModifierModal: React.FC<ModifierModalProps> = ({
  isOpen,
  onClose,
  modifierGroupId,
  onModifierSelect,
  selectedModifiers = []
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modifierGroup, setModifierGroup] = useState<ModifierGroup | null>(null);
  const [selected, setSelected] = useState<string[]>(selectedModifiers);

  useEffect(() => {
    const loadModifierGroup = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchModifierGroup(modifierGroupId);
        setModifierGroup(data);
      } catch (err) {
        setError(t('errors.failedToLoadModifiers'));
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && modifierGroupId) {
      loadModifierGroup();
    }
  }, [isOpen, modifierGroupId, t]);

  const handleModifierToggle = (modifierId: string) => {
    const newSelected = selected.includes(modifierId)
      ? selected.filter(id => id !== modifierId)
      : [...selected, modifierId];
    setSelected(newSelected);
  };

  const handleSave = () => {
    onModifierSelect(selected);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {modifierGroup?.name || t('modifiers.addOns')}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
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

            <div className="p-4">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-center py-4">{error}</div>
              )}

              {!loading && !error && modifierGroup && (
                <div className="space-y-2">
                  {modifierGroup.modifiers.elements.map(modifier => (
                    <label
                      key={modifier.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(modifier.id)}
                          onChange={() => handleModifierToggle(modifier.id)}
                          className="w-4 h-4 mr-3"
                        />
                        <span className="text-sm font-medium">
                          {modifier.name}
                        </span>
                      </div>
                      {modifier.price > 0 && (
                        <span className="text-sm text-gray-600">
                          +${(modifier.price / 100).toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  {t('modifiers.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  {t('modifiers.save')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 