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
  company: string;
  email: string;
  phone: string;
  logo?: string;
  website?: string;
  
  // Billing Address
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  
  // Subscription
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionRenewal?: string;
  
  // POS Integration
  posIntegration?: {
    type: string;
    provider: string;
    config: any;
  };
  
  stores?: Store[];
} 