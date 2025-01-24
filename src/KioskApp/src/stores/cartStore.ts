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
  addOnPrices?: {
    [key: string]: number;
  };
  quantity: number;
  instructions?: string;
  addOns?: string[];
  customizations?: string[];
  beverages?: string[];
  sides?: string[];
  desserts?: string[];
  unavailablePreference?: string;
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
        // Generate a unique cart ID that includes timestamp and a random string
        const cartId = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        // Validate add-ons limits
        if (item.addOns && !get().validateAddOns(item.category || '', item.addOns)) {
          return;
        }

        // Calculate add-on prices
        const addOnPrices: { [key: string]: number } = {};
        if (item.addOns?.length) {
          item.addOns.forEach(addOnId => {
            switch (addOnId) {
              case 'cheese':
                addOnPrices[addOnId] = 1.00;
                break;
              case 'bacon':
                addOnPrices[addOnId] = 2.00;
                break;
              case 'double-protein':
                addOnPrices[addOnId] = 3.00;
                break;
              default:
                addOnPrices[addOnId] = 1.00;
            }
          });
        }

        // Validate recommended items limits
        if (item.beverages && item.beverages.length > MAX_BEVERAGES) {
          toast.error(`Maximum ${MAX_BEVERAGES} beverages allowed`);
          return;
        }
        if (item.sides && item.sides.length > MAX_SIDES) {
          toast.error(`Maximum ${MAX_SIDES} sides allowed`);
          return;
        }

        set((state) => {
          // Generate a unique cart ID for this item
          const cartId = `${item.id}-${Date.now()}`;
          return { 
            items: [...state.items, { 
              ...item, 
              addOnPrices,
              cartId,
              quantity: item.quantity || 1
            }] 
          };
        });
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
        const state = get();
        return state.items.reduce((sum, item) => {
          let itemTotal = item.price || 0;
          
          // Add add-ons prices
          if (item.addOns?.length) {
            itemTotal += item.addOns.reduce((addOnSum, addOnId) => {
              return addOnSum + (item.addOnPrices?.[addOnId] || 0);
            }, 0);
          }

          // Add recommended items prices
          if (item.beverages?.length) {
            itemTotal += item.beverages.length * 2.99; // Example price
          }
          if (item.sides?.length) {
            itemTotal += item.sides.length * 3.99; // Example price
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