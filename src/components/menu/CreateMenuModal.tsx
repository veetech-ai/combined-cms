import React, { useState } from 'react';
import { X, Plus, Trash2, MoveUp, MoveDown, Search } from 'lucide-react';
import { MenuItem, MenuCategory } from '../../types/menu';
import { DEFAULT_MENU_CATEGORIES } from '../../data/menuCategories';

interface CreateMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categories: MenuCategory[], items: MenuItem[]) => void;
}

export default function CreateMenuModal({ isOpen, onClose, onSave }: CreateMenuModalProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newItem, setNewItem] = useState({
    name: '', 
    description: '', 
    price: '', 
    videoUrl: '', 
    isAvailable: true,
    image: '',
    allergens: [] as string[],
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    },
    customizations: [] as { name: string; options: string[]; required: boolean }[]
  });

  const filteredDefaultCategories = DEFAULT_MENU_CATEGORIES.filter(
    category => !categories.some(c => c.id === category.id) &&
    (category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
     category.description.toLowerCase().includes(categorySearch.toLowerCase()))
  );

  const handleAddDefaultCategory = (defaultCategory: typeof DEFAULT_MENU_CATEGORIES[0]) => {
    const category: MenuCategory = {
      id: defaultCategory.id,
      name: defaultCategory.name,
      description: defaultCategory.description,
      order: categories.length
    };

    setCategories([...categories, category]);
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: MenuCategory = {
      id: `category-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      order: categories.length
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '' });
  };

  const handleAddItem = () => {
    if (!selectedCategory || !newItem.name.trim() || !newItem.price) return;

    const item: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      isAvailable: newItem.isAvailable,
      videoUrl: newItem.videoUrl,
      image: newItem.image,
      allergens: newItem.allergens,
      nutritionalInfo: {
        calories: parseFloat(newItem.nutritionalInfo.calories) || 0,
        protein: parseFloat(newItem.nutritionalInfo.protein) || 0,
        carbs: parseFloat(newItem.nutritionalInfo.carbs) || 0,
        fat: parseFloat(newItem.nutritionalInfo.fat) || 0
      },
      customizations: newItem.customizations,
      categoryId: selectedCategory
    };

    setItems([...items, item]);
    setNewItem({
      name: '', 
      description: '', 
      price: '', 
      videoUrl: '', 
      isAvailable: true,
      image: '',
      allergens: [],
      nutritionalInfo: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      },
      customizations: []
    });
  };

  const handleAddCustomization = () => {
    setNewItem({
      ...newItem,
      customizations: [
        ...newItem.customizations,
        { name: '', options: [''], required: false }
      ]
    });
  };

  const handleUpdateCustomization = (index: number, field: string, value: any) => {
    const updatedCustomizations = [...newItem.customizations];
    updatedCustomizations[index] = {
      ...updatedCustomizations[index],
      [field]: value
    };
    setNewItem({ ...newItem, customizations: updatedCustomizations });
  };

  const handleAddCustomizationOption = (customizationIndex: number) => {
    const updatedCustomizations = [...newItem.customizations];
    updatedCustomizations[customizationIndex].options.push('');
    setNewItem({ ...newItem, customizations: updatedCustomizations });
  };

  const handleUpdateCustomizationOption = (
    customizationIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedCustomizations = [...newItem.customizations];
    updatedCustomizations[customizationIndex].options[optionIndex] = value;
    setNewItem({ ...newItem, customizations: updatedCustomizations });
  };

  const handleRemoveCustomization = (index: number) => {
    setNewItem({
      ...newItem,
      customizations: newItem.customizations.filter((_, i) => i !== index)
    });
  };

  const handleRemoveCustomizationOption = (customizationIndex: number, optionIndex: number) => {
    const updatedCustomizations = [...newItem.customizations];
    updatedCustomizations[customizationIndex].options = 
      updatedCustomizations[customizationIndex].options.filter((_, i) => i !== optionIndex);
    setNewItem({ ...newItem, customizations: updatedCustomizations });
  };

  const handleMoveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const index = categories.findIndex(c => c.id === categoryId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) return;

    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCategories[index], newCategories[targetIndex]] = 
    [newCategories[targetIndex], newCategories[index]];

    // Update order
    newCategories.forEach((category, idx) => {
      category.order = idx;
    });

    setCategories(newCategories);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
    setItems(items.filter(i => i.categoryId !== categoryId));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(i => i.id !== itemId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Create Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Categories Section */}
          <div className="col-span-4 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-4">Menu Categories</h3>
              
              {/* Search Categories */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Default Categories */}
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {filteredDefaultCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleAddDefaultCategory(category)}
                    className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Add Custom Category</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newCategory.description}
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddCategory}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Custom Category</span>
                </button>
              </div>
              </div>
            </div>

            <div className="space-y-3">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">
                        {DEFAULT_MENU_CATEGORIES.find(c => c.id === category.id)?.icon || '📋'}
                      </span>
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCategory(category.id, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                      >
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCategory(category.id, 'down');
                        }}
                        disabled={index === categories.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                      >
                        <MoveDown size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-500">{category.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items Section */}
          <div className="col-span-8 space-y-6">
            {selectedCategory ? (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Add Menu Item</h3>
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItem.name}
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newItem.price}
                      onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>

                    <div className="col-span-2">
                      <textarea
                        placeholder="Description"
                        value={newItem.description}
                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>

                    {/* Media */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Image URL
                        </label>
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={newItem.image}
                          onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video URL (optional)
                        </label>
                        <input
                          type="url"
                          placeholder="Video URL"
                          value={newItem.videoUrl}
                          onChange={e => setNewItem({ ...newItem, videoUrl: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Nutritional Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Nutritional Information</h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Calories</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={newItem.nutritionalInfo.calories}
                            onChange={e => setNewItem({
                              ...newItem,
                              nutritionalInfo: {
                                ...newItem.nutritionalInfo,
                                calories: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Protein (g)</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={newItem.nutritionalInfo.protein}
                            onChange={e => setNewItem({
                              ...newItem,
                              nutritionalInfo: {
                                ...newItem.nutritionalInfo,
                                protein: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Carbs (g)</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={newItem.nutritionalInfo.carbs}
                            onChange={e => setNewItem({
                              ...newItem,
                              nutritionalInfo: {
                                ...newItem.nutritionalInfo,
                                carbs: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Fat (g)</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={newItem.nutritionalInfo.fat}
                            onChange={e => setNewItem({
                              ...newItem,
                              nutritionalInfo: {
                                ...newItem.nutritionalInfo,
                                fat: e.target.value
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Allergens */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Allergens</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish'].map(allergen => (
                          <label key={allergen} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={newItem.allergens.includes(allergen)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setNewItem({
                                    ...newItem,
                                    allergens: [...newItem.allergens, allergen]
                                  });
                                } else {
                                  setNewItem({
                                    ...newItem,
                                    allergens: newItem.allergens.filter(a => a !== allergen)
                                  });
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{allergen}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Customizations */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Customizations</h4>
                        <button
                          type="button"
                          onClick={handleAddCustomization}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Add Customization
                        </button>
                      </div>
                      <div className="space-y-4">
                        {newItem.customizations.map((customization, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <input
                                type="text"
                                placeholder="Customization Name (e.g., Size, Toppings)"
                                value={customization.name}
                                onChange={e => handleUpdateCustomization(index, 'name', e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveCustomization(index)}
                                className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="space-y-2">
                              {customization.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Option"
                                    value={option}
                                    onChange={e => handleUpdateCustomizationOption(
                                      index,
                                      optionIndex,
                                      e.target.value
                                    )}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  {customization.options.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCustomizationOption(index, optionIndex)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => handleAddCustomizationOption(index)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                + Add Option
                              </button>
                            </div>
                            <div className="mt-2">
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  checked={customization.required}
                                  onChange={e => handleUpdateCustomization(
                                    index,
                                    'required',
                                    e.target.checked
                                  )}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Required</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isAvailable"
                          checked={newItem.isAvailable}
                          onChange={e => setNewItem({ ...newItem, isAvailable: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isAvailable" className="text-sm text-gray-700">
                          Available
                        </label>
                      </div>

                      <button
                        onClick={handleAddItem}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={18} />
                        <span>Add Item</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {items
                    .filter(item => item.categoryId === selectedCategory)
                    .map(item => (
                      <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{item.name}</h4>
                              <span className="text-lg font-semibold">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            {item.videoUrl && (
                              <a
                                href={item.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                              >
                                Watch Video
                              </a>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a category to add items
                </h3>
                <p className="text-gray-500">
                  Create a category first if you haven't already
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(categories, items);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Menu
          </button>
        </div>
      </div>
    </div>
  );
}