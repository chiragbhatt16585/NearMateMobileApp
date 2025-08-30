// API Configuration
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URLS: {
    development: 'http://192.168.0.102:5174',  // Use your local IP for mobile testing
    staging: 'https://staging-api.nearmate.com',
    production: 'https://api.nearmate.com',
  },
  
  // API version
  VERSION: 'v1',
  
  // Swagger documentation URL
  SWAGGER_URL: 'http://localhost:4000/api/docs',
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      REQUEST_OTP: '/api/v1/auth/request-otp',
      CHECK_MOBILE_EXISTS: '/api/v1/auth/check-mobile-exists',
      VERIFY_OTP_LOGIN: '/api/v1/auth/verify-otp-login',
      VERIFY_OTP_REGISTER: '/api/v1/auth/verify-otp-register',
      LOGIN_WITH_MOBILE: '/api/v1/auth/login-with-mobile',
      LOGIN: '/api/v1/auth/login',
      REFRESH: '/api/v1/auth/refresh',
    },
    CATEGORIES: '/api/v1/categories',
    PARTNERS: '/api/v1/partners',
    USERS: '/api/v1/users',
    END_USERS: '/api/v1/end-users',
    ADDRESSES: '/api/v1/end-users',
  },
  
  // Network settings
  NETWORK: {
    TIMEOUT: 10000, // 10 seconds
    RETRIES: 3,
    RETRY_DELAY: 1000,
  },
};

// Helper function to get the current base URL
export const getApiBaseUrl = (): string => {
  // Use local IP for mobile device testing
  return API_CONFIG.BASE_URLS.development;
};



// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${getApiBaseUrl()}${endpoint}`;
};

// Helper function to get auth endpoints
export const getAuthEndpoint = (endpoint: keyof typeof API_CONFIG.ENDPOINTS.AUTH): string => {
  return buildApiUrl(API_CONFIG.ENDPOINTS.AUTH[endpoint]);
};

// Helper function to get Swagger documentation URL
export const getSwaggerUrl = (): string => {
  return API_CONFIG.SWAGGER_URL;
};

/*
📱 URL Usage Guide:

**Current Setting**: Using 192.168.0.102:4000 for mobile device testing

If you ever need to test with different URLs:
- localhost:4000 - Works when testing on same device/network (terminal)
- 192.168.0.102:4000 - Works for mobile devices on same WiFi network
- staging/production - For future environments

The app is now configured to use your local IP for mobile testing.
*/
