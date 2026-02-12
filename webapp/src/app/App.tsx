import { ApiProvider, AuthProvider, ThemeProvider } from "@providers";

import { AppRouter } from "./routes/AppRouter";
import "./styles/all4trees.css";
import "./styles/globals.css";

function App() {
  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <AuthProvider>
        <ApiProvider>
          <AppRouter />
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
