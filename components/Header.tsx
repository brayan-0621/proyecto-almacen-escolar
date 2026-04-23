import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleLogout = () => {
    // 🔥 luego aquí puedes limpiar sesión/token
    router.replace("/login"); // ajusta si tienes otra ruta
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* IZQUIERDA: USUARIO */}
      <View style={styles.userSection}>
        <Image source={require("../assets/user.png")} style={styles.avatar} />
        <Text style={styles.name} numberOfLines={1}>
          Brayan
        </Text>
      </View>

      {/* DERECHA: ACCIONES */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 15,
    paddingBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    marginRight: 10,
  },

  icon: {
    fontSize: 20,
  },

  logoutButton: {
    backgroundColor: "#f4a261",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
