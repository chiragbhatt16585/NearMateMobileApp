import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Pressable } from 'react-native';
import Header from '../components/Header';

type TermsConditionsScreenProps = {
  onBack: () => void;
};

export default function TermsConditionsScreen({ onBack }: TermsConditionsScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  
  const colors = React.useMemo(() => ({
    background: isDarkMode ? '#0F1215' : '#FFFFFF',
    surface: isDarkMode ? '#1C2228' : '#F8F9FA',
    textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
    textSecondary: isDarkMode ? '#8A9199' : '#687076',
    textMuted: isDarkMode ? '#6B7280' : '#9CA3AF',
    border: isDarkMode ? '#2A2F35' : '#E5E7EB',
    accent: '#007AFF',
    primary: '#3B82F6',
    warning: '#F59E0B',
    success: '#10B981',
  }), [isDarkMode]);

  const sections = [
    {
      number: '1',
      title: 'Acceptance of Terms',
      content: 'By using NearMate, you acknowledge that you have read, understood, and agreed to these Terms. If you do not agree, you should not use our services.'
    },
    {
      number: '2',
      title: 'About NearMate',
      content: 'NearMate is a hyper-local service platform that connects users with verified service providers in their neighborhood. NearMate itself does not directly provide any services—we are a facilitator.'
    },
    {
      number: '3',
      title: 'User Responsibilities',
      content: 'You agree to provide accurate information while registering and using NearMate. You will not use the app for unlawful, harmful, or fraudulent activities. You are responsible for verifying the identity and services of providers before finalizing.'
    },
    {
      number: '4',
      title: 'Service Providers',
      content: 'All providers listed are independent contractors, not employees or agents of NearMate. NearMate verifies basic details, but does not guarantee the performance, quality, or safety of services. Payments, cancellations, and disputes must be handled between you and the provider unless otherwise specified.'
    },
    {
      number: '5',
      title: 'Payments',
      content: 'NearMate may facilitate payments through third-party gateways. Any payment issues arising from third-party platforms are not the responsibility of NearMate.'
    },
    {
      number: '6',
      title: 'Liability Disclaimer',
      content: 'NearMate is a platform to connect users and providers—we are not liable for damages, losses, or disputes resulting from services. Users are advised to exercise caution and judgment while hiring service providers.'
    },
    {
      number: '7',
      title: 'Intellectual Property',
      content: 'All app content, design, and branding belong to NearMate. You may not copy, reproduce, or use our intellectual property without written consent.'
    },
    {
      number: '8',
      title: 'Privacy Policy',
      content: 'By using NearMate, you also agree to our Privacy Policy, which explains how we collect and use your data.'
    },
    {
      number: '9',
      title: 'Termination of Use',
      content: 'NearMate reserves the right to suspend or terminate accounts if any user is found misusing the platform, providing false information, or violating these Terms.'
    },
    {
      number: '10',
      title: 'Changes to Terms',
      content: 'NearMate may update these Terms at any time. Continued use of the app after changes means you accept the updated Terms.'
    },
    {
      number: '11',
      title: 'Governing Law',
      content: 'These Terms shall be governed by and interpreted under the laws of India, and any disputes will be subject to the jurisdiction of the courts of Mumbai, Maharashtra.'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Terms & Conditions" onBack={onBack} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={[styles.headerSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>
            Terms & Conditions
          </Text>
          <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            Welcome to NearMate! By downloading, accessing, or using our app or services, you agree to the following Terms & Conditions ("Terms"). Please read them carefully.
          </Text>
        </View>

        {/* Terms Sections */}
        {sections.map((section, index) => (
          <View key={index} style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.sectionNumberText}>{section.number}</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {section.title}
              </Text>
            </View>
            <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
              {section.content}
            </Text>
          </View>
        ))}

        {/* Contact Section */}
        <View style={[styles.contactSection, { backgroundColor: colors.accent }]}>
          <Text style={styles.contactIcon}>📌</Text>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>
            If you have any questions about these Terms, you can reach us at:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactValue}>support@nearmate.com</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            By using NearMate, you acknowledge that you have read and agree to these Terms & Conditions.
          </Text>
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
  headerSection: {
    padding: 24,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  contactSection: {
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
