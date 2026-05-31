import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ImageBackground, Text, View } from "react-native";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/login.styles";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) {
      setError("Completa todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, pass);
      router.replace("/(tabs)/dashboard");
    } catch (e: any) {
      setError(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <FormInput
            placeholder="Contraseña"
            secureTextEntry
            value={pass}
            onChangeText={setPass}
          />

          {error !== "" && <Text style={styles.error}>{error}</Text>}

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2e6da4"
              style={{ marginTop: 12 }}
            />
          ) : (
            <FormButton label="Ingresar" onPress={handleLogin} />
          )}
        </View>
      </View>
    </ImageBackground>
  );
}
