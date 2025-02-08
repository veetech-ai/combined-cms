import axios from 'axios';

const CLOVER_API_BASE =
  'https://bq2pgkc2c7.execute-api.us-east-1.amazonaws.com';
const MERCHANT_ID = 'PSK40XM0M8ME1';
const API_KEY = 'acca0c85-6c26-710f-4390-23676eae487c';

const cloverApi = axios.create({
  baseURL: `${CLOVER_API_BASE}`,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const fetchModifierGroup = async (modifierGroupId: string) => {
  try {
    const response = await cloverApi.get(`/modifier_group/${modifierGroupId}`);
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

    const response = await cloverApi.get(`/item_id/${itemId}`);

    // Return in the expected format
    return {
      elements: [response.data]
    };
  } catch (error) {
    console.error('Error fetching item modifier groups:', error);
    throw error;
  }
};
