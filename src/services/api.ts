import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, API_CONFIG } from '../config/api';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'nearmate_access_token',
  REFRESH_TOKEN: 'nearmate_refresh_token',
  USER_DATA: 'nearmate_user_data',
};

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface ServiceCategory {
  id: string;
  key: string;
  label: string;
  icon?: string;
  tone?: string;
  popular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  loginId?: string;
  status: string;
  serviceRadiusKm: number;
  isAvailable: boolean;
  pricingType?: string;
  priceMin?: number;
  priceMax?: number;
  plan?: string;
  planStatus?: string;
  boostActive: boolean;
  boostStart?: string;
  boostEnd?: string;
  createdAt: string;
  updatedAt: string;
  categories: PartnerCategory[];
  kycs: PartnerKyc[];
  bank?: PartnerBank;
}

export interface PartnerCategory {
  id: string;
  serviceCategory: {
    id: string;
    key: string;
    label: string;
    icon?: string;
  };
}

export interface PartnerKyc {
  id: string;
  partnerId: string;
  idType?: string;
  idNumber?: string;
  docUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerBank {
  id: string;
  partnerId: string;
  accountName?: string;
  accountNo?: string;
  ifsc?: string;
  bankName?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    // Ensure baseUrl includes the API version path
    this.baseUrl = `${getApiBaseUrl()}/api/v1`;
    console.log('🌐 API Client initialized with base URL:', this.baseUrl);
    console.log('🔍 Starting token loading...');
    this.loadStoredTokens();
  }

  // Test method to check if AsyncStorage is working
  async testAsyncStorage(): Promise<boolean> {
    try {
      console.log('🧪 Testing AsyncStorage...');
      const testKey = 'test_storage';
      const testValue = 'test_value_' + Date.now();
      
      await AsyncStorage.setItem(testKey, testValue);
      const retrieved = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);
      
      const success = retrieved === testValue;
      console.log('🧪 AsyncStorage test result:', success);
      return success;
    } catch (error) {
      console.error('🧪 AsyncStorage test failed:', error);
      return false;
    }
  }

  private async loadStoredTokens() {
    try {
      console.log('🔍 Loading stored tokens...');
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
      
      console.log('🔍 Token load results:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken,
        accessTokenLength: accessToken?.length || 0,
        refreshTokenLength: refreshToken?.length || 0
      });
      
      if (accessToken) {
        this.accessToken = accessToken;
        console.log('🔑 Loaded stored access token');
      }
      
      if (refreshToken) {
        this.refreshToken = refreshToken;
        console.log('🔑 Loaded stored refresh token');
      }
    } catch (error) {
      console.error('❌ Failed to load stored tokens:', error);
    }
  }

  private async storeTokens(accessToken: string, refreshToken?: string) {
    try {
      const promises = [AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)];
      if (refreshToken) {
        promises.push(AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken));
      }
      await Promise.all(promises);
      console.log('💾 Tokens stored successfully');
    } catch (error) {
      console.error('❌ Failed to store tokens:', error);
    }
  }

  private async clearStoredTokens() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
      console.log('🗑️ Stored tokens cleared');
    } catch (error) {
      console.error('❌ Failed to clear stored tokens:', error);
    }
  }

  setToken(token: string) {
    this.accessToken = token;
  }

  hasToken(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearToken() {
    this.accessToken = null;
    this.refreshToken = null;
    this.clearStoredTokens();
  }

  // Update base URL (useful for testing different endpoints)
  updateBaseUrl(newUrl: string) {
    this.baseUrl = newUrl;
    console.log('🔄 API base URL updated to:', this.baseUrl);
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    try {
      console.log('🔄 Refreshing access token...');
      
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data: RefreshTokenResponse = await response.json();
      
      if (data.accessToken) {
        this.accessToken = data.accessToken;
        if (data.refreshToken) {
          this.refreshToken = data.refreshToken;
        }
        // Pass plain strings to satisfy types
        await this.storeTokens(data.accessToken, data.refreshToken);
        console.log('✅ Access token refreshed successfully');
        return this.accessToken;
      } else {
        throw new Error('No access token in refresh response');
      }
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error.message);
      this.clearToken();
      throw new Error('Token refresh failed - please login again');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📡 Making API request to:', url);

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.NETWORK.TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401 && retryCount === 0 && this.refreshToken) {
        console.log('🔄 Token expired, attempting refresh...');
        try {
          await this.refreshAccessToken();
          // Retry the request with new token
          return this.request(endpoint, options, retryCount + 1);
        } catch (refreshError) {
          console.error('❌ Token refresh failed, clearing tokens:', refreshError);
          this.clearToken();
          throw new Error('Session expired - please login again');
        }
      }

      if (response.status === 401) {
        this.clearToken();
        throw new Error('Unauthorized - Please login again');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API response received:', { endpoint, status: response.status, dataLength: Array.isArray(data) ? data.length : 'N/A' });
      return data;

    } catch (error: any) {
      console.error('❌ API request failed:', { endpoint, error: error.message });
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server took too long to respond');
      }
      
      if (error.message.includes('Network request failed')) {
        // Try to reconnect automatically
        if (retryCount < API_CONFIG.NETWORK.RETRIES) {
          console.log(`🔄 Network error, retrying... (${retryCount + 1}/${API_CONFIG.NETWORK.RETRIES})`);
          await new Promise<void>(resolve => setTimeout(resolve, API_CONFIG.NETWORK.RETRY_DELAY));
          return this.request(endpoint, options, retryCount + 1);
        }
        throw new Error(`Network error - cannot connect to ${this.baseUrl}. Please check if the server is running.`);
      }
      
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.accessToken && response.refreshToken) {
      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken;
      // Pass plain strings to satisfy types
      await this.storeTokens(response.accessToken, response.refreshToken);
      
      // Store user data
      if (response.user) {
        try {
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        } catch (error) {
          console.error('❌ Failed to store user data:', error);
        }
      }
    }
    
    return response;
  }

  // Auto-login for development
  async autoDevLogin(): Promise<boolean> {
    if (!__DEV__) {
      return false;
    }

    try {
      const { DEV_AUTH } = await import('../config/apiAuth');
      if (DEV_AUTH.enabled) {
        const response = await this.login(DEV_AUTH.email, DEV_AUTH.password);
        console.log('🔑 Auto-login successful for development');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Auto-login failed:', error);
      return false;
    }
  }

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      // Try to make a simple request to verify token is still valid
      await this.request('/categories');
      return true;
    } catch (error: any) {
      if (error.message.includes('Session expired') || error.message.includes('Unauthorized')) {
        return false;
      }
      // For other errors (network, etc.), assume we're still logged in
      return true;
    }
  }

  // Get stored user data
  async getStoredUser(): Promise<any> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Failed to get stored user data:', error);
      return null;
    }
  }

  // Categories
  async getCategories(): Promise<ServiceCategory[]> {
    return this.request('/categories');
  }

  // Partners
  async getPartners(search?: string): Promise<Partner[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/partners${query}`);
  }

  async getPartner(id: string): Promise<Partner> {
    return this.request(`/partners/${id}`);
  }

  async createPartner(partnerData: Partial<Partner>): Promise<Partner> {
    return this.request('/partners', {
      method: 'POST',
      body: JSON.stringify(partnerData),
    });
  }

  async updatePartner(id: string, partnerData: Partial<Partner>): Promise<Partner> {
    return this.request(`/partners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(partnerData),
    });
  }

  async deletePartner(id: string): Promise<void> {
    return this.request(`/partners/${id}`, {
      method: 'DELETE',
    });
  }

  // KYC Management
  async getPartnerKyc(partnerId: string): Promise<PartnerKyc[]> {
    return this.request(`/partners/${partnerId}/kyc`);
  }

  async createKyc(partnerId: string, kycData: Partial<PartnerKyc>): Promise<PartnerKyc> {
    return this.request(`/partners/${partnerId}/kyc`, {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async updateKyc(partnerId: string, kycId: string, kycData: Partial<PartnerKyc>): Promise<PartnerKyc> {
    return this.request(`/partners/${partnerId}/kyc/${kycId}`, {
      method: 'PATCH',
      body: JSON.stringify(kycData),
    });
  }

  async deleteKyc(partnerId: string, kycId: string): Promise<void> {
    return this.request(`/partners/${partnerId}/kyc/${kycId}`, {
      method: 'DELETE',
    });
  }

  // Test connection to the API
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing API connection...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for connection test
      
      const response = await fetch(`${this.baseUrl}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const isConnected = response.ok;
      console.log('🔍 API connection test result:', isConnected ? '✅ Success' : '❌ Failed');
      return isConnected;
    } catch (error: any) {
      console.error('🔍 API connection test failed:', error.message);
      return false;
    }
  }

  // Check connection health and reconnect if needed
  async ensureConnection(): Promise<boolean> {
    try {
      console.log('🔍 Ensuring API connection...');
      
      // First try a simple connection test
      const isConnected = await this.testConnection();
      if (isConnected) {
        console.log('✅ API connection is healthy');
        return true;
      }

      // If not connected, try to refresh tokens if we have them
      if (this.refreshToken) {
        console.log('🔄 Connection lost, attempting token refresh...');
        try {
          await this.refreshAccessToken();
          console.log('✅ Token refresh successful, connection restored');
          return true;
        } catch (refreshError) {
          console.error('❌ Token refresh failed during reconnection:', refreshError);
        }
      }

      // If still not connected, try auto-login
      console.log('🔄 Attempting auto-login to restore connection...');
      try {
        const success = await this.autoDevLogin();
        if (success) {
          console.log('✅ Auto-login successful, connection restored');
          return true;
        }
      } catch (autoLoginError) {
        console.error('❌ Auto-login failed during reconnection:', autoLoginError);
      }

      console.log('❌ Failed to restore API connection');
      return false;
    } catch (error) {
      console.error('❌ Connection health check failed:', error);
      return false;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
