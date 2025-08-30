import { Platform, PermissionsAndroid } from 'react-native';

// Import Geolocation with error handling
let Geolocation: any;
try {
  Geolocation = require('@react-native-community/geolocation').default;
  console.log('✅ Geolocation imported successfully');
} catch (error) {
  console.error('❌ Failed to import Geolocation:', error);
  Geolocation = null;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface LocationInfo {
  location: Location;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  formattedAddress?: string;
}

class LocationService {
  private currentLocation: Location | null = null;
  private locationPermissionGranted: boolean = false;

  constructor() {
    console.log('📍 LocationService constructor called');
    // Don't call async methods in constructor - they will be called when needed
  }

  /**
   * Check and request location permissions
   */
  async checkLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // iOS permissions are handled in Info.plist
        this.locationPermissionGranted = true;
        return true;
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'NearMate needs access to your location to show nearby services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        this.locationPermissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        return this.locationPermissionGranted;
      }
      return false;
    } catch (error) {
      console.error('❌ Error checking location permission:', error);
      return false;
    }
  }

  /**
   * Get current location with timeout and accuracy options
   */
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!this.locationPermissionGranted) {
        reject(new Error('Location permission not granted'));
        return;
      }

      if (!Geolocation) {
        reject(new Error('Geolocation service not available'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds
        maximumAge: 10000, // 10 seconds
      };

      Geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          
          this.currentLocation = location;
          console.log('📍 Current location obtained:', location);
          resolve(location);
        },
        (error) => {
          console.error('❌ Error getting current location:', error);
          reject(new Error(`Failed to get location: ${error.message}`));
        },
        options
      );
    });
  }

  /**
   * Get location with address information using reverse geocoding
   */
  async getLocationWithAddress(): Promise<LocationInfo> {
    try {
      const location = await this.getCurrentLocation();
      
      // Try to get address information using reverse geocoding
      const addressInfo = await this.reverseGeocode(location);
      
      return {
        location,
        ...addressInfo,
      };
    } catch (error) {
      console.error('❌ Error getting location with address:', error);
      throw error;
    }
  }

  /**
   * Reverse geocoding to get address from coordinates
   */
  private async reverseGeocode(location: Location): Promise<{
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    formattedAddress?: string;
  }> {
    try {
      // Using a free reverse geocoding service (OpenStreetMap Nominatim)
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        console.log('⚠️ Reverse geocoding failed, using coordinates only');
        return {};
      }

      const address = data.display_name;
      const city = data.address?.city || data.address?.town || data.address?.village;
      const state = data.address?.state;
      const country = data.address?.country;
      
      const formattedAddress = [city, state, country].filter(Boolean).join(', ');
      
      console.log('🏠 Address obtained:', { address, city, state, country, formattedAddress });
      
      return {
        address,
        city,
        state,
        country,
        formattedAddress,
      };
    } catch (error) {
      console.error('❌ Reverse geocoding failed:', error);
      return {};
    }
  }

  /**
   * Get cached location if available
   */
  getCachedLocation(): Location | null {
    return this.currentLocation;
  }

  /**
   * Check if location permission is granted
   */
  isLocationPermissionGranted(): boolean {
    return this.locationPermissionGranted;
  }

  /**
   * Calculate distance between two locations in kilometers
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Watch location changes (for real-time updates)
   */
  watchLocation(
    onLocationChange: (location: Location) => void,
    onError?: (error: Error) => void
  ): number {
    if (!this.locationPermissionGranted) {
      if (onError) {
        onError(new Error('Location permission not granted'));
      }
      return -1;
    }

    if (!Geolocation) {
      if (onError) {
        onError(new Error('Geolocation service not available'));
      }
      return -1;
    }

    const options = {
      enableHighAccuracy: true,
      distanceFilter: 10, // Update every 10 meters
      interval: 5000, // Update every 5 seconds
    };

    return Geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        
        this.currentLocation = location;
        onLocationChange(location);
      },
      (error) => {
        console.error('❌ Error watching location:', error);
        if (onError) {
          onError(new Error(`Location watch failed: ${error.message}`));
        }
      },
      options
    );
  }

  /**
   * Stop watching location
   */
  stopWatchingLocation(watchId: number): void {
    if (watchId > 0 && Geolocation) {
      Geolocation.clearWatch(watchId);
    }
  }
}

// Create a singleton instance
const locationServiceInstance = new LocationService();

export const locationService = locationServiceInstance;
export default locationServiceInstance;
