import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useColorScheme } from 'react-native';
import Header from '../../components/Header';
import type { UserProfile, Booking } from '../../types/user';

type AccountScreenProps = {
  user: UserProfile;
  bookings: Booking[];
  onBack: () => void;
  onManageAddresses: () => void;
  showHeader?: boolean;
  showBookings?: boolean;
  onSwitchToVendor?: () => void;
};

export default function AccountScreen({ user, bookings, onBack, onManageAddresses, showHeader = true, showBookings = false, onSwitchToVendor }: AccountScreenProps) {
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

  const defaultAddress = user.addresses.find(a => a.isDefault) || user.addresses[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      {showHeader ? <Header title="Account" onBack={onBack} /> : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.title, { color: colors.textPrimary }]}>{user.name}</Text>
          <View style={styles.row}> 
            <Text style={[styles.mono, { color: colors.textPrimary }]}>{user.phone ?? '—'}</Text>
          </View>
          <View style={styles.row}> 
            <Text style={[styles.mono, { color: colors.textPrimary }]}>{user.email ?? '—'}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={styles.rowBetween}> 
            <Text style={[styles.label, { color: colors.textPrimary }]}>Default address</Text>
            <Pressable style={[styles.ghostBtn, { borderColor: colors.border }]} onPress={onManageAddresses}> 
              <Text style={[styles.ghostText, { color: colors.textPrimary }]}>Manage</Text>
            </Pressable>
          </View>
          {defaultAddress ? (
            <Text style={[styles.body, { color: colors.textMuted }]}>{defaultAddress.label}: {defaultAddress.line1}</Text>
          ) : (
            <Text style={[styles.body, { color: colors.textMuted }]}>No address</Text>
          )}
        </View>

        {showBookings ? (
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <Text style={[styles.label, { color: colors.textPrimary }]}>Booking history</Text>
            {bookings.length === 0 ? (
              <Text style={[styles.body, { color: colors.textMuted }]}>No bookings yet.</Text>
            ) : (
              bookings.map(b => (
                <View key={b.id} style={styles.bookingRow}> 
                  <View style={{ flex: 1 }}> 
                    <Text style={[styles.bookingTitle, { color: colors.textPrimary }]} numberOfLines={1}>{b.providerName} · {b.service}</Text>
                    <Text style={[styles.body, { color: colors.textMuted }]}>{new Date(b.scheduledAt).toLocaleString()}</Text>
                  </View>
                  <Text style={[styles.value, { color: colors.textPrimary }]}>₹{b.total}</Text>
                </View>
              ))
            )}
          </View>
        ) : null}

        {onSwitchToVendor ? (
          <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={onSwitchToVendor}> 
            <Text style={[styles.primaryText, { color: colors.accentText }]}>Switch to vendor</Text>
          </Pressable>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  row: { flexDirection: 'row', gap: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 14, fontWeight: '700' },
  body: { fontSize: 13 },
  mono: { fontSize: 14, fontVariant: ['tabular-nums'] },
  value: { fontSize: 14, fontWeight: '700' },
  bookingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ghostBtn: { height: 32, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  ghostText: { fontSize: 12, fontWeight: '600' },
  bookingTitle: { fontSize: 14, fontWeight: '700' },
});


