import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { ErrorBoundary } from "../components/ErrorBoundary";
import FAB from "../components/FAB";
import Header from "../components/Header";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { logger } from "../services/logger";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
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
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        logger.info("Permiso de notificaciones concedido");
      } else {
        logger.warn("Permiso de notificaciones denegado");
      }
    })();
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
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
