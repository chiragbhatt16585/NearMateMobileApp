import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, useColorScheme } from 'react-native';

type HeaderProps = {
  title?: string; // if not provided, shows NearMate
  onBack?: () => void; // show back if provided
  rightLabel?: string;
  onRightPress?: () => void;
};

export default function Header({ title, onBack, rightLabel, onRightPress }: HeaderProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const colors = React.useMemo(
    () => ({
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
    }),
    [isDarkMode]
  );

  const label = title ?? 'NearMate';

  return (
    <View style={[styles.container, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}> 
      {onBack ? (
        <Pressable onPress={onBack} style={[styles.backBtn, { borderColor: colors.border }]}> 
          <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
        </Pressable>
      ) : (
        <View style={{ width: 36 }} />
      )}

      <View style={styles.centerRow}> 
        <Image
          source={require('../../assets/branding/isp_logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessible
          accessibilityLabel="Logo"
        />
        <Text style={[styles.brandName, { color: colors.textPrimary }]} numberOfLines={1}>{label}</Text>
      </View>

      {rightLabel ? (
        <Pressable style={[styles.helpBtn, { borderColor: colors.border }]} onPress={onRightPress}> 
          <Text style={[styles.helpText, { color: colors.textMuted }]}>{rightLabel}</Text>
        </Pressable>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '65%',
  },
  brandLogo: {
    width: 40,
    height: 35,
    borderRadius: 6,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  helpBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  helpText: {
    fontSize: 13,
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
  title: {},
});


