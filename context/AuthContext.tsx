import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  isLogged: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);

  const login = (user: string, pass: string) => {
    if (user === "admin" && pass === "1234") {
      setIsLogged(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)!;
}
