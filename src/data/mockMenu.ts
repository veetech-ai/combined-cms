import { Menu } from '../types/menu';

export const mockMenu: Menu = {
  id: 'menu-1',
  storeId: 'store1',
  categories: [
    {
      id: 'appetizers',
      name: 'Appetizers',
      description: 'Start your meal with these delicious options',
      order: 0
    },
    {
      id: 'main-courses',
      name: 'Main Courses',
      description: 'Signature dishes crafted with care',
      order: 1
    },
    {
      id: 'desserts',
      name: 'Desserts',
      description: 'Sweet endings to your perfect meal',
      order: 2
    }
  ],
  items: [
    {
      id: 'item-1',
      name: 'Crispy Calamari',
      description: 'Tender calamari rings, lightly breaded and fried, served with marinara sauce',
      price: 14.99,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800&h=600&fit=crop',
      allergens: ['Gluten', 'Shellfish'],
      nutritionalInfo: {
        calories: 320,
        protein: 18,
        carbs: 24,
        fat: 16
      },
      customizations: [
        {
          name: 'Sauce',
          options: ['Marinara', 'Garlic Aioli', 'Spicy Mayo'],
          required: true
        }
      ],
      categoryId: 'appetizers'
    },
    {
      id: 'item-2',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon, grilled to perfection with lemon herb butter',
      price: 28.99,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=600&fit=crop',
      allergens: ['Fish'],
      nutritionalInfo: {
        calories: 450,
        protein: 42,
        carbs: 8,
        fat: 28
      },
      customizations: [
        {
          name: 'Cooking Preference',
          options: ['Medium Rare', 'Medium', 'Well Done'],
          required: true
        },
        {
          name: 'Side',
          options: ['Roasted Vegetables', 'Mashed Potatoes', 'Wild Rice'],
          required: true
        }
      ],
      categoryId: 'main-courses'
    },
    {
      id: 'item-3',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
      price: 10.99,
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop',
      allergens: ['Dairy', 'Eggs', 'Gluten'],
      nutritionalInfo: {
        calories: 580,
        protein: 8,
        carbs: 68,
        fat: 32
      },
      customizations: [
        {
          name: 'Ice Cream Flavor',
          options: ['Vanilla', 'Chocolate', 'Strawberry'],
          required: false
        }
      ],
      categoryId: 'desserts'
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};