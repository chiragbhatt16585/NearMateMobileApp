import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LocationInfo, Location } from '../services/locationService';
import locationService from '../services/locationService';

interface LocationContextType {
  locationInfo: LocationInfo | null;
  isLoading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
  hasPermission: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Check location permission and get initial location
  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📍 Initializing location service...');
      
      // Check if locationService is available
      if (!locationService) {
        console.error('❌ LocationService is not available');
        setError('Location service not available');
        setIsLoading(false);
        return;
      }
      
      // Check permission first
      const permissionGranted = await locationService.checkLocationPermission();
      setHasPermission(permissionGranted);
      
      if (!permissionGranted) {
        setError('Location permission not granted');
        setIsLoading(false);
        return;
      }

      // Try to get cached location first
      const cachedLocation = locationService.getCachedLocation();
      if (cachedLocation) {
        console.log('📍 Using cached location');
        setLocationInfo({ location: cachedLocation });
        setIsLoading(false);
      }

      // Get fresh location with address
      await refreshLocation();
      
    } catch (err: any) {
      console.error('❌ Error initializing location:', err);
      setError(err.message || 'Failed to initialize location');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Refreshing location...');
      
      // Check if locationService is available
      if (!locationService) {
        console.error('❌ LocationService is not available');
        setError('Location service not available');
        setIsLoading(false);
        return;
      }
      
      const newLocationInfo = await locationService.getLocationWithAddress();
      setLocationInfo(newLocationInfo);
      
      console.log('✅ Location refreshed successfully:', newLocationInfo);
      
    } catch (err: any) {
      console.error('❌ Error refreshing location:', err);
      setError(err.message || 'Failed to refresh location');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: LocationContextType = {
    locationInfo,
    isLoading,
    error,
    refreshLocation,
    hasPermission,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
