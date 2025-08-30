import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, useColorScheme } from 'react-native';

type HeaderProps = {
  title?: string; // if not provided, shows NearMate
  onBack?: () => void; // show back if provided
  rightLabel?: string;
  onRightPress?: () => void;
  connectionStatus?: 'healthy' | 'connecting' | 'error';
  onRefreshConnection?: () => void;
};

export default function Header({ title, onBack, rightLabel, onRightPress, connectionStatus, onRefreshConnection }: HeaderProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const colors = React.useMemo(
    () => ({
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
      accent: '#007AFF',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
    }),
    [isDarkMode]
  );

  const label = title ?? 'NearMate';

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'healthy': return colors.success;
      case 'connecting': return colors.warning;
      case 'error': return colors.error;
      default: return colors.success;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'healthy': return '●';
      case 'connecting': return '⟳';
      case 'error': return '⚠';
      default: return '●';
    }
  };

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

      <View style={styles.right}>
        {connectionStatus && (
          <View style={styles.connectionSection}>
            <View style={[styles.connectionIndicator, { backgroundColor: getConnectionColor() }]}>
              <Text style={styles.connectionText}>{getConnectionText()}</Text>
            </View>
            {connectionStatus === 'error' && onRefreshConnection && (
              <Pressable onPress={onRefreshConnection} style={styles.refreshButton}>
                <Text style={[styles.refreshText, { color: colors.accent }]}>⟳</Text>
              </Pressable>
            )}
          </View>
        )}
        {rightLabel ? (
          <Pressable style={[styles.helpBtn, { borderColor: colors.border }]} onPress={onRightPress}> 
            <Text style={[styles.helpText, { color: colors.textMuted }]}>{rightLabel}</Text>
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>
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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  connectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  connectionText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  refreshButton: {
    padding: 4,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
  },
});


