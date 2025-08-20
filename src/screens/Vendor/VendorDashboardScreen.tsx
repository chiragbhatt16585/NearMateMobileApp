import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Pressable } from 'react-native';
import Header from '../../components/Header';
import type { Vendor } from '../../types/vendor';

type VendorDashboardScreenProps = {
  vendor: Vendor;
  onBack: () => void;
  onSwitchToCustomer?: () => void;
  onOpenProfile?: () => void;
};

export default function VendorDashboardScreen({ vendor, onBack, onSwitchToCustomer, onOpenProfile }: VendorDashboardScreenProps) {
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

  const mtd = vendor.earningsMonthToDate;
  const commissionRate = vendor.commissionRatePercent;
  const commission = Math.round((mtd * commissionRate) / 100);
  const payout = mtd - commission + vendor.pendingPayout;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title={`${vendor.name} · ${vendor.category}`} onBack={onBack} rightLabel={onSwitchToCustomer ? 'Customer' : undefined} onRightPress={onSwitchToCustomer} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.kicker, { color: colors.textMuted }]}>Overview</Text>
          <Pressable style={[styles.ghostBtn, { alignSelf: 'flex-start', borderColor: colors.border }]} onPress={onOpenProfile}> 
            <Text style={[styles.ghostText, { color: colors.textPrimary }]}>View profile</Text>
          </Pressable>
          <View style={styles.rowBetween}> 
            <Text style={[styles.metricTitle, { color: colors.textPrimary }]}>Bookings (MTD)</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{vendor.totalBookings}</Text>
          </View>
          <View style={styles.rowBetween}> 
            <Text style={[styles.metricTitle, { color: colors.textPrimary }]}>Earnings (MTD)</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>₹{mtd}</Text>
          </View>
          <View style={styles.rowBetween}> 
            <Text style={[styles.metricTitle, { color: colors.textPrimary }]}>Commission ({commissionRate}%)</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>₹{commission}</Text>
          </View>
          <View style={styles.rowBetween}> 
            <Text style={[styles.metricTitle, { color: colors.textPrimary }]}>Payout (incl. pending)</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>₹{payout}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Upcoming bookings</Text>
          {vendor.upcoming.length === 0 ? (
            <Text style={{ color: colors.textMuted }}>No upcoming bookings.</Text>
          ) : vendor.upcoming.map(b => (
            <View key={b.id} style={styles.rowBetween}> 
              <View style={{ flex: 1 }}> 
                <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={1}>{b.clientName} · {b.service}</Text>
                <Text style={{ color: colors.textMuted }}>{new Date(b.scheduledAt).toLocaleString()}</Text>
              </View>
              <Text style={[styles.value, { color: colors.textPrimary }]}>₹{b.amount}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={styles.rowBetween}> 
            <Text style={[styles.label, { color: colors.textPrimary }]}>Recent completed</Text>
            <Pressable style={[styles.ghostBtn, { borderColor: colors.border }]}> 
              <Text style={[styles.ghostText, { color: colors.textPrimary }]}>Export</Text>
            </Pressable>
          </View>
          {vendor.history.length === 0 ? (
            <Text style={{ color: colors.textMuted }}>No history yet.</Text>
          ) : vendor.history.slice(0, 6).map(b => (
            <View key={b.id} style={styles.rowBetween}> 
              <View style={{ flex: 1 }}> 
                <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={1}>{b.clientName} · {b.service}</Text>
                <Text style={{ color: colors.textMuted }}>{new Date(b.scheduledAt).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.value, { color: colors.textPrimary }]}>₹{b.amount}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  kicker: { fontSize: 12, textTransform: 'uppercase' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metricTitle: { fontSize: 13 },
  metricValue: { fontSize: 15, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '700' },
  itemTitle: { fontSize: 13, fontWeight: '600' },
  value: { fontSize: 14, fontWeight: '700' },
  ghostBtn: { height: 32, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  ghostText: { fontSize: 12, fontWeight: '600' },
});


