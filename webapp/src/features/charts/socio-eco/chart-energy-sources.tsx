import { findLabel } from "@features/indicators/labels";

import type { LabelData } from "@entities/data";

import { i18nInstance, useTranslation } from "@shared/i18n";

import { BarCharWithBenefAndControl } from "../components/bar-chart-benef-control";
import type { ChartComponentType } from "../components/chart-component";

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
  metadata: LabelData[];
  benef: Data;
  temoin?: Data;
};

export const ChartFuelSources: ChartComponentType<ChartEnergySourcesProps> = ({
  benef,
  temoin,
  project,
  metadata,
}) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const lang = i18nInstance.language;

  const chartData = Object.entries(benef).map(([key, value]) => ({
    benef: value,
    indicator:
      findLabel(metadata, project, lang, "ener", key) ||
      t("common:dataManagement.undefined"),
    temoin: temoin?.[key as keyof typeof temoin],
  }));

  return (
    <BarCharWithBenefAndControl
      chartData={chartData}
      legendLabel={t(
        "all4trees:indicators.socioEco.sections.wood.energySources.legend",
      )}
      title={t(
        "all4trees:indicators.socioEco.sections.wood.energySources.title",
      )}
      unit="%"
      withTemoin={!!temoin}
    />
  );
};

ChartFuelSources.isChartComponent = true;
