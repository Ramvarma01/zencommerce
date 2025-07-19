import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import Header from '../components/header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShippingAddress() {
  // Multi-valued address array
  const [state, setState] = useContext(AuthContext);
  const { user } = state || {};
  const addresses = user?.shippingAddress || [];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  });

  const handleFormChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    const { fullName, phone, address, city, state, pincode, country } = form;
    if (!fullName || !phone || !address || !city || !state || !pincode || !country) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Phone Number should be 10 digits.');
      return;
    }
    try {
      const email = user.email;
      const shippingAddress = { fullName, phone, address, city, state, pincode, country };
      const {data} = await axios.post('/add-shipping-address', {
        email,
        shippingAddress
      });
      if (data.success) {
        setState({ ...state, user: data.user });
        setShowForm(false);
        setForm({
          fullName: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: '',
        });
        Alert.alert('Success', 'Address saved!');
      } else {
        Alert.alert('Error', data.message || 'Failed to add address');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Server error');
    }
  };

  const handleDelete = async (idx) => {
    try {
        console.log(idx);
      const email = user.email;
      // Remove address at idx
    //   const selectedAddresses = addresses.filter((_, i) => i !== idx);
    const selectedAddress = addresses[idx];
      console.log(selectedAddress);
      // Update backend (optional: create a dedicated API for deleting, or update the whole array)
      const {data} = await axios.put('/delete-shipping-address', {
        email,
        shippingAddress: selectedAddress
      });
      if (data.success) {
        setState({ ...state, user: data.user });
        Alert.alert('Success', 'Address deleted!');
      } else {
        Alert.alert('Error', data.message || 'Failed to delete address');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Server error');
    }
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Shipping Address'}/> 
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps= "always"
          showsVerticalScrollIndicator={false}
        >
          {/* <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Shipping Address</Text>
            <View style={styles.placeholder} />
          </View> */}
    
          <View >
            {addresses.length > 0 ? (
              addresses.map((address, idx) => (
                <View style={styles.card} key={idx}>
                    {console.log(address,idx)}
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardName}>{address.fullName}</Text>
                    <TouchableOpacity onPress={() => handleDelete(idx)} style={styles.deleteIcon}>
                      <Ionicons name="trash" size={22} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardText}>Phone: {address.phone}</Text>
                  <Text style={styles.cardText}>Address: {address.address}</Text>
                  <Text style={styles.cardText}>City: {address.city}</Text>
                  <Text style={styles.cardText}>State: {address.state}</Text>
                  <Text style={styles.cardText}>Pincode: {address.pincode}</Text>
                  <Text style={styles.cardText}>Country: {address.country}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noAddress}>No Addresses Found</Text>
            )}
            {showForm ? (
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={form.fullName}
                  onChangeText={v => handleFormChange('fullName', v)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={form.phone}
                  onChangeText={v => handleFormChange('phone', v)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={form.address}
                  onChangeText={v => handleFormChange('address', v)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={form.city}
                  onChangeText={v => handleFormChange('city', v)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  value={form.state}
                  onChangeText={v => handleFormChange('state', v)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Pincode"
                  value={form.pincode}
                  onChangeText={v => handleFormChange('pincode', v)}
                  keyboardType="number-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  value={form.country}
                  onChangeText={v => handleFormChange('country', v)}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
                <Ionicons name="add" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 35,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 32,
  },
  container: {
    flex: 1,
    // padding: 24,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    // marginBottom: 24,
    marginVertical: 12,
    marginHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  deleteIcon: {
    padding: 4,
  },
  cardText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
  formContainer: {
    marginTop: 10,
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginHorizontal: 14,
    marginTop: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#3E64FF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    marginHorizontal: 14,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3E64FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  noAddress: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    margin:20,
  },
}); 