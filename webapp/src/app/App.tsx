import { ApiProvider, AuthProvider, MapProvider, ThemeProvider } from "./providers";
import { AppRouter } from "./routes/AppRouter";
import "./styles/globals.css";
import "./styles/index.css";

function App() {
  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <AuthProvider>
        <ApiProvider>
          <MapProvider>
            <AppRouter />
          </MapProvider>
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
