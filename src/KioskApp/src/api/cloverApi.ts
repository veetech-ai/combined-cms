import axios from 'axios';

const CLOVER_API_BASE = 'https://api.clover.com/v3';
const MERCHANT_ID = 'PSK40XM0M8ME1';
const API_KEY = 'acca0c85-6c26-710f-4390-23676eae487c';

const cloverApi = axios.create({
  baseURL: `${CLOVER_API_BASE}/merchants/${MERCHANT_ID}`,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const fetchModifierGroup = async (modifierGroupId: string) => {
  try {
    const response = await cloverApi.get(
      `/modifier_groups/${modifierGroupId}?expand=modifiers,items`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching modifier group:', error);
    throw error;
  }
};

export const fetchItemModifierGroups = async (itemId: string) => {
  try {
    // Get the modifier group ID from the menu section props
    // This should be passed from MenuSection component

    // const modifierGroupId = 'SC1XA3K6BQ5Z2'; // This should come from props
    // console.log(itemId);

    const response = await cloverApi.get(
      `/modifier_groups/${itemId}?expand=modifiers,items`
    );

    // Return in the expected format
    return {
      elements: [response.data]
    };
  } catch (error) {
    console.error('Error fetching item modifier groups:', error);
    throw error;
  }
};
