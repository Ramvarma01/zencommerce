import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  // SafeAreaView,
  Dimensions,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/authContext";
import { ProductContext } from "../../context/productContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const HomePage = () => {
  const [products, , fetchProducts] = useContext(ProductContext);
  const [state, setState, getLocalStorageData] = useContext(AuthContext);
  const user = state.user;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  }, []);
  // Sample categories
  const categories = [
    { id: "all", name: "All", icon: "grid-outline" },
    { id: "electronics", name: "Electronics", icon: "phone-portrait-outline" },
    { id: "fashion", name: "Fashion", icon: "shirt-outline" },
    { id: "home", name: "Home", icon: "home-outline" },
    { id: "sports", name: "Sports", icon: "fitness-outline" },
    { id: "books", name: "Books", icon: "book-outline" },
  ];

  // Sample featured products
  // const featuredProducts = [
  //   {
  //     id: 1,
  //     name: 'Wireless Bluetooth Headphones',
  //     price: 8999,
  //     originalPrice: 12999,
  //     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  //     rating: 4.5,
  //     reviews: 128,
  //     isNew: true,
  //     discount: 31,
  //   },
  //   {
  //     id: 2,
  //     name: 'Smart Fitness Watch',
  //     price: 19999,
  //     originalPrice: 24999,
  //     image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  //     rating: 4.8,
  //     reviews: 256,
  //     isNew: false,
  //     discount: 20,
  //   },
  //   {
  //     id: 3,
  //     name: 'Premium Coffee Maker',
  //     price: 14999,
  //     originalPrice: 19999,
  //     image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
  //     rating: 4.3,
  //     reviews: 89,
  //     isNew: true,
  //     discount: 25,
  //   },
  //   {
  //     id: 4,
  //     name: 'Wireless Charging Pad',
  //     price: 3999,
  //     originalPrice: 5999,
  //     image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
  //     rating: 4.6,
  //     reviews: 167,
  //     isNew: false,
  //     discount: 33,
  //   },
  // ];

  // Sample deals
  const deals = [
    {
      id: 1,
      name: "Flash Sale",
      description: "Up to 70% off on Electronics",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      endTime: "2h 30m",
    },
    {
      id: 2,
      name: "Weekend Special",
      description: "Free shipping on orders over ₹500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      endTime: "1d 5h",
    },
  ];
  
  const handleProductPress = (product) => {
    router.push(`/product/${product._id}`);
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

  const renderHeader = () => (
    <View style={styles.header}>
      {/* <View style={styles.headerTop}> */}
      <View>
        <Text style={styles.greeting}>
          {/* {user ? `Hello, ${user.name.split(" ")[0] || "User"}!` : "Welcome Guest!"} */}
          Hello, {user?.name.split(" ")[0]}
        </Text>
        <Text style={styles.subtitle}>Discover amazing products</Text>
      </View>
      {/* <View style={styles.headerActions}> */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/(profile)")}
      >
        <Ionicons name="person-circle-outline" size={35} color="#007AFF" />
      </TouchableOpacity>
      {/* </View> */}
      {/* </View> */}
    </View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {/* <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              // selectedCategory === category.name && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <View
              style={[
                styles.categoryIcon,
                selectedCategory === category.name &&
                  styles.selectedCategoryIcon,
              ]}
            >
              <Ionicons
                name={category.icon}
                size={24}
                color={selectedCategory === category.name ? "#fff" : "#007AFF"}
              />
            </View>
            <Text
              style={[
                styles.categoryName,
                selectedCategory === category.name &&
                  styles.selectedCategoryName,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDeals = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Special Deals</Text>
        {/* <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dealsContainer}
      >
        {deals.map((deal) => (
          <TouchableOpacity key={deal.id} style={styles.dealCard}>
            <Image source={{ uri: deal.image }} style={styles.dealImage} />
            <View style={styles.dealOverlay}>
              <View style={styles.dealContent}>
                <Text style={styles.dealName}>{deal.name}</Text>
                <Text style={styles.dealDescription}>{deal.description}</Text>
                <View style={styles.dealTimer}>
                  <Ionicons name="time-outline" size={16} color="#fff" />
                  <Text style={styles.dealTimeText}>{deal.endTime}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProducts = () => {
    // Filter products based on selected category
    const filteredProducts =
      selectedCategory === "All"
        ? products
        : products.filter(
            (product) =>
              product.category.toLowerCase() === selectedCategory.toLowerCase()
          );

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          {/* <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.productsGrid}>
          {/* {featuredProducts.map((product) => (  */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TouchableOpacity
                key={product._id}
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
              >
                <View style={styles.productImageContainer}>
                  {/* <Image source={{ uri: product.image }} style={styles.productImage} /> */}
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
                    <Text style={styles.discountBadgeText}>
                      {product.hasVariant
                        ? Math.round(
                            ((product.variants[0].originalPrice -
                              product.variants[0].price) /
                              product.variants[0].originalPrice) *
                              100
                          )
                        : Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                      % OFF
                    </Text>
                  </View>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>

                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={
                            star <= product.rating ? "star" : "star-outline"
                          }
                          size={12}
                          color={star <= product.rating ? "#FFD700" : "#D3D3D3"}
                        />
                      ))}
                    </View>
                    {/* <Text style={styles.reviewsText}>({product.reviews})</Text> */}
                    <Text style={styles.reviewsText}>(100)</Text>
                    {/* <Text style={styles.currentPrice}>
                      {product.hasVariant}
                    </Text> */}
                  </View>

                  <View style={styles.priceContainer}>
                    {/* <Text style={styles.currentPrice}>${product.price}</Text> */}
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
                        <Text style={styles.currentPrice}>
                          ₹{product.price}
                        </Text>
                        <Text style={styles.originalPrice}>
                          ₹{product.originalPrice}
                        </Text>
                      </>
                    )}
                    {/* <Text style={styles.currentPrice}>₹1</Text> */}
                    {/* <Text style={styles.originalPrice}>${product.originalPrice}</Text> */}
                    {/* <Text style={styles.originalPrice}>₹{product.originalPrice}</Text> */}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.addToCartButton,
                      (product.hasVariant
                        ? product.variants[0].quantity <= 0
                        : product.quantity <= 0) && styles.disabledButton,
                    ]}
                    onPress={() => handleAddToCart(product)}
                    disabled={
                      product.hasVariant
                        ? product.variants[0].quantity <= 0
                        : product.quantity <= 0
                    }
                  >
                    <Ionicons name="cart-outline" size={16} color="#fff" />
                    <Text style={styles.addToCartText}>
                      {(
                        product.hasVariant
                          ? product.variants[0].quantity > 0
                          : product.quantity > 0
                      )
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noProductsContainer}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.noProductsText}>No products found</Text>
              <Text style={styles.noProductsSubtext}>
                Try selecting a different category
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {renderHeader()}
      {user ? (
      <ScrollView
      style={styles.scrrollView}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderCategories()}
      {renderDeals()}
      {renderProducts()}
      {/* Bottom spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
       ) : (
        <Redirect href="/login"></Redirect>
       )}
      
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    // paddingTop: 35,
    // paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  sectionHeader: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  // seeAllText: {
  //   fontSize: 14,
  //   color: "#007AFF",
  //   fontWeight: "600",
  // },
  categoriesContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    minWidth: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedCategoryIcon: {
    backgroundColor: "#007AFF",
  },
  categoryName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  selectedCategoryName: {
    color: "#007AFF",
    fontWeight: "600",
  },
  dealsContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  dealCard: {
    width: width * 0.8,
    height: 150,
    borderRadius: 12,
    marginRight: 25,
    overflow: "hidden",
  },
  dealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dealOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    padding: 20,
  },
  dealContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  dealName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  dealDescription: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  dealTimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dealTimeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 50) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    // alignItems: "center",
  },
  productImageContainer: {
    display: "flex",
    width: "100%",
    height: 150,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    // overflow: 'hidden',
  },
  productImage: {
    width: "100%",
    height: "100%",
    // objectFit: 'contain',
    // height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "contain",
  },
  wishlistButton: {
    // position: 'absolute',
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
  disabledButton: {
    backgroundColor: "#D3D3D3",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  noProductsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    minHeight: 200,
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  noProductsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomePage;
