import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Pressable } from 'react-native';
import Header from '../components/Header';

type AboutUsScreenProps = {
  onBack: () => void;
};

export default function AboutUsScreen({ onBack }: AboutUsScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  
  const colors = React.useMemo(() => ({
    background: isDarkMode ? '#0F1215' : '#FFFFFF',
    surface: isDarkMode ? '#1C2228' : '#F8F9FA',
    textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
    textSecondary: isDarkMode ? '#8A9199' : '#687076',
    textMuted: isDarkMode ? '#6B7280' : '#9CA3AF',
    border: isDarkMode ? '#2A2F35' : '#E5E7EB',
    accent: '#007AFF',
    success: '#10B981',
    primary: '#3B82F6',
    warning: '#F59E0B',
  }), [isDarkMode]);

  const features = [
    { icon: '✅', title: 'Verified Service Providers', description: 'No more guesswork. We check authenticity before listing.' },
    { icon: '⚡', title: 'Instant Matching', description: 'Find the right service provider within seconds, right in your area.' },
    { icon: '💰', title: 'Affordable & Transparent', description: 'Clear pricing with no hidden costs.' },
    { icon: '🤝', title: 'Community-Centric', description: 'Designed for urban & semi-urban users who value trust and proximity.' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="About Us" onBack={onBack} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.surface }]}>
          <View style={[styles.logoContainer, { backgroundColor: colors.accent }]}>
            <Text style={styles.logoText}>NM</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            Making Local Services{'\n'}Simple & Trustworthy
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            At NearMate, we believe finding reliable services in your neighborhood should be simple, fast, and stress-free.
          </Text>
        </View>

        {/* Problem Statement */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            The Problem We Solve
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            Too often, people waste time scrolling through WhatsApp groups or unreliable listings, unsure about who to trust. NearMate changes that by connecting you with verified, local service providers—whether you need a plumber, electrician, tutor, cleaner, or any other professional.
          </Text>
        </View>

        {/* Mission */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.missionHeader}>
            <Text style={[styles.missionIcon, { color: colors.primary }]}>🎯</Text>
            <Text style={[styles.missionTitle, { color: colors.textPrimary }]}>Our Mission</Text>
          </View>
          <Text style={[styles.missionText, { color: colors.textSecondary }]}>
            To bring trust, speed, and convenience into everyday services by building a hyper-local platform that makes your neighborhood stronger and smarter.
          </Text>
        </View>

        {/* Features */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Why Choose NearMate?
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={[styles.featureCard, { borderColor: colors.border }]}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vision */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.visionHeader}>
            <Text style={[styles.visionIcon, { color: colors.warning }]}>🚀</Text>
            <Text style={[styles.visionTitle, { color: colors.textPrimary }]}>Our Vision</Text>
          </View>
          <Text style={[styles.visionText, { color: colors.textSecondary }]}>
            We want NearMate to become your first thought whenever you need help, making local services as accessible as ordering food online.
          </Text>
        </View>

        {/* Tagline */}
        <View style={[styles.taglineSection, { backgroundColor: colors.accent }]}>
          <Text style={styles.taglineText}>
            👉 With NearMate, help is never far—{'\n'}it's always Near your Mate.
          </Text>
        </View>

        {/* Contact Info */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Get in Touch
          </Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Text style={[styles.contactLabel, { color: colors.textMuted }]}>Email</Text>
              <Text style={[styles.contactValue, { color: colors.textPrimary }]}>hello@nearmate.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={[styles.contactLabel, { color: colors.textMuted }]}>Website</Text>
              <Text style={[styles.contactValue, { color: colors.accent }]}>nearmate.com</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 300,
  },
  section: {
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  missionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  visionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  visionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  visionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  visionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  taglineSection: {
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
