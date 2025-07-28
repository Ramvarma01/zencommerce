import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async () => {
    if (!email) return Alert.alert("Error", "Please enter your email");
    setLoading(true);
    try {
      const { data } = await axios.post("/send-reset-code", { email });
      Alert.alert("Success", data.message);
      setStep(2);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!code) return Alert.alert("Error", "Please enter the code");
    setLoading(true);
    try {
      const { data } = await axios.post("/verify-reset-code", { email, code });
      Alert.alert("Success", data.message);
      setStep(3);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword)
      return Alert.alert("Error", "Please enter both passwords");
    if (password !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match");
    setLoading(true);
    try {
      const { data } = await axios.post("/reset-password", { email, password });
      Alert.alert("Success", data.message);
      router.push("/login");
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.wrapper}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Forgot</Text>
        <Text style={styles.title}>Password</Text>
        {step === 1 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Sending..." : "Send Code"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {step === 2 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter Code"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerifyCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying..." : "Verify Code"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {step === 3 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Resetting..." : "Reset Password"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View style={styles.signInRow}>
          <Text>Remembered? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
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
    backgroundColor: "#fff" 
  },
  wrapper: { 
    padding: 24, 
    paddingTop: 50 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "700" 
  },
  input: {
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginTop: 15,
  },
  button: {
    backgroundColor: "#3E64FF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "700" 
  },
  link: { 
    color: "#3E64FF", 
    fontWeight: "500" 
  },
  signInRow: { 
    flexDirection: "row", 
    marginTop: 30, 
    justifyContent: "center",
  },
});
