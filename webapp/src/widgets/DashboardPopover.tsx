import { type FC, useEffect, useState } from "react";

import { getChartData } from "@features/charts/chartClient";
import {
  ExampleGraph,
  type GraphConsoElecProps,
} from "@features/charts/ExampleGraph";

import { Button } from "@ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

type GraphData = {
  clientByName: {
    fullName: GraphConsoElecProps["name"];
    consumptionSet: GraphConsoElecProps["chartData"];
  };
};

export type DashboardPopoverProps = {
  dataType: string;
};

export const DashboardPopover: FC<DashboardPopoverProps> = ({ dataType }) => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    getChartData("exampleData")
      .then((json) => setGraphData(json.data))
      .catch((err) => console.error("fetchData error", err));
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button variant="default">Montrer Dashboard</Button>
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
              <ExampleGraph
                chartData={graphData.clientByName?.consumptionSet}
                name={graphData.clientByName?.fullName}
              />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
