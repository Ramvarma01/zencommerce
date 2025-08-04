import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();
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
            // <View  style={[{flex:1, justifyContent:"center", borderRadius:30 ,position:"absolute", top:(focused ? -15 : null), backgroundColor:(focused? "red": null)}]}>
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? "#007AFF" : "#8e8e93"}
            />
            // </View>
          );
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8e8e93",
        // tabBarStyle: {paddingTop: 0, height: 60 + insets.bottom, paddingBottom: insets.bottom,},
        // tabBarStyle: {height:"70"},
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