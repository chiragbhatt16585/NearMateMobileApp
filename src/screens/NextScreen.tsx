import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useColorScheme } from 'react-native';
import Header from '../components/Header';

type NextScreenProps = {
  onBack: () => void;
  showHeader?: boolean;
};

export default function NextScreen({ onBack, showHeader = true }: NextScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#0B0D0F' : '#FFFFFF',
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      card: isDarkMode ? '#12161A' : '#F8F9FB',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
      accent: '#111111',
      accentText: '#FFFFFF',
    }),
    [isDarkMode]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      {showHeader ? <Header title="Explore" onBack={onBack} /> : null}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Nearby offers</Text>
          <Text style={[styles.cardSub, { color: colors.textMuted }]}>Curated deals from trusted providers around you.</Text>
        </View>

        <View style={styles.grid}> 
          {[
            { t: 'Recommended for you', s: 'Based on your interests', k: 'rec' },
            { t: 'Top rated', s: 'Highest reviews', k: 'top' },
            { t: 'Quick response', s: 'Fast arrival', k: 'fast' },
            { t: 'Budget friendly', s: 'Great value', k: 'budget' },
          ].map(({ t, s, k }) => (
            <View key={k} style={[styles.gridCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
              <Text style={[styles.gridTitle, { color: colors.textPrimary }]} numberOfLines={1}>{t}</Text>
              <Text style={[styles.gridSub, { color: colors.textMuted }]} numberOfLines={1}>{s}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
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
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  gridSub: {
    fontSize: 12,
    color: '#687076',
  },
});


