import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Pressable, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import type { Booking } from '../types/user';


type BookingsScreenProps = {
  bookings: Booking[];
  onBack: () => void;
  showHeader?: boolean;
  onOpenDetail?: (b: Booking) => void;
};

export default function BookingsScreen({ bookings, onBack, showHeader = true, onOpenDetail }: BookingsScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#ffffff' : '#ffffff',
      surface: isDarkMode ? '#f8f9fa' : '#f8f9fa',
      textPrimary: isDarkMode ? '#1a1a1a' : '#1a1a1a',
      textSecondary: isDarkMode ? '#666666' : '#666666',
      textMuted: isDarkMode ? '#888888' : '#888888',
      border: isDarkMode ? '#e0e0e0' : '#e0e0e0',
      primary: '#000000',
      secondary: '#6c757d',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8',
    }),
    [isDarkMode]
  );

  const categories = ['All', 'Active', 'Completed', 'Cancelled'];
  const [selectedCat, setSelectedCat] = React.useState<string>('All');
  
  const filtered = React.useMemo(() => {
    if (selectedCat === 'All') return bookings;
    if (selectedCat === 'Active') return bookings.filter(b => b.status === 'confirmed');
    if (selectedCat === 'Completed') return bookings.filter(b => b.status === 'completed');
    if (selectedCat === 'Cancelled') return bookings.filter(b => b.status === 'cancelled');
    return bookings;
  }, [bookings, selectedCat]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return colors.info;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {showHeader ? <Header title="My Bookings" onBack={onBack} /> : null}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >


        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>{bookings.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Bookings</Text>
          </View>
                  <View style={[styles.summaryCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.summaryNumber, { color: colors.info }]}>
            {bookings.filter(b => b.status === 'confirmed').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Active</Text>
        </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.summaryNumber, { color: colors.success }]}>
              {bookings.filter(b => b.status === 'completed').length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Completed</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filtersRow}>
          {categories.map(category => {
            const active = selectedCat === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterTab,
                  { 
                    backgroundColor: active ? colors.primary : 'transparent',
                    borderColor: colors.primary
                  }
                ]}
                onPress={() => setSelectedCat(category)}
              >
                <Text style={[
                  styles.filterText,
                  { color: active ? colors.background : colors.primary }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bookings List */}
        {filtered.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.emptyStateIcon, { color: colors.textMuted }]}>📋</Text>
            <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>No Bookings Found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
              {selectedCat === 'All' 
                ? "You haven't made any bookings yet. Start by exploring our services!"
                : `No ${selectedCat.toLowerCase()} bookings found.`
              }
            </Text>
          </View>
        ) : (
          filtered.map(booking => (
            <TouchableOpacity
              key={booking.id}
              style={[styles.bookingCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => onOpenDetail?.(booking)}
            >
              {/* Header Row */}
              <View style={styles.bookingHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceName, { color: colors.textPrimary }]}>
                    {booking.service}
                  </Text>
                  <Text style={[styles.providerName, { color: colors.textSecondary }]}>
                    by {booking.providerName}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                  <Text style={[styles.statusText, { color: colors.background }]}>
                    {getStatusText(booking.status)}
                  </Text>
                </View>
              </View>

              {/* Details Row */}
              <View style={styles.bookingDetails}>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>📅 Date</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {formatDate(booking.scheduledAt)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>🕒 Time</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {formatTime(booking.scheduledAt)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>📍 Location</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {booking.category || 'Not specified'}
                  </Text>
                </View>
              </View>

              {/* Price Row */}
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Total Amount</Text>
                <Text style={[styles.priceValue, { color: colors.primary }]}>
                  ₹{booking.total}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryNumber: { fontSize: 20, fontWeight: 'bold' },
  summaryLabel: { fontSize: 12, fontWeight: '600' },
  filtersRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 14, fontWeight: '600' },
  bookingCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: { fontSize: 16, fontWeight: '700' },
  providerName: { fontSize: 14, color: '#666' },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: { fontSize: 12, color: '#888' },
  detailValue: { fontSize: 14, fontWeight: '600' },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: { fontSize: 14, color: '#666' },
  priceValue: { fontSize: 16, fontWeight: '700' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyStateIcon: { fontSize: 40 },
  emptyStateTitle: { fontSize: 18, fontWeight: '600', marginTop: 10 },
  emptyStateSubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 5 },
});


