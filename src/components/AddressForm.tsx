import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Address, CreateAddressRequest, ADDRESS_TYPES, INDIAN_STATES } from '../types/address';
// Using simple text icons instead of @expo/vector-icons

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (data: CreateAddressRequest) => void;
  onCancel: () => void;
  colors: {
    surface: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    primary: string;
    error: string;
  };
}

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  colors,
}: AddressFormProps) {
  const [formData, setFormData] = useState<CreateAddressRequest>({
    type: 'home',
    label: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Partial<CreateAddressRequest>>({});
  const [showStatePicker, setShowStatePicker] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        type: address.type,
        label: address.label,
        area: address.area,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
      });
    }
  }, [address]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateAddressRequest> = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Address label is required';
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof CreateAddressRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const renderField = (
    field: keyof CreateAddressRequest,
    label: string,
    placeholder: string,
    options?: { value: string; label: string }[]
  ) => {
    const isError = !!errors[field];
    const value = formData[field] as string;

    if (field === 'state' && options) {
      return (
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            State *
          </Text>
          <Pressable
            style={[
              styles.pickerButton,
              {
                backgroundColor: colors.surface,
                borderColor: isError ? colors.error : colors.border,
              },
            ]}
            onPress={() => setShowStatePicker(!showStatePicker)}
          >
            <Text style={[
              styles.pickerButtonText,
              { color: value ? colors.textPrimary : colors.textMuted }
            ]}>
              {value || 'Select State'}
            </Text>
            <Text style={[styles.chevronIcon, { color: colors.textMuted }]}>
              {showStatePicker ? '▲' : '▼'}
            </Text>
          </Pressable>
          {showStatePicker && (
            <View style={[styles.pickerDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ScrollView style={styles.pickerScroll}>
                {options.map((option) => (
                  <Pressable
                    key={option.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      updateField('state', option.value);
                      setShowStatePicker(false);
                    }}
                  >
                    <Text style={[styles.pickerOptionText, { color: colors.textPrimary }]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          {isError && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors[field]}
            </Text>
          )}
        </View>
      );
    }

    if (field === 'type' && options) {
      return (
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            Address Type *
          </Text>
          <View style={styles.typeButtons}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: value === option.value ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => updateField('type', option.value)}
              >
                <Text style={styles.typeIcon}>{option.icon}</Text>
                <Text style={[
                  styles.typeButtonText,
                  { color: value === option.value ? '#ffffff' : colors.textPrimary }
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
          {label} {field === 'label' || field === 'area' || field === 'city' || field === 'pincode' ? '*' : ''}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: isError ? colors.error : colors.border,
              color: colors.textPrimary,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={(text) => updateField(field, text)}
          multiline={false}
          numberOfLines={1}
        />
        {isError && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors[field]}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {address ? 'Edit Address' : 'Add New Address'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {address ? 'Update your address information' : 'Enter your address details'}
          </Text>
        </View>

        <View style={[styles.form, { backgroundColor: colors.surface }]}>
          {/* Address Type Selection */}
          <View style={[styles.formSection, { backgroundColor: '#ffffff' }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Address Type</Text>
            {renderField('type', 'Select Type', '', ADDRESS_TYPES)}
          </View>
          
          {/* Address Details */}
          <View style={[styles.formSection, { backgroundColor: '#fafafa' }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Address Details</Text>
            {renderField('label', 'Address Label', 'e.g., Primary Home, Office, Villa 15')}
            {renderField('area', 'Area/Location', 'e.g., Andheri West, Bandra East, Satellite')}
          </View>
          
          {/* Location Details */}
          <View style={[styles.formSection, { backgroundColor: '#ffffff' }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Location Details</Text>
            {renderField('city', 'City', 'Enter city name')}
            {renderField('state', 'State', '', INDIAN_STATES.map(s => ({ value: s, label: s })))}
            {renderField('pincode', 'Pincode', 'Enter 6-digit pincode')}
          </View>
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={onCancel}
          >
            <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>
              Cancel
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {address ? 'Update Address' : 'Add Address'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 40,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldContainer: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    lineHeight: 20,
    minHeight: 56,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    minHeight: 56,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  pickerDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 6,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  chevronIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
