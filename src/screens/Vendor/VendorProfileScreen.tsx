import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import Header from '../../components/Header';
import type { Vendor } from '../../types/vendor';

type VendorProfileScreenProps = {
  vendor: Vendor;
  onBack: () => void;
};

export default function VendorProfileScreen({ vendor, onBack }: VendorProfileScreenProps) {
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

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title="Vendor profile" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.title, { color: colors.textPrimary }]}>{vendor.name}</Text>
          <Text style={{ color: colors.textMuted }}>{vendor.category}</Text>
          <Text style={{ color: colors.textMuted }}>{vendor.phone ?? ''}</Text>
          {vendor.rating ? (
            <Text style={{ color: colors.textMuted }}>★ {vendor.rating.toFixed(1)} {vendor.jobs ? `• ${vendor.jobs} jobs` : ''}</Text>
          ) : null}
          {vendor.bio ? (
            <Text style={{ color: colors.textMuted, marginTop: 4 }}>{vendor.bio}</Text>
          ) : null}
        </View>

        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Services</Text>
          {(vendor.services ?? []).length === 0 ? (
            <Text style={{ color: colors.textMuted }}>No services configured.</Text>
          ) : (
            vendor.services!.map(s => (
              <View key={s.id} style={styles.rowBetween}> 
                <Text style={[styles.item, { color: colors.textPrimary }]}>{s.name}</Text>
                <Text style={[styles.value, { color: colors.textPrimary }]}>From ₹{s.basePrice}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 6 },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  label: { fontSize: 14, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '700' },
});


