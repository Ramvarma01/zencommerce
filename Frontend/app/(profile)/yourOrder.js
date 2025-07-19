import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from '../components/header';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_ORDERS = [
  {
    id: 'ORD123456',
    date: '2024-06-18',
    status: 'Delivered',
    total: 28998,
    items: [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        qty: 1,
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        qty: 1,
      },
    ],
  },
  {
    id: 'ORD654321',
    date: '2024-06-10',
    status: 'Shipped',
    total: 14999,
    items: [
      {
        id: '3',
        name: 'Premium Coffee Maker',
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
        qty: 1,
      },
    ],
  },
  {
    id: 'ORD789012',
    date: '2024-05-28',
    status: 'Cancelled',
    total: 3999,
    items: [
      {
        id: '4',
        name: 'Wireless Charging Pad',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        qty: 1,
      },
    ],
  },
];

const statusColors = {
  Delivered: '#4CAF50',
  Shipped: '#007AFF',
  Cancelled: '#FF3B30',
};

export default function YourOrder() {
  return (
    <SafeAreaView style={styles.Container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Orders</Text>
        <View style={styles.placeholder} />
      </View> */}
      <Header title={'Your Orders'} />
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {MOCK_ORDERS.length === 0 ? (
          <Text style={styles.emptyText}>No orders found.</Text>
        ) : (
          MOCK_ORDERS.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={[styles.status, { color: statusColors[order.status] || '#888' }]}>{order.status}</Text>
              </View>
              <Text style={styles.orderDate}>Placed on {order.date}</Text>
              <View style={styles.itemsRow}>
                {order.items.map((product) => (
                  <View key={product.id} style={styles.itemThumb}>
                    <Image source={{ uri: product.image }} style={styles.itemImage} />
                    <Text style={styles.qtyText}>x{product.qty}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.totalText}>Total: ₹{order.total.toFixed(2)}</Text>
                <TouchableOpacity style={styles.detailsButton}>
                  <Ionicons name="chevron-forward" size={18} color="#007AFF" />
                  <Text style={styles.detailsText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 28,
    height: 28,
  },
  listContent: {
    padding: 12,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  itemThumb: {
    alignItems: 'center',
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 2,
  },
  qtyText: {
    fontSize: 12,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  detailsText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
}); 