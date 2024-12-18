export interface SearchEvent {
  storeId: number;
  searchTerm: string;
  productId?: number;
  aisleId?: number;
  matched: boolean;
  sessionId: string;
  userAgent?: string;
}

export interface TimeRangeParams {
  startDate?: string;
  endDate?: string;
  interval?: 'hour' | 'day' | 'week' | 'month';
} 