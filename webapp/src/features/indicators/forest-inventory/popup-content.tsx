import { cx } from "class-variance-authority";
import { TreesIcon } from "lucide-react";
import type { FC } from "react";

import { useTranslation } from "@i18n";

import { useBiodiversityIndicatorElements } from "../biodiversity/use-biodiversity-indicator-elements";
import { ICON_SIZE_HEADER } from "../components/constants";
import { IndicatorElements } from "../components/indicator-elements";
import { IndicatorPopupHeader } from "../components/indicator-popup-header";
import { IndicatorScrollContainer } from "../components/indicator-scroll-container";
import { useSoilIndicatorElements } from "../soil";
import { useDateElement } from "../use-date-element";
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

  const dateElement = useDateElement();
  const biodiversityElements = useBiodiversityIndicatorElements(data);
  const soilElements = useSoilIndicatorElements(data);

  const forestMap = new Map<string, (typeof FORESTS)[number]>();
  FORESTS.forEach((forest) => {
    forestMap.set(forest.value, forest);
  });

  const title = t("popup.title", {
    code: data.cod,
    label: forestMap.get(data.for)?.label || `n°${data.for}`,
  });

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        icon={<TreesIcon size={ICON_SIZE_HEADER} />}
        onCrossClick={onClose}
        subtitle={t("indicators.biodiversity.title")}
        title={title}
      />
      <IndicatorScrollContainer>
        <IndicatorElements elements={dateElement} />
        <IndicatorElements elements={biodiversityElements} />
        <IndicatorElements elements={soilElements} />
      </IndicatorScrollContainer>
    </div>
  );
};
