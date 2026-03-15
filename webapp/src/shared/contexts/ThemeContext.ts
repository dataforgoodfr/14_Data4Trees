import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  setTheme: () => null,
  theme: "system",
};

export const ThemeContext = createContext<ThemeProviderState>(initialState);
