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
  company: string;
  phone?: string;
  logo?: string;
  website?: string;
  
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactRole?: string;
  
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStart?: Date;
  subscriptionRenewal?: Date;
  
  posType: PosIntegrationType;
  posProvider?: string;
  posConfig?: any;
  
  createdAt: Date;
  updatedAt: Date;
  
  stores?: Store[];
  users?: User[];
} 