import { useApi } from "@/app/providers/ApiProvider";
import { Header, Map } from "@/components";
import { Dashboard } from "@/components/Dashboard";
import { useEffect, useState } from "react";

export interface MainPageProps {
    userData?: any;
}

export function MainPage() {
    const client = useApi();
    const [data, setData] = useState<any>(null);
    const [isDashboardShown, setIsDashboardShown] = useState<boolean>(true);

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
                onShowDashboard={() => setIsDashboardShown(true)}
                onHideDashboard={() => setIsDashboardShown(false)}
                isLogin={false}
                isDashboardShown={isDashboardShown} />

            <Map />

            {isDashboardShown && data && (
                <Dashboard graphData={data} dataType="example" />
            )}
        </>
    );
}

