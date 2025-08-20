import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, useColorScheme } from 'react-native';
import Header from '../../components/Header';
import type { Address } from '../../types/user';

type ManageAddressesScreenProps = {
  addresses: Address[];
  onBack: () => void;
  onSave: (addresses: Address[]) => void;
};

export default function ManageAddressesScreen({ addresses, onBack, onSave }: ManageAddressesScreenProps) {
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

  const [rows, setRows] = React.useState<Address[]>(addresses);

  const addRow = () => {
    setRows(prev => [...prev, { id: `addr-${Date.now()}`, label: 'Other', line1: '', isDefault: prev.length === 0 }]);
  };

  const setDefault = (id: string) => {
    setRows(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const setField = (id: string, patch: Partial<Address>) => {
    setRows(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title="Manage addresses" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {rows.map(a => (
          <View key={a.id} style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <View style={styles.rowBetween}> 
              <Text style={[styles.label, { color: colors.textPrimary }]}>{a.label}</Text>
              {!a.isDefault ? (
                <Pressable style={[styles.ghostBtn, { borderColor: colors.border }]} onPress={() => setDefault(a.id)}>
                  <Text style={[styles.ghostText, { color: colors.textPrimary }]}>Set default</Text>
                </Pressable>
              ) : (
                <Text style={[styles.badge, { color: colors.accent }]}>Default</Text>
              )}
            </View>
            <TextInput
              placeholder="Address line"
              placeholderTextColor={colors.textMuted}
              value={a.line1}
              onChangeText={t => setField(a.id, { line1: t })}
              style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
            />
          </View>
        ))}

        <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={addRow}> 
          <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>Add address</Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
        <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={() => onSave(rows)}> 
          <Text style={[styles.primaryText, { color: colors.accentText }]}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 14, fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  ghostBtn: { height: 32, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  ghostText: { fontSize: 12, fontWeight: '600' },
  badge: { fontSize: 12, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, backgroundColor: '#F4F6F8' },
  secondaryBtn: { height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontSize: 14, fontWeight: '600' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, borderTopWidth: 1 },
  primaryBtn: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '700' },
});


