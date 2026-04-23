import type { FC } from "react";

import { useTranslation } from "@shared/i18n";
import type { ChartConfig } from "@shared/ui/chart";

import { PieChartCategorical } from "../components/pie-chart-categorical";
import { lineBreakLabel } from "../utils";

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
      name: "improvement",
      value: data.improvement,
    },
    {
      fill: "var(--chart-3)",
      name: "stable",
      value: data.stable,
    },
    {
      fill: "var(--chart-2)",
      name: "regression",
      value: data.regression,
    },
    {
      fill: "var(--chart-5)",
      name: "refuse",
      value: data.refuse,
    },
    {
      fill: "var(--chart-1)",
      name: "dontKnow",
      value: data.dontKnow,
    },
  ];

  const chartConfig = {
    dontKnow: {
      label: t(
        "indicators.socioEco.sections.economy.livingPerception.dontKnow",
      ),
    },
    improvement: {
      label: t(
        "indicators.socioEco.sections.economy.livingPerception.improvement",
      ),
    },
    refuse: {
      label: t("indicators.socioEco.sections.economy.livingPerception.refuse"),
    },
    regression: {
      label: t(
        "indicators.socioEco.sections.economy.livingPerception.regression",
      ),
    },
    stable: {
      label: t("indicators.socioEco.sections.economy.livingPerception.stable"),
    },
  } satisfies ChartConfig;

  return (
    <PieChartCategorical
      chartConfig={chartConfig}
      chartData={chartData}
      title={t("indicators.socioEco.sections.economy.livingPerception.title")}
      withLabel={/*renderLabel(chartConfig)*/ false}
    />
  );
};

// TODO: Would be nice to display labels correctly but there is not enough space in chart card.
//@ts-expect-error
const renderLabel =
  (chartConfig: any) =>
  ({
    payload,
    ...props
  }: {
    payload: { name: string; value: number };
    [key: string]: any;
  }) => {
    const name = payload.name as keyof typeof chartConfig;
    const label = `${chartConfig[name]?.label || payload.name}: ${payload.value}%`;
    const lines = lineBreakLabel(label);

    return (
      <text
        fill="#9c9798"
        fontSize={12}
        textAnchor={props.textAnchor}
        x={props.x}
        y={props.y}
      >
        {lines.map((line, index) => (
          <tspan
            dy={index === 0 ? 0 : 16}
            // biome-ignore lint/suspicious/noArrayIndexKey: <don't want to enforce id>
            key={index}
            x={props.x}
          >
            {line}
          </tspan>
        ))}
      </text>
    );
  };
