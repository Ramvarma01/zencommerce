import { Slot, Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AuthProvider, AuthContext } from "../context/authContext";
import { ProductProvider } from "../context/productContext";
import { PushNotificationProvider } from "../context/pushNotificationContext";

function RootLayoutInner() {
  const [state, , , loading] = useContext(AuthContext);

  if (loading) {
    // Show a splash screen or nothing while loading
    return null;
  }

  // const isLoggedIn = !!state?.user;
  // console.log('isLoggedIn',isLoggedIn)
  return (
    <>
      {/* <Stack screenOptions={{ headerShown: false }}> */}
      {/* {console.log('isLoggedIn in layout return',isLoggedIn)} */}
      {/* {!isLoggedIn ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgotPassword" />
          <Stack.Screen name="(profile)" />
        </Stack>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      )} */}
   <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="(profile)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <PushNotificationProvider>
          <RootLayoutInner />
        </PushNotificationProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
