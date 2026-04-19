import type { FC } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type PieChartCategoricalProps = {
  title: string;
  chartData: Array<{ name: string; value: unknown; fill: string }>;
};

export const PieChartCategorical: FC<PieChartCategoricalProps> = ({
  title,
  chartData,
}) => {
  return (
    <div className="flex flex-col justify-between gap-sm flex-1">
      <p className="text-muted-foreground">{title}</p>
      <ResponsiveContainer
        height={200}
        width="100%"
      >
        <PieChart
          accessibilityLayer
          barCategoryGap="10%"
          barGap={4}
          cx="50%"
          cy="50%"
          data={chartData}
          endAngle={360}
          innerRadius={0}
          layout="centric"
          margin={{
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          }}
          outerRadius="80%"
          stackOffset="none"
          startAngle={0}
          syncMethod="index"
        >
          <Pie
            data={chartData}
            dataKey="value"
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
