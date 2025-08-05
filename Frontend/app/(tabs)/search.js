import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Platform,
  Modal,
  Slider,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductContext } from "../../context/productContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const MOCK_RESULTS = [
  { id: "1", name: "Wireless Bluetooth Headphones" },
  { id: "2", name: "Smart Fitness Watch" },
  { id: "3", name: "Premium Coffee Maker" },
];

const MOCK_PRODUCTS = [
  {
    id: "101",
    name: "Wireless Bluetooth Headphones",
    price: 8999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    brand: "AudioTech",
    rating: 4.5,
    reviews: 128,
    isNew: true,
    discount: 31,
  },
  {
    id: "102",
    name: "Smart Fitness Watch",
    price: 19999,
    originalPrice: 24999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    brand: "FitTech",
    rating: 4.8,
    reviews: 256,
    isNew: false,
    discount: 20,
  },
  {
    id: "103",
    name: "Premium Coffee Maker",
    price: 14999,
    originalPrice: 19999,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
    brand: "BrewMaster",
    rating: 4.3,
    reviews: 89,
    isNew: false,
    discount: 25,
  },
];

const categories = [
  { id: "all", name: "All" },
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home", name: "Home" },
  { id: "sports", name: "Sports" },
  { id: "books", name: "Books" },
];

const SearchPage = () => {
  const [products] = useContext(ProductContext);
  const [state, , getLocalStorageData] = useContext(AuthContext);
  const { user, token } = state;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    filtered = filtered.filter((item) => {
      let price = item.hasVariant ? item.variants[0]?.price : item.price;
      return price >= minPrice && price <= maxPrice;
    });
    if (query.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase())
      );
    }
    setResults(filtered);
  }, [products, query, selectedCategory, minPrice, maxPrice]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setMinPrice(0);
    setMaxPrice(100000);
    setFilterModalVisible(false);
  };

  const handleResultPress = (item) => {
    setSelectedResult(item);
  };

  const handleAddToCart = async (product) => {
    try {
      // Check if product is already in cart (new cart structure)
      const isInCart = user.cart.some(
        (cartItem) => cartItem.productId === product._id
      );
      if (isInCart) {
        return Alert.alert("Product already in cart");
      }

      // Prepare cart item data
      const cartItem = {
        productId: product._id,
        quantity: 1,
      };

      // Add variantId if product has variants
      if (
        product.hasVariant &&
        product.variants &&
        product.variants.length > 0
      ) {
        cartItem.variantId = product.variants[0]._id; // Default to first variant
      }

      const { data } = await axios.put(`/add-product-to-cart/${user._id}`, {
        cartItem: cartItem,
      });

      if (data.success) {
        await AsyncStorage.setItem(
          "@auth",
          JSON.stringify({ user: data.user })
        );
        getLocalStorageData();
        Alert.alert(data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error adding product to the Cart";
      Alert.alert("Error", errorMessage);
      console.error("Error adding product to Cart:", error);
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      if (user.wishlist.includes(product._id)) {
        return Alert.alert("Product already in wishlist");
      }
      const { data } = await axios.put(`/add-product-to-wishlist/${user._id}`, {
        product_id: product._id,
      });

      if (data.success) {
        await AsyncStorage.setItem(
          "@auth",
          JSON.stringify({ user: data.user })
        );
        getLocalStorageData();
        Alert.alert(data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error adding product to wishlist";
      Alert.alert("Error", errorMessage);
      console.error("Error adding product to wishlist:", error);
    }
  };

  const handleProductPress = (product) => {
    router.push(`/product/${product._id}`);
  };

  const renderProductCard = ({ item: product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.productImage}
        />
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => handleAddToWishlist(product)}
        >
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </TouchableOpacity>
        {product.isNewProduct && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        <View style={styles.discountBadge}>
          {/* <Text style={styles.discountBadgeText}>{product.discount}% OFF</Text>*/}
          {product.hasVariant ? (
            <Text style={styles.discountBadgeText}>
              {Math.round(
                ((product.variants[0].originalPrice -
                  product.variants[0].price) /
                  product.variants[0].originalPrice) *
                  100
              )}
              % OFF
            </Text>
          ) : (
            <Text style={styles.discountBadgeText}>
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              % OFF
            </Text>
          )}
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= product.rating ? "star" : "star-outline"}
                size={12}
                color={star <= product.rating ? "#FFD700" : "#D3D3D3"}
              />
            ))}
          </View>
          {/* <Text style={styles.reviewsText}>({product.reviews})</Text> */}
          <Text style={styles.reviewsText}>(100)</Text>
        </View>
        <View style={styles.priceContainer}>
          {/* <Text style={styles.currentPrice}>₹{product.price}</Text> */}
          {/* <Text style={styles.originalPrice}>₹{product.originalPrice}</Text> */}
          {product.hasVariant ? (
            <>
              <Text style={styles.currentPrice}>
                ₹{product.variants[0].price}
              </Text>
              <Text style={styles.originalPrice}>
                ₹{product.variants[0].originalPrice}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.currentPrice}>₹{product.price}</Text>
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(product)}
        >
          <Ionicons name="cart-outline" size={16} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    //   <View style={{ flex: 1 }}>
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust if header is overlapping
    // >
    //   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //     <ScrollView
    //       contentContainerStyle={{ flexGrow: 1 }}
    //       keyboardShouldPersistTaps="handled"
    //       showsVerticalScrollIndicator={false}
    //     >
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          onPress={() => {
            setFilterModalVisible(true);
          }}
          style={styles.filterButton}
        >
          <Ionicons name="funnel-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {/* Filter Chips */}
      {(selectedCategory !== "All" || minPrice > 0 || maxPrice < 100000) && (
        <View style={styles.filterChipsContainer}>
          {selectedCategory !== "All" && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedCategory}</Text>
              <TouchableOpacity onPress={() => setSelectedCategory("All")}>
                <Ionicons name="close" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          {minPrice > 0 && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Min ₹{minPrice}</Text>
              <TouchableOpacity onPress={() => setMinPrice(0)}>
                <Ionicons name="close" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          {maxPrice < 100000 && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Max ₹{maxPrice}</Text>
              <TouchableOpacity onPress={() => setMaxPrice(100000)}>
                <Ionicons name="close" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <View style={styles.resultsContainer}>
        {/* {selectedResult ? (
          <FlatList
            // data={MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(selectedResult.name.toLowerCase()))}
            data={products.filter(p => p.name.toLowerCase().includes(selectedResult.name.toLowerCase()))}
            keyExtractor={item => item._id}
            renderItem={renderProductCard}
            contentContainerStyle={styles.productsGrid}
          />
        ) : query === '' ? (
          <Text style={styles.placeholderText}>Type to search for products</Text>
        ) : results.length === 0 ? (
          <Text style={styles.placeholderText}>No results found</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)}>
                <Text style={styles.resultText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )} */}
        {
          // query === "" ? (
          //   <Text style={styles.placeholderText}>
          //     Type to search for products
          //   </Text>
          // ) :
          results.length === 0 ? (
            <Text style={styles.placeholderText}>No results found</Text>
          ) : (
            <FlatList
              // data={MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(selectedResult.name.toLowerCase()))}
              // data={products.filter(p => p.name.toLowerCase().includes(results.name.toLowerCase()))}
              data={results}
              keyExtractor={(item) => item._id}
              renderItem={renderProductCard}
              contentContainerStyle={styles.productsGrid}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => <View style={{ height: 100 }} />
              }
            />
          )
        }
      </View>
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
              width: "85%",
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}
            >
              Filter Products
            </Text>
            <Text style={{ marginTop: 10, fontWeight: "600" }}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 10 }}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor:
                      selectedCategory === cat.name ? "#007AFF" : "#eee",
                    marginRight: 8,
                  }}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  <Text
                    style={{
                      color: selectedCategory === cat.name ? "#fff" : "#333",
                    }}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={{ marginTop: 10, fontWeight: "600" }}>
              Price Range
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <Text>₹</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 6,
                  padding: 4,
                  width: 70,
                  marginHorizontal: 5,
                }}
                keyboardType="numeric"
                value={minPrice.toString()}
                onChangeText={(v) => setMinPrice(Number(v) || 0)}
                placeholder="Min"
              />
              <Text> - </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 6,
                  padding: 4,
                  width: 70,
                  marginHorizontal: 5,
                }}
                keyboardType="numeric"
                value={maxPrice.toString()}
                onChangeText={(v) => setMaxPrice(Number(v) || 0)}
                placeholder="Max"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={resetFilters}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: "#FF3B30", fontWeight: "600" }}>
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Text style={{ color: "#007AFF", fontWeight: "600" }}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* <View style={{ height: 100 }} /> */}
    </SafeAreaView>
    // </ScrollView>
    // </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  filterButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  resultItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    color: "#222",
  },
  // Product card styles (from HomePage)
  productsGrid: {
    paddingVertical: 10,
    gap: 15,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    // marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  productImageContainer: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "contain",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  newBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  discountBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  productInfo: {
    padding: 12,
    gap: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 1,
  },
  reviewsText: {
    fontSize: 10,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 5,
    marginTop: 4,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
    marginTop: -8,
    marginLeft: 2,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginTop: 8,
  },
  filterChipText: {
    color: "#fff",
    fontSize: 13,
    marginRight: 4,
  },
});

export default SearchPage;
