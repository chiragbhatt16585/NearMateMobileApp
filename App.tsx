/**
 * Static landing screen for a hyper-local services app
 * Minimal, clean design with light/dark theme support
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import NextScreen from './src/screens/NextScreen';
import ServiceListScreen from './src/screens/ServiceListScreen';
import ProviderProfileScreen, { ProviderProfile } from './src/screens/ProviderProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import Header from './src/components/Header';
// import { signInWithGoogle } from './src/services/googleAuth';
// import type { AuthUser } from './src/types/auth';
import LoginScreen from './src/screens/Auth/LoginScreen';
import LocationAskScreen from './src/screens/LocationAskScreen';
import MobileAuthScreen from './src/screens/Auth/MobileAuthScreen';
import BookingScreen from './src/screens/BookingScreen';
import AccountScreen from './src/screens/Account/AccountScreen';
import ManageAddressesScreen from './src/screens/Account/ManageAddressesScreen';
import type { UserProfile, Booking } from './src/types/user';
import BookingDetailScreen from './src/screens/BookingDetailScreen';
import BottomTabs from './src/components/BottomTabs';
import BookingsScreen from './src/screens/BookingsScreen';
import AllCategoriesScreen from './src/screens/AllCategoriesScreen';
import VendorDashboardScreen from './src/screens/Vendor/VendorDashboardScreen';
import VendorProfileScreen from './src/screens/Vendor/VendorProfileScreen';
import type { Vendor } from './src/types/vendor';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const [route, setRoute] = React.useState<'login' | 'mobileAuth' | 'locationAsk' | 'home' | 'next' | 'service' | 'profile' | 'booking' | 'account' | 'addresses' | 'bookingDetail' | 'allCategories' | 'vendor' | 'vendorProfile' | 'chat'>('login');
  const [selectedService, setSelectedService] = React.useState<{ key: string; label: string } | null>(null);
  const [selectedProvider, setSelectedProvider] = React.useState<ProviderProfile | null>(null);
  const [user, setUser] = React.useState<UserProfile>({
    id: 'user-demo',
    name: 'Chirag Bhatt',
    phone: '+919930793707',
    email: 'chiragbhatt16585@gmail.com',
    addresses: [
      { id: 'addr-1', label: 'Home', line1: '502, Shreeji Heights, Andheri West, Mumbai', isDefault: true },
      { id: 'addr-2', label: 'Work', line1: 'BKC, Bandra East, Mumbai' },
    ],
  });
  const [bookings, setBookings] = React.useState<Booking[]>([
    {
      id: 'bkg-1003',
      providerId: 'p3',
      providerName: 'Ravi Kumar',
      service: 'AC gas refill',
      category: 'AC',
      total: 1299,
      scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'completed',
    },
    {
      id: 'bkg-1002',
      providerId: 'p2',
      providerName: 'Priya Verma',
      service: 'Wiring repair',
      category: 'Electrician',
      total: 799,
      scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: 'completed',
    },
    {
      id: 'bkg-1001',
      providerId: 'p1',
      providerName: 'Amit Sharma',
      service: 'Leak fix',
      category: 'Plumber',
      total: 499,
      scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
      status: 'completed',
    },
  ]);
  const [homeTab, setHomeTab] = React.useState<'home' | 'explore' | 'bookings' | 'account' | 'vendor'>('home');
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [demoVendor] = React.useState<Vendor>({
    id: 'vnd-1',
    name: 'Riya Sharma',
    category: 'Beautician',
    commissionRatePercent: 20,
    earningsMonthToDate: 24850,
    pendingPayout: 3200,
    totalBookings: 42,
    upcoming: [
      { id: 'vb-3', clientName: 'Aditi', service: 'Home facial', scheduledAt: new Date(Date.now()+1000*60*60*24).toISOString(), amount: 999, status: 'upcoming' },
      { id: 'vb-4', clientName: 'Meera', service: 'Waxing', scheduledAt: new Date(Date.now()+1000*60*60*48).toISOString(), amount: 799, status: 'upcoming' },
    ],
    history: [
      { id: 'vb-2', clientName: 'Neha', service: 'Hair spa', scheduledAt: new Date(Date.now()-1000*60*60*24*2).toISOString(), amount: 1299, status: 'completed' },
      { id: 'vb-1', clientName: 'Puja', service: 'Manicure & Pedicure', scheduledAt: new Date(Date.now()-1000*60*60*24*5).toISOString(), amount: 1499, status: 'completed' },
    ],
  });
  // const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);

  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#0B0D0F' : '#FFFFFF',
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      card: isDarkMode ? '#12161A' : '#F8F9FB',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
      accent: '#111111',
      accentText: '#FFFFFF',
    }),
    [isDarkMode]
  );

  const openService = React.useCallback((key: string, label: string) => {
    setSelectedService({ key, label });
    setRoute('service');
  }, []);

  const openProfile = React.useCallback((provider: ProviderProfile) => {
    setSelectedProvider(provider);
    setRoute('profile');
  }, []);

  const openBooking = React.useCallback((provider: ProviderProfile) => {
    setSelectedProvider(provider);
    setRoute('booking');
  }, []);
  const handleSearch = React.useCallback(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    const labels: Record<string, string> = {
      plumber: 'Plumber', electrician: 'Electrician', carpenter: 'Carpenter', ac: 'AC Repair', salon: 'Salon at Home', tutor: 'Tutor', cleaning: 'Cleaning', pest: 'Pest Control', painting: 'Painting', appliances: 'Appliance Repair', moving: 'Packers & Movers', gardening: 'Gardening', carwash: 'Car Wash', laptop: 'Laptop Repair',
    };
    const synonyms: Record<string, string[]> = {
      plumber: ['plumber','plumbing','leak','pipe','tap'],
      electrician: ['electrician','electric','wire','wiring','switch'],
      carpenter: ['carpenter','wood','furniture'],
      ac: ['ac','a/c','ac repair','air conditioner','cooling'],
      salon: ['salon','beauty','parlour','salon at home'],
      tutor: ['tutor','teacher','coaching','tuition'],
      cleaning: ['cleaning','housekeeping','maid'],
      pest: ['pest','termite','cockroach','mosquito'],
      painting: ['painting','painter','paint'],
      appliances: ['appliance','fridge','washing machine','oven','tv','microwave'],
      moving: ['moving','movers','packers','relocation'],
      gardening: ['garden','gardening','lawn'],
      carwash: ['car wash','carwash','wash car'],
      laptop: ['laptop','laptop repair','computer','pc'],
    };
    let foundKey: string | null = null;
    for (const [key, list] of Object.entries(synonyms)) {
      if (q === key || list.some(s => q === s || q.includes(s))) { foundKey = key; break; }
    }
    if (foundKey) { openService(foundKey, labels[foundKey] ?? foundKey); setSearchQuery(''); } else { setRoute('allCategories'); }
  }, [searchQuery, openService]);
  // Auth / onboarding routes
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
        <MobileAuthScreen onBack={() => setRoute('login')} onSuccess={(phone) => { setUser(prev => ({ ...prev, id: 'user-'+Date.now(), name: prev.name === 'Guest' ? 'User' : prev.name, phone })); setRoute('home'); }} />
      </View>
    );
  }

  if (route === 'locationAsk') {
    return (
      <View style={[styles.container, { backgroundColor: '#FBFCFD', paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <LocationAskScreen
          onBack={() => setRoute('login')}
          onUseCurrent={() => setRoute('home')}
          onEnterManually={() => setRoute('home')}
        />
      </View>
    );
  }
  if (route === 'service' && selectedService) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <ServiceListScreen
          serviceKey={selectedService.key}
          serviceLabel={selectedService.label}
          onBack={() => setRoute('home')}
          onViewProfile={openProfile}
          onBook={openBooking}
        />
      </View>
    );
  }

  if (route === 'next') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <NextScreen onBack={() => setRoute('home')} />
      </View>
    );
  }

  if (route === 'profile' && selectedProvider) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <ProviderProfileScreen provider={selectedProvider} onBack={() => setRoute('service')} onBook={openBooking} onChat={(p) => { setSelectedProvider(p); setRoute('chat'); }} />
      </View>
    );
  }

  if (route === 'booking' && selectedProvider) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <BookingScreen
          provider={selectedProvider}
          onBack={() => setRoute(selectedService ? 'service' : 'home')}
          onConfirm={({ service, dayOffset, slot, addressType, addressLine, notes, total }) => {
            const when = new Date();
            when.setDate(when.getDate() + dayOffset);
            const [h, m] = slot.split(':');
            when.setHours(Number(h), Number(m), 0, 0);
            setBookings(prev => [
              { id: 'bkg-'+Date.now(), providerId: selectedProvider.id, providerName: selectedProvider.name, service, total, scheduledAt: when.toISOString(), status: 'confirmed', category: selectedService?.label },
              ...prev,
            ]);
            setHomeTab('bookings');
            setRoute('home');
          }}
        />
      </View>
    );
  }

  if (route === 'account') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <AccountScreen user={user} bookings={bookings} onBack={() => setRoute('home')} onManageAddresses={() => setRoute('addresses')} />
      </View>
    );
  }

  if (route === 'addresses') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <ManageAddressesScreen
          addresses={user.addresses}
          onBack={() => setRoute('account')}
          onSave={(addresses) => { setUser(prev => ({ ...prev, addresses })); setRoute('account'); }}
        />
      </View>
    );
  }

  if (route === 'allCategories') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <AllCategoriesScreen
          onBack={() => setRoute('home')}
          onSelectCategory={(key, label) => {
            setSelectedService({ key, label });
            setRoute('service');
          }}
        />
      </View>
    );
  }

  if (route === 'bookingDetail' && selectedBooking) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <BookingDetailScreen
          booking={selectedBooking}
          onBack={() => setRoute('home')}
          onSaveReview={(rating, comment) => {
            setBookings(prev => prev.map(b => (b.id === selectedBooking.id ? { ...b, rating, comment, status: 'completed' } : b)));
            setRoute('home');
          }}
          allBookings={bookings}
          showHistory={false}
        />
      </View>
    );
  }

  if (route === 'vendor') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <VendorDashboardScreen vendor={demoVendor} onBack={() => setRoute('home')} onSwitchToCustomer={() => setRoute('home')} onOpenProfile={() => setRoute('vendorProfile')} />
      </View>
    );
  }

  if (route === 'chat' && selectedProvider) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <ChatScreen provider={selectedProvider} onBack={() => setRoute('profile')} />
      </View>
    );
  }

  if (route === 'vendorProfile') {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <VendorProfileScreen vendor={demoVendor} onBack={() => setRoute('vendor')} />
      </View>
    );
  }

  const renderHomeContent = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.heroCard, styles.shadowMedium, { backgroundColor: colors.background, borderColor: colors.border }]}> 
        <Text style={[styles.heroKicker, { color: colors.textMuted }]}>Trusted home & daily services</Text>
        <Text style={[styles.heroHeading, { color: colors.textPrimary }]}>Book verified professionals near you</Text>
        <Text style={[styles.heroBody, { color: colors.textMuted }]}>Fast matching by proximity, trust score, and price. Pay securely via UPI or card.</Text>

        <View style={styles.segmentRow}>
          {['Now', 'Schedule'].map((label, index) => (
            <View key={label} style={[styles.segmentItem, index === 0 ? styles.segmentActive : styles.segment]}> 
              <Text style={[styles.segmentText, index === 0 ? styles.segmentTextActive : null]}> {label} </Text>
            </View>
          ))}
        </View>

        <View style={styles.searchRow}>
          <Pressable onPress={handleSearch}><Text style={styles.searchIcon}>🔍</Text></Pressable>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable
            placeholder="Search a service (plumber, electrician, AC, etc.)"
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInputBare, { color: colors.textPrimary }]}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <Pressable style={[styles.locBtn, { borderColor: colors.border }]}> 
            <Text style={styles.locIcon}>📍</Text>
          </Pressable>
        </View>

        <View style={styles.quickRow}>
          {['Plumber', 'Electrician', 'Cleaning', 'Salon at home'].map(x => (
            <Pressable
              key={x}
              style={[styles.quickPill]}
              onPress={() => {
                const map: Record<string, string> = {
                  Plumber: 'plumber',
                  Electrician: 'electrician',
                  Cleaning: 'cleaning',
                  'Salon at home': 'salon',
                };
                openService(map[x] ?? x.toLowerCase(), x);
              }}
            >
              <Text style={{ fontSize: 12 }}> {x} </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionIcon]}>✨</Text>
        <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>Popular categories</Text>
      </View>
      <View style={styles.gridModern}>
        {[
          { key: 'plumber', label: 'Plumber', icon: '🛠️', tone: '#E9EEF9' },
          { key: 'electrician', label: 'Electrician', icon: '🔌', tone: '#F4ECF7' },
          { key: 'carpenter', label: 'Carpenter', icon: '🪚', tone: '#F0F5F2' },
          { key: 'ac', label: 'AC Repair', icon: '❄️', tone: '#ECF6FB' },
          { key: 'salon', label: 'Salon at Home', icon: '💇‍♀️', tone: '#FEF3F2' },
          { key: 'tutor', label: 'Tutor', icon: '📚', tone: '#F8F1E7' },
        ].map(({ key, label, icon, tone }) => (
          <Pressable
            key={key}
            style={[styles.modernCard, styles.shadowLight, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={() => openService(key, label)}
          > 
            <View style={[styles.modernThumb, { backgroundColor: tone }]}> 
              <Text style={styles.modernIcon}>{icon}</Text>
            </View>
            <Text style={[styles.modernLabel, { color: colors.textPrimary }]} numberOfLines={1}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={[styles.ctaSecondary, { borderColor: colors.border }]} onPress={() => setRoute('allCategories')}> 
        <Text style={[styles.ctaSecondaryText, { color: colors.textPrimary }]}>View all services</Text>
      </Pressable>

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionIcon]}>🛡️</Text>
        <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>Why NearMate</Text>
      </View>
      <View style={styles.featureGrid}>
        {[
          { t: 'Verified & insured', s: 'Aadhaar/PAN verified, reviews & work history' },
          { t: 'Upfront pricing', s: 'Smart recommendations within your budget' },
          { t: 'Fast response', s: 'Instant matching based on proximity' },
          { t: 'Secure payments', s: 'UPI, cards, wallet with protection' },
          { t: '24/7 emergency', s: 'Prioritized help for urgent cases' },
          { t: 'Private chat/calls', s: 'In‑app chat & masked voice calls' },
        ].map(({ t, s }) => (
          <View key={t} style={[styles.featureCard, styles.shadowLight, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{t}</Text>
            <Text style={[styles.featureSub, { color: colors.textMuted }]}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionIcon]}>📈</Text>
        <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>For providers</Text>
      </View>
      <View style={[styles.providerBanner, styles.shadowMedium, { backgroundColor: colors.background, borderColor: colors.border }]}> 
        <Text style={[styles.providerTitle, { color: colors.textPrimary }]}>Grow with NearMate</Text>
        <Text style={[styles.providerBody, { color: colors.textMuted }]}>Accept jobs, set availability, track earnings, and boost your profile.</Text>
        <View style={styles.providerRow}> 
          <Text style={[styles.providerPill]}>Premium badge</Text>
          <Text style={[styles.providerPill]}>Featured listing</Text>
          <Text style={[styles.providerPill]}>Analytics</Text>
        </View>
        <Pressable style={[styles.ctaSecondary, { borderColor: colors.border }]}> 
          <Text style={[styles.ctaSecondaryText, { color: colors.textPrimary }]}>Become a provider</Text>
        </Pressable>
      </View>

      <View style={{ height: 96 }} />
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
      <Header />
      {homeTab === 'home' && renderHomeContent()}
      {homeTab === 'explore' && (<NextScreen onBack={() => setHomeTab('home')} showHeader={false} />)}
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
        <VendorDashboardScreen vendor={demoVendor} onBack={() => setHomeTab('home')} onSwitchToCustomer={() => setHomeTab('home')} onOpenProfile={() => setRoute('vendorProfile')} />
      )}

      <BottomTabs value={homeTab} onChange={setHomeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },
  brandLogo: {
    width: 40,
    height: 35,
    borderRadius: 6,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  helpBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  helpText: {
    fontSize: 13,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  heroKicker: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  heroHeading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentItem: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    borderWidth: 1,
    borderColor: '#E6E8EB',
  },
  segmentActive: {
    backgroundColor: '#111111',
  },
  segmentText: {
    fontSize: 13,
    color: '#687076',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchRow: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ECEEF0',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF0A',
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInputBare: {
    flex: 1,
    fontSize: 14,
  },
  locBtn: {
    height: 28,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  locIcon: {
    fontSize: 15,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPill: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  gridModern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modernCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  modernThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernIcon: {
    fontSize: 20,
  },
  modernLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  featureSub: {
    fontSize: 12,
    lineHeight: 18,
  },
  providerBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  providerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  providerBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  providerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerPill: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#EEF2F6',
  },
  bottomSpacer: {
    height: 96,
  },
  bottomCtaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  ctaPrimary: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  ctaSecondary: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 6,
  },
  ctaSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  shadowLight: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  shadowUp: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
});

export default App;
