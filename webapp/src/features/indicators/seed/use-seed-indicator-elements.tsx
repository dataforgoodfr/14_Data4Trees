import { useTranslation } from "@i18n";

import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { type SeedData } from "./format-data";

export const useSeedIndicatorElements = (
  data: SeedData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");

  return [
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("seed.indicator.reboisement.orga")}
            value={data.orga}
          />
          <IndicatorRawValue
            dataName={t("seed.indicator.reboisement.responsable")}
            value={data.responsable}
          />
          <IndicatorRawValue
            dataName={t("seed.indicator.reboisement.type_plant")}
            value={data.type_plant}
          />
          <IndicatorRawValue
            dataName={t("seed.indicator.reboisement.prelevement_mangrove")}
            value={data.prelevement_mangrove}
          />
        </>
      ),
      identifier: "indicator-seed",
      title: t("seed.indicator.reboisement.title"),
      type: "section",
    },
  ];
};
