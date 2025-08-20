import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useColorScheme } from 'react-native';
import Header from '../components/Header';
import type { ProviderProfile } from './ProviderProfileScreen';

type ServiceListScreenProps = {
  serviceKey: string;
  serviceLabel: string;
  onBack: () => void;
  onViewProfile: (provider: ProviderProfile) => void;
  onBook: (provider: ProviderProfile) => void;
};

export default function ServiceListScreen({ serviceKey, serviceLabel, onBack, onViewProfile, onBook }: ServiceListScreenProps) {
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

  const providers = React.useMemo(
    () => [
      { id: 'p1', name: 'Amit Sharma', rating: 4.8, jobs: 320, distanceKm: 1.2, priceFrom: 199, badge: 'Top rated', etaMin: 20 },
      { id: 'p2', name: 'Priya Verma', rating: 4.7, jobs: 210, distanceKm: 2.1, priceFrom: 179, badge: 'Great value', etaMin: 25 },
      { id: 'p3', name: 'Ravi Kumar', rating: 4.5, jobs: 150, distanceKm: 3.4, priceFrom: 149, badge: 'Quick response', etaMin: 18 },
      { id: 'p4', name: 'Suman Das', rating: 4.6, jobs: 190, distanceKm: 2.9, priceFrom: 199, badge: 'Verified', etaMin: 22 },
    ],
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title={serviceLabel} onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersRow}> 
          {['Nearby', 'Top rated', 'Under ₹500', 'Emergency'].map(x => (
            <Text key={x} style={styles.filterPill}>{x}</Text>
          ))}
        </View>

        <View style={styles.metaRow}> 
          <Text style={[styles.metaText, { color: colors.textMuted }]}>Showing {providers.length} {serviceKey} near you</Text>
        </View>

        {providers.map(p => (
          <View key={p.id} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.background }]}> 
            <View style={styles.cardHeader}> 
              <View style={[styles.avatar, { backgroundColor: '#ECF6FB' }]}> 
                <Text style={styles.avatarText}>🔧</Text>
              </View>
              <View style={{ flex: 1 }}> 
                <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{p.name}</Text>
                <View style={styles.rowSmall}> 
                  <Text style={[styles.badge, { color: colors.accent }]}>{p.badge}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}> 
                <Text style={[styles.rating, { color: colors.textPrimary }]}>★ {p.rating.toFixed(1)}</Text>
                <Text style={[styles.subtle, { color: colors.textMuted }]}>{p.jobs} jobs</Text>
              </View>
            </View>

            <View style={styles.cardBody}> 
              <Text style={[styles.subtle, { color: colors.textMuted }]}>{p.distanceKm} km • ETA {p.etaMin} min</Text>
              <Text style={[styles.price, { color: colors.textPrimary }]}>From ₹{p.priceFrom}</Text>
            </View>

            <View style={styles.cardFooter}> 
              <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => onViewProfile(p)}> 
                <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>View profile</Text>
              </Pressable>
              <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={() => onBook(p)}> 
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
  container: {
    flex: 1,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  backIcon: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#EEF2F6',
  },
  metaRow: {
    paddingTop: 2,
  },
  metaText: {
    fontSize: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  rowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#F4F6F8',
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtle: {
    fontSize: 12,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  secondaryBtn: {
    height: 40,
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryBtn: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '700',
  },
});


