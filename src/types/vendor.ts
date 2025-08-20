export type VendorBooking = {
  id: string;
  clientName: string;
  service: string;
  scheduledAt: string; // ISO
  amount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
};

export type Vendor = {
  id: string;
  name: string;
  category: string;
  phone?: string;
  rating?: number;
  jobs?: number;
  bio?: string;
  commissionRatePercent: number; // e.g., 20
  earningsMonthToDate: number;
  pendingPayout: number;
  totalBookings: number;
  services?: { id: string; name: string; basePrice: number }[];
  upcoming: VendorBooking[];
  history: VendorBooking[];
};


