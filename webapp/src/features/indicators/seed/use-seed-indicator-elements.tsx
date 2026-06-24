import { useTranslation } from "@i18n";

import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import type { SeedData } from "./format-data";

export const useSeedIndicatorElements = (
  data: SeedData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("seed");

  return [
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicator.reboisement.orga")}
            value={data.orga}
          />
          <IndicatorRawValue
            dataName={t("indicator.reboisement.responsable")}
            value={data.responsable}
          />
          <IndicatorRawValue
            dataName={t("indicator.reboisement.typePlant")}
            value={data.type_plant}
          />
          <IndicatorRawValue
            dataName={t("indicator.reboisement.prelevementMangrove")}
            value={data.prelevement_mangrove}
          />
        </>
      ),
      identifier: "indicator-seed",
      title: t("indicator.reboisement.title"),
      type: "section",
    },
  ];
};
