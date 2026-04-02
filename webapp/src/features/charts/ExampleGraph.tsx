import { CartesianGrid, ErrorBar, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/chart";

export const description = "A line chart with custom dots";

interface DataPoint {
  kwhConsumed: number;
  month: number;
  year: number;
}

export interface GraphConsoElecProps {
  chartData: DataPoint[];
  name: string;
}

const chartConfig = {
  kwhConsumed: {
    color: "var(--chart-3)",
    label: "kWh Consommés",
  },
  month: {
    color: "var(--chart-2)",
    label: "Mois",
  },
  year: {
    color: "var(--chart-1)",
    label: "Année",
  },
} satisfies ChartConfig;

export function ExampleGraph({ name, chartData }: GraphConsoElecProps) {
  chartData.sort((a, b) => {
    if (a.year === b.year) {
      return a.month - b.month;
    }
    return a.year - b.year;
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-title-primary">
          Consommation Electrique de {name}
        </CardTitle>
        <CardDescription>2015-2023</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer={true}
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              xAxisId={0}
            />
            <XAxis
              allowDuplicatedCategory={false}
              axisLine={false}
              dataKey="year"
              tickLine={false}
              tickMargin={8}
              xAxisId={1}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel={true} />}
              cursor={false}
            />
            <Line
              dataKey="kwhConsumed"
              stroke="var(--color-kwhConsumed)"
              strokeWidth={2}
              type="natural"
            >
              <ErrorBar
                dataKey={(data) => data.kwhConsumed * 0.1}
                direction="y"
                stroke="red"
                width={5}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
