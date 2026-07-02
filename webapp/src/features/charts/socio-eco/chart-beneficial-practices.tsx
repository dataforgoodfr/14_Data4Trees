import { useTranslation } from "@shared/i18n";

import { BarCharWithBenefAndControl } from "../components/bar-chart-benef-control";
import type { ChartComponentType } from "../components/chart-component";

type Data = {
  pract1: number;
  pract2: number;
  pract3: number;
  pract4: number;
  pract5: number;
};

type ChartBeneficialPracticesProps = {
  benef: Data;
  temoin?: Data;
};

export const ChartBeneficialPractices: ChartComponentType<
  ChartBeneficialPracticesProps
> = ({ benef, temoin }) => {
  const { t } = useTranslation("all4trees");

  const chartData = [
    {
      benef: benef.pract1,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.pract1",
      ),
      temoin: temoin?.pract1,
    },
    {
      benef: benef.pract2,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.pract2",
      ),
      temoin: temoin?.pract2,
    },
    {
      benef: benef.pract3,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.pract3",
      ),
      temoin: temoin?.pract3,
    },
    {
      benef: benef.pract4,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.pract4",
      ),
      temoin: temoin?.pract4,
    },
    {
      benef: benef.pract5,
      indicator: t(
        "indicators.socioEco.sections.governance.beneficialPractices.pract5",
      ),
      temoin: temoin?.pract5,
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
      unit="%"
      withTemoin={!!temoin}
    />
  );
};

ChartBeneficialPractices.isChartComponent = true;
