import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Partner } from '../services/api';


interface ProviderProfileScreenProps {
  provider: Partner;
  onBack: () => void;
  onBook: (provider: Partner) => void;
  onChat: (provider: Partner) => void;
}

export default function ProviderProfileScreen({ provider, onBack, onBook, onChat }: ProviderProfileScreenProps) {
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
      good: '#16a34a',
      warn: '#ca8a04',
    }),
    [isDarkMode]
  );

  const getMainCategory = () => {
    if (provider.categories && provider.categories.length > 0) {
      return provider.categories[0].serviceCategory.label;
    }
    return 'Service Provider';
  };

  const getPriceText = () => {
    if (provider.pricingType === 'hourly') {
      return `₹${provider.priceMin}/hr - ₹${provider.priceMax}/hr`;
    } else if (provider.pricingType === 'fixed') {
      return `₹${provider.priceMin} - ₹${provider.priceMax}`;
    }
    return 'Contact for pricing';
  };

  const getStatusColor = () => (provider.isAvailable ? colors.good : colors.warn);
  const getStatusText = () => (provider.isAvailable ? 'Available' : 'Currently Busy');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>


        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={styles.headerRow}> 
            <View style={[styles.avatar, { backgroundColor: '#ECF6FB' }]}> 
              <Text style={styles.avatarText}>{provider.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}> 
              <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{provider.name}</Text>
              <Text style={[styles.subtle, { color: colors.textMuted }]}>{getMainCategory()}</Text>
              <View style={styles.statusRow}> 
                <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
                <Text style={[styles.subtle, { color: colors.textMuted }]}>{getStatusText()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.rowBetween}> 
            <Text style={[styles.label, { color: colors.textPrimary }]}>Pricing</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{getPriceText()}</Text>
          </View>

          <View style={styles.rowBetween}> 
            <Text style={[styles.label, { color: colors.textPrimary }]}>Phone</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{provider.phone ?? '—'}</Text>
          </View>

          <View style={styles.rowBetween}> 
            <Text style={[styles.label, { color: colors.textPrimary }]}>Email</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{provider.email ?? '—'}</Text>
          </View>

          <View style={styles.rowBetween}> 
            <Text style={[styles.label, { color: colors.textPrimary }]}>Service radius</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{provider.serviceRadiusKm} km</Text>
          </View>

          {provider.kycs && provider.kycs.length > 0 ? (
            <View style={{ marginTop: 10 }}> 
              <Text style={[styles.label, { color: colors.textPrimary }]}>Verification</Text>
              {provider.kycs.map(kyc => (
                <View key={kyc.id} style={styles.rowBetween}> 
                  <Text style={[styles.subtle, { color: colors.textPrimary }]}>{kyc.idType}</Text>
                  <Text style={[styles.subtle, { color: kyc.status === 'verified' ? colors.good : colors.warn }]}>
                    {kyc.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.actionsRow}> 
            <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => onChat(provider)}> 
              <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>💬 Chat</Text>
            </Pressable>
            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={() => onBook(provider)}> 
              <Text style={[styles.primaryText, { color: colors.accentText }]}>📅 Book now</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },

  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 14, fontWeight: '700' },
  value: { fontSize: 14, fontWeight: '600' },
  subtle: { fontSize: 12 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  secondaryBtn: { height: 44, flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  secondaryText: { fontSize: 14, fontWeight: '600' },
  primaryBtn: { height: 44, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 14, fontWeight: '700' },
});


