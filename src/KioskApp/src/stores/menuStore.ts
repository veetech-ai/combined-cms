import { create } from 'zustand';
import { fetchMenu } from '../api/menu';

interface MenuItem {
  id: number;
  name: {
    en: string;
    es: string;
  };
  price: number;
  category: string;
  imageUrl: string;
}

interface Category {
  id: string;
  name: string;
}

interface MenuStore {
  categories: Category[];
  menuItems: MenuItem[];
  addOns: Record<string, ItemAddOn[]>;
  customizations: Record<string, ItemCustomization[]>;
  recommendations: Record<number, {
    beverages: RecommendedItem[];
    sides: RecommendedItem[];
    desserts: RecommendedItem[];
  }>;
  availability: Record<string, boolean>;
  status: 'idle' | 'loading' | 'error' | 'success';
  isLoading: boolean;
  error: string | null;
  loadMenuItems: () => Promise<void>;
  loadAddOns: (category: string) => Promise<void>;
  loadCustomizations: (category: string) => Promise<void>;
  loadRecommendations: (itemId: number) => Promise<void>;
  checkAvailability: (itemId: number, locationId: string) => Promise<void>;
}

// Default menu data as fallback
const defaultCategories = [
  { id: 'burgers', name: 'Burgers' },
  { id: 'pizzas', name: 'Pizzas' },
  { id: 'drinks', name: 'Drinks & Juices' },
];

const defaultMenuItems = [
  { 
    id: 1,
    name: {
      en: 'Classic Zinger',
      es: 'Zinger Clásico'
    }, 
    price: 8.99, 
    category: 'burgers', 
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
    addOns: [
      {
        id: 'cheese',
        name: { en: 'Add Cheese', es: 'Agregar Queso' },
        price: 1.00
      },
      {
        id: 'bacon',
        name: { en: 'Add Bacon', es: 'Agregar Tocino' },
        price: 2.00
      },
      {
        id: 'double-protein',
        name: { en: 'Double Protein', es: 'Doble Proteína' },
        price: 3.00
      }
    ],
    customizations: [
      {
        id: 'no-onions',
        name: { en: 'No Onions', es: 'Sin Cebolla' }
      },
      {
        id: 'no-tomatoes',
        name: { en: 'No Tomatoes', es: 'Sin Tomate' }
      },
      {
        id: 'no-lettuce',
        name: { en: 'No Lettuce', es: 'Sin Lechuga' }
      }
    ],
    recommendedBeverages: [
      {
        id: 'cola',
        name: { en: 'Cola', es: 'Cola' },
        price: 2.99
      },
      {
        id: 'lemonade',
        name: { en: 'Lemonade', es: 'Limonada' },
        price: 3.49
      }
    ],
    recommendedSides: [
      {
        id: 'fries',
        name: { en: 'French Fries', es: 'Papas Fritas' },
        price: 3.99
      },
      {
        id: 'onion-rings',
        name: { en: 'Onion Rings', es: 'Aros de Cebolla' },
        price: 4.99
      }
    ]
  },
  { 
    id: 2, 
    name: {
      en: 'Double Cheese',
      es: 'Doble Queso'
    }, 
    price: 10.99, 
    category: 'burgers', 
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300' 
  },
  { 
    id: 3, 
    name: {
      en: 'Spicy BBQ',
      es: 'BBQ Picante'
    }, 
    price: 9.99, 
    category: 'burgers', 
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300' 
  },
  { 
    id: 4, 
    name: {
      en: 'Veggie Supreme',
      es: 'Suprema Vegetariana'
    }, 
    price: 7.99, 
    category: 'burgers', 
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=300' 
  },
  { 
    id: 5, 
    name: {
      en: 'Mushroom Swiss',
      es: 'Champiñones y Suizo'
    }, 
    price: 9.99, 
    category: 'burgers', 
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300' 
  },
  { 
    id: 6, 
    name: {
      en: 'Chicken Ranch',
      es: 'Pollo Ranch'
    }, 
    price: 8.99, 
    category: 'burgers', 
    imageUrl: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=300' 
  },
  { 
    id: 7, 
    name: {
      en: 'Fish Fillet',
      es: 'Filete de Pescado'
    }, 
    price: 8.99, 
    category: 'burgers', 
    imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300' 
  },
  { 
    id: 8, 
    name: {
      en: 'Ultimate Beast',
      es: 'Bestia Suprema'
    }, 
    price: 12.99, 
    category: 'burgers', 
    imageUrl: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=300' 
  },
  { 
    id: 9, 
    name: {
      en: 'Margherita',
      es: 'Margarita'
    }, 
    price: 12.99, 
    category: 'pizzas', 
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' 
  },
  { 
    id: 10, 
    name: {
      en: 'Pepperoni',
      es: 'Pepperoni'
    }, 
    price: 14.99, 
    category: 'pizzas', 
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300' 
  },
  { 
    id: 11, 
    name: {
      en: 'BBQ Chicken',
      es: 'Pollo BBQ'
    }, 
    price: 15.99, 
    category: 'pizzas', 
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300' 
  },
  { 
    id: 12, 
    name: {
      en: 'Cola',
      es: 'Cola'
    }, 
    price: 2.99, 
    category: 'drinks', 
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300' 
  },
  { 
    id: 13, 
    name: {
      en: 'Orange Juice',
      es: 'Jugo de Naranja'
    }, 
    price: 3.99, 
    category: 'drinks', 
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300' 
  },
  { 
    id: 14, 
    name: {
      en: 'Mango Shake',
      es: 'Batido de Mango'
    }, 
    price: 4.99, 
    category: 'drinks', 
    imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300' 
  },
  { 
    id: 15, 
    name: {
      en: 'Lemonade',
      es: 'Limonada'
    }, 
    price: 3.49, 
    category: 'drinks', 
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300' 
  },
  { 
    id: 16, 
    name: {
      en: 'Smoothie',
      es: 'Batido'
    }, 
    price: 4.99, 
    category: 'drinks', 
    imageUrl: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=300' 
  }
  // Add more default items as needed...
];

export const useMenuStore = create<MenuStore>((set) => ({
  categories: defaultCategories,
  menuItems: defaultMenuItems,
  addOns: {},
  customizations: {},
  recommendations: {},
  availability: {},
  status: 'idle',
  isLoading: false,
  error: null,
  loadMenuItems: async () => {
    set({ status: 'loading', isLoading: true, error: null });
    try {
      const response = await fetchMenu();
      if (response?.categories?.length && response?.menuItems?.length) {
        set({
          categories: response.categories,
          menuItems: response.menuItems,
          status: 'success',
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('Empty menu data received');
      }
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message === 'API_URL not configured') {
          errorMessage = 'Using offline menu data';
        } else if (error.name === 'TimeoutError') {
          errorMessage = 'Connection timed out. Using offline menu data';
        } else {
          errorMessage = `${error.message}. Using offline menu data`;
        }
      }

      set({ 
        status: 'error',
        isLoading: false,
        error: errorMessage,
        categories: defaultCategories,
        menuItems: defaultMenuItems
      });
    }
  },
  loadAddOns: async (category: string) => {
    try {
      const addOns = await fetchAddOns(category);
      set(state => ({
        addOns: { ...state.addOns, [category]: addOns }
      }));
    } catch (error) {
      console.error('Failed to load add-ons:', error);
    }
  },

  loadCustomizations: async (category: string) => {
    try {
      const customizations = await fetchCustomizations(category);
      set(state => ({
        customizations: { ...state.customizations, [category]: customizations }
      }));
    } catch (error) {
      console.error('Failed to load customizations:', error);
    }
  },

  loadRecommendations: async (itemId: number) => {
    try {
      const recommendations = await fetchRecommendations(itemId);
      set(state => ({
        recommendations: { ...state.recommendations, [itemId]: recommendations }
      }));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  },

  checkAvailability: async (itemId: number, locationId: string) => {
    try {
      const { isAvailable } = await checkAvailability(itemId, locationId);
      set(state => ({
        availability: { ...state.availability, [`${itemId}-${locationId}`]: isAvailable }
      }));
    } catch (error) {
      console.error('Failed to check availability:', error);
    }
  }
}));