import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
