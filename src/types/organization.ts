export type SubscriptionPlan = 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'CANCELLED';
export type PosIntegrationType = 'NONE' | 'SQUARE' | 'CLOVER' | 'STRIPE' | 'CUSTOM';

export interface OrganizationSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string;
} 

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  logo?: string;
  website?: string;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionRenewal?: string;
  posIntegration?: any; // Replace with proper type if available
  stores: Store[];
  modules: any[]; // Replace with proper type if available
} 