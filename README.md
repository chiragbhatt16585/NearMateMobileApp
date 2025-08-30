# NearMate Mobile App

A React Native mobile application for hyper-local services with automatic authentication and modern UI.

## Features

### 🔐 Automatic Authentication
- **Token Persistence**: Access tokens are automatically stored and retrieved from device storage
- **Auto-refresh**: Expired tokens are automatically refreshed using refresh tokens
- **Development Auto-login**: Automatic login with dev credentials for seamless development
- **Session Management**: App remembers your login state across app restarts

### 🏠 Core Screens
- **Home**: Popular service categories, search, and quick access
- **Explore**: Browse available services
- **Bookings**: View and manage your service bookings
- **Account**: User profile and settings
- **Vendor**: Switch to vendor mode for service providers

### 🎨 Design Features
- Light/dark theme support
- Consistent header with logo across all screens
- Modern card-based UI design
- Responsive bottom tab navigation

## Development Setup

### Prerequisites
- Node.js 16+
- React Native CLI
- iOS Simulator (for iOS development)
- Android Emulator (for Android development)

### Installation
```bash
npm install
cd ios && pod install && cd ..
```

### Running the App
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

### API Configuration
The app automatically connects to your local NearMate backend:

1. **Start your backend server** on `localhost:4000`
2. **Enable dev auth** in `src/config/apiAuth.ts`:
   ```typescript
   export const DEV_AUTH = {
     enabled: true,
     email: 'admin@nearmate.local',
     password: 'admin123',
   };
   ```

### Auto-Login Features
- **Token Storage**: Uses AsyncStorage to persist authentication tokens
- **Automatic Refresh**: Handles token expiration seamlessly
- **Development Mode**: Automatically logs in with dev credentials
- **Error Handling**: Graceful fallback to login screen when needed

## API Integration

The app integrates with the NearMate API for:
- Service categories
- Service providers/partners
- User authentication
- Booking management

### Network Configuration
- **Development**: Automatically detects platform (localhost for iOS, 10.0.2.2 for Android)
- **Production**: Configurable production endpoints
- **Timeout**: 10-second request timeout with retry logic

## Troubleshooting

### Common Issues
1. **Network Connection**: Ensure your backend is running on localhost:4000
2. **Authentication**: Check dev credentials in `src/config/apiAuth.ts`
3. **Token Issues**: Clear app storage if experiencing auth problems

### Debug Commands
```bash
# Test API connection
curl -X GET http://localhost:4000/api/v1/categories

# Check authentication
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nearmate.local","password":"admin123"}'
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens and pages
├── services/           # API client and business logic
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## Contributing

1. Follow the existing code style
2. Test on both iOS and Android
3. Ensure all API calls handle errors gracefully
4. Update documentation for new features
