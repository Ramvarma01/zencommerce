import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: name/email, 2: OTP, 3: password
  const [otpSent, setOtpSent] = useState(false);

  const validateStep1 = () => {
    let newErrors = {};

    if (!name) newErrors.name = "Name is required";
    else if (name.length > 20) newErrors.name = "Name can only have 20 characters";

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};

    if (!otp) newErrors.otp = "OTP is required";
    else if (otp.length !== 6) newErrors.otp = "OTP must be 6 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    let newErrors = {};

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;

    try {
      setLoading(true);
      const { data } = await axios.post('/send-otp', { name, email });

      Alert.alert("Success", data.message);
      setOtpSent(true);
      setStep(2);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateStep2()) return;

    try {
      setLoading(true);
      const { data } = await axios.post('/verify-otp', { email, otp });

      Alert.alert("Success", data.message);
      setStep(3);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;

    try {
      setLoading(true);
      const { data } = await axios.post('/register', { name, email, password });

      Alert.alert("Success", data.message);
      if (data.success) router.replace('/login');
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/send-otp', { name, email });
      Alert.alert("Success", "OTP resent successfully");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.title}>Create an</Text>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>Enter your details to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.validityText}>{errors.name}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text style={styles.validityText}>{errors.email}</Text>}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSendOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.title}>Verify</Text>
      <Text style={styles.title}>Email</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      {errors.otp && <Text style={styles.validityText}>{errors.otp}</Text>}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.resendButton} 
        onPress={handleResendOtp}
        disabled={loading}
      >
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.title}>Set</Text>
      <Text style={styles.title}>Password</Text>
      <Text style={styles.subtitle}>Create a secure password for your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password && <Text style={styles.validityText}>{errors.password}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errors.confirmPassword && <Text style={styles.validityText}>{errors.confirmPassword}</Text>}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="handled">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <View style={styles.signInRow}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  wrapper: { 
    padding: 24, 
    paddingTop: 50 
  },
  title: { 
    fontSize: 36, 
    fontWeight: '700' 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    marginTop: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginTop: 15,
  },
  validityText: {
    color: '#b22222',
    marginLeft: 15,
    fontWeight: '450',
  },
  button: {
    backgroundColor: '#3E64FF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendText: {
    color: '#3E64FF',
    fontSize: 14,
    fontWeight: '500',
  },
  link: {
    color: '#3E64FF',
    fontWeight: '500',
  },
  signInRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
});