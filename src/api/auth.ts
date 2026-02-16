// Authentication and session management

const DEVICE_TOKEN_KEY = 'safeddara_device_token';
const SESSION_KEY = 'safeddara_session';
const EXPIRES_AT_KEY = 'safeddara_expires_at';

/**
 * Generate or retrieve device token
 * UUID is generated on first use and stored in localStorage
 */
export function getDeviceToken(): string {
  // Check if localStorage is available (browser environment)
  if (typeof window === 'undefined' || !window.localStorage) {
    // Fallback for SSR or non-browser environments
    return 'temp-device-token-' + Math.random().toString(36).substring(7);
  }
  
  let deviceToken = localStorage.getItem(DEVICE_TOKEN_KEY);
  
  if (!deviceToken) {
    // Use crypto.randomUUID() if available, otherwise fallback to manual UUID generation
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceToken = crypto.randomUUID();
    } else {
      // Fallback UUID v4 generation
      deviceToken = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    localStorage.setItem(DEVICE_TOKEN_KEY, deviceToken);
  }
  
  return deviceToken;
}

/**
 * Get current session ID
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Save session and expiration time
 */
export function saveAuth(session: string, expiresAt: string | Date): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  localStorage.setItem(SESSION_KEY, session);
  const expiresAtString = expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt;
  localStorage.setItem(EXPIRES_AT_KEY, expiresAtString);
}

/**
 * Set session ID (backward compatibility)
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  localStorage.setItem(SESSION_KEY, sessionId);
  // Try to get expiresAt from existing session if available
  const existingExpires = localStorage.getItem(EXPIRES_AT_KEY);
  if (!existingExpires) {
    // Set default expiration (40 minutes from now, matching API default)
    const expiresAt = new Date(Date.now() + 40 * 60 * 1000);
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString());
  }
}

/**
 * Check if session is expired
 */
export function isSessionExpired(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return true;
  }
  
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
  if (!expiresAt) {
    return true;
  }
  
  return new Date(expiresAt) <= new Date();
}

/**
 * Clear session and device token
 */
export function clearSession(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  // Optionally clear device token on logout
  // localStorage.removeItem(DEVICE_TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const session = getSessionId();
  if (!session) {
    return false;
  }
  // Check if session is expired
  return !isSessionExpired();
}
