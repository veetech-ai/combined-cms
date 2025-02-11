import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  instructions: string;
  cartId: string;
}

interface CartStore {
  items: CartItem[];
  customerName: string;
  phoneNumber: string;
  discountCode: string;
  phoneDiscount: boolean;
  addItem: (item: {
    id: number;
    name: { en: string; es: string };
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
  getDiscountedTotal: () => {
    subtotal: number;
    phoneDiscountAmount: number;
    couponDiscountAmount: number;
    total: number;
  };
  isEligibleForPhoneDiscount: (phone: string) => boolean;
  validateAddOns: (category: string, addOns: string[]) => boolean;
}

// Constants
const VIP_PHONES = ['6464369745', '0303567659393'];
const PHONE_DISCOUNT_PERCENT = 0.15;
const COUPON_DISCOUNT_PERCENT = 0.1;
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

const calculateItemTotal = (item: CartItem) => {
  let total = item.price;

  try {
    const instructions = JSON.parse(item.instructions);
    if (instructions.addOns) {
      instructions.addOns.forEach((addOn: any) => {
        total += addOn.price / 100;
      });
    }
  } catch (e) {
    ////console.error('Error calculating item total:');
  }

  return total * item.quantity;
};

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
      
        // Parse the instructions JSON if it exists
        let parsedInstructions;
        try {
          parsedInstructions = item.instructions ? JSON.parse(item.instructions) : {};
        } catch (e) {
          parsedInstructions = {};
        }
      
        // Helper function to deeply compare arrays of objects
        const areArraysEqual = (arr1: any[], arr2: any[]) => {
          if (arr1.length !== arr2.length) return false;
          return arr1.every((item1, index) => {
            const item2 = arr2[index];
            return JSON.stringify(item1) === JSON.stringify(item2);
          });
        };
      
        // Check if the same product with the same add-ons, customizations, and extras already exists in the cart
        const existingItem = get().items.find((existing) => {
          if (existing.id !== item.id) return false;
      
          // Compare add-ons
          const existingAddOns = existing.addOns || [];
          const newAddOns = parsedInstructions.addOns || [];
          if (!areArraysEqual(existingAddOns, newAddOns)) return false;
      
          // Compare customizations
          const existingCustomizations = existing.customizations || [];
          const newCustomizations = parsedInstructions.customizations || [];
          if (!areArraysEqual(existingCustomizations, newCustomizations)) return false;
      
          // Compare extras
          const existingExtras = existing.extras || [];
          const newExtras = parsedInstructions.extras || [];
          if (!areArraysEqual(existingExtras, newExtras)) return false;
      
          return true;
        });
      
        if (existingItem) {
          // If the same product with the same add-ons, customizations, and extras exists, increase its quantity
          set((state) => ({
            items: state.items.map((existing) =>
              existing.cartId === existingItem.cartId
                ? { ...existing, quantity: existing.quantity + (item.quantity || 1) }
                : existing
            ),
          }));
        } else {
          // If the product is different or has different customizations, add it as a new item
          set((state) => ({
            items: [
              ...state.items,
              {
                ...item,
                cartId,
                imageUrl: item.imageUrl,
                addOns: parsedInstructions.addOns || [],
                customizations: parsedInstructions.customizations || [],
                beverages: parsedInstructions.beverages || [],
                sides: parsedInstructions.sides || [],
                desserts: parsedInstructions.desserts || [],
                quantity: parsedInstructions.quantity || item.quantity || 1,
                addOnPrices: {},
                beveragePrices: {},
                sidePrices: {},
                dessertPrices: {},
              },
            ],
          }));
        }
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartId !== cartId)
        }));
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity < 1 || quantity > MAX_QUANTITY) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, quantity } : item
          )
        }));
      },

      updateInstructions: (cartId, instructions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, instructions } : item
          )
        }));
      },

      setCustomerInfo: (name, phone) => {
        set({ customerName: name, phoneNumber: phone });
      },

      setDiscountCode: (code) => set({ discountCode: code }),
      setPhoneDiscount: (value) => set({ phoneDiscount: value }),

      clearCart: () =>
        set({
          items: [],
          customerName: '',
          phoneNumber: '',
          discountCode: '',
          phoneDiscount: false
        }),

      getTotal: () => {
        //console.log('Calculating total...');
        const state = get();
        return state.items.reduce((sum, item) => {
          let itemTotal = item.price;

          // Add add-on prices
          if (item.addOns?.length) {
            itemTotal += item.addOns.reduce(
              (addOnSum, addOnId) =>
                addOnSum + (item.addOnPrices[addOnId] || 0),
              0
            );
          }

          // Add beverage prices
          if (item.beverages?.length) {
            itemTotal += item.beverages.reduce(
              (bevSum, bevId) => bevSum + (item.beveragePrices[bevId] || 0),
              0
            );
          }

          // Add side prices
          if (item.sides?.length) {
            itemTotal += item.sides.reduce(
              (sideSum, sideId) => sideSum + (item.sidePrices[sideId] || 0),
              0
            );
          }

          // Add dessert prices
          if (item.desserts?.length) {
            itemTotal += item.desserts.reduce(
              (dessertSum, dessertId) =>
                dessertSum + (item.dessertPrices[dessertId] || 0),
              0
            );
          }
          return sum + itemTotal * item.quantity;
        }, 0);
      },

      getDiscountedTotal: () => {
        const state = get();
        const subtotal = state.items.reduce(
          (sum, item) => sum + calculateItemTotal(item),
          0
        );

        // Calculate discounts
        const phoneDiscountAmount = state.phoneDiscount ? subtotal * 0.1 : 0;
        const couponDiscountAmount = state.discountCode ? subtotal * 0.05 : 0;

        const total = subtotal - phoneDiscountAmount - couponDiscountAmount;

        return {
          subtotal,
          phoneDiscountAmount,
          couponDiscountAmount,
          total
        };
      },

      isEligibleForPhoneDiscount: (phone) => {
        const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
        return VIP_PHONES.some(
          (vipPhone) => vipPhone.replace(/^0+/, '') === cleanPhone
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
