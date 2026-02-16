// Authentication Context

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSessionId, saveAuth, clearSession, isAuthenticated } from '../../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Safely initialize auth state
  const [authState, setAuthState] = useState(() => {
    try {
      return {
        isAuthenticated: isAuthenticated(),
        isLoading: false,
      };
    } catch (error) {
      // Fallback if isAuthenticated fails
      return {
        isAuthenticated: false,
        isLoading: false,
      };
    }
  });

  const login = async (password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { getDeviceToken } = await import('../../api/auth');
      const { usersApi } = await import('../../api/users');
      const deviceToken = getDeviceToken();
      const response = await usersApi.login({
        deviceToken,
        password,
      });

      // API returns {"auth": {"session": "...", "expiresAt": "..."}}
      if (response.success && response.data && typeof response.data === 'object') {
        const auth = (response.data as any).auth;
        if (auth && auth.session) {
          saveAuth(auth.session, auth.expiresAt || new Date(Date.now() + 40 * 60 * 1000));
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          throw new Error(response.message || 'Login failed - no session in response');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    clearSession();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const refreshSession = async () => {
    if (!isAuthenticated()) return;

    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { usersApi } = await import('../../api/users');
      const response = await usersApi.refreshSession();
      // API returns {"auth": {"session": "...", "expiresAt": "..."}}
      if (response.success && response.data && typeof response.data === 'object') {
        const auth = (response.data as any).auth;
        if (auth && auth.session) {
          saveAuth(auth.session, auth.expiresAt || new Date(Date.now() + 40 * 60 * 1000));
          setAuthState(prev => ({ ...prev, isLoading: false }));
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  // Check session on mount (use isAuthenticated to respect expiration)
  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: isAuthenticated(),
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
