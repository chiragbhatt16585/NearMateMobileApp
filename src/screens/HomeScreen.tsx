import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { ServiceCategory } from '../services/api';

interface HomeScreenProps {
  onNext: () => void;
  onServicePress: (category: ServiceCategory) => void;
  onViewAllServices: () => void;
  onSearch: (query: string) => void;
}

export default function HomeScreen({ onNext, onServicePress, onViewAllServices, onSearch }: HomeScreenProps) {
  const colorScheme = useColorScheme();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      
      console.log('🔄 Loading categories from API...');
      
      // Import the API client dynamically to avoid circular dependencies
      const { apiClient } = await import('../services/api');
      
      // If no token set, try dev auto-login
      if (!apiClient.hasToken()) {
        try {
          const { DEV_AUTH } = await import('../config/apiAuth');
          if (DEV_AUTH.enabled) {
            console.log('🔐 Dev auto-login...');
            await apiClient.login(DEV_AUTH.email, DEV_AUTH.password);
            console.log('🔐 Dev login success');
          }
        } catch (e) {
          console.log('ℹ️ Dev auth config missing or disabled');
        }
      }
      
      // Test connection first
      const isConnected = await apiClient.testConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to the API server. Please check if the backend is running.');
      }
      
      const data = await apiClient.getCategories();
      
      console.log('✅ API Response:', data);
      console.log('📊 Total categories received:', data.length);
      
      // Filter popular categories - if none are marked popular, show first 6
      let popularCategories = data.filter(cat => cat.popular);
      console.log('⭐ Popular categories found:', popularCategories.length);
      
      if (popularCategories.length === 0) {
        popularCategories = data.slice(0, 6);
        console.log('📋 Using first 6 categories as popular');
      } else {
        popularCategories = popularCategories.slice(0, 6);
        console.log('⭐ Using actual popular categories');
      }
      
      console.log('🎯 Final categories to display:', popularCategories);
      setCategories(popularCategories);
    } catch (err: any) {
      console.error('❌ Failed to load categories:', err);
      
      let errorMessage = 'Failed to load categories';
      if (err.message.includes('Network error')) {
        errorMessage = 'Network error - Cannot connect to the server. Please check:\n\n1. Is your backend running on localhost:4000?\n2. Are you using the correct IP address?\n3. Check the console for more details.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout - Server is taking too long to respond.';
      } else if (err.message.includes('Cannot connect')) {
        errorMessage = 'Cannot connect to API server. Please start your backend.';
      } else if (err.message.includes('Unauthorized')) {
        errorMessage = 'Unauthorized - Please login first.';
      } else {
        errorMessage = err.message || 'Failed to load categories';
      }
      
      setError(errorMessage);
      
      // Only show error message, don't set static categories
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };

  const quickServices = React.useMemo(() => {
    // Use first 4 categories from API if available, otherwise fallback to defaults
    if (categories.length >= 4) {
      return categories.slice(0, 4).map(cat => ({
        key: cat.key,
        label: cat.label,
        icon: cat.icon || '🔧'
      }));
    }
    
    // Fallback quick services
    return [
      { key: 'plumber', label: 'Plumber', icon: '🛠️' },
      { key: 'electrician', label: 'Electrician', icon: '🔌' },
      { key: 'cleaning', label: 'Cleaning', icon: '🧹' },
      { key: 'salon', label: 'Salon at Home', icon: '💇‍♀️' },
    ];
  }, [categories]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading services...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.heroKicker, { color: colors.textSecondary }]}>Trusted home & daily services</Text>
          <Text style={[styles.heroHeading, { color: colors.textPrimary }]}>Book verified professionals near you</Text>
          <Text style={[styles.heroBody, { color: colors.textSecondary }]}>
            Fast matching by proximity, trust score, and price. Pay securely via UPI or card.
          </Text>

          <View style={styles.searchContainer}>
            <View style={[styles.searchRow, { borderColor: colors.border }]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search a service (plumber, electrician, AC, etc.)"
                placeholderTextColor={colors.textSecondary}
                style={[styles.searchInput, { color: colors.textPrimary }]}
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
              />
              <Pressable style={[styles.locBtn, { borderColor: colors.border }]}>
                <Text style={styles.locIcon}>📍</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.quickRow}>
            {quickServices.map((service) => (
              <Pressable
                key={service.key}
                style={styles.quickPill}
                onPress={() => {
                  const category: ServiceCategory = {
                    id: service.key,
                    key: service.key,
                    label: service.label,
                    icon: service.icon,
                    tone: '#F0F0F0',
                    popular: true,
                    createdAt: '',
                    updatedAt: '',
                  };
                  onServicePress(category);
                }}
              >
                <Text style={styles.quickPillText}>{service.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>✨ Popular categories</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: '#ff6b6b' }]}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadCategories}>
              <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
            </Pressable>
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No categories available</Text>
          </View>
        ) : (
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => onServicePress(category)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.tone || '#F0F0F0' }]}>
                  <Text style={styles.categoryIconText}>{category.icon}</Text>
                </View>
                <Text style={[styles.categoryLabel, { color: colors.textPrimary }]} numberOfLines={1}>
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable 
          style={[styles.viewAllButton, { borderColor: colors.border }]} 
          onPress={onViewAllServices}
        >
          <Text style={[styles.viewAllText, { color: colors.textPrimary }]}>View all services</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🛡️ Why NearMate</Text>
        </View>

        <View style={styles.featuresGrid}>
          {[
            { title: 'Verified & insured', subtitle: 'Aadhaar/PAN verified, reviews & work history' },
            { title: 'Upfront pricing', subtitle: 'Smart recommendations within your budget' },
            { title: 'Fast response', subtitle: 'Instant matching based on proximity' },
            { title: 'Secure payments', subtitle: 'UPI, cards, wallet with protection' },
            { title: '24/7 emergency', subtitle: 'Prioritized help for urgent cases' },
            { title: 'Private chat/calls', subtitle: 'In‑app chat & masked voice calls' },
          ].map((feature, index) => (
            <View key={index} style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{feature.title}</Text>
              <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>{feature.subtitle}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.providerBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.providerTitle, { color: colors.textPrimary }]}>Grow with NearMate</Text>
          <Text style={[styles.providerBody, { color: colors.textSecondary }]}>
            Accept jobs, set availability, track earnings, and boost your profile.
          </Text>
          <View style={styles.providerFeatures}>
            <Text style={styles.providerFeature}>Premium badge</Text>
            <Text style={styles.providerFeature}>Featured listing</Text>
            <Text style={styles.providerFeature}>Analytics</Text>
          </View>
          <Pressable style={[styles.providerButton, { borderColor: colors.border }]}>
            <Text style={[styles.providerButtonText, { color: colors.textPrimary }]}>Become a provider</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
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
  heroCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  heroKicker: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroHeading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchRow: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF0A',
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  locBtn: {
    height: 28,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  locIcon: {
    fontSize: 15,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  quickPillText: {
    fontSize: 12,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  categoryCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  viewAllButton: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  featureSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  providerBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  providerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  providerBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  providerFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerFeature: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#EEF2F6',
  },
  providerButton: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  providerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
