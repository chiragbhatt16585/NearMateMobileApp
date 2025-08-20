import React from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';

type TabKey = 'home' | 'explore' | 'bookings' | 'account' | 'vendor';

type BottomTabsProps = {
  value: TabKey;
  onChange: (next: TabKey) => void;
};

export default function BottomTabs({ value, onChange }: BottomTabsProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#0F1215' : '#FBFCFD',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
      active: '#111111',
      activeText: '#FFFFFF',
      text: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
    }),
    [isDarkMode]
  );

  const items: { key: TabKey; icon: string; label: string }[] = [
    { key: 'home', icon: '🏠', label: 'Home' },
    { key: 'explore', icon: '🔎', label: 'Explore' },
    { key: 'bookings', icon: '📋', label: 'Bookings' },
    { key: 'account', icon: '👤', label: 'Account' },
    { key: 'vendor', icon: '💼', label: 'Vendor' },
  ];

  return (
    <View style={[styles.bar, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
      {items.map(it => {
        const active = value === it.key;
        return (
          <Pressable key={it.key} style={styles.item} onPress={() => onChange(it.key)}> 
            <Text style={[styles.icon, { color: active ? colors.active : colors.text }]}>{it.icon}</Text>
            <Text style={[styles.label, { color: active ? colors.text : colors.textMuted }]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  icon: { fontSize: 18 },
  label: { fontSize: 11, fontWeight: '600' },
});


