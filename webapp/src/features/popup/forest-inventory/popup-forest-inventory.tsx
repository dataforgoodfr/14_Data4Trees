import { cx } from "class-variance-authority";
import type { LayerMetadata } from "coordo";
import { TreesIcon } from "lucide-react";
import { Activity, type FC, useState } from "react";

import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { useSoilIndicatorElements } from "@features/indicators/soil";
import { IndicatorPopupHeader } from "@features/popup/components/indicator-popup-header";

import { findCategoricalLabel, formatDate } from "@shared/lib/utils";
import { GridSelector } from "@shared/ui/grid-selector";
import { useTranslation } from "@i18n";

import { useBiodiversityIndicatorElements } from "../../indicators/biodiversity/use-biodiversity-indicator-elements";
import type { ForestInventoryData } from "./types";

type ForestInventoryPopupContentProps = {
  onClose: () => void;
  data: ForestInventoryData;
  metadata: LayerMetadata;
  className?: string;
};

type TabKind = "biodiversity" | "soil";

const TABS: Record<string, TabKind> = {
  BIODIVERSITY: "biodiversity",
  SOIL: "soil",
} as const;

export const ForestInventoryPopupContent: FC<
  ForestInventoryPopupContentProps
> = ({ onClose, data, metadata, className }) => {
  const { t } = useTranslation("translations");
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.BIODIVERSITY);

  const biodiversityElements = useBiodiversityIndicatorElements(data, metadata);
  const soilElements = useSoilIndicatorElements(data, metadata);

  const title = t("popup.forestInventory.title", { id: data.id });
  const subtitle = (
    <div>
      <span>
        {t("popup.forestInventory.subtitle", {
          for:
            findCategoricalLabel(metadata, "for", data.for) ||
            t("popup.undefined"),
        })}
      </span>
      <br />
      <span>
        {t("popup.forestInventory.date", { date: formatDate(new Date()) })}
      </span>
    </div>
  );
  const tabs = {
    [TABS.BIODIVERSITY]: t("indicators.biodiversity.title"),
    [TABS.SOIL]: t("indicators.soil.title"),
  };

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        icon={<TreesIcon size={ICON_SIZE_HEADER} />}
        onCrossClick={onClose}
        subtitle={subtitle}
        title={title}
      />

      <GridSelector
        className="m-sm"
        onChange={(value) => setSelectedTab(value as TabKind)}
        options={[
          {
            id: TABS.BIODIVERSITY,
            label: tabs[TABS.BIODIVERSITY],
          },
          {
            id: TABS.SOIL,
            label: tabs[TABS.SOIL],
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
