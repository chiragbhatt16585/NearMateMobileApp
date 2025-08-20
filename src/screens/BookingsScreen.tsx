import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Pressable } from 'react-native';
import Header from '../components/Header';
import type { Booking } from '../types/user';

type BookingsScreenProps = {
  bookings: Booking[];
  onBack: () => void;
  showHeader?: boolean;
  onOpenDetail?: (b: Booking) => void;
};

export default function BookingsScreen({ bookings, onBack, showHeader = true, onOpenDetail }: BookingsScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#0B0D0F' : '#FFFFFF',
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
    }),
    [isDarkMode]
  );

  const categories = ['All', 'Plumber', 'Electrician', 'AC', 'Salon', 'Tutor', 'Cleaning', 'Carpenter'];
  const [selectedCat, setSelectedCat] = React.useState<string>('All');
  const filtered = React.useMemo(
    () =>
      bookings.filter(b =>
        selectedCat === 'All' ? true : (b.category ?? 'Other').toLowerCase() === selectedCat.toLowerCase()
      ),
    [bookings, selectedCat]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      {showHeader ? <Header title="Bookings" onBack={onBack} /> : null}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersRow}> 
          {categories.map(c => {
            const active = selectedCat === c;
            return (
              <Pressable key={c} onPress={() => setSelectedCat(c)} style={[styles.filterPill, { borderColor: colors.border }, active ? [styles.filterActive, { backgroundColor: '#111111' }] : null]}> 
                <Text style={[styles.filterText, active ? { color: '#FFFFFF' } : { color: colors.textPrimary }]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>

        {filtered.length === 0 ? (
          <Text style={{ color: colors.textMuted }}>No bookings yet.</Text>
        ) : filtered.map(b => (
          <Pressable key={b.id} style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => onOpenDetail?.(b)}> 
            <Text style={[styles.title, { color: colors.textPrimary }]}>{b.providerName} · {b.service}</Text>
            <Text style={{ color: colors.textMuted }}>{new Date(b.scheduledAt).toLocaleString()} • {b.status}</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>₹{b.total}</Text>
          </Pressable>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterPill: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 },
  filterActive: {},
  filterText: { fontSize: 12, fontWeight: '600' },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  title: { fontSize: 14, fontWeight: '700' },
  value: { fontSize: 14, fontWeight: '700' },
});


