import { TreesIcon } from "lucide-react";
import type { FC } from "react";

import { useTranslation } from "@i18n";

import { useFormatBiodiversityData } from "../biodiversity/format-data";
import { useBiodiversityIndicatorElements } from "../biodiversity/use-biodiversity-indicator-elements";
import { ICON_SIZE_HEADER } from "../components/constants";
import { IndicatorContainer } from "../components/indicator-container";
import { FORESTS } from "./constants";
import type { ForestInventoryData } from "./types";

type ForestInventoryPopupContentProps = {
  onClose: () => void;
  data: ForestInventoryData;
  className?: string;
};

export const ForestInventoryPopupContent: FC<
  ForestInventoryPopupContentProps
> = ({ onClose, data, className }) => {
  const { t } = useTranslation("translations");
  const biodiversityData = useFormatBiodiversityData(data);
  const biodiversityElements =
    useBiodiversityIndicatorElements(biodiversityData);

  const forestMap = new Map<string, (typeof FORESTS)[number]>();
  FORESTS.forEach((forest) => {
    forestMap.set(forest.value, forest);
  });

  const title = t("popup.title", {
    code: data.cod,
    label: forestMap.get(data.for)?.label || `n°${data.for}`,
  });

  return (
    <IndicatorContainer
      className={className}
      elements={biodiversityElements}
      icon={<TreesIcon size={ICON_SIZE_HEADER} />}
      onCrossClick={onClose}
      subtitle={t("indicators.biodiversity.title")}
      title={title}
    />
  );
};
