import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useColorScheme } from 'react-native';
import Header from '../components/Header';

type AllCategoriesScreenProps = {
  onBack: () => void;
  onSelectCategory: (key: string, label: string) => void;
  showHeader?: boolean;
};

const CATEGORIES: { key: string; label: string; icon: string; tone: string }[] = [
  { key: 'plumber', label: 'Plumber', icon: '🛠️', tone: '#E9EEF9' },
  { key: 'electrician', label: 'Electrician', icon: '🔌', tone: '#F4ECF7' },
  { key: 'carpenter', label: 'Carpenter', icon: '🪚', tone: '#F0F5F2' },
  { key: 'ac', label: 'AC Repair', icon: '❄️', tone: '#ECF6FB' },
  { key: 'salon', label: 'Salon at Home', icon: '💇‍♀️', tone: '#FEF3F2' },
  { key: 'tutor', label: 'Tutor', icon: '📚', tone: '#F8F1E7' },
  { key: 'cleaning', label: 'Cleaning', icon: '🧹', tone: '#F3F6EE' },
  { key: 'pest', label: 'Pest Control', icon: '🐜', tone: '#FDF6E7' },
  { key: 'painting', label: 'Painting', icon: '🎨', tone: '#EAF7F3' },
  { key: 'appliances', label: 'Appliance Repair', icon: '🧺', tone: '#F0F0FF' },
  { key: 'moving', label: 'Packers & Movers', icon: '📦', tone: '#FFF0F0' },
  { key: 'gardening', label: 'Gardening', icon: '🌿', tone: '#EAF6EA' },
  { key: 'carwash', label: 'Car Wash', icon: '🚗', tone: '#EAF3FB' },
  { key: 'laptop', label: 'Laptop Repair', icon: '💻', tone: '#F2F2F2' },
];

export default function AllCategoriesScreen({ onBack, onSelectCategory, showHeader = true }: AllCategoriesScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#0B0D0F' : '#FFFFFF',
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
    }),
    [isDarkMode]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      {showHeader ? <Header title="All services" onBack={onBack} /> : null}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}> 
          {CATEGORIES.map(({ key, label, icon, tone }) => (
            <Pressable key={key} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.background }]} onPress={() => onSelectCategory(key, label)}> 
              <View style={[styles.thumb, { backgroundColor: tone }]}> 
                <Text style={styles.icon}>{icon}</Text>
              </View>
              <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', borderWidth: 1, borderRadius: 14, padding: 12, gap: 10 },
  thumb: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
  name: { fontSize: 14, fontWeight: '600' },
});


