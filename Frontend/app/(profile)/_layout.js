import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        // tabBarActiveTintColor: '#007AFF',
        // tabBarInactiveTintColor: '#8e8e93',
        // tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="editProfile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="helpAndSupport" options={{ title: 'Help & Support' }} />
      <Stack.Screen name="shippingAddress" options={{ title: 'Address Shipping' }} />
      <Stack.Screen name="yourOrder" options={{ title: 'Your Order' }} />
    </Stack>
  );
}
