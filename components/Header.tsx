import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/header.styles";
import LogoutButton from "./LogoutButton";
import UserInfo from "./UserInfo";

export default function Header() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <UserInfo name="Brayan" />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>

        <LogoutButton onPress={handleLogout} />
      </View>
    </View>
  );
}
