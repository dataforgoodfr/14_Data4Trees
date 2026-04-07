import { cx } from "class-variance-authority";
import { TreesIcon } from "lucide-react";
import { Activity, type FC, useState } from "react";

import { GridSelector } from "@shared/ui/grid-selector";
import { useTranslation } from "@i18n";

import { useBiodiversityIndicatorElements } from "../biodiversity/use-biodiversity-indicator-elements";
import { ICON_SIZE_HEADER } from "../components/constants";
import { IndicatorElements } from "../components/indicator-elements";
import { IndicatorPopupHeader } from "../components/indicator-popup-header";
import { IndicatorScrollContainer } from "../components/indicator-scroll-container";
import { useSoilIndicatorElements } from "../soil";
import { useDateElement } from "../use-date-element";
import { FORESTS_MAP } from "./constants";
import type { ForestInventoryData } from "./types";

type ForestInventoryPopupContentProps = {
  onClose: () => void;
  data: ForestInventoryData;
  className?: string;
};

type TabKind = "biodiversity" | "soil";

const TABS: Record<string, TabKind> = {
  BIODIVERSITY: "biodiversity",
  SOIL: "soil",
} as const;

export const ForestInventoryPopupContent: FC<
  ForestInventoryPopupContentProps
> = ({ onClose, data, className }) => {
  const { t } = useTranslation("translations");
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.BIODIVERSITY);

  console.log("Received data for Forest Inventory Popup:", data);
  const dateElement = useDateElement({ withDivider: false });
  const biodiversityElements = useBiodiversityIndicatorElements(data);
  const soilElements = useSoilIndicatorElements(data);

  console.log(`Displaying Popup for place for:${data.for} with cod:${data.cod}`);
  const title = t("popup.forest-inventory.title", {
    code: data.cod,
    label: FORESTS_MAP.get(data.for)?.label || `n°${data.for}`,
  });

  const subtitles = {
    [TABS.BIODIVERSITY]: t("indicators.biodiversity.title"),
    [TABS.SOIL]: t("indicators.soil.title"),
  };

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        icon={<TreesIcon size={ICON_SIZE_HEADER} />}
        onCrossClick={onClose}
        subtitle={dateElement[0].date}
        title={title}
      />

      <GridSelector
        className="m-sm"
        onChange={(value) => setSelectedTab(value as TabKind)}
        options={[
          {
            id: TABS.BIODIVERSITY,
            label: subtitles[TABS.BIODIVERSITY],
          },
          {
            id: TABS.SOIL,
            label: subtitles[TABS.SOIL],
          },
        ]}
        value={selectedTab}
      />

      <IndicatorScrollContainer>
        <Activity
          mode={selectedTab === TABS.BIODIVERSITY ? "visible" : "hidden"}
        >
          <IndicatorElements elements={biodiversityElements} />
        </Activity>

        <Activity mode={selectedTab === TABS.SOIL ? "visible" : "hidden"}>
          <IndicatorElements elements={soilElements} />
        </Activity>
      </IndicatorScrollContainer>
    </div>
  );
};
