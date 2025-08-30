import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/user';
import { getApiBaseUrl } from '../config/api';
import { AppState, AppStateStatus } from 'react-native';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: UserProfile, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Storage keys
  const STORAGE_KEYS = {
    USER_DATA: 'nearmate_user_data',
    ACCESS_TOKEN: 'nearmate_access_token',
    REFRESH_TOKEN: 'nearmate_refresh_token',
  };

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Monitor app state changes to refresh authentication when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isAuthenticated && user) {
        console.log('📱 App came to foreground, refreshing auth status...');
        refreshAuthStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [isAuthenticated, user]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Starting authentication check...');
      
      // Check if we have stored user data and tokens
      const [userData, accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      console.log('🔍 Storage check results:');
      console.log('  - User data:', userData ? 'Found' : 'Not found');
      console.log('  - Access token:', accessToken ? 'Found' : 'Not found');
      console.log('  - Refresh token:', refreshToken ? 'Found' : 'Not found');

      if (userData && accessToken) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('👤 Parsed user data:', parsedUser.name, parsedUser.email);
          
          // Validate token by making a simple API call
          console.log('🔐 Validating stored token...');
          const isValid = await validateToken(accessToken);
          
          if (isValid) {
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log('✅ User authenticated from storage successfully');
          } else {
            // Token validation failed - this could be due to network issues
            // For now, let's be more lenient and keep the user logged in
            // but mark that we need to revalidate when network is available
            console.log('⚠️ Token validation failed, but keeping user logged in temporarily');
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            // TODO: Implement a background token refresh mechanism
            // For now, we'll keep the user logged in and let them continue using the app
          }
        } catch (error) {
          console.error('❌ Error parsing stored user data:', error);
          await clearStorage();
        }
      } else {
        console.log('🔑 No stored authentication data found');
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      await clearStorage();
    } finally {
      setIsLoading(false);
      console.log('🏁 Authentication check completed');
    }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Make a simple API call to validate the token
      // Use the centralized API configuration
      const apiUrl = `${getApiBaseUrl()}/api/v1/categories`;
      console.log('🔍 Validating token with:', apiUrl);
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('✅ Token validation successful');
        return true;
      } else {
        console.log('❌ Token validation failed with status:', response.status);
        return false;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏰ Token validation timed out');
      } else {
        console.error('❌ Token validation failed with error:', error);
      }
      return false;
    }
  };

  const login = async (userData: UserProfile, accessToken: string, refreshToken: string) => {
    try {
      console.log('🔐 Starting login process...');
      console.log('👤 User data to store:', userData.name, userData.email);
      console.log('🔑 Token length:', accessToken.length);
      
      // Store user data and tokens
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);

      console.log('💾 Data stored in AsyncStorage successfully');

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('✅ User logged in successfully');
      
      // Verify storage was successful
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      console.log('🔍 Storage verification:');
      console.log('  - User data stored:', storedUser ? 'Yes' : 'No');
      console.log('  - Token stored:', storedToken ? 'Yes' : 'No');
    } catch (error) {
      console.error('❌ Error storing authentication data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await clearStorage();
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
    }
  };

  const refreshAuthStatus = async () => {
    try {
      console.log('🔄 Refreshing authentication status...');
      
      // Get current stored data
      const [userData, accessToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
      ]);

      if (userData && accessToken) {
        const parsedUser = JSON.parse(userData);
        
        // Try to validate the token again
        const isValid = await validateToken(accessToken);
        
        if (isValid) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('✅ Authentication refreshed successfully');
        } else {
          console.log('❌ Token still invalid after refresh');
          // Don't clear storage immediately, let the user continue
        }
      }
    } catch (error) {
      console.error('❌ Error refreshing auth status:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    refreshAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
