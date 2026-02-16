import { type ReactNode, useEffect, useState } from "react";

import { verifyToken } from "@shared/api/client";
import { AuthContext } from "@shared/contexts/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setIsAuthLoading(false);
      return;
    }

    verifyToken(storedToken)
      .then((isValid) => {
        if (isValid) {
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAuthLoading, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
