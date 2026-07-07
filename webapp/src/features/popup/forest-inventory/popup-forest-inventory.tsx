import { cx } from "class-variance-authority";
import { TreesIcon } from "lucide-react";
import { Activity, type FC, use, useState } from "react";
import { useTranslation } from "react-i18next";

import { useBiodiversityIndicatorElements } from "@features/indicators/biodiversity";
import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { useSoilIndicatorElements } from "@features/indicators/soil";
import { findLabelInExternalData } from "@features/indicators/utils";

import { formatDate } from "@shared/lib/utils";
import { GridSelector } from "@shared/ui/grid-selector";

import { IndicatorPopupHeader } from "../components/indicator-popup-header";
import type { RenderPopupProps } from "../renderPopup";
import type { ForestInventoryData } from "./types";

type ForestInventoryPopupContentProps = RenderPopupProps<ForestInventoryData>;

type TabKind = "biodiversity" | "soil";

const TABS: Record<string, TabKind> = {
  BIODIVERSITY: "biodiversity",
  SOIL: "soil",
} as const;

export const ForestInventoryPopupContent: FC<
  ForestInventoryPopupContentProps
> = ({ data, metadata, externalDataPromise, className, ...headerProps }) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.BIODIVERSITY);
  const externalData = use(externalDataPromise);

  const tabs = {
    [TABS.BIODIVERSITY]: t("indicators.biodiversity.title", {
      ns: "all4trees",
    }),
    [TABS.SOIL]: t("indicators.soil.title", {
      ns: "all4trees",
    }),
  };

  const title = t("popup.forestInventory.title", {
    id: data.cod,
    ns: "all4trees",
  });

  const subtitle =
    findLabelInExternalData(
      externalData,
      "for_label",
      data.project,
      "loc2",
      Number(data.for),
    ) || t("dataManagement.undefined", { ns: "common" });

  const biodiversityElements = useBiodiversityIndicatorElements(
    data,
    externalData,
  );
  const soilElements = useSoilIndicatorElements(data, externalData);
  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        date={t("popup.forestInventory.date", {
          date: formatDate(new Date()),
          ns: "all4trees",
        })}
        icon={<TreesIcon size={ICON_SIZE_HEADER} />}
        subtitle={subtitle}
        title={title}
        {...headerProps}
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
