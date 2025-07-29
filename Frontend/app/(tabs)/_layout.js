import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Custom Header Component
// function CustomHeader({ title }) {
//     const router = useRouter();

//     const handleProfilePress = () => {
//         // Navigate to profile page - you'll need to create this page
//         router.push('/(profile)');
//     };

//     return (
//         <View style={styles.header}>
//             {/* <View style={styles.logoContainer}> */}
//                 {/* <Text style={styles.logoText}>ZenCommerce</Text> */}
//             <TouchableOpacity style={styles.logoContainer} onPress={() => router.push('/')}>
//                 <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
//           </TouchableOpacity>
//             {/* </View> */}
//             <Text style={styles.title}>{title}</Text>
//             <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
//             {/* <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(profile)')}> */}
//                 <Ionicons name="person-circle-outline" size={30} color="#007AFF" />
//             </TouchableOpacity>
//         </View>
//     );
// }

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = "home-outline";
          } else if (route.name === "wishlist") {
            iconName = "heart-outline";
          } else if (route.name === "search") {
            iconName = "search-outline";
          } else if (route.name === "cart") {
            iconName = "cart-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? "#007AFF" : "#8e8e93"}
            />
          );
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8e8e93",
        headerShown: false,
        // header: ({ route }) => <CustomHeader title={route.name === 'index' ? 'Home' : route.name.charAt(0).toUpperCase() + route.name.slice(1)} />,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
    </Tabs>
  );
}

// const styles = StyleSheet.create({
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         paddingTop: 35,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//     },
//     logoContainer: {
//         flex: 1,
//         alignItems: 'flex-start',
//     },
//     logo: {
//         width: 30,
//         height: 30,
//         resizeMode: 'contain',
//         borderRadius: 15,
//     },
//     logoText: {
//         fontSize: 15,
//         fontWeight: 'bold',
//         color: '#007AFF',
//     },
//     title: {
//         flex: 1,
//         fontSize: 20,
//         fontWeight: '700',
//         textAlign: 'center',
//         color: '#000',
//     },
//     profileButton: {
//         flex: 1,
//         alignItems: 'flex-end',
//         padding: 4,
//     },
// });
