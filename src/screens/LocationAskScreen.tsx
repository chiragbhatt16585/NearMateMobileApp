import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import Header from '../components/Header';

type LocationAskScreenProps = {
  onUseCurrent: () => void;
  onEnterManually: () => void;
  onBack?: () => void;
};

export default function LocationAskScreen({ onUseCurrent, onEnterManually, onBack }: LocationAskScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const colors = React.useMemo(
    () => ({
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
      <Header title="Where do you want your service?" onBack={onBack} />

      <View style={styles.body}> 
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Choose a location to find nearby professionals.</Text>

        <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={onUseCurrent}> 
          <Text style={[styles.primaryText, { color: colors.accentText }]}>Use current location</Text>
        </Pressable>
        <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={onEnterManually}> 
          <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>Enter location manually</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  subtitle: { fontSize: 13, lineHeight: 18 },
  primaryBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryText: { fontSize: 16, fontWeight: '600' },
});


