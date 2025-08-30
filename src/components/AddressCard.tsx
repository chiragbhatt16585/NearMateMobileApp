import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { Address, ADDRESS_TYPES } from '../types/address';
// Using simple text icons instead of @expo/vector-icons

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  colors: {
    surface: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    primary: string;
    success: string;
    error: string;
  };
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  colors,
}: AddressCardProps) {
  const addressType = ADDRESS_TYPES.find(type => type.value === address.type);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Header with type and default badge */}
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeIcon}>{addressType?.icon}</Text>
          <Text style={[styles.typeLabel, { color: colors.textSecondary }]}>
            {addressType?.label}
          </Text>
        </View>
        
        {address.isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      {/* Address label */}
      <Text style={[styles.addressName, { color: colors.textPrimary }]}>
        {address.label}
      </Text>

      {/* Address details */}
      <View style={styles.addressDetails}>
        <Text style={[styles.addressLine, { color: colors.textPrimary }]}>
          {address.area}
        </Text>
        <Text style={[styles.addressLine, { color: colors.textPrimary }]}>
          {address.city}, {address.state} {address.pincode}
        </Text>
        <Text style={[styles.addressLine, { color: colors.textPrimary }]}>
          {address.country}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        {!address.isDefault && (
          <Pressable
            style={styles.actionButton}
            onPress={onSetDefault}
          >
            <Text style={[styles.actionIcon, { color: colors.primary }]}>⭐</Text>
            <Text style={[styles.actionText, { color: colors.primary }]}>
              Set Default
            </Text>
          </Pressable>
        )}
        
        <Pressable
          style={styles.actionButton}
          onPress={onEdit}
        >
          <Text style={[styles.actionIcon, { color: colors.primary }]}>✏️</Text>
          <Text style={[styles.actionText, { color: colors.primary }]}>
            Edit
          </Text>
        </Pressable>
        
        <Pressable
          style={styles.actionButton}
          onPress={onDelete}
        >
          <Text style={[styles.actionIcon, { color: colors.error }]}>🗑️</Text>
          <Text style={[styles.actionText, { color: colors.error }]}>
            Delete
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  addressName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  addressDetails: {
    marginBottom: 16,
  },
  addressLine: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  landmark: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  actionIcon: {
    fontSize: 20,
  },
});
