import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: number;
  cartId: string;
  name: {
    en: string;
    es: string;
  };
  price: number;
  quantity: number;
  imageUrl: string;
  instructions?: string;
  addOns?: string[];
  customizations?: string[];
  beverages?: string[];
  sides?: string[];
  desserts?: string[];
  addOnPrices: {
    [key: string]: number;
  };
  beveragePrices: {
    [key: string]: number;
  };
  sidePrices: {
    [key: string]: number;
  };
  dessertPrices: {
    [key: string]: number;
  };
}

interface CartStore {
  items: CartItem[];
  customerName: string;
  phoneNumber: string;
  discountCode: string;
  phoneDiscount: boolean;
  addItem: (item: { 
    id: number; 
    name: { en: string; es: string; }; 
    price: number; 
    imageUrl: string;
    instructions?: string; 
    quantity: number;
    addOns?: string[];
    customizations?: string[];
    beverages?: string[];
    sides?: string[];
    desserts?: string[];
    unavailablePreference?: string;
  }) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  updateInstructions: (cartId: string, instructions: string) => void;
  setCustomerInfo: (name: string, phone: string) => void;
  setDiscountCode: (code: string) => void;
  setPhoneDiscount: (value: boolean) => void;
  clearCart: () => void;
  getTotal: () => number;
  getDiscountedTotal: () => { subtotal: number; phoneDiscountAmount: number; couponDiscountAmount: number; total: number };
  isEligibleForPhoneDiscount: (phone: string) => boolean;
  validateAddOns: (category: string, addOns: string[]) => boolean;
}

// Constants
const VIP_PHONES = ['6464369745', '0303567659393'];
const PHONE_DISCOUNT_PERCENT = 0.15;
const COUPON_DISCOUNT_PERCENT = 0.10;
const VALID_COUPON = '0000';
const MAX_QUANTITY = 99;
const MIN_ORDER_AMOUNT = 0.01;
const MAX_ADDONS = {
  burgers: 3,
  pizzas: 4,
  drinks: 2
};
const MAX_BEVERAGES = 2;
const MAX_SIDES = 2;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: '',
      phoneNumber: '',
      discountCode: '',
      phoneDiscount: false,

      addItem: (item) => {
        const cartId = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        
        // Initialize price maps
        const addOnPrices: { [key: string]: number } = {};
        const beveragePrices: { [key: string]: number } = {};
        const sidePrices: { [key: string]: number } = {};
        const dessertPrices: { [key: string]: number } = {};
      
        // Parse the instructions JSON if it exists
        let parsedInstructions;
        try {
          parsedInstructions = item.instructions ? JSON.parse(item.instructions) : {};
        } catch (e) {
          parsedInstructions = {};
        }
      
        // Calculate add-on prices
        if (parsedInstructions.addOns?.length) {
          parsedInstructions.addOns.forEach((addOnId: string) => {
            switch (addOnId) {
              case 'extra-cheese':
                addOnPrices[addOnId] = 1.50;
                break;
              case 'extra-sauce':
                addOnPrices[addOnId] = 0.75;
                break;
            }
          });
        }
      
        // Calculate beverage prices
        if (parsedInstructions.beverages?.length) {
          parsedInstructions.beverages.forEach((bevId: string) => {
            switch (bevId) {
              case 'soda':
                beveragePrices[bevId] = 2.00;
                break;
              case 'water':
                beveragePrices[bevId] = 1.00;
                break;
            }
          });
        }
      
        // Calculate side prices
        if (parsedInstructions.sides?.length) {
          parsedInstructions.sides.forEach((sideId: string) => {
            if (sideId === 'fries') {
              sidePrices[sideId] = 3.00;
            }
          });
        }
      
        // Calculate dessert prices
        if (parsedInstructions.desserts?.length) {
          parsedInstructions.desserts.forEach((dessertId: string) => {
            if (dessertId === 'ice-cream') {
              dessertPrices[dessertId] = 2.50;
            }
          });
        }
      
        set((state) => ({
          items: [...state.items, {
            ...item,
            cartId,
            imageUrl: item.imageUrl,
            addOns: parsedInstructions.addOns || [],
            customizations: parsedInstructions.customizations || [],
            beverages: parsedInstructions.beverages || [],
            sides: parsedInstructions.sides || [],
            desserts: parsedInstructions.desserts || [],
            quantity: parsedInstructions.quantity || item.quantity || 1,
            addOnPrices,
            beveragePrices,
            sidePrices,
            dessertPrices
          }]
        }));
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartId !== cartId),
        }));
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity < 1 || quantity > MAX_QUANTITY) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, quantity } : item
          ),
        }));
      },

      updateInstructions: (cartId, instructions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, instructions } : item
          ),
        }));
      },

      setCustomerInfo: (name, phone) => {
        set({ customerName: name, phoneNumber: phone });
      },

      setDiscountCode: (code) => set({ discountCode: code }),
      setPhoneDiscount: (value) => set({ phoneDiscount: value }),

      clearCart: () => set({
        items: [],
        customerName: '',
        phoneNumber: '',
        discountCode: '',
        phoneDiscount: false
      }),

      getTotal: () => {
        console.log('Calculating total...');
        const state = get();
        return state.items.reduce((sum, item) => {
          let itemTotal = item.price;
      
          // Add add-on prices
          if (item.addOns?.length) {
            itemTotal += item.addOns.reduce((addOnSum, addOnId) => 
              addOnSum + (item.addOnPrices[addOnId] || 0), 0);
          }
      
          // Add beverage prices
          if (item.beverages?.length) {
            itemTotal += item.beverages.reduce((bevSum, bevId) => 
              bevSum + (item.beveragePrices[bevId] || 0), 0);
          }
      
          // Add side prices
          if (item.sides?.length) {
            itemTotal += item.sides.reduce((sideSum, sideId) => 
              sideSum + (item.sidePrices[sideId] || 0), 0);
          }
      
          // Add dessert prices
          if (item.desserts?.length) {
            itemTotal += item.desserts.reduce((dessertSum, dessertId) => 
              dessertSum + (item.dessertPrices[dessertId] || 0), 0);
          }
          return sum + (itemTotal * item.quantity);
        }, 0);
      },

      getDiscountedTotal: () => {
        const state = get();
        const subtotal = state.getTotal();
        let total = subtotal;
        let phoneDiscountAmount = 0;
        let couponDiscountAmount = 0;

        if (subtotal >= MIN_ORDER_AMOUNT) {
          if (state.phoneDiscount) {
            phoneDiscountAmount = subtotal * PHONE_DISCOUNT_PERCENT;
            total -= phoneDiscountAmount;
          }

          if (state.discountCode === VALID_COUPON) {
            couponDiscountAmount = total * COUPON_DISCOUNT_PERCENT;
            total -= couponDiscountAmount;
          }
        }

        return {
          subtotal,
          phoneDiscountAmount,
          couponDiscountAmount,
          total: Math.max(total, 0)
        };
      },

      isEligibleForPhoneDiscount: (phone) => {
        const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
        return VIP_PHONES.some(vipPhone => 
          vipPhone.replace(/^0+/, '') === cleanPhone
        );
      },

      validateAddOns: (category, addOns) => {
        const maxAllowed = MAX_ADDONS[category as keyof typeof MAX_ADDONS] || 0;
        if (addOns.length > maxAllowed) {
          toast.error(`Maximum ${maxAllowed} add-ons allowed for ${category}`);
          return false;
        }
        return true;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode
      })
    }
  )
);