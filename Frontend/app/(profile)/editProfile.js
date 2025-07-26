import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Header from "../components/header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const [state, setState, getLocalStorageData] = useContext(AuthContext);
  const { user } = state;
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    try {
      if (name.length > 20) {
        Alert.alert("Error", "Name can only have 20 characters");
        return;
      }
      if (phone) {
        if (!/^\d{10}$/.test(phone)) {
          Alert.alert("Error", "Phone Number should be of 10 digits");
          return;
        }
      }
      const { data } = await axios.put("/update-user", {
        name: name || undefined,
        email,
        phone: phone || undefined,
      });
      if (data.success) {
        Alert.alert(data && data.message);
        const Data = JSON.parse(await AsyncStorage.getItem("@auth"));
        await AsyncStorage.setItem(
          "@auth",
          JSON.stringify({ token: Data.token, user: data.updatedUser })
        );
        getLocalStorageData();
        router.back();
      }
    } catch (error) {
      Alert.alert(error.response?.data?.message);
      console.log(error);
    }
  };

  const handlePasswordSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "confirm password and new password do not match.");
      return;
    }
    try {
      const { data } = await axios.put("/update-password", {
        currentPassword,
        newPassword,
        email,
      });
      if (data.success) {
        try {
          Alert.alert(data && data.message, "!! Please Login again");
          await GoogleSignin.signOut();
          await AsyncStorage.removeItem("@auth");
          router.replace("/login");
        } catch (err) {
          console.error("Logout error:", err);
          Alert.alert("Error", "Failed to log out");
        }
      } else {
        Alert.alert(data && data.message);
      }
    } catch (error) {
      Alert.alert(error.response?.data?.message);
      console.log(error);
    }
  };

  return (
    // <ScrollView>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        // style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust if header is overlapping
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Header title={"Edit Profile"} />
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={styles.placeholder} />
            </View> */}

            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
    // contentContainerStyle={{ flexGrow: 1 }} 
    showsVerticalScrollIndicator={false} 
    keyboardShouldPersistTaps="handled"> */}

            <View>
              {/* <Text style={styles.title}>Profile</Text> */}

              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: "#e0e0e0", color: "#000" },
                ]}
                placeholder="Email"
                value={email}
                editable={false}
                // onChangeText={setEmail}
                // keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              {/* Divider */}
              {user.isGoogleUser ? null : (
                <>
                  <View style={styles.divider} />
                  <Text style={[styles.headerTitle]}>Edit Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handlePasswordSave}
                  >
                    <Text style={styles.saveButtonText}>Save Password</Text>
                  </TouchableOpacity>
                </>
              )}
              {/* </ScrollView>  */}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 35,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  placeholder: {
    width: 32,
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingTop: 50,
    backgroundColor: "#fff",
  },
  // title: {
  //    fontSize: 24,
  //    fontWeight: '700',
  // },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginHorizontal: 14,
    marginTop: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#3E64FF",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 14,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
    marginTop: 30,
    marginBottom: 10,
  },
});
