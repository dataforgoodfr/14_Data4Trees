import type { FC } from "react";

import { useTranslation } from "@shared/i18n";

import { BarCharWithBenefAndControl } from "../components/bar-chart-benef-control";

type Data = {
  defense: number;
  improvedHousehold: number;
  rna: number;
  treePlanting: number;
};

type ChartBeneficialPracticesProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartBeneficialPractices: FC<ChartBeneficialPracticesProps> = ({
  benef,
  temoin,
}) => {
  const { t } = useTranslation("translations");

  const chartData = [
    {
      benef: benef.defense,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.defense",
      ),
      temoin: temoin?.defense,
    },
    {
      benef: benef.improvedHousehold,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.improvedHousehold",
      ),
      temoin: temoin?.improvedHousehold,
    },
    {
      benef: benef.rna,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.rna",
      ),
      temoin: temoin?.rna,
    },
    {
      benef: benef.treePlanting,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.treePlanting",
      ),
      temoin: temoin?.treePlanting,
    },
  ];

  return (
    <BarCharWithBenefAndControl
      chartData={chartData}
      legendLabel={t(
        "indicators.socioEco.sections.governance.beneficialPractices.legend",
      )}
      title={t(
        "indicators.socioEco.sections.governance.beneficialPractices.title",
      )}
      withTemoin={!!temoin}
    />
  );
};
