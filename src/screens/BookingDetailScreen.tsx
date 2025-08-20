import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, useColorScheme, ScrollView } from 'react-native';
import Header from '../components/Header';
import type { Booking } from '../types/user';

type BookingDetailScreenProps = {
  booking: Booking;
  onBack: () => void;
  onSaveReview: (rating: number, comment: string) => void;
  allBookings?: Booking[]; // optional, only used if showHistory is true
  showHistory?: boolean; // default false
};

export default function BookingDetailScreen({ booking, onBack, onSaveReview, allBookings = [], showHistory = false }: BookingDetailScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = React.useMemo(
    () => ({
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      background: isDarkMode ? '#0B0D0F' : '#FFFFFF',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
      accent: '#111111',
      accentText: '#FFFFFF',
    }),
    [isDarkMode]
  );

  const [rating, setRating] = React.useState<number>(booking.rating ?? 0);
  const [comment, setComment] = React.useState<string>(booking.comment ?? '');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title="Booking details" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.title, { color: colors.textPrimary }]}>{booking.providerName}</Text>
          <Text style={{ color: colors.textMuted }}>{booking.category ?? 'Service'} · {booking.service}</Text>
          <Text style={{ color: colors.textMuted }}>{new Date(booking.scheduledAt).toLocaleString()} · {booking.status}</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>₹{booking.total}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Rate your experience</Text>
          <View style={styles.starsRow}> 
            {[1,2,3,4,5].map(n => (
              <Pressable key={n} onPress={() => setRating(n)}>
                <Text style={[styles.star, { color: n <= rating ? '#f59e0b' : colors.textMuted }]}>★</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            placeholder="Leave a comment (optional)"
            placeholderTextColor={colors.textMuted}
            value={comment}
            onChangeText={setComment}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
            multiline
          />
          <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={() => onSaveReview(rating, comment)}> 
            <Text style={[styles.primaryText, { color: colors.accentText }]}>Save review</Text>
          </Pressable>
        </View>

        {showHistory && allBookings.length > 1 ? (
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <Text style={[styles.label, { color: colors.textPrimary }]}>Your services history</Text>
            {allBookings
              .filter(b => b.id !== booking.id)
              .slice(0, 6)
              .map(b => (
                <View key={b.id} style={styles.rowBetween}> 
                  <View style={{ flex: 1 }}> 
                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={1}>{b.providerName} · {b.service}</Text>
                    <Text style={{ color: colors.textMuted }}>{new Date(b.scheduledAt).toLocaleDateString()}</Text>
                  </View>
                  <Text style={[styles.value, { color: colors.textPrimary }]}>₹{b.total}</Text>
                </View>
              ))}
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  title: { fontSize: 16, fontWeight: '800' },
  label: { fontSize: 14, fontWeight: '700' },
  value: { fontSize: 16, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { fontSize: 13, fontWeight: '600' },
  starsRow: { flexDirection: 'row', gap: 6 },
  star: { fontSize: 24 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  primaryBtn: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 14, fontWeight: '700' },
});


