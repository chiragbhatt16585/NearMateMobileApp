import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, useColorScheme } from 'react-native';
import Header from '../components/Header';
import type { ProviderProfile } from './ProviderProfileScreen';

type BookingScreenProps = {
  provider: ProviderProfile;
  onBack: () => void;
  onConfirm: (details: {
    service: string;
    dayOffset: number;
    slot: string;
    addressType: 'current' | 'manual';
    addressLine?: string;
    notes?: string;
    total: number;
  }) => void;
};

export default function BookingScreen({ provider, onBack, onConfirm }: BookingScreenProps) {
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

  const services = ['Leak fix', 'Tap install', 'Drain unclog', 'Bathroom fitting'];
  const slots = ['09:00', '11:00', '14:00', '16:00', '18:00'];
  const [service, setService] = React.useState<string>(services[0]);
  const [dayOffset, setDayOffset] = React.useState<number>(0);
  const [slot, setSlot] = React.useState<string>(slots[2]);
  const [addressType, setAddressType] = React.useState<'current' | 'manual'>('current');
  const [addressLine, setAddressLine] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');

  const base = provider.priceFrom;
  const convenience = 29;
  const total = base + convenience;

  const days = React.useMemo(() => {
    const d: { label: string; offset: number }[] = [];
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    for (let i = 0; i < 7; i += 1) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      const label = i === 0 ? 'Today' : `${names[dt.getDay()]} ${dt.getDate()}`;
      d.push({ label, offset: i });
    }
    return d;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title="Confirm booking" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.title, { color: colors.textPrimary }]}>{provider.name}</Text>
          <Text style={[styles.subtle, { color: colors.textMuted }]}>★ {provider.rating.toFixed(1)} • {provider.jobs} jobs • {provider.distanceKm} km</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Service</Text>
          <View style={styles.rowWrap}> 
            {services.map(s => (
              <Pressable key={s} onPress={() => setService(s)} style={[styles.pill, service === s ? [styles.pillActive, { backgroundColor: colors.accent }] : { borderColor: colors.border }]}> 
                <Text style={[styles.pillText, service === s ? { color: colors.accentText } : { color: colors.textPrimary }]}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}> 
            {days.map(d => (
              <Pressable key={d.offset} onPress={() => setDayOffset(d.offset)} style={[styles.dayBox, { borderColor: colors.border }, dayOffset === d.offset ? [styles.dayActive, { backgroundColor: colors.accent }] : null]}> 
                <Text style={[styles.dayText, dayOffset === d.offset ? { color: colors.accentText } : { color: colors.textPrimary }]}>{d.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Time</Text>
          <View style={styles.rowWrap}> 
            {slots.map(t => (
              <Pressable key={t} onPress={() => setSlot(t)} style={[styles.pill, slot === t ? [styles.pillActive, { backgroundColor: colors.accent }] : { borderColor: colors.border }]}> 
                <Text style={[styles.pillText, slot === t ? { color: colors.accentText } : { color: colors.textPrimary }]}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Address</Text>
          <View style={styles.rowWrap}> 
            {['current', 'manual'].map(a => (
              <Pressable key={a} onPress={() => setAddressType(a as 'current' | 'manual')} style={[styles.pill, addressType === a ? [styles.pillActive, { backgroundColor: colors.accent }] : { borderColor: colors.border }]}> 
                <Text style={[styles.pillText, addressType === a ? { color: colors.accentText } : { color: colors.textPrimary }]}>{a === 'current' ? 'Use current' : 'Enter manually'}</Text>
              </Pressable>
            ))}
          </View>
          {addressType === 'manual' ? (
            <TextInput
              placeholder="Flat, street, landmark"
              placeholderTextColor={colors.textMuted}
              value={addressLine}
              onChangeText={setAddressLine}
              style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
            />
          ) : (
            <Text style={[styles.subtle, { color: colors.textMuted }]}>We will use your device location at booking time.</Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Notes (optional)</Text>
          <TextInput
            placeholder="Anything the pro should know?"
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
            multiline
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Price summary</Text>
          <View style={styles.rowBetween}> 
            <Text style={[styles.subtle, { color: colors.textMuted }]}>Base price</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>₹{base}</Text>
          </View>
          <View style={styles.rowBetween}> 
            <Text style={[styles.subtle, { color: colors.textMuted }]}>Convenience</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>₹{convenience}</Text>
          </View>
          <View style={styles.rowBetween}> 
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.textPrimary }]}>₹{total}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
          onPress={() => onConfirm({ service, dayOffset, slot, addressType, addressLine, notes, total })}
        >
          <Text style={[styles.primaryText, { color: colors.accentText }]}>Confirm & Pay</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  title: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  label: { fontSize: 14, fontWeight: '700' },
  subtle: { fontSize: 12 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  pillActive: {},
  pillText: { fontSize: 13, fontWeight: '600' },
  dayBox: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 },
  dayActive: {},
  dayText: { fontSize: 13, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { fontSize: 14, fontWeight: '600' },
  totalLabel: { fontSize: 15, fontWeight: '800' },
  totalValue: { fontSize: 18, fontWeight: '800' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, borderTopWidth: 1 },
  primaryBtn: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '700' },
});


