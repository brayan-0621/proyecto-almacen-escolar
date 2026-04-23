import { Stack } from "expo-router";
import { View } from "react-native";
import FAB from "../components/FAB";
import Header from "../components/Header";
import { AuthProvider, useAuth } from "../context/AuthContext";

function AppContent() {
  const { isLogged } = useAuth();

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
