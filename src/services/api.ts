import { Platform } from 'react-native';

// Network configuration
const NETWORK_CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000,
};

// Helper function to check if we're in development
const isDevelopment = () => {
  return __DEV__;
};

// Helper function to get the correct API base URL
const getApiBaseUrl = () => {
  if (isDevelopment()) {
    // iOS simulator: localhost; Android emulator: 10.0.2.2
    const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    return `http://${host}:4000/api/v1`;
  }
  return 'https://api.nearmate.com/api/v1';
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
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
    console.log('🌐 API Client initialized with base URL:', this.baseUrl);
  }

  setToken(token: string) {
    this.accessToken = token;
  }

  hasToken(): boolean {
    return !!this.accessToken;
  }

  clearToken() {
    this.accessToken = null;
  }

  // Update base URL (useful for testing different endpoints)
  updateBaseUrl(newUrl: string) {
    this.baseUrl = newUrl;
    console.log('🔄 API base URL updated to:', this.baseUrl);
  }

  private async request(endpoint: string, options: RequestInit = {}) {
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
      const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
    
    if (response.accessToken) {
      this.setToken(response.accessToken);
    }
    
    return response;
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
}

export const apiClient = new ApiClient();
export default apiClient;
