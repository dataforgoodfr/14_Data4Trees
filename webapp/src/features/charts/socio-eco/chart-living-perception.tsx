import type { FC } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { useTranslation } from "@shared/i18n";

type PieChartProps = {
  data: {
        improvement: number;
        stable: number;
    regression: number;
    dontKnow: number;
    refuse: number;
  };
};

export const ChartLivingPerception: FC<PieChartProps> = ({ data }) => {
  const { t } = useTranslation("translations");
  const chartData = [
    {
      fill: "var(--chart-4)",
      name: t("indicators.socioEco.sections.economy.livingPerception.improvement"),
      value: data.improvement,
    },
    {
      fill: "var(--chart-3)",
      name: t("indicators.socioEco.sections.economy.livingPerception.stable"),
      value: data.stable,
    },
    {
      fill: "var(--chart-2)",
      name: t("indicators.socioEco.sections.economy.livingPerception.regression"),
      value: data.regression,
    },
      {
          fill: "var(--chart-5)",
          name: t("indicators.socioEco.sections.economy.livingPerception.refuse"),
          value: data.refuse,
      },
    {
      fill: "var(--chart-1)",
      name: t("indicators.socioEco.sections.economy.livingPerception.dontKnow"),
      value: data.dontKnow,
    },
  ];

  return (
    <div className="flex flex-col justify-between gap-sm flex-1">
      <p className="text-muted-foreground">
        {t("indicators.socioEco.sections.economy.livingPerception.title")}
      </p>
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
