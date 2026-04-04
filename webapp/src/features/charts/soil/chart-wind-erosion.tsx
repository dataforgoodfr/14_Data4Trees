import type { FC } from "react";

import { useTranslation } from "@shared/i18n";

import { ChartRadarWithBenefAndControl } from "../components/radar-benef-control";

type Data = {
  wind: number;
  soilCover: number;
  soilStability: number;
};

type ChartWindErosionProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartWindErosion: FC<ChartWindErosionProps> = ({
  benef,
  temoin,
}) => {
  const { t } = useTranslation("translations");

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
