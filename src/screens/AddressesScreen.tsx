import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Address, CreateAddressRequest, ADDRESS_TYPES, INDIAN_STATES } from '../types/address';
import addressService from '../services/addressService';
import AddressCard from '../components/AddressCard';
import AddressForm from '../components/AddressForm';
// Using simple text icons instead of @expo/vector-icons

interface AddressesScreenProps {
  endUserId: string;
  onBack: () => void;
  showHeader?: boolean;
}

export default function AddressesScreen({ 
  endUserId, 
  onBack, 
  showHeader = true 
}: AddressesScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      surface: isDarkMode ? '#2a2a2a' : '#f8f9fa',
      textPrimary: isDarkMode ? '#ffffff' : '#1a1a1a',
      textSecondary: isDarkMode ? '#cccccc' : '#666666',
      textMuted: isDarkMode ? '#999999' : '#888888',
      border: isDarkMode ? '#404040' : '#e0e0e0',
      primary: '#000000',
      accent: '#000000',
      error: '#FF3B30',
      success: '#34C759',
    }),
    [isDarkMode]
  );

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  const loadAddresses = async () => {
    if (!endUserId) return;
    
    setIsLoading(true);
    try {
      const fetchedAddresses = await addressService.getAddresses(endUserId);
      setAddresses(fetchedAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Error', 'Failed to load addresses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAddresses();
    setIsRefreshing(false);
  };

  const handleAddAddress = async (addressData: CreateAddressRequest) => {
    try {
      const newAddress = await addressService.createAddress(endUserId, addressData);
      setAddresses(prev => [...prev, newAddress]);
      setShowAddForm(false);
      Alert.alert('Success', 'Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address. Please try again.');
    }
  };

  const handleUpdateAddress = async (addressId: string, addressData: CreateAddressRequest) => {
    try {
      const updatedAddress = await addressService.updateAddress(endUserId, addressId, addressData);
      setAddresses(prev => prev.map(addr => 
        addr.id === addressId ? updatedAddress : addr
      ));
      setEditingAddress(null);
      Alert.alert('Success', 'Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address. Please try again.');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await addressService.deleteAddress(endUserId, addressId);
              setAddresses(prev => prev.filter(addr => addr.id !== addressId));
              Alert.alert('Success', 'Address deleted successfully!');
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const updatedAddress = await addressService.setDefaultAddress(endUserId, addressId);
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })));
      Alert.alert('Success', 'Default address updated!');
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address. Please try again.');
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  if (isLoading && addresses.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading addresses...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showHeader && (
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Manage Addresses
          </Text>
          <View style={styles.headerRight} />
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {showAddForm ? (
          <AddressForm
            address={editingAddress}
            onSubmit={editingAddress ? 
              (data) => handleUpdateAddress(editingAddress.id, data) : 
              handleAddAddress
            }
            onCancel={() => {
              setShowAddForm(false);
              setEditingAddress(null);
            }}
            colors={colors}
          />
        ) : (
          <>
            <View style={styles.addButtonContainer}>
              <Pressable
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowAddForm(true)}
              >
                <Text style={styles.addIcon}>+</Text>
                <Text style={styles.addButtonText}>Add New Address</Text>
              </Pressable>
            </View>

            {addresses.length === 0 ? (
                          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyStateIcon, { color: colors.textMuted }]}>📍</Text>
              <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
                No Addresses Yet
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
                Add your first address to get started
              </Text>
            </View>
            ) : (
              <View style={styles.addressesList}>
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() => handleEditAddress(address)}
                    onDelete={() => handleDeleteAddress(address.id)}
                    onSetDefault={() => handleSetDefault(address.id)}
                    colors={colors}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  addButtonContainer: {
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressesList: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyStateIcon: {
    fontSize: 64,
  },
});
