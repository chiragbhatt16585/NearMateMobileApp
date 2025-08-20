import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useColorScheme, Image } from 'react-native';
import Header from '../../components/Header';

type LoginScreenProps = {
  onMobilePress: () => void;
  onSkip: () => void;
};

export default function LoginScreen({ onMobilePress, onSkip }: LoginScreenProps) {
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
      <Header title="Login" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
          <Image
            source={require('../../../assets/branding/isp_logo.png')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Welcome to NearMate</Text>
          <Text style={[styles.heroSub, { color: colors.textMuted }]}>Sign in to sync your bookings, chat with providers, and get faster support.</Text>
        </View>

        <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={onMobilePress}> 
          <Text style={[styles.primaryText, { color: colors.accentText }]}>Continue with Mobile</Text>
        </Pressable>

        <Pressable onPress={onSkip} style={styles.skipBtn}> 
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip for now</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  heroLogo: {
    width: 72,
    height: 64,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  primaryBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});


