import { API_CONFIG, DEFAULT_HEADERS } from '../config/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private storeId: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.storeId = API_CONFIG.STORE_ID;
    this.headers = DEFAULT_HEADERS;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      console.log(`Making POST request to: ${this.baseUrl}${endpoint}`);
      console.log('Request data:', data);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Customer endpoints
  async findOrCreateCustomer(
    name: string,
    phone: string
  ): Promise<ApiResponse<any>> {
    const endpoint = API_CONFIG.ENDPOINTS.CUSTOMERS.FIND_OR_CREATE(
      this.storeId
    );
    return this.post(endpoint, { name, phone });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };
