import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useColorScheme } from 'react-native';
import Header from '../components/Header';

export type ProviderProfile = {
  id: string;
  name: string;
  rating: number;
  jobs: number;
  distanceKm: number;
  priceFrom: number;
  badge: string;
  etaMin: number;
};

type ProviderProfileScreenProps = {
  provider: ProviderProfile;
  onBack: () => void;
  onBook?: (provider: ProviderProfile) => void;
  onChat?: (provider: ProviderProfile) => void;
};

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
    }),
    [isDarkMode]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title={provider.name} onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={[styles.avatarLg, { backgroundColor: '#ECF6FB' }]}> 
            <Text style={styles.avatarEmoji}>🔧</Text>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{provider.name}</Text>
          <View style={styles.metricsRow}> 
            <Text style={[styles.metricText, { color: colors.textPrimary }]}>★ {provider.rating.toFixed(1)}</Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.metricText, { color: colors.textPrimary }]}>{provider.jobs} jobs</Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.metricText, { color: colors.textPrimary }]}>{provider.distanceKm} km</Text>
          </View>
          <Text style={[styles.badge, { color: colors.accent }]}>{provider.badge}</Text>

          <View style={styles.actionsRow}> 
            <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]}> 
              <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>📞 Call</Text>
            </Pressable>
            <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => onChat?.(provider)}> 
              <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>💬 Chat</Text>
            </Pressable>
            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={() => onBook?.(provider)}> 
              <Text style={[styles.primaryText, { color: colors.accentText }]}>Book now</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={styles.sectionHeaderRow}> 
            <Text style={styles.sectionIcon}>ℹ️</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About</Text>
          </View>
          <Text style={[styles.sectionBody, { color: colors.textMuted }]}>Experienced professional offering reliable and affordable services. Punctual, courteous, and focused on quality workmanship.</Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={styles.sectionHeaderRow}> 
            <Text style={styles.sectionIcon}>🧰</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Services</Text>
          </View>
          {[
            'Leak detection & repair',
            'Tap & fixture installation',
            'Drain unclogging',
            'Bathroom fitting',
          ].map(s => (
            <Text key={s} style={[styles.listItem, { color: colors.textPrimary }]}>• {s}</Text>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={styles.sectionHeaderRow}> 
            <Text style={styles.sectionIcon}>💵</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Pricing</Text>
          </View>
          <Text style={[styles.sectionBody, { color: colors.textMuted }]}>Starts at ₹{provider.priceFrom}. Final quote after quick assessment. No hidden charges.</Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <View style={styles.sectionHeaderRow}> 
            <Text style={styles.sectionIcon}>⭐</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Reviews</Text>
          </View>
          {[
            { by: 'Rohit', t: 'Quick and professional. Fixed a leak in minutes.' },
            { by: 'Neha', t: 'Affordable pricing and on time.' },
          ].map((r, i) => (
            <Text key={i} style={[styles.reviewItem, { color: colors.textPrimary }]}>“{r.t}” — {r.by}</Text>
          ))}
        </View>

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
  headerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  avatarLg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dot: {
    fontSize: 14,
  },
  badge: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#F4F6F8',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
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
  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  listItem: {
    fontSize: 13,
  },
  reviewItem: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});


