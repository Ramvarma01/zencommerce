import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

const ProductPage = () => {
  const { id } = useLocalSearchParams(); // expects /product/[id] route
  const [state, , getLocalStorageData] = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const user = state.user;

  const handelAddToCart = async () => {
    try {
      if (!user || !user._id) {
        return Alert.alert("Error", "You must be logged in to add to cart.");
      }
      // Prepare cart item data
      const cartItem = {
        productId: product._id,
        quantity: 1,
      };
      if (product.hasVariant && selectedVariant) {
        cartItem.variantId = selectedVariant._id;
      }
      // Check if product (and variant, if any) is already in cart
      const isInCart = user.cart.some(
        (item) =>
          item.productId === product._id &&
          (product.hasVariant
            ? item.variantId === (selectedVariant && selectedVariant._id)
            : true)
      );
      if (isInCart) {
        return Alert.alert("Product already in cart");
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/product/${id}`);
        setProduct(data.product);
        if (data.product.hasVariant && data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  // Determine stock and price
  let price, originalPrice, quantity, variantName, variantOptions, variantImage;
  if (product.hasVariant && selectedVariant) {
    price = selectedVariant.price;
    originalPrice = selectedVariant.originalPrice;
    quantity = selectedVariant.quantity;
    variantName = product.variantName;
    variantOptions = product.variants;
    variantImage = selectedVariant.image;
  } else {
    price = product.price;
    originalPrice = product.originalPrice;
    quantity = product.quantity;
    variantName = null;
    variantOptions = null;
    variantImage = null;
  }

  const isOutOfStock = quantity === 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Icon */}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <ScrollView style={styles.container}> */}
        {/* Images - Only horizontal thumbnails, no main big image */}
        {/* <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity> */}
        <View style={styles.infoSection}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          {/* <Text style={styles.brand}>{product.brand}</Text> */}
        </View>
        <View style={styles.imageGallery}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailRow}
          >
            {[product.thumbnail, ...(product.images || [])].map((img, idx) => (
              <View key={idx} style={styles.imageContainer}>
                <Image source={{ uri: img }} style={styles.images} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Badges */}
        <View style={styles.badgesRow}>
          {product.isNewProduct && <Text style={styles.badge}>NEW</Text>}
          {product.isFeatured && (
            <Text
              style={[
                styles.badge,
                { backgroundColor: "#FFD700", color: "#333" },
              ]}
            >
              FEATURED
            </Text>
          )}
          {isOutOfStock && (
            <Text style={[styles.badge, { backgroundColor: "#FF3B30" }]}>
              Out of Stock
            </Text>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          {/* <Text style={styles.brand}>{product.brand}</Text> */}
          {/* <Text style={styles.name}>{product.name}</Text> */}
          {/* <Text style={styles.category}>{product.category}</Text> */}
          {/* <Text style={styles.rating}>⭐ {product.rating} / 5</Text> */}

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
            <Text style={styles.reviewsText}>(100)</Text>
          </View>
          {/* <Text style={styles.description}>{product.description}</Text> */}
        </View>

        {/* Variant Selector */}
        {variantName && variantOptions && (
          <View style={styles.variantSection}>
            <Text style={styles.variantLabel}>{variantName}:</Text>
            <View style={styles.variantOptionsRow}>
              {variantOptions.map((variant) => (
                <TouchableOpacity
                  key={variant._id}
                  style={[
                    styles.variantOption,
                    selectedVariant &&
                      selectedVariant._id === variant._id &&
                      styles.selectedVariant,
                  ]}
                  onPress={() => setSelectedVariant(variant)}
                  disabled={variant.quantity === 0}
                >
                  <Text
                    style={{
                      color: variant.quantity === 0 ? "#989CA0" : "#000000",
                    }}
                  >
                    {variant.name}
                  </Text>
                  {variant.quantity === 0 && (
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Price and Stock */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{price}</Text>
          {originalPrice && originalPrice > price && (
            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
          )}
          <Text style={styles.savings}>
            {originalPrice && originalPrice > price
              ? `Save ₹${(originalPrice - price).toFixed(2)}`
              : ""}
          </Text>
        </View>
        <Text style={styles.stockText}>
          {isOutOfStock ? "Out of Stock" : `In Stock: ${quantity}`}
        </Text>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            isOutOfStock && { backgroundColor: "#ccc" },
          ]}
          disabled={isOutOfStock}
          onPress={handelAddToCart}
        >
          <Text style={styles.addToCartButtonText}>
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={{ fontSize: 15, fontWeight: "600", marginTop: 6 }}>
            Description:
          </Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Reviews */}
        {/* <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, idx) => (
              <Text key={idx} style={styles.reviewText}>
                - {review}
              </Text>
            ))
          ) : (
            <Text style={styles.reviewText}>No reviews yet.</Text>
          )}
        </View> */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    // marginVertical: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageGallery: {
    alignItems: "center",
    marginTop: 10,
  },
  mainImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: "contain",
  },
  thumbnailRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  imageContainer: {
    width: width,
    height: 300,
    borderRadius: 8,
    marginRight: 8,
    // borderWidth: 1,
    // borderColor: "#eee",
  },
  images: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 20,
    marginTop: 10,
  },
  badge: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
    fontSize: 12,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  brand: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginVertical: 4,
  },
  category: {
    fontSize: 13,
    color: "#007AFF",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: "#FFD700",
    marginBottom: 4,
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
  description: {
    fontSize: 15,
    color: "#444",
    marginTop: 8,
  },
  variantSection: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  variantLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  variantOptionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  variantOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#007AFF",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  selectedVariant: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  outOfStockText: {
    color: "#FF3B30",
    fontSize: 10,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  savings: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 8,
  },
  stockText: {
    fontSize: 14,
    color: "#FF3B30",
    marginLeft: 20,
    marginTop: 4,
  },
  addToCartButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
  },
  reviewsTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  backIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
});

export default ProductPage;
