import { toast } from 'react-hot-toast';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1, delay * 2);
  }
}

export function handleAPIError(error: unknown): never {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        toast.error('Session expired. Please log in again.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('The requested resource was not found.');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('An unexpected error occurred. Please try again later.');
        break;
      default:
        toast.error(error.message || 'An unknown error occurred.');
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unknown error occurred.');
  }
  throw error;
}