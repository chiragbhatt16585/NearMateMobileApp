# NearMate Mobile App - API Integration Guide

## Overview

The NearMate mobile app has been updated to integrate with the NearMate backend API. The app now fetches real data from the API instead of using hardcoded mock data.

## API Configuration

### Base URL
- **Development**: `http://localhost:4000/api/v1`
- **Production**: `https://api.nearmate.com/api/v1`

### Authentication
The app uses Bearer token authentication. When a user logs in, the access token is stored and automatically included in subsequent API requests.

## Key Features

### 1. Dynamic Service Categories
- Categories are fetched from `/categories` endpoint
- Popular categories are displayed on the home screen
- All categories are available in the "View all services" section

### 2. Real-time Service Providers
- Partners are fetched from `/partners` endpoint
- Filtered by selected service category
- Shows real partner information including:
  - Name, phone, email
  - Service categories
  - Pricing (hourly/fixed)
  - Availability status
  - Plan details
  - KYC verification status

### 3. Fallback to Mock Data
- If the API is unavailable, the app gracefully falls back to mock data
- This ensures the app remains functional even during API downtime
- Users can retry API calls with a "Retry" button

## API Integration Points

### HomeScreen
- Fetches popular categories from API
- Displays dynamic service grid
- Handles search functionality

### AllCategoriesScreen
- Fetches all available categories
- Shows loading states and error handling
- Provides retry functionality

### ServiceListScreen
- Fetches partners filtered by category
- Displays partner cards with real data
- Shows availability and pricing information

### ProviderProfileScreen
- Displays detailed partner information
- Shows KYC verification status
- Lists all services offered by the partner

## Error Handling

The app includes comprehensive error handling:

1. **Network Errors**: Shows user-friendly error messages
2. **API Errors**: Displays specific error messages from the backend
3. **Fallback Data**: Uses mock data when API fails
4. **Retry Mechanism**: Users can retry failed requests
5. **Loading States**: Shows loading indicators during API calls

## Configuration

### Environment Variables
The API configuration automatically switches between development and production based on the build environment:

```typescript
// Development (localhost)
BASE_URL: 'http://localhost:4000/api/v1'

// Production
BASE_URL: 'https://api.nearmate.com/api/v1'
```

### Customization
You can modify the API configuration in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'your-api-url',
  TIMEOUT: 15000, // 15 seconds
  MAX_RETRIES: 5,
  // ... other settings
};
```

## Testing the Integration

### 1. Start the Backend
Ensure your NearMate backend is running on `http://localhost:4000`

### 2. Test Authentication
Use the provided test credentials:
- Email: `admin@nearmate.local`
- Password: `admin123`

### 3. Verify Data Flow
1. Open the app
2. Navigate to "View all services"
3. Select a service category
4. View the list of providers
5. Check that real data is displayed

### 4. Test Error Handling
1. Stop the backend server
2. Try to navigate to services
3. Verify that fallback data is shown
4. Check that retry functionality works

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | User authentication |
| `/categories` | GET | Fetch service categories |
| `/partners` | GET | Fetch service providers |
| `/partners/{id}` | GET | Fetch specific provider |
| `/partners/{id}/kyc` | GET | Fetch provider KYC documents |

## Data Models

The app uses TypeScript interfaces that match the API response structure:

- `ServiceCategory`: Service categories with icons and popularity
- `Partner`: Service provider information
- `PartnerKyc`: KYC verification details
- `PartnerBank`: Banking information

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend is running
   - Verify the API URL in configuration
   - Check network connectivity

2. **Authentication Errors**
   - Verify login credentials
   - Check token expiration
   - Ensure proper authorization headers

3. **Data Not Loading**
   - Check API response format
   - Verify data structure matches interfaces
   - Check console for error messages

### Debug Mode

Enable debug logging by setting:

```typescript
// In src/services/api.ts
const DEBUG = true;

if (DEBUG) {
  console.log('API Request:', endpoint, options);
  console.log('API Response:', response);
}
```

## Future Enhancements

1. **Offline Support**: Cache API responses for offline use
2. **Real-time Updates**: WebSocket integration for live data
3. **Push Notifications**: Booking updates and reminders
4. **Analytics**: Track API usage and performance
5. **Rate Limiting**: Implement request throttling

## Support

For API integration issues:
1. Check the console logs for error details
2. Verify API endpoint responses
3. Test with Postman or similar tools
4. Check backend server logs

---

**Note**: This integration maintains backward compatibility with the existing app structure while adding real-time data capabilities.
