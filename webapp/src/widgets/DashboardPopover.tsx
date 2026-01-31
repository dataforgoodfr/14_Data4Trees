import { ExampleGraph, type GraphConsoElecProps } from "@components";
import { Button } from "@ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";

export interface DashboardProps {
    graphData: {
        clientByName: { fullName: GraphConsoElecProps["name"], consumptionSet: GraphConsoElecProps["chartData"] }
    };
    dataType: string;
}

export function DashboardPopover({ graphData, dataType }: DashboardProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Montrer Dashboard</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">Dashboard</h4>
                        <p className="text-muted-foreground text-sm">
                            Simple graphs to represent data
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {graphData && dataType === "example" && (
                            <ExampleGraph name={graphData.clientByName?.fullName} chartData={graphData.clientByName?.consumptionSet} />
                        )}

                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}