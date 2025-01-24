import { rateLimiter } from './rateLimiter';
import { handleAPIError, APIError } from './errorHandler';

type RequestOptions = RequestInit & {
  endpoint: string;
  skipRateLimit?: boolean;
};

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new APIError(
        data.message || 'An error occurred',
        response.status,
        data.code
      );
    }

    return data;
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const { endpoint, skipRateLimit = false, ...init } = options;

    if (!skipRateLimit) {
      await rateLimiter.waitForToken(endpoint);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      });

      // Handle rate limit headers if present
      const rateLimit = {
        limit: response.headers.get('X-RateLimit-Limit'),
        remaining: response.headers.get('X-RateLimit-Remaining'),
        reset: response.headers.get('X-RateLimit-Reset'),
      };

      if (rateLimit.remaining === '0') {
        throw new APIError(
          'Rate limit exceeded',
          429,
          'RATE_LIMIT_EXCEEDED'
        );
      }

      return await this.handleResponse(response);
    } catch (error) {
      return handleAPIError(error);
    }
  }

  async get<T>(endpoint: string, options: Omit<RequestOptions, 'endpoint' | 'method'> = {}): Promise<T> {
    return this.request<T>({
      ...options,
      endpoint,
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data: any, options: Omit<RequestOptions, 'endpoint' | 'method'> = {}): Promise<T> {
    return this.request<T>({
      ...options,
      endpoint,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any, options: Omit<RequestOptions, 'endpoint' | 'method'> = {}): Promise<T> {
    return this.request<T>({
      ...options,
      endpoint,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'endpoint' | 'method'> = {}): Promise<T> {
    return this.request<T>({
      ...options,
      endpoint,
      method: 'DELETE',
    });
  }
}

export const apiClient = new APIClient((import.meta as any).env.VITE_API_URL);