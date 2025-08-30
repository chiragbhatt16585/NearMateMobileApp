export interface Address {
  id: string;
  endUserId: string;
  type: 'home' | 'work' | 'other';
  label: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  type: 'home' | 'work' | 'other';
  label: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
  country?: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
  // All fields are optional for updates
}

export interface AddressResponse {
  message: string;
  address?: Address;
  addresses?: Address[];
  count?: number;
  error?: string;
}

export type AddressType = 'home' | 'work' | 'other';

export const ADDRESS_TYPES: { value: AddressType; label: string; icon: string }[] = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'work', label: 'Work', icon: '🏢' },
  { value: 'other', label: 'Other', icon: '📍' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Lakshadweep', 'Puducherry', 'Andaman and Nicobar Islands'
];
