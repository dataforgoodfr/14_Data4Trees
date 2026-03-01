import type { UseIndicatorReturnType } from "../components/types";
import { useTranslation } from "@i18n";

export const useBiodiversityIndicatorElements = (): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");

  return [
    { type: "divider" },
    {
      type: "section",
      children: <p>Hello world</p>,
      title: t("indicators.biodiversity.sections.biomass.title"),
    },
    {
      type: "section",
      children: <p>Hello world</p>,
      title: t("indicators.biodiversity.sections.treeDiversity.title"),
    },
    {
      type: "section",
      children: <p>Hello world</p>,
      title: t("indicators.biodiversity.sections.indicatorSpecies.title"),
    },
    {
      type: "section",
      children: <p>Hello world</p>,
      title: t("indicators.biodiversity.sections.forestPotentialLevel.title"),
    },
  ];
};
