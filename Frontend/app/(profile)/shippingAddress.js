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
  const [editingIndex, setEditingIndex] = useState(null);
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

  const resetForm = () => {
    setForm({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
    });
    setEditingIndex(null);
  };

  const handleEdit = (address, index) => {
    setForm(address);
    setEditingIndex(index);
    setShowForm(true);
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
      
      if (editingIndex !== null) {
        // Update existing address
        const oldAddress = addresses[editingIndex];
        const { data } = await axios.put('/update-shipping-address', {
          email,
          oldAddress,
          newAddress: shippingAddress
        });
        if (data.success) {
          setState({ ...state, user: data.user });
          setShowForm(false);
          resetForm();
          Alert.alert('Success', 'Address updated!');
        } else {
          Alert.alert('Error', data.message || 'Failed to update address');
        }
      } else {
        // Add new address
        const { data } = await axios.post('/add-shipping-address', {
          email,
          shippingAddress
        });
        if (data.success) {
          setState({ ...state, user: data.user });
          setShowForm(false);
          resetForm();
          Alert.alert('Success', 'Address saved!');
        } else {
          Alert.alert('Error', data.message || 'Failed to add address');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Server error');
    }
  };

  const handleDelete = async (idx) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const email = user.email;
              const selectedAddress = addresses[idx];
              const { data } = await axios.put('/delete-shipping-address', {
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
          }
        }
      ]
    );
  };

  const handleSetDefault = async (idx) => {
    try {
      const email = user.email;
      const { data } = await axios.put('/set-default-address', {
        email,
        addressIndex: idx
      });
      if (data.success) {
        setState({ ...state, user: data.user });
        Alert.alert('Success', 'Default address set!');
      } else {
        Alert.alert('Error', data.message || 'Failed to set default address');
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
    
          <View style={styles.content}>
            <View style={styles.addressesContainer}>
              <Text style={styles.sectionTitle}>Your Addresses</Text>
            {addresses.length > 0 ? (
              addresses.map((address, idx) => (
                <View style={styles.card} key={idx}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.cardName}>{address.fullName}</Text>
                      {user.defaultAddressIndex === idx && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity 
                        onPress={() => handleSetDefault(idx)} 
                        style={[styles.actionButton, user.defaultAddressIndex === idx && styles.disabledButton]}
                        disabled={user.defaultAddressIndex === idx}
                      >
                        <Ionicons name="star" size={18} color={user.defaultAddressIndex === idx ? "#ccc" : "#007AFF"} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleEdit(address, idx)} style={styles.actionButton}>
                        <Ionicons name="pencil" size={18} color="#007AFF" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(idx)} style={styles.actionButton}>
                        <Ionicons name="trash" size={18} color="#ff3b30" />
                      </TouchableOpacity>
                    </View>
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
            </View>
            
            {showForm ? (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                  {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
                </Text>
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
                <View style={styles.formButtons}>
                  <TouchableOpacity 
                    style={[styles.saveButton, styles.cancelButton]} 
                    onPress={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>
                      {editingIndex !== null ? 'Update' : 'Save'} Address
                    </Text>
                  </TouchableOpacity>
                </View>
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
    marginVertical: 10,
    // marginHorizontal: 14,
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
    // height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginVertical: 30,
    marginHorizontal: 14,
  },
  buttonText: {
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
  content: {
    flex: 1,
    padding: 16,
  },
  addressesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#b2ebf2',
  },
  defaultText: {
    color: '#00796b',
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
}); 