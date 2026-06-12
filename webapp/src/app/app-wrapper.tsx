import type { ReactNode } from "react";

import { ApiProvider, AuthProvider, ThemeProvider } from "./providers";

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <AuthProvider>
        <ApiProvider>{children}</ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
