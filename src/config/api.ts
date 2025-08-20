export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: 'http://localhost:4000/api/v1',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
    },
    CATEGORIES: {
      LIST: '/categories',
    },
    PARTNERS: {
      LIST: '/partners',
      GET: (id: string) => `/partners/${id}`,
      CREATE: '/partners',
      UPDATE: (id: string) => `/partners/${id}`,
      DELETE: (id: string) => `/partners/${id}`,
      KYC: {
        LIST: (partnerId: string) => `/partners/${partnerId}/kyc`,
        CREATE: (partnerId: string) => `/partners/${partnerId}/kyc`,
        UPDATE: (partnerId: string, kycId: string) => `/partners/${partnerId}/kyc/${kycId}`,
        DELETE: (partnerId: string, kycId: string) => `/partners/${partnerId}/kyc/${kycId}`,
      },
    },
    USERS: {
      LIST: '/users',
      GET: (id: string) => `/users/${id}`,
      CREATE: '/users',
      UPDATE: (id: string) => `/users/${id}`,
      DELETE: (id: string) => `/users/${id}`,
    },
    ITEMS: {
      LIST: '/items',
      CREATE: '/items',
      UPDATE: (id: string) => `/items/${id}`,
      DELETE: (id: string) => `/items/${id}`,
    },
  },
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Timeout settings
  TIMEOUT: 10000, // 10 seconds
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Environment-specific configurations
export const getApiConfig = () => {
  if (__DEV__) {
    // Development environment
    return {
      ...API_CONFIG,
      BASE_URL: 'http://localhost:4000/api/v1',
    };
  } else {
    // Production environment
    return {
      ...API_CONFIG,
      BASE_URL: 'https://api.nearmate.com/api/v1',
    };
  }
};
