import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, DevSettings } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/authContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header.js'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import { CommonActions } from '@react-navigation/native';



export default function index() {
    const router = useRouter();
    const [state, setState, getLocalStorageData,loading] = useContext(AuthContext);
    const { user = {}, token } = state;

    const handleLogout = async () => {
        try {
          await GoogleSignin.signOut();
          await AsyncStorage.removeItem('@auth');
          setState({ user: null, token: "" });
          setTimeout(() => {
            DevSettings.reload(); // This reloads the entire app, clearing all navigation stacks
            // router.replace('/loginn')
          }, 300);
        } catch (err) {
          console.error('Logout error:', err);
          Alert.alert('Error', 'Failed to log out');
        }
      };

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.placeholder} />
            </View> */}
            <Header title={'Profile'}/>
            
            <ScrollView style={styles.content}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={80} color="#007AFF" />
                    </View>
                    <Text style={styles.userName}>{ user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(profile)/editProfile')}>
                        <Ionicons name="person-outline" size={24} color="#333" />
                        <Text style={styles.menuText}>Edit Profile {user?.isGoogleUser ? '' : '/Password'} </Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(profile)/shippingAddress')}>    
                        <Ionicons name="location-outline" size={24} color="#333" />
                        <Text style={styles.menuText}>Shipping Address</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="card-outline" size={24} color="#333" />
                        <Text style={styles.menuText}>Payment Methods</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(profile)/yourOrder')}>
                        <Ionicons name="bag-outline" size={24} color="#333" />
                        <Text style={styles.menuText}>Your Orders</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(profile)/helpAndSupport')}>
                        <Ionicons name="help-circle-outline" size={24} color="#333" />
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={24} color="#333" />
                        <Text style={styles.menuText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity> */}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        // paddingTop: 35,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
    },
    menuSection: {
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        marginHorizontal: 15,
        marginBottom: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ff3b30',
    },
    logoutText: {
        fontSize: 16,
        color: '#ff3b30',
        marginLeft: 8,
        fontWeight: '600',
    },
}); 
