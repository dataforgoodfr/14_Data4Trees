import { useState, useEffect } from "react";
import "./styles/all4trees.css";
import "./styles/globals.css";
import { fetchData } from "./api/client";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { GraphConsoElec } from "@/components/Charts/LineChart";


function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData()
      .then((json) => setData(json.data))
      .catch((err) => console.error("fetchData error", err));
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header
        onLogin={() => console.log("Login clicked")}
        onLogout={() => console.log("Logout clicked")}
        onShowDashboard={() => console.log("Show Dashboard clicked")}
        onHideDashboard={() => console.log("Hide Dashboard clicked")}
        isLogin={false}
        isDashboardShown={false} />

      <h1 className="py-4 text-center text-primary-foreground font-title-primary">Bienvenue sur la carte all4Trees</h1>

      <div className="px-4 py-10 items-center justify-between max-w-7xl max-h-7">
        {data && (
          <GraphConsoElec name={data.clientByName?.fullName} chartData={data.clientByName?.consumptionSet} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;