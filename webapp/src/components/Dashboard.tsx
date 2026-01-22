import { ExampleGraph } from "@components";

export interface DashboardProps {
    graphData: any;
    dataType: string;
}

export function Dashboard({ graphData, dataType }: DashboardProps) {
    return (
        <div>
            <h1>Dashboard</h1>
            <div className="px-4 py-10 items-center justify-between max-w-7xl max-h-7">
                {graphData && dataType === "example" && (
                    <ExampleGraph name={graphData.clientByName?.fullName} chartData={graphData.clientByName?.consumptionSet} />
                )}
            </div>
        </div>
    );
}