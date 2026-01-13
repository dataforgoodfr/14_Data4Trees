import { useState, useEffect } from "react";
import "./styles/all4trees.css";
import "./styles/globals.css";
import { fetchData } from "./api/client";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/app/providers/ThemeProvider";


function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch((err) => console.error("fetchData error", err));
  }, []);

  console.log("Fetched data:", data);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header
        onLogin={() => console.log("Login clicked")}
        onLogout={() => console.log("Logout clicked")}
        onShowDashboard={() => console.log("Show Dashboard clicked")}
        onHideDashboard={() => console.log("Hide Dashboard clicked")}
        isLogin={false}
        isDashboardShown={false} />

        <h1>Bienvenue sur la carte all4Trees</h1>
    </ThemeProvider>
  );
}

export default App;