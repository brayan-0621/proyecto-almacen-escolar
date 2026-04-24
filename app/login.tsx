import { useRouter } from "expo-router";
import { useState } from "react";
import { ImageBackground, Text, View } from "react-native";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/login.styles";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (login(user, pass)) {
      router.replace("/(tabs)/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/login-img-fondo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <FormInput
            placeholder="Usuario"
            value={user}
            onChangeText={setUser}
          />

          <FormInput
            placeholder="Contraseña"
            secureTextEntry
            value={pass}
            onChangeText={setPass}
          />

          {error !== "" && <Text style={styles.error}>{error}</Text>}

          <FormButton label="Ingresar" onPress={handleLogin} />

          <Text style={styles.hint}>admin / 1234</Text>
        </View>
      </View>
    </ImageBackground>
  );
}
