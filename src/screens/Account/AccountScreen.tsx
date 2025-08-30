import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, useColorScheme, Alert } from 'react-native';
import Header from '../../components/Header';
import { UserProfile, Address, Booking } from '../../types/user';
import { getAuthEndpoint, getApiBaseUrl, buildApiUrl } from '../../config/api';

type AccountScreenProps = {
  user: UserProfile | null;
  bookings: Booking[];
  onBack: () => void;
  onManageAddresses: () => void;
  showHeader?: boolean;
  showBookings?: boolean;
  onSwitchToVendor?: () => void;
  onAboutUs?: () => void;
  onTermsConditions?: () => void;
  onMobileAuth?: (userData: any) => void;
  onLogout?: () => void;
};

type AuthStep = 'phone' | 'otp' | 'register' | 'complete';

export default function AccountScreen({ 
  user, 
  bookings, 
  onBack, 
  onManageAddresses, 
  showHeader = true, 
  showBookings = false, 
  onSwitchToVendor, 
  onAboutUs, 
  onTermsConditions,
  onMobileAuth,
  onLogout
}: AccountScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [authStep, setAuthStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    isRegistered: false
  });

  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      surface: isDarkMode ? '#2a2a2a' : '#f8f9fa',
      textPrimary: isDarkMode ? '#ffffff' : '#1a1a1a',
      textSecondary: isDarkMode ? '#cccccc' : '#666666',
      textMuted: isDarkMode ? '#999999' : '#888888',
      border: isDarkMode ? '#404040' : '#e0e0e0',
      primary: '#000000', // Black color as requested
      accent: '#000000', // Black color as requested
      error: '#FF3B30',
      success: '#34C759',
    }),
    [isDarkMode]
  );

  const resetAuth = () => {
    setAuthStep('phone');
    setPhoneNumber('');
    setOtp('');
    setIsOTPSent(false);
    setIsLoading(false);
    setRegistrationData({
      name: '',
      email: '',
      dateOfBirth: '',
      gender: 'male',
      isRegistered: false
    });
  };

  const handleRequestOTP = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      // First check if mobile number is already registered
      const checkResponse = await fetch(getAuthEndpoint('CHECK_MOBILE_EXISTS'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: phoneNumber,
          userType: 'end-user'
        })
      });

      let isRegistered = false;
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        isRegistered = checkData.isRegistered;
      }

      // Request OTP with appropriate purpose
      const otpResponse = await fetch(getAuthEndpoint('REQUEST_OTP'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: phoneNumber,
          userType: 'end-user',
          purpose: isRegistered ? 'login' : 'register'
        })
      });

      if (otpResponse.ok) {
        const data = await otpResponse.json();
        setIsOTPSent(true);
        setAuthStep('otp');
        // Store whether user is registered for later use
        setRegistrationData(prev => ({ ...prev, isRegistered }));
        Alert.alert('Success', `OTP sent to +91${phoneNumber}`);
      } else {
        const error = await otpResponse.json();
        Alert.alert('Error', error.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Network error details:', error);
      
      let errorMessage = 'Network error. Please check your connection.';
      
      if (error.message?.includes('Network request failed')) {
        errorMessage = 'Cannot connect to server. Please check:\n\n1. Is your backend running?\n2. Are you on the same WiFi network?\n3. Try using IP: 192.168.0.102:4000';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timeout. Server is taking too long to respond.';
      } else if (error.message?.includes('fetch')) {
        errorMessage = 'Network request failed. Please check your internet connection.';
      }
      
      Alert.alert('Connection Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Check if user is registered and use appropriate endpoint
      const isRegistered = registrationData.isRegistered;
      
      if (isRegistered) {
        // Use login-with-mobile endpoint for existing users
        const loginResponse = await fetch(getAuthEndpoint('LOGIN_WITH_MOBILE'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mobile: phoneNumber,
            otp: otp,
            userType: 'end-user'
          })
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          // User exists, login successful
          if (onMobileAuth) {
            onMobileAuth(data);
          }
          Alert.alert('Success', 'Login successful!');
          return;
        } else {
          // Login failed - OTP is invalid
          const errorData = await loginResponse.json();
          console.log('Login failed:', errorData);
          Alert.alert('Invalid OTP', 'The OTP you entered is incorrect or has expired. Please try again.');
          setOtp(''); // Clear the OTP input
        }
      } else {
        // User is new - verify OTP for registration
        const otpCheckResponse = await fetch(getAuthEndpoint('VERIFY_OTP_REGISTER'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mobile: phoneNumber,
            otp: otp,
            userType: 'end-user'
          })
        });
        
        if (otpCheckResponse.ok) {
          // OTP is valid - user is new, proceed to registration
          setAuthStep('register');
          Alert.alert('New User', 'Please complete your registration');
        } else {
          // OTP is invalid for registration
          const otpErrorData = await otpCheckResponse.json();
          console.log('OTP validation failed:', otpErrorData);
          Alert.alert('Invalid OTP', 'The OTP you entered is incorrect or has expired. Please try again.');
          setOtp(''); // Clear the OTP input
        }
      }
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!registrationData.name.trim() || !registrationData.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(getAuthEndpoint('VERIFY_OTP_REGISTER'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: phoneNumber,
          otp: otp,
          userType: 'end-user',
          userData: {
            name: registrationData.name,
            email: registrationData.email,
            dateOfBirth: registrationData.dateOfBirth,
            gender: registrationData.gender
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Registration successful
        Alert.alert('Success', 'Registration successful!', [
          {
            text: 'OK',
            onPress: () => {
              if (onMobileAuth) {
                onMobileAuth(data);
              }
              setAuthStep('complete');
            }
          }
        ]);
      } else {
        const error = await response.json();
        
        // Check if it's an OTP validation error
        if (response.status === 400 || response.status === 401) {
          if (error.message?.toLowerCase().includes('otp')) {
            Alert.alert('Invalid OTP', 'The OTP you entered is incorrect or has expired. Please try again.');
            setOtp(''); // Clear the OTP input
            return;
          }
        }
        
        Alert.alert('Error', error.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

    // If user is not authenticated, show OTP authentication flow
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Header title="Account" onBack={onBack} />
          <View style={styles.header}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in with your mobile number to access your profile
            </Text>
          </View>

          {/* Step 1: Phone Number Input */}
          {authStep === 'phone' && (
            <View style={[styles.formCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
                Enter Mobile Number
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Mobile Number</Text>
                <View style={styles.phoneInputContainer}>
                  <Text style={[styles.countryCode, { color: colors.textSecondary }]}>+91</Text>
                  <TextInput
                    style={[styles.phoneInput, { 
                      backgroundColor: colors.background, 
                      borderColor: colors.border,
                      color: colors.textPrimary 
                    }]}
                    placeholder="Enter your 10-digit mobile number"
                    placeholderTextColor={colors.textMuted}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              <Pressable 
                style={[
                  styles.submitButton, 
                  { 
                    backgroundColor: phoneNumber.length === 10 ? colors.primary : colors.textMuted,
                    opacity: phoneNumber.length === 10 ? 1 : 0.6
                  }
                ]} 
                onPress={handleRequestOTP}
                disabled={phoneNumber.length !== 10 || isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Text>
              </Pressable>


            </View>
          )}

          {/* Step 2: OTP Input */}
          {authStep === 'otp' && (
            <View style={[styles.formCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
                Enter OTP
              </Text>
              
              <Text style={[styles.otpSubtitle, { color: colors.textSecondary }]}>
                OTP sent to +91{phoneNumber}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>6-Digit OTP</Text>
                <TextInput
                  style={[styles.otpInput, { 
                    backgroundColor: colors.background, 
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }]}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={colors.textMuted}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <View style={styles.formActions}>
                <Pressable 
                  style={[
                    styles.submitButton, 
                    { 
                      backgroundColor: otp.length === 6 ? colors.primary : colors.textMuted,
                      opacity: otp.length === 6 ? 1 : 0.6
                    }
                  ]} 
                  onPress={handleVerifyOTP}
                  disabled={otp.length !== 6 || isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Text>
                </Pressable>
                
                <Pressable 
                  style={styles.resendButton} 
                  onPress={handleRequestOTP}
                  disabled={isLoading}
                >
                  <Text style={[styles.resendButtonText, { color: colors.primary }]}>
                    Resend OTP
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

                      {/* Step 3: Registration Form */}
            {authStep === 'register' && (
              <View style={[styles.formCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
                Complete Registration
              </Text>
              
              <Text style={[styles.otpSubtitle, { color: colors.textSecondary }]}>
                Please provide your details to complete registration
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name *</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textMuted}
                  value={registrationData.name}
                  onChangeText={(text) => setRegistrationData(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email *</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }]}
                  placeholder="Enter your email address"
                  placeholderTextColor={colors.textMuted}
                  value={registrationData.email}
                  onChangeText={(text) => setRegistrationData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Date of Birth</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }]}
                  placeholder="YYYY-MM-DD (optional)"
                  placeholderTextColor={colors.textMuted}
                  value={registrationData.dateOfBirth}
                  onChangeText={(text) => setRegistrationData(prev => ({ ...prev, dateOfBirth: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Gender</Text>
                <View style={styles.genderSelector}>
                  {(['male', 'female', 'other'] as const).map((gender) => (
                    <Pressable 
                      key={gender}
                      style={[
                        styles.genderButton, 
                        { 
                          backgroundColor: registrationData.gender === gender ? colors.primary : 'transparent',
                          borderColor: colors.primary
                        }
                      ]} 
                      onPress={() => setRegistrationData(prev => ({ ...prev, gender }))}
                    >
                      <Text style={[
                        styles.genderButtonText, 
                        { color: registrationData.gender === gender ? 'white' : colors.primary }
                      ]}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.formActions}>
                <Pressable 
                  style={[styles.submitButton, { backgroundColor: colors.primary }]} 
                  onPress={handleRegistration}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Step 4: Success */}
          {authStep === 'complete' && (
            <View style={[styles.formCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
                🎉 Welcome to NearMate!
              </Text>
              
              <Text style={[styles.otpSubtitle, { color: colors.textSecondary }]}>
                Your account has been created successfully. You can now access all features.
              </Text>

              <Pressable 
                style={[styles.submitButton, { backgroundColor: colors.primary }]} 
                onPress={resetAuth}
              >
                <Text style={styles.submitButtonText}>
                  Continue
                </Text>
              </Pressable>
            </View>
          )}

          {/* Back to Phone Button */}
          {authStep !== 'phone' && (
            <Pressable 
              style={styles.backButton} 
              onPress={resetAuth}
            >
              <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>
                ← Back to Phone Number
              </Text>
            </Pressable>
          )}

          {/* About Us and Terms buttons */}
          <View style={styles.infoButtons}>
            {onAboutUs && (
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Pressable style={styles.aboutUsButton} onPress={onAboutUs}> 
                  <Text style={[styles.aboutUsText, { color: colors.textPrimary }]}>About Us</Text>
                  <Text style={[styles.aboutUsSubtext, { color: colors.textMuted }]}>Learn more about NearMate</Text>
                </Pressable>
              </View>
            )}

            {onTermsConditions && (
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Pressable style={styles.termsButton} onPress={onTermsConditions}> 
                  <Text style={[styles.termsText, { color: colors.textPrimary }]}>Terms & Conditions</Text>
                  <Text style={[styles.termsSubtext, { color: colors.textMuted }]}>Read our terms of service</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  // If user is authenticated, show the original profile content
  // Debug: Log user data to see what's available
  console.log('🔍 AccountScreen - User data:', {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    addresses: user.addresses?.length || 0
  });
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Header title="Account" onBack={onBack} />
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Welcome back, {user.name}!
          </Text>
        </View>

        {/* User Profile Card */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user.name}</Text>
              <Text style={[styles.profilePhone, { color: colors.textSecondary }]}>
                📱 {user.phone || 'Phone not set'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                ✉️ {user.email || 'Email not set'}
              </Text>
            </View>
          </View>
        </View>

        {/* Mobile Number Display */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Mobile Number</Text>
          <View style={styles.mobileInfo}>
            <Text style={[styles.mobileLabel, { color: colors.textSecondary }]}>Primary Contact</Text>
            <Text style={[styles.mobileNumber, { color: colors.textPrimary }]}>
              📱 +91 {user.phone || 'Phone number not set'}
            </Text>
          </View>
        </View>

        {/* Default Address */}
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Default Address</Text>
          {user.addresses && user.addresses.length > 0 ? (
            <View style={styles.addressInfo}>
              <Text style={[styles.addressLabel, { color: colors.textSecondary }]}>
                {user.addresses.find(addr => addr.isDefault)?.label || 'Home'}
              </Text>
              <Text style={[styles.addressText, { color: colors.textPrimary }]}>
                {user.addresses.find(addr => addr.isDefault)?.area || 'No address set'}
              </Text>
            </View>
          ) : (
            <Text style={[styles.noAddress, { color: colors.textMuted }]}>No address set</Text>
          )}
          <Pressable style={styles.manageButton} onPress={onManageAddresses}>
            <Text style={[styles.manageButtonText, { color: colors.primary }]}>Manage Addresses</Text>
          </Pressable>
        </View>

        {/* Switch to Vendor */}
        {/* {onSwitchToVendor && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Vendor Mode</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Switch to vendor mode to accept bookings and manage services
            </Text>
            <Pressable style={styles.vendorButton} onPress={onSwitchToVendor}>
              <Text style={[styles.vendorButtonText, { color: colors.primary }]}>Switch to Vendor</Text>
            </Pressable>
          </View>
        )} */}

        {/* About Us and Terms buttons */}
        <View style={styles.infoButtons}>
          {onAboutUs && (
            <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
              <Pressable style={styles.aboutUsButton} onPress={onAboutUs}> 
                <Text style={[styles.aboutUsText, { color: colors.textPrimary }]}>About Us</Text>
                <Text style={[styles.aboutUsSubtext, { color: colors.textMuted }]}>Learn more about NearMate</Text>
              </Pressable>
            </View>
          )}

                      {onTermsConditions && (
              <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                <Pressable style={styles.termsButton} onPress={onTermsConditions}> 
                  <Text style={[styles.termsText, { color: colors.textPrimary }]}>Terms & Conditions</Text>
                  <Text style={[styles.termsSubtext, { color: colors.textMuted }]}>Read our terms of service</Text>
                </Pressable>
            </View>
            )}
        </View>

        {/* Logout Button */}
        {onLogout && (
          <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Pressable 
              style={[styles.logoutButton, { borderColor: colors.error }]} 
              onPress={onLogout}
            >
              <Text style={[styles.logoutButtonText, { color: colors.error }]}>Sign Out</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  scrollContent: {
    gap: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    width: 40,
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  otpInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 8,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formActions: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  infoButtons: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profilePhone: {
    fontSize: 14,
  },
  profileEmail: {
    fontSize: 14,
  },
  addressInfo: {
    gap: 4,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
  },
  noAddress: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  mobileInfo: {
    gap: 4,
  },
  mobileLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  mobileNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  manageButton: {
    alignSelf: 'flex-start',
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  vendorButton: {
    alignSelf: 'flex-start',
  },
  vendorButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  aboutUsButton: { 
    paddingVertical: 8 
  },
  aboutUsText: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  aboutUsSubtext: { 
    fontSize: 13 
  },
  termsButton: { 
    paddingVertical: 8 
  },
  termsText: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  termsSubtext: { 
    fontSize: 13 
  },
  logoutButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },


});


