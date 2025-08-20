/**
 * Static landing screen for a hyper-local services app
 * Minimal, clean design with light/dark theme support
 * @format
 */

import React from 'react';
import { View, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './src/components/Header';
import BottomTabs from './src/components/BottomTabs';
import LoginScreen from './src/screens/Auth/LoginScreen';
import MobileAuthScreen from './src/screens/Auth/MobileAuthScreen';
import LocationAskScreen from './src/screens/LocationAskScreen';
import HomeScreen from './src/screens/HomeScreen';
import NextScreen from './src/screens/NextScreen';
import ServiceListScreen from './src/screens/ServiceListScreen';
import ProviderProfileScreen from './src/screens/ProviderProfileScreen';
import BookingScreen from './src/screens/BookingScreen';
import AccountScreen from './src/screens/Account/AccountScreen';
import ManageAddressesScreen from './src/screens/Account/ManageAddressesScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import BookingDetailScreen from './src/screens/BookingDetailScreen';
import AllCategoriesScreen from './src/screens/AllCategoriesScreen';
import VendorDashboardScreen from './src/screens/Vendor/VendorDashboardScreen';
import VendorProfileScreen from './src/screens/Vendor/VendorProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import { ServiceCategory, Partner } from './src/services/api';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  
  const [route, setRoute] = React.useState<'login' | 'mobileAuth' | 'locationAsk' | 'home' | 'next' | 'service' | 'profile' | 'booking' | 'account' | 'addresses' | 'bookingDetail' | 'allCategories' | 'vendor' | 'vendorProfile' | 'chat' | 'bookings'>('login');
  const [selectedCategory, setSelectedCategory] = React.useState<ServiceCategory | null>(null);
  const [selectedProvider, setSelectedProvider] = React.useState<Partner | null>(null);
  const [user, setUser] = React.useState({
    id: 'user-1',
    name: 'Chirag Bhatt',
    phone: '+919930793707',
    email: 'chiragbhatt16585@gmail.com',
    addresses: [
      { id: '1', label: 'Home', line1: '123 Main Street, Mumbai, Maharashtra', isDefault: true },
      { id: '2', label: 'Work', line1: '456 Park Avenue, Delhi, Delhi', isDefault: false },
    ],
  });
  const [bookings, setBookings] = React.useState([
    { 
      id: '1', 
      providerId: 'provider-1',
      providerName: 'Riya Sharma', 
      service: 'Salon at Home', 
      scheduledAt: '2024-01-15T10:00:00Z',
      status: 'completed' as const, 
      total: 500, 
      rating: 5, 
      comment: 'Excellent service!' 
    },
    { 
      id: '2', 
      providerId: 'provider-2',
      providerName: 'Amit Patel', 
      service: 'Plumber', 
      scheduledAt: '2024-01-20T14:00:00Z',
      status: 'confirmed' as const, 
      total: 300, 
      rating: 0, 
      comment: '' 
    },
    { 
      id: '3', 
      providerId: 'provider-3',
      providerName: 'Priya Singh', 
      service: 'Electrician', 
      scheduledAt: '2024-01-10T09:00:00Z',
      status: 'completed' as const, 
      total: 400, 
      rating: 4, 
      comment: 'Good work' 
    },
  ]);
  const [homeTab, setHomeTab] = React.useState<'home' | 'explore' | 'bookings' | 'account' | 'vendor'>('home');
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [demoVendor] = React.useState({
    id: 'vendor-1',
    name: 'Riya Sharma',
    category: 'Beautician',
    phone: '9876543210',
    rating: 4.8,
    jobs: 150,
    bio: 'Professional beautician with 5+ years of experience. Specializing in bridal makeup, party makeup, and regular beauty treatments.',
    services: [
      { id: 'service-1', name: 'Bridal Makeup', basePrice: 5000 },
      { id: 'service-2', name: 'Party Makeup', basePrice: 1500 },
      { id: 'service-3', name: 'Facial', basePrice: 800 },
      { id: 'service-4', name: 'Hair Styling', basePrice: 500 },
    ],
    commissionRatePercent: 20,
    earningsMonthToDate: 24850,
    pendingPayout: 3200,
    totalBookings: 42,
    upcoming: [
      { id: 'vb-3', clientName: 'Aditi', service: 'Home facial', scheduledAt: new Date(Date.now()+1000*60*60*24).toISOString(), amount: 999, status: 'upcoming' as const },
      { id: 'vb-4', clientName: 'Meera', service: 'Waxing', scheduledAt: new Date(Date.now()+1000*60*60*48).toISOString(), amount: 799, status: 'upcoming' as const },
    ],
    history: [
      { id: 'vb-2', clientName: 'Neha', service: 'Hair spa', scheduledAt: new Date(Date.now()-1000*60*60*24*2).toISOString(), amount: 1299, status: 'completed' as const },
      { id: 'vb-1', clientName: 'Puja', service: 'Manicure & Pedicure', scheduledAt: new Date(Date.now()-1000*60*60*24*5).toISOString(), amount: 1499, status: 'completed' as const },
    ],
  });

  const colors = React.useMemo(() => ({
    background: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
    surface: colorScheme === 'dark' ? '#2a2a2a' : '#f8f9fa',
    textPrimary: colorScheme === 'dark' ? '#ffffff' : '#1a1a1a',
    textSecondary: colorScheme === 'dark' ? '#cccccc' : '#666666',
    border: colorScheme === 'dark' ? '#404040' : '#e0e0e0',
  }), [colorScheme]);

  const openService = React.useCallback((category: ServiceCategory) => {
    setSelectedCategory(category);
    setRoute('service');
  }, []);

  const openProfile = React.useCallback((provider: Partner) => {
    setSelectedProvider(provider);
    setRoute('profile');
  }, []);

  const openBooking = React.useCallback((provider: Partner) => {
    setSelectedProvider(provider);
    setRoute('booking');
  }, []);

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Navigate to service list with search query
      const mockCategory: ServiceCategory = {
        id: 'search',
        key: 'search',
        label: `Search: ${query}`,
        icon: '🔍',
        tone: '#F0F0F0',
        popular: false,
        createdAt: '',
        updatedAt: '',
      };
      setSelectedCategory(mockCategory);
      setRoute('service');
    } else {
      // Navigate to all categories
      setRoute('allCategories');
    }
  }, []);

  const saveBooking = React.useCallback((bookingData: any) => {
    const newBooking = {
      id: Date.now().toString(),
      providerId: selectedProvider?.id || 'unknown',
      providerName: selectedProvider?.name || 'Unknown Provider',
      service: selectedCategory?.label || 'Service',
      scheduledAt: new Date(bookingData.date).toISOString(),
      status: 'confirmed' as const,
      total: bookingData.total,
      rating: 0,
      comment: '',
    };
    setBookings(prev => [newBooking, ...prev]);
    setRoute('home');
  }, [selectedProvider, selectedCategory]);

  const saveReview = React.useCallback((rating: number, comment: string) => {
    if (selectedBooking) {
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, rating, comment }
          : booking
      ));
    }
    setRoute('bookings');
  }, [selectedBooking]);

  if (route === 'login') {
    return (
      <View style={[styles.container, { backgroundColor: '#FBFCFD', paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <LoginScreen onMobilePress={() => setRoute('mobileAuth')} onSkip={() => setRoute('home')} />
      </View>
    );
  }

  if (route === 'mobileAuth') {
    return (
      <View style={[styles.container, { backgroundColor: '#FBFCFD', paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <MobileAuthScreen onBack={() => setRoute('login')} onSuccess={(phone) => {
          setUser(prev => ({ ...prev, phone: phone || prev.phone }));
          setRoute('locationAsk');
        }} />
      </View>
    );
  }

  if (route === 'locationAsk') {
    return (
      <View style={[styles.container, { backgroundColor: '#FBFCFD', paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <LocationAskScreen onBack={() => setRoute('mobileAuth')} onUseCurrent={() => setRoute('home')} onEnterManually={() => setRoute('home')} />
      </View>
    );
  }

  if (route === 'service' && selectedCategory) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Header title={selectedCategory.label} onBack={() => setRoute('home')} />
        <ServiceListScreen 
          category={selectedCategory}
          onBack={() => setRoute('home')} 
          onViewProfile={openProfile}
          onBook={openBooking}
        />
      </View>
    );
  }

  if (route === 'profile' && selectedProvider) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Header title={selectedProvider.name} onBack={() => setRoute('service')} />
        <ProviderProfileScreen 
          provider={selectedProvider}
          onBack={() => setRoute('service')} 
          onBook={openBooking}
          onChat={(provider) => {
            setSelectedProvider(provider);
            setRoute('chat');
          }}
        />
      </View>
    );
  }

  if (route === 'booking' && selectedProvider && selectedCategory) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <BookingScreen 
          provider={selectedProvider}
          onBack={() => setRoute('profile')}
          onConfirm={saveBooking}
        />
      </View>
    );
  }

  if (route === 'account') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <AccountScreen 
          user={user} 
          bookings={bookings}
          onBack={() => setRoute('home')}
          onManageAddresses={() => setRoute('addresses')}
          showHeader={false}
          showBookings={false}
          onSwitchToVendor={() => setRoute('vendor')}
        />
      </View>
    );
  }

  if (route === 'addresses') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ManageAddressesScreen 
          addresses={user.addresses}
          onBack={() => setRoute('account')}
          onSave={(addresses) => setUser(prev => ({ ...prev, addresses }))}
        />
      </View>
    );
  }

  if (route === 'bookingDetail' && selectedBooking) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <BookingDetailScreen 
          booking={selectedBooking}
          onBack={() => setRoute('bookings')}
          showHistory={false}
          onSaveReview={saveReview}
        />
      </View>
    );
  }

  if (route === 'allCategories') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <AllCategoriesScreen 
          onBack={() => setRoute('home')}
          onSelectCategory={openService}
        />
      </View>
    );
  }

  if (route === 'vendor') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <VendorDashboardScreen 
          vendor={demoVendor}
          onBack={() => setRoute('home')}
          onSwitchToCustomer={() => setRoute('home')}
          onOpenProfile={() => setRoute('vendorProfile')}
        />
      </View>
    );
  }

  if (route === 'vendorProfile') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <VendorProfileScreen 
          vendor={demoVendor}
          onBack={() => setRoute('vendor')}
        />
      </View>
    );
  }

  if (route === 'chat' && selectedProvider) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ChatScreen 
          provider={selectedProvider}
          onBack={() => setRoute('profile')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header />
      {homeTab === 'home' && (
        <HomeScreen 
          onNext={() => setHomeTab('explore')}
          onServicePress={openService}
          onViewAllServices={() => setRoute('allCategories')}
          onSearch={handleSearch}
        />
      )}
      {homeTab === 'explore' && (
        <NextScreen onBack={() => setHomeTab('home')} showHeader={false} />
      )}
      {homeTab === 'bookings' && (
        <BookingsScreen
          bookings={bookings}
          onBack={() => setHomeTab('home')}
          showHeader={false}
          onOpenDetail={(b) => { setSelectedBooking(b); setRoute('bookingDetail'); }}
        />
      )}
      {homeTab === 'account' && (
        <AccountScreen
          user={user}
          bookings={bookings}
          onBack={() => setHomeTab('home')}
          onManageAddresses={() => setRoute('addresses')}
          showHeader={false}
          showBookings={false}
          onSwitchToVendor={() => setRoute('vendor')}
        />
      )}
      {homeTab === 'vendor' && (
        <VendorDashboardScreen 
          vendor={demoVendor} 
          onBack={() => setHomeTab('home')} 
          onSwitchToCustomer={() => setHomeTab('home')} 
          onOpenProfile={() => setRoute('vendorProfile')}
        />
      )}
      <BottomTabs value={homeTab} onChange={setHomeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
