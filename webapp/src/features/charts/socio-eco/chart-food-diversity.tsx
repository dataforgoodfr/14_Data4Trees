import type { FC } from "react";

import { useTranslation } from "@shared/i18n";

import { BarCharWithBenefAndControl } from "../components/bar-chart-benef-control";

type Data = {
  cereals: number;
  eggs: number;
  fish: number;
  fruits: number;
  roots: number;
  meat: number;
  seeds: number;
  vegetables: number;
};

type ChartFoodDiversityProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartFoodDiversity: FC<ChartFoodDiversityProps> = ({
  benef,
  temoin,
}) => {
  const { t } = useTranslation("translations");

  const chartData = [
    {
      benef: benef.cereals,
      indicator: t(
        "indicators.socioEco.sections.food.diversity.cereals",
      ),
      temoin: temoin?.cereals,
    },
    {
      benef: benef.eggs,
      indicator: t("indicators.socioEco.sections.food.diversity.eggs"),
      temoin: temoin?.eggs,
    },
    {
      benef: benef.fish,
      indicator: t("indicators.socioEco.sections.food.diversity.fish"),
      temoin: temoin?.fish,
    },
    {
      benef: benef.meat,
      indicator: t(
        "indicators.socioEco.sections.food.diversity.meat",
      ),
      temoin: temoin?.meat,
    },
    {
      benef: benef.fruits,
      indicator: t(
        "indicators.socioEco.sections.food.diversity.fruits",
      ),
      temoin: temoin?.fruits,
    },
    {
      benef: benef.vegetables,
      indicator: t("indicators.socioEco.sections.food.diversity.vegetables"),
      temoin: temoin?.vegetables,
    },
    {
      benef: benef.roots,
      indicator: t("indicators.socioEco.sections.food.diversity.roots"),
      temoin: temoin?.roots,
    },
    {
      benef: benef.seeds,
      indicator: t("indicators.socioEco.sections.food.diversity.seeds"),
      temoin: temoin?.seeds,
    },
  ];

  return (
    <BarCharWithBenefAndControl
      chartData={chartData}
      legendLabel={t("indicators.socioEco.sections.food.diversity.legend")}
      title={t("indicators.socioEco.sections.food.diversity.title")}
      withTemoin={!!temoin}
    />
  );
};
