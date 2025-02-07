import { apiClient } from './apiClient';
import type { MenuItem, Category, ItemAddOn, ItemCustomization, RecommendedItem } from '../types';

const API_URL = (import.meta as any).env.VITE_API_URL;

interface MenuResponse {
  categories: Category[];
  menuItems: MenuItem[];
  addOns: ItemAddOn[];
  customizations: ItemCustomization[];
  recommendations: RecommendedItem[];
}

// Categories Management
export async function createCategory(category: { name_en: string; name_es: string; slug: string }): Promise<Category> {
  return apiClient.post<Category>('/menu/categories', category);
}

export async function updateCategory(id: string, category: { name_en: string; name_es: string; slug: string }): Promise<Category> {
  return apiClient.put<Category>(`/menu/categories/${id}`, category);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete(`/menu/categories/${id}`);
}

// Menu Items Management
export async function createMenuItem(item: {
  category_id: string;
  name_en: string;
  name_es: string;
  price: number;
  image_url?: string;
  available?: boolean;
}): Promise<MenuItem> {
  return apiClient.post<MenuItem>('/menu/items', item);
}

export async function updateMenuItem(id: string, item: {
  category_id?: string;
  name_en?: string;
  name_es?: string;
  price?: number;
  image_url?: string;
  available?: boolean;
}): Promise<MenuItem> {
  return apiClient.put<MenuItem>(`/menu/items/${id}`, item);
}

export async function deleteMenuItem(id: string): Promise<void> {
  return apiClient.delete(`/menu/items/${id}`);
}

// Add-ons Management
export async function fetchAddOns(category: string): Promise<ItemAddOn[]> {
  return apiClient.get<ItemAddOn[]>(`/menu/add-ons?category=${category}`);
}

export async function createAddOn(addOn: {
  name_en: string;
  name_es: string;
  price: number;
  category: string;
}): Promise<ItemAddOn> {
  return apiClient.post<ItemAddOn>('/menu/add-ons', addOn);
}

export async function updateAddOn(id: string, addOn: {
  name_en?: string;
  name_es?: string;
  price?: number;
  category?: string;
  active?: boolean;
}): Promise<ItemAddOn> {
  return apiClient.put<ItemAddOn>(`/menu/add-ons/${id}`, addOn);
}

export async function deleteAddOn(id: string): Promise<void> {
  return apiClient.delete(`/menu/add-ons/${id}`);
}

// Customizations Management
export async function fetchCustomizations(category: string): Promise<ItemCustomization[]> {
  return apiClient.get<ItemCustomization[]>(`/menu/customizations?category=${category}`);
}

export async function createCustomization(customization: {
  name_en: string;
  name_es: string;
  category: string;
}): Promise<ItemCustomization> {
  return apiClient.post<ItemCustomization>('/menu/customizations', customization);
}

export async function updateCustomization(id: string, customization: {
  name_en?: string;
  name_es?: string;
  category?: string;
  active?: boolean;
}): Promise<ItemCustomization> {
  return apiClient.put<ItemCustomization>(`/menu/customizations/${id}`, customization);
}

export async function deleteCustomization(id: string): Promise<void> {
  return apiClient.delete(`/menu/customizations/${id}`);
}

// Recommendations Management
export async function fetchRecommendations(itemId: number): Promise<{
  beverages: RecommendedItem[];
  sides: RecommendedItem[];
  desserts: RecommendedItem[];
}> {
  return apiClient.get<{
    beverages: RecommendedItem[];
    sides: RecommendedItem[];
    desserts: RecommendedItem[];
  }>(`/menu/recommendations/${itemId}`);
}

// Availability check
export async function checkAvailability(itemId: number, locationId: string): Promise<{
  isAvailable: boolean;
  unavailableReason?: {
    en: string;
    es: string;
  };
}> {
  return apiClient.get<{
    isAvailable: boolean;
    unavailableReason?: {
      en: string;
      es: string;
    };
  }>(`/menu/availability/${itemId}?location=${locationId}`);
}

// Availability Management
export async function updateAvailability(
  itemId: string,
  locationId: string,
  data: {
    is_available: boolean;
    unavailable_reason_en?: string;
    unavailable_reason_es?: string;
  }
): Promise<void> {
  return apiClient.put(`/menu/availability/${itemId}/${locationId}`, data);
}

export async function fetchMenu(): Promise<MenuResponse> {
  return apiClient.get<MenuResponse>('/menu');
}