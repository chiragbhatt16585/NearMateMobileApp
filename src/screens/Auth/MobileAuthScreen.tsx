import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, useColorScheme } from 'react-native';
import Header from '../../components/Header';

type MobileAuthScreenProps = {
  onBack: () => void;
  onSuccess: (phone?: string) => void;
};

const DEFAULT_OTP = '123456';

export default function MobileAuthScreen({ onBack, onSuccess }: MobileAuthScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const colors = React.useMemo(
    () => ({
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      background: isDarkMode ? '#0B0D0F' : '#FFFFFF',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
      accent: '#111111',
      accentText: '#FFFFFF',
      error: '#dc2626',
    }),
    [isDarkMode]
  );

  const [step, setStep] = React.useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const hiddenOtpRef = React.useRef<TextInput>(null);

  const canContinue = phone.replace(/\D/g, '').length === 10;
  const canVerify = otp.length === 6;

  const onPressContinue = () => {
    if (!canContinue) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setStep('otp');
    setTimeout(() => hiddenOtpRef.current?.focus(), 50);
  };

  const onPressVerify = () => {
    if (otp === DEFAULT_OTP) {
      setError(null);
      onSuccess(phone);
    } else {
      setError('Incorrect OTP. Try 123456');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title={step === 'phone' ? 'Verify mobile' : 'Enter OTP'} onBack={onBack} />

      {step === 'phone' ? (
        <View style={styles.body}> 
          <Text style={[styles.label, { color: colors.textPrimary }]}>Mobile number</Text>
          <TextInput
            value={phone}
            onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            placeholder="Enter 10-digit number"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
          />
          {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

          <Pressable style={[styles.primaryBtn, { backgroundColor: canContinue ? colors.accent : '#9CA3AF' }]} disabled={!canContinue} onPress={onPressContinue}> 
            <Text style={[styles.primaryText, { color: colors.accentText }]}>Continue</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.body}> 
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>OTP sent to +91 {phone}</Text>

          <Pressable style={styles.otpTap} onPress={() => hiddenOtpRef.current?.focus()}>
            <View style={styles.otpRow}> 
              {new Array(6).fill(0).map((_, i) => {
                const char = otp[i] ?? '';
                return (
                  <View key={i} style={[styles.otpBox, { borderColor: colors.border, backgroundColor: colors.background }]}> 
                    <Text style={[styles.otpChar, { color: colors.textPrimary }]}>{char}</Text>
                  </View>
                );
              })}
            </View>
          </Pressable>

          <TextInput
            ref={hiddenOtpRef}
            value={otp}
            onChangeText={t => setOtp(t.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            autoFocus
          />

          {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

          <Pressable style={[styles.primaryBtn, { backgroundColor: canVerify ? colors.accent : '#9CA3AF' }]} disabled={!canVerify} onPress={onPressVerify}> 
            <Text style={[styles.primaryText, { color: colors.accentText }]}>Verify & Continue</Text>
          </Pressable>

          <Pressable onPress={() => setOtp(DEFAULT_OTP)} style={styles.linkBtn}> 
            <Text style={[styles.linkText, { color: colors.textMuted }]}>Auto-fill demo OTP (123456)</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  label: { fontSize: 14, fontWeight: '700' },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  errorText: { fontSize: 12 },
  subtitle: { fontSize: 13 },
  primaryBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontSize: 16, fontWeight: '700' },
  otpTap: { alignItems: 'center' },
  otpRow: { flexDirection: 'row', gap: 8 },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpChar: { fontSize: 20, fontWeight: '700', letterSpacing: 1 },
  hiddenInput: { height: 0, width: 0, opacity: 0 },
  linkBtn: { alignItems: 'center', paddingVertical: 6 },
  linkText: { fontSize: 13, textDecorationLine: 'underline' },
});


