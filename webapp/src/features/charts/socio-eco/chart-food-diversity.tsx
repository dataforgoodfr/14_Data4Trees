import { useTranslation } from "@shared/i18n";

import { BarCharWithBenefAndControl } from "../components/bar-chart-benef-control";
import type { ChartComponentType } from "../components/chart-component";

type Data = {
  cer: number;
  egg: number;
  fish: number;
  fru: number;
  tub: number;
  meat: number;
  puls: number;
  veg: number;
  dairy: number;
};

type ChartFoodDiversityProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartFoodDiversity: ChartComponentType<
  ChartFoodDiversityProps
> = ({ benef, temoin }) => {
  const { t } = useTranslation("all4trees");

  const chartData = [
    {
      benef: benef.cer,
      indicator: t("indicators.socioEco.sections.food.diversity.cereals"),
      temoin: temoin?.cer,
    },
    {
      benef: benef.egg,
      indicator: t("indicators.socioEco.sections.food.diversity.eggs"),
      temoin: temoin?.egg,
    },
    {
      benef: benef.fish,
      indicator: t("indicators.socioEco.sections.food.diversity.fish"),
      temoin: temoin?.fish,
    },
    {
      benef: benef.meat,
      indicator: t("indicators.socioEco.sections.food.diversity.meat"),
      temoin: temoin?.meat,
    },
    {
      benef: benef.fru,
      indicator: t("indicators.socioEco.sections.food.diversity.fruits"),
      temoin: temoin?.fru,
    },
    {
      benef: benef.veg,
      indicator: t("indicators.socioEco.sections.food.diversity.vegetables"),
      temoin: temoin?.veg,
    },
    {
      benef: benef.tub,
      indicator: t("indicators.socioEco.sections.food.diversity.roots"),
      temoin: temoin?.tub,
    },
    {
      benef: benef.puls,
      indicator: t("indicators.socioEco.sections.food.diversity.seeds"),
      temoin: temoin?.puls,
    },
    {
      benef: benef.dairy,
      indicator: t("indicators.socioEco.sections.food.diversity.dairy"),
      temoin: temoin?.dairy,
    },
  ];

  return (
    <BarCharWithBenefAndControl
      chartData={chartData}
      legendLabel={t("indicators.socioEco.sections.food.diversity.legend")}
      title={t("indicators.socioEco.sections.food.diversity.title")}
      unit="%"
      withTemoin={!!temoin}
    />
  );
};

ChartFoodDiversity.isChartComponent = true;
