import { useApi } from "@/app/providers/ApiProvider";
import { GraphConsoElec } from "@/components/Charts/LineChart";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";

export function Map() {
    const client = useApi();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        client.getData()
            .then((json) => setData(json.data))
            .catch((err) => console.error("fetchData error", err));
    }, []);
    return (
        <>
            <Header
                onLogin={() => console.log("Login clicked")}
                onLogout={() => console.log("Logout clicked")}
                onShowDashboard={() => console.log("Show Dashboard clicked")}
                onHideDashboard={() => console.log("Hide Dashboard clicked")}
                isLogin={false}
                isDashboardShown={false} />

            <h1 className="py-4 text-center text-foreground font-title-primary">Bienvenue sur la carte all4Trees</h1>

            <div className="px-4 py-10 items-center justify-between max-w-7xl max-h-7">
                {data && (
                    <GraphConsoElec name={data.clientByName?.fullName} chartData={data.clientByName?.consumptionSet} />
                )}
            </div>
        </>
    );
}

