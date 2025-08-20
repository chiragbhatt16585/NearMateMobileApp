import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { ServiceCategory } from '../services/api';

interface AllCategoriesScreenProps {
  onBack: () => void;
  onSelectCategory: (category: ServiceCategory) => void;
}

export default function AllCategoriesScreen({ onBack, onSelectCategory }: AllCategoriesScreenProps) {
  const colorScheme = useColorScheme();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = React.useMemo(() => ({
    background: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
    surface: colorScheme === 'dark' ? '#2a2a2a' : '#f8f9fa',
    textPrimary: colorScheme === 'dark' ? '#ffffff' : '#1a1a1a',
    textSecondary: colorScheme === 'dark' ? '#cccccc' : '#666666',
    border: colorScheme === 'dark' ? '#404040' : '#e0e0e0',
    primary: '#007AFF',
  }), [colorScheme]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Import the API client dynamically to avoid circular dependencies
      const { apiClient } = await import('../services/api');
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      
      // Fallback to mock data if API fails
      setCategories([
        { id: '1', key: 'plumber', label: 'Plumber', icon: '🛠️', tone: '#E9EEF9', popular: false, createdAt: '', updatedAt: '' },
        { id: '2', key: 'electrician', label: 'Electrician', icon: '🔌', tone: '#F4ECF7', popular: false, createdAt: '', updatedAt: '' },
        { id: '3', key: 'carpenter', label: 'Carpenter', icon: '🪚', tone: '#F0F5F2', popular: false, createdAt: '', updatedAt: '' },
        { id: '4', key: 'ac', label: 'AC Repair', icon: '❄️', tone: '#ECF6FB', popular: false, createdAt: '', updatedAt: '' },
        { id: '5', key: 'salon', label: 'Salon at Home', icon: '💇‍♀️', tone: '#FEF3F2', popular: false, createdAt: '', updatedAt: '' },
        { id: '6', key: 'tutor', label: 'Tutor', icon: '📚', tone: '#F8F1E7', popular: false, createdAt: '', updatedAt: '' },
        { id: '7', key: 'cleaning', label: 'Cleaning', icon: '🧹', tone: '#F3F6EE', popular: false, createdAt: '', updatedAt: '' },
        { id: '8', key: 'pest', label: 'Pest Control', icon: '🐜', tone: '#FDF6E7', popular: false, createdAt: '', updatedAt: '' },
        { id: '9', key: 'painting', label: 'Painting', icon: '🎨', tone: '#EAF7F3', popular: false, createdAt: '', updatedAt: '' },
        { id: '10', key: 'appliances', label: 'Appliance Repair', icon: '🧺', tone: '#F0F0FF', popular: false, createdAt: '', updatedAt: '' },
        { id: '11', key: 'moving', label: 'Packers & Movers', icon: '📦', tone: '#FFF0F0', popular: false, createdAt: '', updatedAt: '' },
        { id: '12', key: 'gardening', label: 'Gardening', icon: '🌿', tone: '#EAF6EA', popular: false, createdAt: '', updatedAt: '' },
        { id: '13', key: 'carwash', label: 'Car Wash', icon: '🚗', tone: '#EAF3FB', popular: false, createdAt: '', updatedAt: '' },
        { id: '14', key: 'laptop', label: 'Laptop Repair', icon: '💻', tone: '#F2F2F2', popular: false, createdAt: '', updatedAt: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.textPrimary }]}>All Services</Text>
          <View style={styles.rightSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading services...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>All Services</Text>
        <View style={styles.rightSpacer} />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#ff6b6b' }]}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadCategories}>
            <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
          </Pressable>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => onSelectCategory(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon || '🔧'}</Text>
              <Text style={[styles.categoryLabel, { color: colors.textPrimary }]}>{category.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  rightSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});


