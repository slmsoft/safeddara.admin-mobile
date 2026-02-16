// Base HTTP client with interceptors

import { getSessionId, clearSession, saveAuth, isSessionExpired } from './auth';
import type { ApiResponse, ApiErrorResponse } from './types';

// Use direct URL always (no proxy)
let API_BASE_URL = 'https://api.safeddara.tj/api/v1';

try {
  // Check if import.meta is available (Vite environment)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // Always use direct URL, can be overridden by env variable
    API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.safeddara.tj/api/v1';
  }
} catch (e) {
  API_BASE_URL = 'https://api.safeddara.tj/api/v1';
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = false,
    isRetry: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add session header if required
    if (requiresAuth) {
      if (isSessionExpired()) {
        try {
          // Dynamic import to avoid circular dependency
          const { usersApi } = await import('./users');
          const refreshResponse = await usersApi.refreshSession();
          if (refreshResponse.success && refreshResponse.data && typeof refreshResponse.data === 'object') {
            const auth = (refreshResponse.data as any).auth;
            if (auth && auth.session && auth.expiresAt) {
              saveAuth(auth.session, auth.expiresAt);
            }
          }
        } catch (refreshError) {
          throw new Error('Session expired and refresh failed');
        }
      }
      
      const sessionId = getSessionId();
      if (sessionId) {
        headers['X-Session-ID'] = sessionId;
      } else {
        throw new Error('Session ID is required for this request');
      }
    }


    try {
      // Add timeout to fetch request (60 seconds to match proxy timeout)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000);
      
      // Log request details for POST/PUT requests
      if ((options.method === 'POST' || options.method === 'PUT') && options.body) {
        try {
          const requestBody = JSON.parse(options.body as string);
          console.log('[API Request Body]', {
            url,
            method: options.method,
            headers: Object.fromEntries(Object.entries(headers)),
            body: requestBody,
            bodyString: options.body,
          });
        } catch (e) {
          console.error('[API Request Body Parse Error]', {
            url,
            method: options.method,
            body: options.body,
            error: e,
          });
        }
      }
      
      let response: Response;
      try {
        response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });
      } catch (fetchError: any) {
        // Clear timeout if fetch fails
        clearTimeout(timeoutId);
        
        // Handle AbortError specifically
        if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
          console.error('[API] Request was aborted:', {
            url,
            reason: fetchError.message || 'Request timeout (60 seconds)',
          });
          throw {
            success: false,
            message: 'Запрос превысил время ожидания. Пожалуйста, проверьте подключение к интернету и попробуйте снова.',
          } as ApiErrorResponse;
        }
        // Re-throw other fetch errors
        throw fetchError;
      }
      
      // Clear timeout on successful fetch
      clearTimeout(timeoutId);


      // Handle non-JSON responses (e.g., barcode image)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('image/')) {
        // This shouldn't happen in request() - images should use getRaw()
        // But handle it just in case
        return {
          success: true,
          message: 'Success',
          data: response as any,
        };
      }

      // Read response body once
      let data;
      let responseText = '';
      try {
        const text = await response.text();
        responseText = text;
        
        if (text.trim().startsWith('<html>') || text.trim().startsWith('<!DOCTYPE')) {
          const titleMatch = text.match(/<title>(.*?)<\/title>/i);
          const errorMsg = titleMatch ? titleMatch[1] : 'Server error';
          
          throw {
            success: false,
            message: errorMsg,
          } as ApiErrorResponse;
        }
        
        // Try to parse as JSON
        if (text.trim()) {
          try {
            data = JSON.parse(text);
            // Log parsed response for debugging
            console.log('[API Response Parsed]', {
              url,
              status: response.status,
              data,
              dataType: Array.isArray(data) ? 'array' : typeof data,
              isEmpty: typeof data === 'object' && data !== null && Object.keys(data).length === 0,
            });
          } catch (parseError) {
            console.error('[API Parse Error]', {
              url,
              status: response.status,
              text: text.substring(0, 500),
              textLength: text.length,
              error: parseError,
            });
            throw {
              success: false,
              message: 'Invalid server response',
            } as ApiErrorResponse;
          }
        } else {
          // Empty response - log this case
          console.warn('[API Empty Response Text]', {
            url,
            status: response.status,
            contentType: response.headers.get('content-type'),
            textLength: text.length,
            text: text,
          });
          data = {};
        }
      } catch (readError: any) {
        if (readError.success === false) {
          throw readError;
        }
        throw {
          success: false,
          message: 'Failed to read server response',
        } as ApiErrorResponse;
      }


      if (!response.ok) {
        // Handle error responses
        // Try to extract detailed error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Swagger says error responses are arrays: "schema": {"type": "array", "items": {"$ref": "#/definitions/handler.ErrorResponse"}}
        if (Array.isArray(data) && data.length > 0) {
          // Handle array of error responses
          const firstError = data[0];
          if (firstError && typeof firstError === 'object') {
            if (firstError.message) {
              errorMessage = firstError.message;
            } else if (firstError.error) {
              errorMessage = firstError.error;
            }
          }
        } else if (data && typeof data === 'object') {
          // Handle single error object
          if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (Object.keys(data).length === 0) {
            // Empty object - server didn't provide error details
            errorMessage = `Server returned empty error response (status ${response.status}). Check request format.`;
          }
        }
        
        const error: ApiErrorResponse = {
          success: false,
          message: errorMessage,
        };

        console.error('[API Error Response]', {
          url,
          status: response.status,
          statusText: response.statusText,
          error,
          responseData: data,
          responseText: responseText.substring(0, 500), // First 500 chars
          fullResponse: JSON.stringify(data, null, 2),
          headers: Object.fromEntries(response.headers.entries()),
          contentType: response.headers.get('content-type'),
          isEmpty: Object.keys(data).length === 0,
        });
        
        // If response is empty, log raw response text
        if (Object.keys(data).length === 0 && responseText) {
          console.error('[API Empty Response Body]', {
            url,
            status: response.status,
            rawText: responseText,
            textLength: responseText.length,
          });
        }

        if (response.status === 401 && requiresAuth && !isRetry) {
          try {
            const { usersApi } = await import('./users');
            const refreshResponse = await usersApi.refreshSession();
            
            if (refreshResponse.success && refreshResponse.data && typeof refreshResponse.data === 'object') {
              const auth = (refreshResponse.data as any).auth;
              if (auth && auth.session && auth.expiresAt) {
                saveAuth(auth.session, auth.expiresAt);
                return this.request<T>(endpoint, options, requiresAuth, true);
              }
            }
          } catch (refreshError) {
            // Silent fail
          }
          
          // If refresh failed, clear session and redirect
          clearSession();
          if (typeof window !== 'undefined' && window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }

        throw error;
      }

      // Handle array responses (Swagger returns arrays for some endpoints)
      if (Array.isArray(data)) {
        // Check if it's an array of Response objects
        if (data.length > 0 && typeof data[0] === 'object' && 'success' in data[0]) {
          // Return first response if array of responses
          return data[0] as ApiResponse<T>;
        }
        return {
          success: true,
          message: 'Success',
          data: data as T,
        };
      }

      // Handle standard response format
      // Check if data already has success field (standard response)
      if (typeof data === 'object' && data !== null && 'success' in data) {
        // Extract data from response if present, otherwise return whole object
        const response = data as ApiResponse<T>;
        return response;
      }

      // Wrap in standard response format
      return {
        success: true,
        message: 'Success',
        data: data as T,
      };
    } catch (error: any) {
      console.error('[API Error]', error.message || error);

      if (error.success === false) {
        throw error;
      }
      
      throw {
        success: false,
        message: error.message || 'Network error occurred',
      } as ApiErrorResponse;
    }
  }

  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, requiresAuth);
  }

  async post<T>(
    endpoint: string,
    body?: any,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    // Log request body for debugging
    if (body) {
      console.log('[API POST Request]', {
        endpoint,
        body: JSON.parse(JSON.stringify(body)), // Clone to avoid mutation
      });
    }
    
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      requiresAuth
    );
  }

  /**
   * Get raw response (for binary data like images)
   */
  async getRaw(endpoint: string, requiresAuth: boolean = false): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {};

    if (requiresAuth) {
      const sessionId = getSessionId();
      if (sessionId) {
        headers['X-Session-ID'] = sessionId;
      } else {
        throw new Error('Session ID is required for this request');
      }
    }

    // Add timeout to fetch request (60 seconds to match proxy timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000);
    
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      // Clear timeout if fetch fails
      clearTimeout(timeoutId);
      
      // Handle AbortError specifically
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
        throw new Error('Запрос превысил время ожидания. Пожалуйста, проверьте подключение к интернету и попробуйте снова.');
      }
      // Re-throw other fetch errors
      throw fetchError;
    }
    
    // Clear timeout on successful fetch
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        clearSession();
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }
}

// Create apiClient instance
export const apiClient = new ApiClient(API_BASE_URL);
