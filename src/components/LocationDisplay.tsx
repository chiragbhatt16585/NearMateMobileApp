import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocation } from '../contexts/LocationContext';

interface LocationDisplayProps {
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  compact?: boolean;
}

export default function LocationDisplay({ 
  onRefresh, 
  showRefreshButton = true, 
  compact = false 
}: LocationDisplayProps) {
  const { locationInfo, isLoading, error, refreshLocation, hasPermission } = useLocation();

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      await refreshLocation();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Getting your location...</Text>
            <ActivityIndicator size="small" color="#007AFF" style={styles.loadingIndicator} />
          </View>
        </View>
      </View>
    );
  }

  if (error || !hasPermission) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>⚠️</Text>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>
              {error || 'Location permission required'}
            </Text>
            <Text style={styles.locationSubtext}>
              {!hasPermission 
                ? 'Please enable location access in settings'
                : 'Unable to get your current location'
              }
            </Text>
          </View>
        </View>
        {showRefreshButton && (
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!locationInfo) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Location not available</Text>
          </View>
        </View>
        {showRefreshButton && (
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const { location, formattedAddress, city, state } = locationInfo;
  const displayAddress = formattedAddress || city || state || 'Unknown location';

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.locationRow}>
        <Text style={styles.locationIcon}>📍</Text>
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>Your Location</Text>
          <Text style={styles.locationAddress} numberOfLines={2}>
            {displayAddress}
          </Text>
          {location && (
            <Text style={styles.locationCoordinates}>
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
          )}
        </View>
      </View>
      {showRefreshButton && (
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  containerCompact: {
    padding: 12,
    marginVertical: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
    lineHeight: 20,
  },
  locationSubtext: {
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 16,
  },
  locationCoordinates: {
    fontSize: 11,
    color: '#868e96',
    fontFamily: 'monospace',
  },
  loadingIndicator: {
    marginTop: 4,
  },
  refreshButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
