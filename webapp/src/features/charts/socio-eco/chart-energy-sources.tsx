import type { FC } from "react";

import { useTranslation } from "@shared/i18n";

import { BarCharWithBenefAndControl } from "../components/bar-chart-benef-control";

type Data = {
  collectedWood: number;
  boughtWood: number;
  coal: number;
  organicWaste: number;
  animalWaste: number;
  gas: number;
  other: number;
};

type ChartEnergySourcesProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartEnergySources: FC<ChartEnergySourcesProps> = ({
  benef,
  temoin,
}) => {
  const { t } = useTranslation("translations");

  const chartData = [
    {
      benef: benef.collectedWood,
      indicator: t(
        "indicators.socio-eco.sections.wood.energySources.collectedWood",
      ),
      temoin: temoin?.collectedWood,
    },
    {
      benef: benef.boughtWood,
      indicator: t(
        "indicators.socio-eco.sections.wood.energySources.boughtWood",
      ),
      temoin: temoin?.boughtWood,
    },
    {
      benef: benef.coal,
      indicator: t("indicators.socio-eco.sections.wood.energySources.coal"),
      temoin: temoin?.coal,
    },
    {
      benef: benef.organicWaste,
      indicator: t(
        "indicators.socio-eco.sections.wood.energySources.organicWaste",
      ),
      temoin: temoin?.organicWaste,
    },
    {
      benef: benef.animalWaste,
      indicator: t(
        "indicators.socio-eco.sections.wood.energySources.animalWaste",
      ),
      temoin: temoin?.animalWaste,
    },
    {
      benef: benef.gas,
      indicator: t("indicators.socio-eco.sections.wood.energySources.gas"),
      temoin: temoin?.gas,
    },
    {
      benef: benef.other,
      indicator: t("indicators.socio-eco.sections.wood.energySources.other"),
      temoin: temoin?.other,
    },
  ];

  return (
    <BarCharWithBenefAndControl
      chartData={chartData}
      legendLabel={t("indicators.socio-eco.sections.wood.energySources.legend")}
      title={t("indicators.socio-eco.sections.wood.energySources.title")}
      withTemoin={!!temoin}
    />
  );
};
