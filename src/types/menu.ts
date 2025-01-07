export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  videoUrl?: string;
  image?: string;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  customizations: {
    name: string;
    options: string[];
    required: boolean;
  }[];
  categoryId: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface Menu {
  id: string;
  storeId: string;
  categories: MenuCategory[];
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
  isLive: boolean;
  name: string;
  version: number;
}

export interface MenuStats {
  totalItems: number;
  activeItems: number;
  categories: number;
  lastUpdated: string;
}