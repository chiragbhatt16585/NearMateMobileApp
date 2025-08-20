# Network Request Failed - Troubleshooting Guide

## 🚨 Error: "Network request failed"

This error occurs when your React Native app cannot connect to your NearMate backend API.

## 🔍 Quick Diagnosis

### 1. Check Console Logs
Look for these messages in your console:
- `🌐 API Client initialized with base URL: http://localhost:4000/api/v1`
- `🔍 Testing API connection...`
- `❌ API request failed: Network error - cannot connect to...`

### 2. Check Backend Status
Ensure your backend is running:
```bash
# Check if port 4000 is in use
lsof -i :4000

# Or check with netstat
netstat -an | grep 4000
```

## 🛠️ Step-by-Step Solutions

### Solution 1: Start Your Backend Server

1. **Navigate to your backend directory**
   ```bash
   cd /path/to/your/nearmate-backend
   ```

2. **Start the server**
   ```bash
   npm start
   # or
   yarn start
   # or
   node server.js
   ```

3. **Verify it's running**
   - Open browser: `http://localhost:4000/api/v1/categories`
   - Should see JSON response or API documentation

### Solution 2: Check IP Address Configuration

The app is configured to use `localhost:4000`, but this might not work depending on your setup:

#### For iOS Simulator:
- ✅ `localhost:4000` should work
- ✅ `127.0.0.1:4000` should work

#### For Android Emulator:
- ❌ `localhost:4000` won't work
- ✅ `10.0.2.2:4000` should work (Android emulator localhost)
- ✅ Your computer's IP address should work

#### For Physical Device:
- ❌ `localhost:4000` won't work
- ✅ Your computer's IP address should work

### Solution 3: Update API Base URL

If you need to change the IP address, update the API configuration:

```typescript
// In src/services/api.ts, update this line:
const getApiBaseUrl = () => {
  if (isDevelopment()) {
    // Change this to your computer's IP address
    return 'http://192.168.1.100:4000/api/v1'; // Replace with your IP
  }
  return 'https://api.nearmate.com/api/v1';
};
```

**To find your computer's IP address:**
```bash
# On Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows
ipconfig | findstr "IPv4"
```

### Solution 4: Test API Endpoints Manually

1. **Test with curl:**
   ```bash
   curl http://localhost:4000/api/v1/categories
   ```

2. **Test with Postman:**
   - URL: `http://localhost:4000/api/v1/categories`
   - Method: GET
   - Should return JSON data

3. **Test in browser:**
   - Navigate to: `http://localhost:4000/api/v1/categories`
   - Should see JSON response

### Solution 5: Check Firewall and Network

1. **Check if port 4000 is blocked:**
   ```bash
   # Test if port is accessible
   telnet localhost 4000
   ```

2. **Check firewall settings:**
   - Ensure port 4000 is allowed
   - Check if antivirus is blocking the connection

3. **Check network configuration:**
   - Ensure both app and backend are on same network
   - Check for VPN conflicts

## 🔧 Advanced Configuration

### Environment-Specific URLs

You can create different configurations for different environments:

```typescript
// src/config/api.ts
export const getApiConfig = () => {
  if (__DEV__) {
    // Development - use your computer's IP
    return {
      BASE_URL: 'http://192.168.1.100:4000/api/v1', // Your IP here
    };
  }
  
  // Production
  return {
    BASE_URL: 'https://api.nearmate.com/api/v1',
  };
};
```

### Multiple Backend URLs

For testing different backends:

```typescript
// In your HomeScreen or App.tsx
import { apiClient } from '../services/api';

// Test different URLs
const testUrls = [
  'http://localhost:4000/api/v1',
  'http://127.0.0.1:4000/api/v1',
  'http://10.0.2.2:4000/api/v1', // Android emulator
  'http://192.168.1.100:4000/api/v1', // Your computer's IP
];

const testConnection = async () => {
  for (const url of testUrls) {
    console.log(`Testing ${url}...`);
    apiClient.updateBaseUrl(url);
    const isConnected = await apiClient.testConnection();
    if (isConnected) {
      console.log(`✅ Connected to ${url}`);
      return url;
    }
  }
  console.log('❌ No working connection found');
  return null;
};
```

## 📱 Testing Steps

### 1. Start Backend
```bash
cd your-backend-directory
npm start
```

### 2. Verify Backend is Running
```bash
curl http://localhost:4000/api/v1/categories
# Should return JSON data
```

### 3. Test in App
- Open your React Native app
- Check console for connection logs
- Look for the categories loading

### 4. Check Error Messages
- If still failing, check the detailed error message
- Look for specific network details

## 🆘 Still Having Issues?

### Check These Common Problems:

1. **Backend not running on port 4000**
2. **Wrong IP address in configuration**
3. **Firewall blocking port 4000**
4. **Backend running on different port**
5. **CORS issues (if testing in browser)**
6. **Network configuration conflicts**

### Debug Commands:

```bash
# Check what's using port 4000
lsof -i :4000

# Test network connectivity
ping localhost
ping 127.0.0.1

# Check if backend responds
curl -v http://localhost:4000/api/v1/categories
```

### Get Help:

1. **Check console logs** for detailed error messages
2. **Verify backend is running** and accessible
3. **Test API endpoints manually** with curl/Postman
4. **Check network configuration** and IP addresses

---

**Remember**: The most common cause is that your backend server isn't running or is running on a different port/IP address than expected.
