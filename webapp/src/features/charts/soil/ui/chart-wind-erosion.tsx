import type { ChartComponentType } from "@features/charts/components/chart-component";

import { useTranslation } from "@shared/i18n";

import { ChartRadarWithBenefAndControl } from "../../components/radar-benef-control";

type Data = {
  wind: number;
  soilCover: number;
  soilStability: number;
};

type ChartWindErosionProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartWindErosion: ChartComponentType<ChartWindErosionProps> = ({
  benef,
  temoin,
}) => {
  const { t } = useTranslation("all4trees");

  const chartData: Array<{
    indicator: string;
    benef: number;
    temoin?: number;
  }> = [
    {
      benef: benef.soilCover,
      indicator: t("indicators.soil.sections.erosion.wind.soilCover"),
      temoin: temoin?.soilCover,
    },
    {
      benef: benef.soilStability,
      indicator: t("indicators.soil.sections.erosion.wind.stability"),
      temoin: temoin?.soilStability,
    },
    {
      benef: benef.wind,
      indicator: t("indicators.soil.sections.erosion.wind.speed"),
      temoin: temoin?.wind,
    },
  ];

  return (
    <ChartRadarWithBenefAndControl
      chartData={chartData}
      title={t("indicators.soil.sections.erosion.wind.title")}
      withTemoin={!!temoin}
    />
  );
};

ChartWindErosion.isChartComponent = true;
