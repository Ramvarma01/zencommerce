import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleReset = () => {
    console.log('Reset password request for:', email);
    // Add your password reset logic or backend call here
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.wrapper}>
        <Text style={styles.title}>Forgot</Text>
        <Text style={styles.title}>Password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered email to receive a reset link
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <View style={styles.backToLoginRow}>
          <Text>Remembered your password? </Text>
          {/* <TouchableOpacity onPress={() => router.push('/')}> */}
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 30,
    marginTop: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3E64FF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: { 
    color: '#fff',
    fontSize: 16, 
    fontWeight: '600' 
  },
  link: {
    color: '#3E64FF',
    fontWeight: '500',
  },
  backToLoginRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
});