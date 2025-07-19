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
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
        let newErrors = {};

        if (!name) newErrors.name = "Name is required";
        else if (name.length > 20) newErrors.name = "Name can only have 20 characters";

        // if (!username) newErrors.username = "Username is required";
        // else if (username.length > 10) newErrors.username = "Username can only have 10 characters";

        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
        
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
        
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        // if (!phone) newErrors.phone = "Phone number is required";
        // else if (!/^\d{10}$/.test(phone)) newErrors.phone = "Phone number must be 10 digits";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateFields()) return;

        try {
            setLoading(true);
            // const { data } = await axios.post('/register', { name, email, password, phone });
            const { data } = await axios.post('/register', { name, email, password});

            Alert.alert(data.message);
            if (data.success) router.push('/login');
            // if (data.success) router.push('/');
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Something went wrong");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create an</Text>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

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

        {/* <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        {errors.phone && <Text style={styles.validityText}>{errors.phone}</Text>} */}

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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.signInRow}>
          <Text>Already have an account? </Text>
          {/* <TouchableOpacity onPress={() => router.push('/')}> */}
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
  title: { fontSize: 36, 
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
    // backgroundColor: '#F83758',
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