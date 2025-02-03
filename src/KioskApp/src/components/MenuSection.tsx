import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../stores/cartStore';
import { ModifiersModal } from './ModifiersModal';
import type { MenuItem } from '../types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { itemImageMap, DEFAULT_IMAGE } from '../utils/imageMap';

// Add a constant for featured items
const FEATURED_ITEMS = [
  "Chicken Karahi Loaded Fries",
  "Beef Nihari Loaded Fries",
  "Daal Rice Bowl",
  "Chicken Karahi Rice Bowl",
  "Beef Keema Rice Bowl"
];

// Add category mapping for specific items
const ITEM_CATEGORY_OVERRIDE: Record<string, string> = {
  // Breakfast Items
  "Reg Kebab": "Breakfast",
  "Bun Kebab": "Breakfast",
  "Breakfast Burrito": "Breakfast",

  // Burritos
  "Aloo Burrito": "Burritos",
  "Chicken Karahi Burrito": "Burritos",
  "Beef Nihari Burrito": "Burritos",
  "Beef Keema Burrito": "Burritos",
  "Weekend Special Burrito": "Burritos",

  // Quesadillas
  "Beef Keema Quesadilla": "Quesadillas",
  "Chicken Karahi Quesadilla": "Quesadillas",
  "Chicken Karachi Quesadilla": "Quesadillas",
  "Cheese Quesadilla": "Quesadillas",
  "Cheeese Quesadilla": "Quesadillas",
  "Beef Nihari Quesadilla": "Quesadillas",
  "Aloo Quesadilla": "Quesadillas",

  // Tacos
  "Aloo Tacos": "Tacos",
  "Chicken Karahi Tacos": "Tacos",
  "Beef Nihari Tacos": "Tacos",
  "Beef Keema Tacos": "Tacos",

  // Rice Bowls
  "Daal Rice Bowl": "Rice Bowls",
  "Chicken Karahi Rice Bowl": "Rice Bowls",
  "Beef Nihari Rice Bowl": "Rice Bowls",
  "Beef Keema Rice Bowl": "Rice Bowls",
  "Weekend Special Rice Bowl": "Rice Bowls",

  // Traditional Items
  "Yellow Daal (Traditional)": "Traditional",
  "Beef Nihari (Traditional)": "Traditional",
  "Chicken Karahi (Traditional)": "Traditional",

  // Side Items
  "Side Daal": "Side Items",
  "Side Fries": "Side Items",
  "Side Naan": "Side Items",
  "Side Nihari Soup": "Side Items",
  "Side Nihari Soup w/ Beef": "Side Items",

  // Drinks
  "Jarritos": "Drinks",
  "Can": "Drinks",
  "Sprite Bottle": "Drinks",
  "Water": "Drinks",
  "Rooh Afzah": "Drinks",
  "Scangwi": "Drinks",
  "Dood Soda": "Drinks",
  "Chai": "Drinks",

  // Desserts
  "Gulab Jamun": "Desserts",

  // Weekend Special
  "Weekend Special - Pink Kashmiri Chai": "Weekend Special",
  "Weekend Special - Samosa": "Weekend Special",

  // Other
  "Gift Card": "Other",
  "Delivery Fee": "Other"
};

// Add type for category names
type CategoryName = {
  en: string;
  es: string;
} | string;  // Allow both translated and simple string formats

// Add this constant for category order
const CATEGORY_ORDER: Record<string, { order: number; translations: { en: string; es: string } }> = {
  'All': { 
    order: -2,
    translations: { en: 'All', es: 'Todo' }
  },
  'Featured': { 
    order: -1,
    translations: { en: 'Featured', es: 'Destacado' }
  },
  'Breakfast': { 
    order: 1,
    translations: { en: 'Breakfast', es: 'Desayuno' }
  },
  'Tacos': { 
    order: 2,
    translations: { en: 'Tacos', es: 'Tacos' }
  },
  'Rice Bowls': { 
    order: 3,
    translations: { en: 'Rice Bowls', es: 'Tazones de Arroz' }
  },
  'Burritos': { 
    order: 4,
    translations: { en: 'Burritos', es: 'Burritos' }
  },
  'Quesadillas': { 
    order: 5,
    translations: { en: 'Quesadillas', es: 'Quesadillas' }
  },
  'Loaded Fries': { 
    order: 6,
    translations: { en: 'Loaded Fries', es: 'Papas Cargadas' }
  },
  'Traditional': { 
    order: 7,
    translations: { en: 'Traditional', es: 'Tradicional' }
  },
  'Drinks': { 
    order: 8,
    translations: { en: 'Drinks', es: 'Bebidas' }
  },
  'Desserts': { 
    order: 9,
    translations: { en: 'Desserts', es: 'Postres' }
  },
  'Side Items': { 
    order: 10,
    translations: { en: 'Side Items', es: 'Complementos' }
  },
  'Weekend Special': { 
    order: 11,
    translations: { en: 'Weekend Special', es: 'Especial de Fin de Semana' }
  }
};

// Update Category type
type Category = {
  id: string;
  name: CategoryName;
  sortOrder: number;
};

// Add API response types
type ApiCategory = {
  id: string;
  name: CategoryName;
  sortOrder: number;
};

type ApiMenuItem = {
  id: string;
  name: string;
  price: number;
  hidden: boolean;
  available: boolean;
  categories?: {
    elements: ApiCategory[];
  };
};

type ApiResponse = {
  elements: ApiMenuItem[];
};

const sortByCategory = (items: MenuItem[], categories: Category[]) => {
  return [...items].sort((a, b) => {
    const categoryA = a.category as string;
    const categoryB = b.category as string;
    
    const orderA = CATEGORY_ORDER[categoryA]?.order ?? 999;
    const orderB = CATEGORY_ORDER[categoryB]?.order ?? 999;
    
    if (orderA === orderB) {
      return a.name.en.localeCompare(b.name.en);
    }
    return orderA - orderB;
  });
};

const ITEMS_PER_PAGE = 100; // Increase this number significantly

// Add categories that use simplified modal
const SIMPLIFIED_MODAL_CATEGORIES = [
  'Drinks',
  'Side Items',
  'Desserts',
  'Weekend Special'
];

// Add this list to track previously excluded items
const PREVIOUSLY_EXCLUDED = [
  "Yellow Daal (Traditional)",
  "Chicken Karahi (Traditional)",
  "Beef Nihari Rice Bowl",
  "Beef Nihari (Traditional)",
  "Side Nihari Soup w/ Beef",
  "Can",
  "Aloo Quesadilla"
];

// Add a helper function to normalize item names for image mapping
const normalizeItemName = (name: string) => {
  // Remove extra spaces and trim
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
};

const MenuSection = () => {
  const { t, i18n } = useTranslation();
  const { addItem } = useCartStore();
  const [apiMenuItems, setApiMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModifiers, setShowModifiers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<number>(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [showSimplifiedModal, setShowSimplifiedModal] = useState(false);

  const currentLanguage = i18n.language as 'en' | 'es';

  const fetchApiMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://live.fastn.ai/api/v1/getMenu', {
        method: 'POST',
        headers: {
          'x-fastn-api-key': 'e2ea1416-f354-4353-bbd1-5068969ce8b4',
          'Content-Type': 'application/json',
          'x-fastn-space-id': '2cade1a6-133a-4344-86bf-c3b6f2bbfbe1',
          'x-fastn-space-tenantid': 'veetech_customer2',
          'stage': 'DRAFT',
        },
        body: JSON.stringify({"input":{}})
      });
      const data = await response.json() as ApiResponse;

      // Extract unique categories and their sort orders from API response
      const uniqueCategoriesMap = new Map<string, Category>();
      
      // Add Featured category first
      uniqueCategoriesMap.set('featured', {
        id: 'featured',
        name: 'Featured',
        sortOrder: -1 // Ensures Featured appears first
      });

      // Process categories from API data
      data.elements.forEach((item: ApiMenuItem) => {
        const categoryElements = item.categories?.elements;
        if (categoryElements?.[0]) {
          const category = categoryElements[0];
          if (!uniqueCategoriesMap.has(category.id)) {
            uniqueCategoriesMap.set(category.id, {
              id: category.id,
              name: category.name,
              sortOrder: CATEGORY_ORDER[typeof category.name === 'string' ? category.name : category.name.en]?.order ?? (category.sortOrder + 100)
            });
          }
        }
      });
      
      // Convert to array and sort by our custom order
      const uniqueCategories = Array.from(uniqueCategoriesMap.values())
        .sort((a, b) => {
          const orderA = CATEGORY_ORDER[typeof a.name === 'string' ? a.name : a.name.en]?.order ?? 999;
          const orderB = CATEGORY_ORDER[typeof b.name === 'string' ? b.name : b.name.en]?.order ?? 999;
          return orderA - orderB;
        });

      setCategories(uniqueCategories);
      
      // Transform menu items with detailed logging
      const baseItems: MenuItem[] = data.elements
        .filter((item: any) => {
          return !item.hidden && item.available;
        })
        .map((item: any) => {
          const apiCategory = item.categories?.elements?.[0]?.name;
          const overrideCategory = ITEM_CATEGORY_OVERRIDE[item.name];
          const finalCategory = overrideCategory || apiCategory || 'uncategorized';
          
          return {
            id: parseInt(item.id.slice(0, 8), 36),
            name: {
              en: item.name,
              es: getSpanishName(item.name),
            },
            price: item.price / 100,
            category: finalCategory,
            sortOrder: item.categories?.elements?.[0]?.sortOrder || 999,
            imageUrl: itemImageMap[item.name],
            addOns: [
              {
                id: 'extra-cheese',
                name: { en: 'Extra Cheese', es: 'Queso Extra' },
                price: 1.50
              },
              {
                id: 'extra-sauce',
                name: { en: 'Extra Sauce', es: 'Salsa Extra' },
                price: 0.75
              }
            ],
            customizations: [
              {
                id: 'spicy',
                name: { en: 'Make it Spicy', es: 'Hacer Picante' }
              },
              {
                id: 'no-onions',
                name: { en: 'No Onions', es: 'Sin Cebollas' }
              }
            ],
            recommendedBeverages: [
              {
                id: 'soda',
                name: { en: 'Soda', es: 'Refresco' },
                price: 2.00
              },
              {
                id: 'water',
                name: { en: 'Water', es: 'Agua' },
                price: 1.00
              }
            ],
            recommendedSides: [
              {
                id: 'fries',
                name: { en: 'French Fries', es: 'Papas Fritas' },
                price: 3.00
              }
            ],
            recommendedDesserts: [
              {
                id: 'ice-cream',
                name: { en: 'Ice Cream', es: 'Helado' },
                price: 2.50
              }
            ]
          };
        });

      // Create featured items
      const featuredItems = baseItems
        .filter(item => FEATURED_ITEMS.includes(item.name.en))
        .map(item => ({
          ...item,
          isFeatured: true // Add flag to track featured items
        }));

      // Combine items and sort by category order
      const allItems = [...featuredItems, ...baseItems.filter(item => !FEATURED_ITEMS.includes(item.name.en))];
      const sortedItems = sortByCategory(allItems, uniqueCategories);
      
      setApiMenuItems(sortedItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiMenuItems();
  }, []);

  const handleModifierSave = (instructions: string, quantity: number) => {
    if (selectedItem) {
      addItem({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        instructions,
        quantity
      });
    }
    setShowModifiers(false);
    setSelectedItem(null);
  };

  // Memoize filtered items with pagination
  const filteredItems = useMemo(() => {
    let items;
    const categoryKey = typeof selectedCategory === 'string' ? selectedCategory.toLowerCase() : selectedCategory.en.toLowerCase();
    
    if (categoryKey === 'all') {
      items = apiMenuItems;
    } else if (selectedCategory === 'Featured') {
      items = apiMenuItems.filter(item => FEATURED_ITEMS.includes(item.name.en));
    } else {
      items = apiMenuItems.filter(item => {
        const itemCategory = typeof item.category === 'string' 
          ? item.category 
          : typeof item.category === 'string' ? item.category : (item.category as { en: string }).en;
        return typeof itemCategory === 'string' && typeof selectedCategory === 'string' && itemCategory.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Sort items by name within their category
    items.sort((a, b) => a.name.en.localeCompare(b.name.en));

    return items;
  }, [apiMenuItems, selectedCategory]);

  // Calculate row count based on screen size
  const getColumnCount = () => {
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 3;  // md
    if (window.innerWidth >= 640) return 3;  // sm
    return 2; // default
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rowCount = Math.ceil(filteredItems.length / columnCount);

  // Fix the parentRef declaration
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 288, []),
    overscan: 10, // Increase overscan to show more items
  });

  const handleAddItem = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    if (SIMPLIFIED_MODAL_CATEGORIES.includes(item.category)) {
      setShowSimplifiedModal(true);
    } else {
      setShowModifiers(true);
    }
  }, []);

  const capitalizeFirstLetter = (string: string) => {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleItems((prev) => {
            const nextValue = prev + ITEMS_PER_PAGE;
            return nextValue;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [apiMenuItems, selectedCategory]);

  // Reset visible items when category changes
  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [selectedCategory]);

  // Update the preloadImages function to highlight previously excluded items
  const preloadImages = (items: MenuItem[]) => {
    items.forEach(item => {
      const img = new Image();
      const normalizedName = normalizeItemName(item.name.en);
      const imageSrc = itemImageMap[normalizedName];
      
      if (imageSrc) {
        img.src = imageSrc;
      } else {
        img.src = DEFAULT_IMAGE;
      }
    });
  };

  // Add this effect after the fetchApiMenuItems call
  useEffect(() => {
    if (filteredItems.length > 0) {
      preloadImages(filteredItems.slice(0, ITEMS_PER_PAGE));
    }
  }, [filteredItems]);

  const handleSimplifiedModalSave = (quantity: number) => {
    if (selectedItem) {
      addItem({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        instructions: '',
        quantity
      });
    }
    setShowSimplifiedModal(false);
    setSelectedItem(null);
  };

  // Add a helper function to get Spanish translations
  const getSpanishName = (englishName: string) => {
    const normalizedName = englishName.trim();
    
    const translations: Record<string, string> = {
      // Breakfast
      "Reg Kebab": "Kebab Regular",
      "Bun Kebab": "Kebab en Pan",
      "Breakfast Burrito": "Burrito de Desayuno",

      // Burritos
      "Aloo Burrito": "Burrito de Papa",
      "Chicken Karahi Burrito": "Burrito de Pollo Karahi",
      "Beef Nihari Burrito": "Burrito de Nihari de Res",
      "Beef Keema Burrito": "Burrito de Keema de Res",
      "Weekend Special Burrito": "Burrito Especial de Fin de Semana",

      // Quesadillas
      "Beef Keema Quesadilla": "Quesadilla de Keema de Res",
      "Chicken Karahi Quesadilla": "Quesadilla de Pollo Karahi",
      "Chicken Karachi Quesadilla": "Quesadilla de Pollo Karachi",
      "Cheese Quesadilla": "Quesadilla de Queso",
      "Cheeese Quesadilla": "Quesadilla de Queso",
      "Beef Nihari Quesadilla": "Quesadilla de Nihari de Res",
      "Aloo Quesadilla": "Quesadilla de Papa",

      // Tacos
      "Aloo Tacos": "Tacos de Papa",
      "Chicken Karahi Tacos": "Tacos de Pollo Karahi",
      "Beef Nihari Tacos": "Tacos de Nihari de Res",
      "Beef Keema Tacos": "Tacos de Keema de Res",

      // Rice Bowls
      "Daal Rice Bowl": "Tazón de Arroz con Daal",
      "Chicken Karahi Rice Bowl": "Tazón de Arroz con Pollo Karahi",
      "Beef Nihari Rice Bowl": "Tazón de Arroz con Nihari de Res",
      "Beef Keema Rice Bowl": "Tazón de Arroz con Keema de Res",
      "Weekend Special Rice Bowl": "Tazón de Arroz Especial de Fin de Semana",

      // Loaded Fries
      "Chicken Karahi Loaded Fries": "Papas Cargadas con Pollo Karahi",
      "Beef Nihari Loaded Fries": "Papas Cargadas con Nihari de Res",
      "Beef Keema Loaded Fries": "Papas Cargadas con Keema de Res",

      // Traditional Items
      "Yellow Daal (Traditional)": "Daal Amarillo (Tradicional)",
      "Beef Nihari (Traditional)": "Nihari de Res (Tradicional)",
      "Chicken Karahi (Traditional)": "Pollo Karahi (Tradicional)",

      // Side Items
      "Side Daal": "Daal de Acompañamiento",
      "Side Fries": "Papas Fritas de Acompañamiento",
      "Side Naan": "Naan de Acompañamiento",
      "Side Nihari Soup": "Sopa Nihari de Acompañamiento",
      "Side Nihari Soup w/ Beef": "Sopa Nihari con Res de Acompañamiento",

      // Weekend Specials
      "Weekend Special - Pink Kashmiri Chai": "Chai Rosado de Cachemira - Especial de Fin de Semana",
      "Weekend Special - Samosa": "Samosa - Especial de Fin de Semana",

      // Drinks
      "Jarritos": "Jarritos",
      "Can": "Lata",
      "Sprite Bottle": "Botella de Sprite",
      "Water": "Agua",
      "Rooh Afzah": "Rooh Afzah",
      "Scangwi": "Scangwi",
      "Dood Soda": "Soda de Leche",
      "Chai": "Té",

      // Desserts
      "Gulab Jamun": "Gulab Jamun",

      // Other
      "Gift Card": "Tarjeta de Regalo",
      "Delivery Fee": "Cargo por Entrega"
    };

    return translations[normalizedName] || normalizedName;
  };

  // Add this debug logging after fetching items
  useEffect(() => {
    if (apiMenuItems.length > 0) {
      console.log('Image mapping check:', apiMenuItems.map(item => ({
        name: item.name.en,
        hasImage: !!itemImageMap[item.name.en.trim()],
        imagePath: itemImageMap[item.name.en.trim()] || 'no image'
      })));
    }
  }, [apiMenuItems]);

  return (
    <div className="flex flex-col h-full">
      
      <div className="mb-4 sticky top-0 bg-white shadow-sm relative z-50">
        {selectedItem && (
          <div className="absolute inset-0 bg-black/50 z-40" />
        )}
        {!loading && !error && (
          <>
            <div className="p-2 relative z-30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                    typeof selectedCategory === 'string' && selectedCategory.toLowerCase() === 'all'
                      ? 'bg-black text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {CATEGORY_ORDER['All'].translations[currentLanguage]}
                </button>
                <div className="flex-1 overflow-x-scroll no-scrollbar categories-scroll-container">
                  <div className="flex items-center gap-2 min-w-max">
                    <button
                      onClick={() => setSelectedCategory('Featured')}
                      className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === 'Featured'
                          ? 'bg-black text-white shadow-md'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {CATEGORY_ORDER['Featured'].translations[currentLanguage]}
                    </button>
                    {categories
                      .filter(category => category.name !== 'Featured' && category.name !== 'All')
                      .map((category) => {
                        const categoryKey = typeof category.name === 'string' ? category.name : category.name.en;
                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(categoryKey)}
                            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                              selectedCategory === categoryKey
                              ? 'bg-black text-white shadow-md'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                          >
                            {CATEGORY_ORDER[categoryKey]?.translations[currentLanguage] || categoryKey}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div 
        ref={parentRef}
        className="flex-1 overflow-y-auto min-h-0 relative no-scrollbar menu-scrollable"
      >
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">{t('navigation.loading')}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-black rounded-lg text-center mb-4">
            <p className="text-black mb-2">{error}</p>
            <button
              onClick={() => fetchApiMenuItems()}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black transition"
            >
              {t('navigation.retry')}
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const startIndex = virtualRow.index * columnCount;
                const rowItems = filteredItems.slice(startIndex, startIndex + columnCount);

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '288px',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4"
                  >
                    {rowItems.map((item) => (
                      <div
                        key={`${item.id}-${item.category}`}
                        className="bg-white rounded-lg relative group shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden h-72"
                      >
                        <div
                          className="w-full h-full flex flex-col text-left relative cursor-pointer"
                          onClick={() => handleAddItem(item)}
                        >
                          <img
                            loading="lazy"
                            src={(() => {
                              const normalizedName = normalizeItemName(item.name.en);
                              const imageSrc = itemImageMap[normalizedName];
                              return imageSrc || DEFAULT_IMAGE;
                            })()}
                            alt={item.name[currentLanguage]}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = DEFAULT_IMAGE;
                            }}
                          />
                          <div className="p-3 flex flex-col flex-1">
                            <h3 className="font-medium text-neutral-800 text-lg h-12 line-clamp-2 mb-2">
                              {capitalizeFirstLetter(item.name[currentLanguage])}
                            </h3>
                            <div className="flex items-center justify-between">
                              <p className="text-primary font-bold text-lg">
                                ${item.price.toFixed(2)}
                              </p>
                              <button
                                className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddItem(item);
                                }}
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            
            {visibleItems < (selectedCategory === 'all' 
              ? apiMenuItems.length 
              : apiMenuItems.filter(item => item.category === selectedCategory).length) && (
              <div 
                ref={loadMoreRef}
                className="py-4 text-center"
              >
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedItem && !SIMPLIFIED_MODAL_CATEGORIES.includes(selectedItem.category) && (
        <ModifiersModal
          isOpen={showModifiers}
          onClose={() => {
            setShowModifiers(false);
            setSelectedItem(null);
          }}
          onSave={handleModifierSave}
          item={selectedItem}
          category={selectedItem.category}
        />
      )}

      {selectedItem && SIMPLIFIED_MODAL_CATEGORIES.includes(selectedItem.category) && (
        <SimplifiedModal
          isOpen={showSimplifiedModal}
          onClose={() => {
            setShowSimplifiedModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSimplifiedModalSave}
          item={selectedItem}
        />
      )}
    </div>
  );
};

// Add SimplifiedModal component
const SimplifiedModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  item 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (quantity: number) => void; 
  item: MenuItem; 
}) => {
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{item.name.en}</h2>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xl font-semibold text-primary">
              ${(item.price * quantity).toFixed(2)}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-neutral-100 text-neutral-600 font-medium hover:bg-neutral-200"
            >
              {t('modifiers.cancel')}
            </button>
            <button
              onClick={() => onSave(quantity)}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90"
            >
              {t('modifiers.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
