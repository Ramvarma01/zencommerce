import { Redirect, useRouter } from 'expo-router';
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/authContext';
// import {GOOGLE_CLIENT_ID} from '@env';

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '226672527950-sjeqb4t9ad8oe7fr53i59di5c67lvk05.apps.googleusercontent.com',
  // webClientId: GOOGLE_CLIENT_ID,
});

export default function Login() {
// function Login() {
  const router = useRouter();
  const [state, setState] = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  console.log('local storage data=>', state.user, state.token);
  
  // google login
    const handleGoogleLogin = async () => {
      setLoading(true);
      try {
         await GoogleSignin.hasPlayServices();
         const response = await GoogleSignin.signIn();
         if (isSuccessResponse(response)) {
           const user = response.data.user;
            setUserInfo(user.name);
            const { data } = await axios.post('/google-login', { 
              name: user.name,
              email: user.email,
              googleId: user.id,
            });
            console.log(data.message);
            console.log('Google login response:', data);
            if (data.success) {
              console.log('Google login successful, updating state...');
              setState({ user: data.user, token: data.token });
              await AsyncStorage.setItem('@auth', JSON.stringify({ token: data.token, user: data.user }));
              console.log('Google login state updated, navigating to tabs...');
              router.replace('/(tabs)');
              Alert.alert('Success', 'Logged in with Google!');
            } else {
                Alert.alert('Error', data.message || 'Google login failed');
              }
          } else {
            console.log('Google sign in failed:', response);
            Alert.alert('Google Sign In Failed', 'Please try again later.'); // sign in was cancelled by user
            }
      } catch (error) {
        if (isErrorWithCode(error)) {
             switch (error.code) {
             case statusCodes.IN_PROGRESS:
           // operation (eg. sign in) already in progress
                Alert.alert('Google Sign Is In Progress', 'Please wait for the current operation to complete.');
                break;
             case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
           // Android only, play services not available or outdated
                Alert.alert('Google Play Services Not Available', 'Please update Google Play Services.');
                break;
            default:
           // some other error happened
          }
          } else {
           // an error that's not related to google sign in occurred
           Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
           await GoogleSignin.signOut();
          }
        } finally {
         setLoading(false);
          }
      }

      //DON'T DELETE THIS FUNCTION
      // const handleLogout = async () => {
      //   try {
      //    await GoogleSignin.signOut();
      //    setUserInfo(null); // Remember to remove the user from your app's state as well
      //    Alert.alert('Logged out', 'You have successfully logged out from Google.');
      //    } catch (error) {
      //       console.error(error);
      //       Alert.alert('Error', 'Failed to log out from Google. Please try again later.');
      //      }
      // }

  // 🔍 Validate Inputs
    const validateFields = () => {
        let newErrors = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  // 🔑 Handle Login
  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      console.log('Attempting login with:', { email, password: '***' });
      
      const { data } = await axios.post('/login', { email, password });
      console.log('Login response:', data);
      
      if (data.success) {
        console.log('Login successful, updating state...');
        setState({ user: data.user, token: data.token });
        await AsyncStorage.setItem('@auth', JSON.stringify({ token: data.token, user: data.user }));
        console.log('State and AsyncStorage updated, navigating to tabs...');
        router.replace('/(tabs)');
      }

      console.log('Local storage after login=>', await AsyncStorage.getItem('@auth'));

      Alert.alert(data.message);
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
      <ScrollView>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.title}>Back!</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.validityText}>{errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.validityText}>{errors.password}</Text>}
        
        <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.or}>- or continue with -</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity 
            style={[styles.circleButton, loading && styles.disabledButton]} 
            // onPress={() => promptAsync()
            onPress={() => {
              // console.log('Google login button pressed');
              // promptAsync();
              handleGoogleLogin(); // Call the function to handle Google login
            }}
            disabled={loading}
          >
            <Image 
               source={require("../assets/images/googleLogo.png")}
               style={styles.socialIconCircle}
           />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.circleButton, loading && styles.disabledButton]} disabled={loading}>
            <Image
              source={require("../assets/images/facebookLogo.png")}
              style={styles.socialIconCircle}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.signUpRow}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
         {/* {userInfo ?
        <>
          <Text>{JSON.stringify(userInfo, null, 2)}</Text>
         <TouchableOpacity style={styles.button} onPress={handleLogout} >
           <Text style-={styles.buttonText}>LOGOUT GOOGLE</Text>
         </TouchableOpacity> 
        </>
        : <Text>Not yet logined with google</Text>}
        <TouchableOpacity style={styles.button} onPress={handleLogout} >
           <Text style-={styles.buttonText}>LOGOUT GOOGLE</Text>
         </TouchableOpacity>   */}
        
      </View>
      </ScrollView>
    </KeyboardAvoidingView> 
  );
}

// export default Login;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  wrapper: {
    padding: 24, 
    // marginTop: 10 
    paddingTop: 50
  },
  title: { 
    fontSize: 36, 
    fontWeight: '700', 
    // marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666',
    paddingTop: 10 ,
    marginBottom: 15, 
    // marginTop:10
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    // backgroundColor: '#A8A8A9',
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
    marginTop: 8,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  link: { 
    textAlign: 'right',
    color: '#3E64FF', 
    fontWeight: '500', 
    // marginTop: 8,
    marginBottom:30, 
  },
  or: {
  textAlign: 'center',
  marginTop: 50,
  marginBottom: 20,
  fontSize: 14,
  color: '#888',
},
socialRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  // gap: 20,
  marginBottom: 24,
},
circleButton: {
  width: 60,
  height: 60,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: '#ddd',
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 10,
},
socialIconCircle: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
},
  signUpRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});