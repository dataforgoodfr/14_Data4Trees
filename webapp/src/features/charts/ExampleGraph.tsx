import { GitCommitVertical } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
  year: number;
  month: number;
  kwhConsumed: number;
}

export interface GraphConsoElecProps {
  name: string;
  chartData: DataPoint[];
}

const chartConfig = {
  year: {
    label: "Année",
    color: "var(--chart-1)",
  },
  month: {
    label: "Mois",
    color: "var(--chart-2)",
  },
  kwhConsumed: {
    label: "kWh Consommés",
    color: "var(--chart-3)",
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
              xAxisId={0}
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <XAxis
              xAxisId={1}
              dataKey="year"
              allowDuplicatedCategory={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel={true} />}
            />
            <Line
              dataKey="kwhConsumed"
              type="natural"
              stroke="var(--color-kwhConsumed)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = payload.kwhConsumed / 20;
                return (
                  <GitCommitVertical
                    key={`${payload.year} / ${payload.month}`}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--background))"
                    stroke="var(--color-kwhConsumed)"
                  />
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
