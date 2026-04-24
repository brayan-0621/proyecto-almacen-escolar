import { Stack, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import FAB from "../components/FAB";
import Header from "../components/Header";
import { AuthProvider, useAuth } from "../context/AuthContext";

function AppContent() {
  const { isLogged } = useAuth();
  const router = useRouter();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    if (!isLogged) {
      setTimeout(() => {
        router.replace("/login");
      }, 0);
    }
  }, [isLogged]);

  if (!isLogged) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
      </Stack>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Stack screenOptions={{ headerShown: false }} />
      <FAB />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
