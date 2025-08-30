import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { Partner, ServiceCategory } from '../services/api';


interface ServiceListScreenProps {
  category: ServiceCategory;
  onBack: () => void;
  onViewProfile: (provider: Partner) => void;
  onBook: (provider: Partner) => void;
}

export default function ServiceListScreen({ category, onBack, onViewProfile, onBook }: ServiceListScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [providers, setProviders] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadProviders();
  }, [category]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { apiClient } = await import('../services/api');
      const allPartners = await apiClient.getPartners();
      const filteredPartners = allPartners.filter(partner => 
        partner.categories.some(partnerCat => partnerCat.serviceCategory.key === category.key)
      );
      setProviders(filteredPartners);
    } catch (err: any) {
      setError(err.message || 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const getPriceText = (provider: Partner) => {
    if (provider.pricingType === 'hourly') return `₹${provider.priceMin}/hr - ₹${provider.priceMax}/hr`;
    if (provider.pricingType === 'fixed') return `₹${provider.priceMin} - ₹${provider.priceMax}`;
    return 'Contact for pricing';
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading providers...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: '#ff6b6b' }]}>{error}</Text>
            <Pressable style={[styles.retryBtn, { borderColor: colors.border }]} onPress={loadProviders}>
              <Text style={[styles.retryText, { color: colors.textPrimary }]}>Retry</Text>
            </Pressable>
          </View>
        ) : null}



        <View style={styles.metaRow}> 
          <Text style={[styles.metaText, { color: colors.textMuted }]}>Showing {providers.length} {category.label} near you</Text>
        </View>

        {providers.map(provider => (
          <View key={provider.id} style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <View style={styles.cardHeader}> 
              <View style={[styles.avatar, { backgroundColor: '#ECF6FB' }]}> 
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View style={{ flex: 1 }}> 
                <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{provider.name}</Text>
                <View style={styles.rowSmall}> 
                  <Text style={[styles.badge, { color: colors.accent }]}>{provider.plan ?? 'Verified'}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}> 
                <Text style={[styles.rating, { color: colors.textPrimary }]}>{provider.isAvailable ? 'Available' : 'Busy'}</Text>
                <Text style={[styles.subtle, { color: colors.textMuted }]}>{provider.serviceRadiusKm} km radius</Text>
              </View>
            </View>

            <View style={styles.cardBody}> 
              <Text style={[styles.subtle, { color: colors.textMuted }]}>{provider.phone ?? provider.email ?? ''}</Text>
              <Text style={[styles.price, { color: colors.textPrimary }]}>{getPriceText(provider)}</Text>
            </View>

            <View style={styles.cardFooter}> 
              <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => onViewProfile(provider)}> 
                <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>View profile</Text>
              </Pressable>
              <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={() => onBook(provider)}> 
                <Text style={[styles.primaryText, { color: colors.accentText }]}>Book</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 14 },
  errorContainer: { alignItems: 'center', paddingVertical: 12 },
  errorText: { fontSize: 14, marginBottom: 8 },
  retryBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  retryText: { fontSize: 14, fontWeight: '600' },
  metaRow: { paddingTop: 2 },
  metaText: { fontSize: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 14, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20 },
  name: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  rowSmall: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { fontSize: 12, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, backgroundColor: '#F4F6F8' },
  rating: { fontSize: 14, fontWeight: '700' },
  subtle: { fontSize: 12 },
  cardBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: '700' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  secondaryBtn: { height: 40, flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  secondaryText: { fontSize: 14, fontWeight: '600' },
  primaryBtn: { height: 40, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 14, fontWeight: '700' },
});


