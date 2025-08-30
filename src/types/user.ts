export type Address = {
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
};

export type Booking = {
  id: string;
  providerId: string;
  providerName: string;
  service: string;
  total: number;
  scheduledAt: string; // ISO string
  status: 'confirmed' | 'completed' | 'cancelled';
  category?: string;
  rating?: number; // 1-5
  comment?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  addresses: Address[];
};


