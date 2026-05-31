import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiPost } from "../services/api";

type Usuario = { id: number; nombre: string; email: string; rol: string };

type AuthContextType = {
  isLogged: boolean;
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Recuperar sesión guardada al abrir la app
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const user = await AsyncStorage.getItem("auth_user");
        if (token && user) {
          setUsuario(JSON.parse(user));
          setIsLogged(true);
        }
      } catch (e) {
        console.error("Error cargando sesión:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiPost("/auth/login", { email, password });
    await AsyncStorage.setItem("auth_token", data.token);
    await AsyncStorage.setItem("auth_user", JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    setIsLogged(true);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
    setUsuario(null);
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)!;
}
