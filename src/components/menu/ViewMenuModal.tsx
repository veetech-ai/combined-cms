import React from 'react';
import { X } from 'lucide-react';
import { Menu } from '../../types/menu';

interface ViewMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu;
}

export default function ViewMenuModal({ isOpen, onClose, menu }: ViewMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Menu Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {menu.categories.map(category => (
            <div key={category.id} className="mb-8 last:mb-0">
              <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 mb-4">{category.description}</p>
              )}

              <div className="grid gap-6">
                {menu.items
                  .filter(item => item.categoryId === category.id)
                  .map(item => (
                    <div key={item.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">{item.name}</h4>
                          <p className="text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-semibold">
                            ${item.price.toFixed(2)}
                          </span>
                          {!item.isAvailable && (
                            <span className="block text-sm text-red-600 mt-1">
                              Currently Unavailable
                            </span>
                          )}
                        </div>
                      </div>

                      {(item.allergens.length > 0 || item.customizations.length > 0) && (
                        <div className="mt-4 space-y-4">
                          {item.allergens.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">
                                Allergens
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {item.allergens.map(allergen => (
                                  <span
                                    key={allergen}
                                    className="px-2 py-1 bg-red-50 text-red-700 text-sm rounded"
                                  >
                                    {allergen}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.customizations.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">
                                Customizations
                              </h5>
                              <div className="space-y-2">
                                {item.customizations.map((customization, index) => (
                                  <div key={index}>
                                    <p className="text-sm font-medium">
                                      {customization.name}
                                      {customization.required && (
                                        <span className="text-red-600 ml-1">*</span>
                                      )}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {customization.options.map((option, optionIndex) => (
                                        <span
                                          key={optionIndex}
                                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                                        >
                                          {option}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}