import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function Index() {
  const [state] = useContext(AuthContext);
  const isLoggedIn = !!state?.user;
  // console.log('isLoggedIn in index',isLoggedIn)
  return (
    <>
      {!isLoggedIn ? (
        <Redirect href="/login" /> // Redirect to login page
      ) : (
        <Redirect href="/(tabs)" />
      )}
    </>
  );
}
