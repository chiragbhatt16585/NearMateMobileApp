export type Address = {
  id: string;
  label: string; // e.g., Home, Work
  line1: string;
  isDefault?: boolean;
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


