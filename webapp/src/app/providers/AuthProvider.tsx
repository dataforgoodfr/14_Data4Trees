import { type ReactNode, useEffect, useState } from "react";

import { AuthContext, verifyToken } from "@features/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Why isAuthLoading true by default ? Prevent mounting #map too early, since the map ref needs to be attached once
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setIsAuthLoading(false);
      return;
    }

    async function checkToken(token: string) {
      try {
        const isValid = await verifyToken(token);
        if (isValid) {
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      setIsAuthLoading(false);
    }

    checkToken(storedToken);
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
    <AuthContext
      value={{ isAuthenticated, isAuthLoading, login, logout, token }}
    >
      {children}
    </AuthContext>
  );
}
