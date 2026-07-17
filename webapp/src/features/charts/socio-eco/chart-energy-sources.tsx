import { useTranslation } from "@shared/i18n";

import { BarCharWithBenefAndControl } from "../components/bar-chart-benef-control";
import type { ChartComponentType } from "../components/chart-component";
import type { ExternalData } from "@features/popup/forest-inventory/types";

type Data = {
  fw_coll: number;
  fw_pur: number;
  fw_rec: number;
  coal: number;
  crop: number;
  man: number;
  gaz: number;
  oth: number;
};

type ChartEnergySourcesProps = {
  project: string;
  externalData: ExternalData
  benef: Data;
  temoin?: Data;
};

export const ChartFuelSources: ChartComponentType<ChartEnergySourcesProps> = ({
  benef,
  temoin,
}) => {
  const { t } = useTranslation("all4trees");

  const chartData = [
    {
      benef: benef.fw_coll,
      indicator: t(
        "indicators.socioEco.sections.wood.energySources.collectedWood",
      ),
      temoin: temoin?.fw_coll,
    },
    {
      benef: benef.fw_pur,
      indicator: t(
        "indicators.socioEco.sections.wood.energySources.boughtWood",
      ),
      temoin: temoin?.fw_pur,
    },
    {
      benef: benef.fw_rec,
      indicator: t("indicators.socioEco.sections.wood.energySources.recWood"),
      temoin: temoin?.fw_rec,
    },
    {
      benef: benef.coal,
      indicator: t("indicators.socioEco.sections.wood.energySources.coal"),
      temoin: temoin?.coal,
    },
    {
      benef: benef.crop,
      indicator: t(
        "indicators.socioEco.sections.wood.energySources.organicWaste",
      ),
      temoin: temoin?.crop,
    },
    {
      benef: benef.man,
      indicator: t(
        "indicators.socioEco.sections.wood.energySources.animalWaste",
      ),
      temoin: temoin?.man,
    },
    {
      benef: benef.gaz,
      indicator: t("indicators.socioEco.sections.wood.energySources.gas"),
      temoin: temoin?.gaz,
    },
    {
      benef: benef.oth,
      indicator: t("indicators.socioEco.sections.wood.energySources.other"),
      temoin: temoin?.oth,
    },
  ];

  return (
    <BarCharWithBenefAndControl
      chartData={chartData}
      legendLabel={t("indicators.socioEco.sections.wood.energySources.legend")}
      title={t("indicators.socioEco.sections.wood.energySources.title")}
      unit="%"
      withTemoin={!!temoin}
    />
  );
};

ChartFuelSources.isChartComponent = true;
