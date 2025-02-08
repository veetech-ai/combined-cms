import { CartItem } from '../types';

const CLOVER_API_BASE =
  'https://cors-anywhere.herokuapp.com/https://api.clover.com/v3';
const MERCHANT_ID = 'PSK40XM0M8ME1';
const AUTH_TOKEN = 'acca0c85-6c26-710f-4390-23676eae487c';

interface CloverLineItem {
  id: string;
  item: {
    id: string;
  };
  price: number;
  unitQty: number;
  note?: string;
}

interface CloverOrderRequest {
  orderCart: {
    lineItems: CloverLineItem[];
    note: string;
    merchant: {
      id: string;
    };
    currency: string;
    id: string;
  };
}

export const createCloverOrder = async (
  items: CartItem[],
  orderNote: string = 'Web Order'
) => {
  try {
    // Transform cart items to Clover format
    const lineItems: CloverLineItem[] = items.map((item) => ({
      id: `order-12`,
      item: {
        id: item.cloverId || 'NN5PSWS4Q35KJ' // Use cloverId if available, fallback to id
      },
      price: Math.round(item.price * 100), // Convert to cents
      unitQty: item.quantity,
      note: item.instructions || undefined
    }));

    const orderRequest: CloverOrderRequest = {
      orderCart: {
        lineItems,
        note: orderNote,
        merchant: {
          id: MERCHANT_ID
        },
        currency: 'USD',
        id: `ORDER-12`
      }
    };

    console.log(
      'Sending order to Clover:',
      JSON.stringify(orderRequest, null, 2)
    );

    const response = await fetch(
      `${CLOVER_API_BASE}/merchants/${MERCHANT_ID}/atomic_order/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderRequest),
        mode: 'cors'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Clover API Error:', errorText);
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Clover API Response:', data);

    return data;
  } catch (error) {
    console.error('Error creating Clover order:', error);
    throw error;
  }
};
