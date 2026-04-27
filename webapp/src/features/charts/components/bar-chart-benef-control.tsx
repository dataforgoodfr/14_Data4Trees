import type { FC } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useTranslation } from "@shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@shared/ui/chart";

type BarChartProps = {
  title: string;
  chartData: Array<{ indicator: string; benef: unknown; temoin?: unknown }>;
  legendLabel: string;
  withTemoin?: boolean;
};

export const BarCharWithBenefAndControl: FC<BarChartProps> = ({
  title,
  chartData,
  legendLabel,
  withTemoin,
}) => {
  const { t } = useTranslation("translations");
  const chartConfig = {
    benef: {
      color: "var(--chart-1)",
      label: `(${t("indicators.common.beneficiary")}) ` + legendLabel,
    },
    temoin: {
      color: "var(--chart-2)",
      label: `(${t("indicators.common.control")}) ` + legendLabel,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          className="mx-auto max-h-62.5"
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="indicator"
              tickFormatter={(value) => value.slice(0, 4)}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
            />
            <Bar
              dataKey="benef"
              fill="var(--chart-3)"
              radius={8}
            />

            {withTemoin && (
              <Bar
                dataKey="temoin"
                fill="var(--chart-4)"
                radius={8}
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
