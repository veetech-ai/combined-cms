export type MenuItem = {
  id: number;
  name: {
    en: string;
    es: string;
  };
  price: number;
  category: string;
  sortOrder: number;
  imageUrl?: string;
  isFeatured?: boolean;
  addOns: Array<{
    id: string;
    name: { en: string; es: string };
    price: number;
  }>;
  customizations: Array<{
    id: string;
    name: { en: string; es: string };
  }>;
  recommendedBeverages: Array<{
    id: string;
    name: { en: string; es: string };
    price: number;
  }>;
  recommendedSides: Array<{
    id: string;
    name: { en: string; es: string };
    price: number;
  }>;
  recommendedDesserts: Array<{
    id: string;
    name: { en: string; es: string };
    price: number;
  }>;
};

export interface ItemAddOn {
  id: string;
  name: {
    en: string;
    es: string;
  };
  price: number;
}

export interface ItemCustomization {
  id: string;
  name: {
    en: string;
    es: string;
  };
}

export interface RecommendedItem {
  id: string;
  name: {
    en: string;
    es: string;
  };
  price: number;
  maxSelections?: number;
}

export type CategoryName = {
  en: string;
  es: string;
};

export interface Category {
  id: string;
  name: CategoryName;
}

export interface CartItem {
  id: number;
  name: {
    en: string;
    es: string;
  };
  price: number;
  quantity: number;
  instructions?: string;
  cloverId?: string;
}

export interface CloverApiResponse {
  id: string;
  orderCart: {
    id: string;
    lineItems: Array<{
      id: string;
      item: {
        id: string;
      };
      price: number;
      unitQty: number;
      note?: string;
    }>;
    total: number;
    currency: string;
  };
  createdTime: number;
  modifiedTime: number;
  status: string;
}