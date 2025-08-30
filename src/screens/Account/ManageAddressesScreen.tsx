import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, useColorScheme, Alert, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
import type { Address } from '../../types/address';
import { ADDRESS_TYPES, INDIAN_STATES } from '../../types/address';
import { getApiBaseUrl } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pincode lookup response type
type PincodeLookupResponse = {
  found: boolean;
  count: number;
  offices: Array<{
    pincode: string;
    district: string;
    city: string;
    state: string;
    area: string;
  }>;
};

type ManageAddressesScreenProps = {
  userId: string;
  onBack: () => void;
  onSave: (addresses: Address[]) => void;
};

export default function ManageAddressesScreen({ userId, onBack, onSave }: ManageAddressesScreenProps) {
  console.log('🚀 ManageAddressesScreen loaded with userId:', userId);
  
  const isDarkMode = useColorScheme() === 'dark';
  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#0B0D0F' : '#FFFFFF',
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
      accent: '#111111',
      accentText: '#FFFFFF',
    }),
    [isDarkMode]
  );

  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [pincodeLookupLoading, setPincodeLookupLoading] = React.useState<string | null>(null);

  // Pincode lookup function
  const lookupPincode = React.useCallback(async (pincode: string, addressId: string) => {
    if (pincode.length !== 6) return;
    
    try {
      setPincodeLookupLoading(addressId);
      console.log('🔍 Looking up pincode:', pincode);
      
      const apiUrl = `${getApiBaseUrl()}/api/v1/pincode/lookup/${pincode}`;
      console.log('🌐 Pincode lookup URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.log('⚠️ Pincode lookup failed:', response.status);
        return;
      }
      
      const data: PincodeLookupResponse = await response.json();
      console.log('✅ Pincode lookup result:', data);
      
      if (data.found && data.offices && data.offices.length > 0) {
        // Use the first office result for city and state
        const firstOffice = data.offices[0];
        
        // Auto-populate city and state fields
        setField(addressId, { 
          city: firstOffice.city, 
          state: firstOffice.state 
        });
        
        // Show success message
        Alert.alert(
          '📍 Address Found!',
          `City: ${firstOffice.city}\nState: ${firstOffice.state}`,
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('❌ Pincode lookup error:', err);
      // Don't show error to user, just log it
    } finally {
      setPincodeLookupLoading(null);
    }
  }, []);

  // Handle pincode input with auto-lookup
  const handlePincodeChange = React.useCallback((text: string, addressId: string) => {
    // Update pincode field
    setField(addressId, { pincode: text });
    
    // Trigger lookup when exactly 6 digits are entered
    if (text.length === 6 && /^\d{6}$/.test(text)) {
      lookupPincode(text, addressId);
    }
  }, [lookupPincode]);

  // Fetch addresses from API
  const fetchAddresses = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Starting fetchAddresses...');
      console.log('👤 User ID received:', userId);
      console.log('👤 User ID type:', typeof userId);
      console.log('👤 User ID length:', userId?.length);
      
      const token = await AsyncStorage.getItem('nearmate_access_token');
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
      console.log('🔑 Token length:', token?.length);
      console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'None');
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const apiUrl = `${getApiBaseUrl()}/api/v1/end-users/${userId}/addresses`;
      console.log('🌐 Fetching addresses from:', apiUrl);
      console.log('🌐 Base URL:', getApiBaseUrl());

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch addresses: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', JSON.stringify(data, null, 2));
      
      if (data.addresses && Array.isArray(data.addresses)) {
        console.log('📦 Setting addresses:', data.addresses.length);
        setAddresses(data.addresses);
      } else {
        console.log('⚠️ No addresses array in response, setting empty array');
        setAddresses([]);
      }
    } catch (err) {
      console.error('❌ Error fetching addresses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch addresses');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load addresses on component mount
  React.useEffect(() => {
    console.log('🔄 useEffect triggered - userId:', userId);
    if (userId) {
      fetchAddresses();
    } else {
      console.log('❌ No userId provided, cannot fetch addresses');
      setError('No user ID provided');
      setIsLoading(false);
    }
  }, [fetchAddresses, userId]);

  const addRow = () => {
    const newAddress: Address = {
      id: `temp-${Date.now()}`,
      endUserId: userId,
      label: 'New Address',
      type: 'home',
      area: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: addresses.length === 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAddresses(prev => [...prev, newAddress]);
    setEditingId(newAddress.id); // Start editing the new address
  };

  const setDefault = async (id: string) => {
    try {
      console.log('🔄 Setting default address:', id);
      
      // Get auth token
      const token = await AsyncStorage.getItem('nearmate_access_token');
      if (!token) {
        Alert.alert('Error', 'No authentication token available');
        return;
      }

      // First, update all addresses to not default
      const updatedAddresses = addresses.map(a => ({ ...a, isDefault: false }));
      setAddresses(updatedAddresses);

      // Then set the selected address as default
      const finalAddresses = updatedAddresses.map(a => ({ 
        ...a, 
        isDefault: a.id === id 
      }));
      setAddresses(finalAddresses);

      // Update API for all addresses
      let allUpdatesSuccessful = true;
      
      for (const address of finalAddresses) {
        if (!address.id.startsWith('temp-')) {
          try {
            // Use the correct endpoint structure for updating addresses
            const endpoint = `${getApiBaseUrl()}/api/v1/end-users/${userId}/addresses/${address.id}`;
            
            console.log('🌐 Updating address:', endpoint);
            
            const response = await fetch(endpoint, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                isDefault: address.isDefault
              }),
            });

            if (response.ok) {
              console.log('✅ Address updated successfully via:', endpoint);
            } else {
              console.log('⚠️ Endpoint failed:', endpoint, response.status);
              const errorText = await response.text();
              console.log('⚠️ Error details:', errorText);
              allUpdatesSuccessful = false;
            }
          } catch (err) {
            console.error('❌ Error updating address:', address.id, err);
            allUpdatesSuccessful = false;
          }
        }
      }

      if (allUpdatesSuccessful) {
        Alert.alert('Success', 'Default address updated successfully!');
      } else {
        Alert.alert('Warning', 'Some addresses may not have been updated. Please check your connection and try again.');
        // Refresh addresses to get the latest state
        await fetchAddresses();
      }
    } catch (err) {
      console.error('❌ Error setting default address:', err);
      Alert.alert('Error', 'Failed to update default address. Please try again.');
      // Refresh addresses to get the latest state
      await fetchAddresses();
    }
  };

  const setField = (id: string, patch: Partial<Address>) => {
    setAddresses(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
  };

  const deleteAddress = async (id: string) => {
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
              // If it's a temporary address, just remove from state
              if (id.startsWith('temp-')) {
                setAddresses(prev => prev.filter(a => a.id !== id));
                if (editingId === id) {
                  setEditingId(null);
                }
                return;
              }

              // For existing addresses, delete from API first
              const token = await AsyncStorage.getItem('nearmate_access_token');
              if (token) {
                const apiUrl = `${getApiBaseUrl()}/api/v1/end-users/${userId}/addresses/${id}`;
                console.log('🌐 Deleting address:', apiUrl);
                
                const response = await fetch(apiUrl, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (response.ok) {
                  console.log('✅ Address deleted successfully from API');
                } else {
                  console.error('❌ Failed to delete address from API:', response.status);
                  // Still remove from local state even if API fails
                }
              }

              // Remove from local state
              setAddresses(prev => prev.filter(a => a.id !== id));
              if (editingId === id) {
                setEditingId(null);
              }
            } catch (err) {
              console.error('❌ Error deleting address:', err);
              // Still remove from local state even if API fails
              setAddresses(prev => prev.filter(a => a.id !== id));
              if (editingId === id) {
                setEditingId(null);
              }
            }
          }
        }
      ]
    );
  };

  const startEditing = (id: string) => {
    setEditingId(id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validate required fields
      const addressesToSave = addresses.filter(addr => !addr.id.startsWith('temp-') || 
        (addr.label && addr.area && addr.city && addr.state && addr.pincode));
      
      if (addressesToSave.length === 0) {
        throw new Error('Please fill in all required fields for at least one address');
      }

      // Check for incomplete addresses
      const incompleteAddresses = addresses.filter(addr => 
        addr.id.startsWith('temp-') && 
        (!addr.label || !addr.area || !addr.city || !addr.state || !addr.pincode)
      );
      
      if (incompleteAddresses.length > 0) {
        Alert.alert(
          'Incomplete Addresses',
          'Some addresses have missing required fields. These will be removed.',
          [{ text: 'OK' }]
        );
        // Remove incomplete addresses
        setAddresses(prev => prev.filter(addr => 
          !addr.id.startsWith('temp-') || 
          (addr.label && addr.area && addr.city && addr.state && addr.pincode)
        ));
      }

      // Get auth token
      const token = await AsyncStorage.getItem('nearmate_access_token');
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Handle new addresses (ones that start with 'temp-')
      const newAddresses = addresses.filter(addr => addr.id.startsWith('temp-'));
      const existingAddresses = addresses.filter(addr => !addr.id.startsWith('temp-'));
      
      // Create new addresses via API
      for (const newAddress of newAddresses) {
        try {
          const apiUrl = `${getApiBaseUrl()}/api/v1/end-users/${userId}/addresses`;
          console.log('🌐 Creating new address:', apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: newAddress.type,
              label: newAddress.label,
              area: newAddress.area,
              city: newAddress.city,
              state: newAddress.state,
              pincode: newAddress.pincode,
              country: newAddress.country,
              isDefault: newAddress.isDefault
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Failed to create address:', response.status, errorText);
            throw new Error(`Failed to create address: ${response.status}`);
          }

          console.log('✅ New address created successfully');
        } catch (err) {
          console.error('❌ Error creating new address:', err);
          throw err;
        }
      }

      // Update existing addresses that were edited
      for (const existingAddress of existingAddresses) {
        try {
          const apiUrl = `${getApiBaseUrl()}/api/v1/end-users/${userId}/addresses/${existingAddress.id}`;
          console.log('🌐 Updating existing address:', apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: existingAddress.type,
              label: existingAddress.label,
              area: existingAddress.area,
              city: existingAddress.city,
              state: existingAddress.state,
              pincode: existingAddress.pincode,
              country: existingAddress.country,
              isDefault: existingAddress.isDefault
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Failed to update address:', existingAddress.id, response.status, errorText);
            throw new Error(`Failed to update address: ${response.status}`);
          }

          console.log('✅ Existing address updated successfully');
        } catch (err) {
          console.error('❌ Error updating existing address:', err);
          throw err;
        }
      }

      // Call the onSave callback with all addresses
      await onSave([...existingAddresses, ...newAddresses]);
      
      // Refresh addresses from API
      await fetchAddresses();
      
      // Exit edit mode
      setEditingId(null);
      
      Alert.alert('Success', 'Addresses saved successfully!');
    } catch (err) {
      console.error('Error saving addresses:', err);
      setError(err instanceof Error ? err.message : 'Failed to save addresses');
      Alert.alert('Error', 'Failed to save addresses. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderAddressDisplay = (address: Address) => (
    <View key={address.id} style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
      {/* Address Header with Type and Actions */}
      <View style={styles.rowBetween}> 
        <View style={styles.typeContainer}>
          {/* Show only the selected address type */}
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: colors.accent,
                borderColor: colors.border,
              }
            ]}
          >
            <Text style={styles.typeIcon}>
              {ADDRESS_TYPES.find(t => t.value === address.type)?.icon || '📍'}
            </Text>
            <Text style={[
              styles.typeBadgeText,
              { color: colors.accentText }
            ]}>
              {ADDRESS_TYPES.find(t => t.value === address.type)?.label || 'Address'}
            </Text>
          </View>
        </View>
        <View style={styles.actionContainer}>
          {!address.isDefault ? (
            <Pressable style={[styles.ghostBtn, { borderColor: colors.border }]} onPress={() => setDefault(address.id)}>
              <Text style={[styles.ghostText, { color: colors.textPrimary }]}>Set default</Text>
            </Pressable>
          ) : (
            <Text style={[styles.badge, { color: colors.accent }]}>Default</Text>
          )}
          <Pressable 
            style={[styles.actionBtn, { borderColor: colors.border }]} 
            onPress={() => startEditing(address.id)}
          >
            <Text style={[styles.actionBtnText, { color: colors.accent }]}>✏️ Edit</Text>
          </Pressable>
          <Pressable 
            style={[styles.actionBtn, { borderColor: colors.border }]} 
            onPress={() => deleteAddress(address.id)}
          >
            <Text style={[styles.actionBtnText, { color: '#FF4444' }]}>🗑️ Delete</Text>
          </Pressable>
        </View>
      </View>

      {/* Address Display (Read-only) - Only essential info */}
      <View style={styles.addressDisplay}>
        <Text style={[styles.addressText, { color: colors.textMuted }]}>
          {address.area}, {address.city}, {address.state} {address.pincode}
        </Text>
        <Text style={[styles.addressText, { color: colors.textMuted }]}>
          {address.country}
        </Text>
      </View>
    </View>
  );

  const renderAddressForm = (address: Address) => (
    <View key={address.id} style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
      {/* Form Header */}
      <View style={styles.rowBetween}> 
        <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
          {address.id.startsWith('temp-') ? 'Add New Address' : 'Edit Address'}
        </Text>
        <Pressable 
          style={[styles.cancelBtn, { borderColor: colors.border }]} 
          onPress={cancelEditing}
        >
          <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>❌ Cancel</Text>
        </Pressable>
      </View>

      {/* Address Type Selection */}
      <View style={styles.typeContainer}>
        {ADDRESS_TYPES.map(type => (
          <Pressable
            key={type.value}
            style={[
              styles.typeButton,
              {
                backgroundColor: address.type === type.value ? colors.accent : colors.surface,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setField(address.id, { type: type.value })}
          >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <Text style={[
              styles.typeButtonText,
              { color: address.type === type.value ? colors.accentText : colors.textPrimary }
            ]}>
              {type.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Address Label */}
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
          Address Label <Text style={{ color: '#FF4444' }}>*</Text>
        </Text>
        <TextInput
          placeholder="e.g., Primary Home, Office, Villa 15"
          placeholderTextColor={colors.textMuted}
          value={address.label}
          onChangeText={text => setField(address.id, { label: text })}
          style={[
            styles.input, 
            { 
              borderColor: address.label ? colors.border : '#FF4444', 
              color: colors.textPrimary, 
              backgroundColor: colors.surface 
            }
          ]}
        />
      </View>

      {/* Area/Location */}
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
          Area/Location <Text style={{ color: '#FF4444' }}>*</Text>
        </Text>
        <TextInput
          placeholder="e.g., Andheri West, Bandra East, Satellite"
          placeholderTextColor={colors.textMuted}
          value={address.area}
          onChangeText={text => setField(address.id, { area: text })}
          style={[
            styles.input, 
            { 
              borderColor: address.area ? colors.border : '#FF4444', 
              color: colors.textPrimary, 
              backgroundColor: colors.surface 
            }
          ]}
        />
      </View>

      {/* City */}
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
          City <Text style={{ color: '#FF4444' }}>*</Text>
        </Text>
        <TextInput
          placeholder="Enter city name"
          placeholderTextColor={colors.textMuted}
          value={address.city}
          onChangeText={text => setField(address.id, { city: text })}
          style={[
            styles.input, 
            { 
              borderColor: address.city ? colors.border : '#FF4444', 
              color: colors.textPrimary, 
              backgroundColor: colors.surface 
            }
          ]}
        />
      </View>

      {/* State and Pincode Row */}
      <View style={styles.rowHalf}>
        <View style={[styles.fieldContainer, styles.halfField]}>
          <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
            State <Text style={{ color: '#FF4444' }}>*</Text>
          </Text>
          <TextInput
            placeholder="Select state"
            placeholderTextColor={colors.textMuted}
            value={address.state}
            onChangeText={text => setField(address.id, { state: text })}
            style={[
              styles.input, 
              { 
                borderColor: address.state ? colors.border : '#FF4444', 
                color: colors.textPrimary, 
                backgroundColor: colors.surface 
              }
            ]}
          />
        </View>
        <View style={[styles.fieldContainer, styles.halfField]}>
          <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>
            Pincode <Text style={{ color: '#FF4444' }}>*</Text>
          </Text>
          <TextInput
            placeholder="6-digit pincode"
            placeholderTextColor={colors.textMuted}
            value={address.pincode}
            onChangeText={text => handlePincodeChange(text, address.id)}
            style={[
              styles.input, 
              { 
                borderColor: address.pincode ? colors.border : '#FF4444', 
                color: colors.textPrimary, 
                backgroundColor: colors.surface 
              }
            ]}
            keyboardType="numeric"
            maxLength={6}
          />
          {pincodeLookupLoading === address.id && (
            <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 8 }} />
          )}
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
        <Header title="Manage addresses" onBack={onBack} />
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading addresses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Header title="Manage addresses" onBack={onBack} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#FF4444' }]}>⚠️ {error}</Text>
          <Pressable style={[styles.retryBtn, { borderColor: colors.border }]} onPress={fetchAddresses}>
            <Text style={[styles.retryText, { color: colors.textPrimary }]}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title="Manage addresses" onBack={onBack} />

      {/* Debug Section */}
      {/* <View style={styles.debugContainer}>
        <Text style={[styles.debugText, { color: colors.textMuted }]}>
          🔍 Debug: User ID: {userId || 'NOT SET'}
        </Text>
        <Text style={[styles.debugText, { color: colors.textMuted }]}>
          🌐 API: {getApiBaseUrl()}/api/v1/end-users/{userId || 'USER_ID'}/addresses
        </Text>
        <Text style={[styles.debugText, { color: colors.textMuted }]}>
          🔑 Token: Check console for status
        </Text>
        <Pressable 
          style={[styles.debugBtn, { borderColor: colors.border }]} 
          onPress={fetchAddresses}
        >
          <Text style={[styles.debugBtnText, { color: colors.textPrimary }]}>🔄 Test API</Text>
        </Pressable>
      </View> */}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {editingId ? (
          (() => {
            const editingAddress = addresses.find(addr => addr.id === editingId);
            if (!editingAddress) {
              setEditingId(null);
              return null;
            }
            return renderAddressForm(editingAddress);
          })()
        ) : (
          addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyIcon, { color: colors.textMuted }]}>📍</Text>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No addresses yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Add your first address to get started</Text>
            </View>
          ) : (
            addresses.map(renderAddressDisplay)
          )
        )}

        <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={addRow}> 
          <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>➕ Add address</Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
        <Pressable 
          style={[
            styles.primaryBtn, 
            { backgroundColor: isSaving ? colors.textMuted : colors.accent }
          ]} 
          onPress={handleSave}
          disabled={isSaving}
        > 
          <Text style={[styles.primaryText, { color: colors.accentText }]}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 20, gap: 16 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowHalf: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  fieldContainer: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '700' },
  input: { borderWidth: 2, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, minHeight: 48 },
  typeContainer: { flexDirection: 'row', gap: 8 },
  typeButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 10 },
  typeButtonText: { fontSize: 12, fontWeight: '600' },
  typeIcon: { fontSize: 16 },
  actionContainer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  ghostBtn: { height: 32, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  ghostText: { fontSize: 12, fontWeight: '600' },
  actionBtn: { height: 32, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 12, fontWeight: '600' },
  badge: { fontSize: 12, fontWeight: '700', color: '#111111' },
  secondaryBtn: { height: 48, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontSize: 16, fontWeight: '700' },
  primaryBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  bottomBar: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptySubtitle: { fontSize: 16, textAlign: 'center' },
  errorContainer: { padding: 20, alignItems: 'center', gap: 16 },
  errorText: { fontSize: 16, textAlign: 'center' },
  retryBtn: { height: 40, borderRadius: 12, borderWidth: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  retryText: { fontSize: 16, fontWeight: '600' },
  loadingText: { fontSize: 16, marginTop: 16 },
  debugContainer: { padding: 16, backgroundColor: '#F0F0F0', margin: 16, borderRadius: 8 },
  debugText: { fontSize: 12, marginBottom: 4 },
  debugBtn: { height: 32, borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  debugBtnText: { fontSize: 12, fontWeight: '600' },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  typeBadgeText: { fontSize: 12, fontWeight: '600' },
  addressDisplay: { paddingTop: 12 },
  addressText: { fontSize: 14, marginBottom: 4 },
  formTitle: { fontSize: 18, fontWeight: '700' },
  cancelBtn: { height: 32, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontSize: 12, fontWeight: '600' },
});
