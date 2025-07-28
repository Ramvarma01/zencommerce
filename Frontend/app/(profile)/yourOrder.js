import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Header from "../components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { ProductContext } from "../../context/productContext";

const YourOrders = () => {
  const [orders, setOrders] = useState([]);
  // const [products, setProducts] = useState({}); // productId -> product
  const [state, setState] = useContext(AuthContext);
  const [products, setProducts] = useContext(ProductContext);
  const { user, token } = state;

  useEffect(() => {
    // Fetch orders for the user
    const fetchOrders = async () => {
      const { data } = await axios.get(`/user-orders/${user._id}`); // adjust endpoint as needed
      setOrders(data.orders);

      // Collect all unique productIds from all orders
      const productIds = [
        ...new Set(
          data.orders.flatMap((order) =>
            order.items.map((item) => item.productId)
          )
        ),
      ];

      // Fetch all products in one go (if you have such an endpoint)
      const productsRes = await axios.post("/api/products/bulk", {
        ids: productIds,
      });
      // productsRes.data.products should be an array of product objects
      const productsMap = {};
      productsRes.data.products.forEach((prod) => {
        productsMap[prod._id] = prod;
      });
      setProducts(productsMap);
    };

    fetchOrders();
  }, []);

  const renderOrderItem = (item) => {
    const product = products.find((p) => p._id === item.productId);
    // If product has variants, find the
    let variant = null;
    // variant = product.variants.find((v) => v._id === item.variantId);
    if (product && item.variantId) {
      variant = product.variants.find((v) => v._id === item.variantId);
    }
    return (
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <View style={{ width: 60, height: 60, borderRadius: 8 }}>
          <Image
            source={{ uri: product?.thumbnail }}
            style={{ width: "100%", height: 60, objectFit: "contain" }}
          />
        </View>
        <View style={{ marginLeft: 12 }}>
          {/* <Text style={{ fontWeight: "bold" }}>{product?.name}</Text> */}

          <Text>Qty: {item.quantity}</Text>
          <Text>Price: ₹{item.price}</Text>
          {variant && (
            <Text>
              {product.variantName}: {variant.name}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.Container}>
      <Header title={"Your Orders"} />
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(order) => order._id}
          renderItem={({ item: order }) => (
            <View
              style={{
                marginHorizontal: 16,
                marginVertical: 10,
                shadowColor: "#000",
                elevation: 3,
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Order #{order._id}
              </Text>
              <Text>Status: {order.Orderstatus}</Text>
              <Text>Total: ₹{order.totalAmount}</Text>
              {/* <Text>Date: {new Date(order.createdAt).toLocaleString()}</Text> */}
              <Text>
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </Text>
              <View style={{ marginTop: 8 }}>
                {order.items.map((item, idx) => (
                  <View key={idx}>{renderOrderItem(item)}</View>
                ))}
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No Orders Found</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  itemThumb: {
    alignItems: "center",
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 2,
  },
  qtyText: {
    fontSize: 12,
    color: "#666",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  detailsText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 2,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    // paddingVertical: 250,
    // marginTop: 50,
  },
});

export default YourOrders;
