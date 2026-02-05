import { ThemeProvider, ApiProvider, AuthProvider } from "@providers";
import { AppRouter } from "./routes/AppRouter";

import "./styles/all4trees.css";
import "./styles/globals.css";
import { useEffect } from "react";
import { fetchToken, verifyToken } from "./api/client";

function App() {

  useEffect(() => {
    fetchToken("arnfou", "admin").then(token => {
      console.log("Token fetched on app load:", token);
      verifyToken(token).then(isValid => {
        if (isValid) {
          console.log("User is authenticated");
        } else {
          console.log("User is not authenticated");
        }
      }).catch(error => {
        console.error("Error verifying token:", error);
      });
    }).catch(error => {
      console.error("Error fetching token:", error);
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <ApiProvider>
          <AppRouter />
        </ApiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;