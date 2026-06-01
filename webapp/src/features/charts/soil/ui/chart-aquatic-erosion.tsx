import type { ChartComponentType } from "@features/charts/components/chart-component";

import { useTranslation } from "@shared/i18n";

import { ChartRadarWithBenefAndControl } from "../../components/radar-benef-control";

type Data = {
  rainfall: number;
  soilCover: number;
  slope: number;
  soilStability: number;
  waterSeepage: number;
};

type ChartAquaticErosionProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartAquaticErosion: ChartComponentType<
  ChartAquaticErosionProps
> = ({ benef, temoin }) => {
  const { t } = useTranslation("translations");

  const chartData: Array<{
    indicator: string;
    benef: number;
    temoin?: number;
  }> = [
    {
      benef: benef.soilCover,
      indicator: t("indicators.soil.sections.erosion.aquatic.soilCover"),
      temoin: temoin?.soilCover,
    },
    {
      benef: benef.slope,
      indicator: t("indicators.soil.sections.erosion.aquatic.slope"),
      temoin: temoin?.slope,
    },
    {
      benef: benef.soilStability,
      indicator: t("indicators.soil.sections.erosion.aquatic.stability"),
      temoin: temoin?.soilStability,
    },
    {
      benef: benef.waterSeepage,
      indicator: t("indicators.soil.sections.erosion.aquatic.waterSeepage"),
      temoin: temoin?.waterSeepage,
    },
    {
      benef: benef.rainfall,
      indicator: t("indicators.soil.sections.erosion.aquatic.rainfall"),
      temoin: temoin?.rainfall,
    },
  ];

  return (
    <ChartRadarWithBenefAndControl
      chartData={chartData}
      title={t("indicators.soil.sections.erosion.aquatic.title")}
      withTemoin={!!temoin}
    />
  );
};

ChartAquaticErosion.isChartComponent = true;
