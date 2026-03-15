import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
