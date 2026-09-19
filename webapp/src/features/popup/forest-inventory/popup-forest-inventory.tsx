import { cx } from "class-variance-authority";
import { Calendar, TreesIcon } from "lucide-react";
import { Activity, type FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { useExternalData } from "@features/external-data/context";
import { useBiodiversityIndicatorElements } from "@features/indicators/biodiversity";
import {
  ICON_SIZE,
  ICON_SIZE_HEADER,
} from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { findLabel } from "@features/indicators/labels";
import { useSoilIndicatorElements } from "@features/indicators/soil";

import { i18nInstance } from "@shared/i18n";
import { formatDate, precise } from "@shared/lib/utils";
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
> = ({ data, metadata, className, ...headerProps }) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const lang = i18nInstance.language;
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.BIODIVERSITY);
  const externalData = useExternalData();
  const labelData = externalData.for_label;

  const biodiversityElements = useBiodiversityIndicatorElements(
    data,
    labelData,
  );
  const soilElements = useSoilIndicatorElements(data, externalData);

  const tabs = {
    [TABS.BIODIVERSITY]: t("indicators.biodiversity.title", {
      ns: "all4trees",
    }),
    [TABS.SOIL]: t("indicators.soil.title", {
      ns: "all4trees",
    }),
  };

  const title = t("popup.forestInventory.title", {
    id: data.code,
    ns: "all4trees",
  });

  const subtitle =
    findLabel(labelData, data.project, lang, "loc2", data.loc2) ||
    t("common:dataManagement.undefined");

  const ecos = `${t("all4trees:popup.common.ecosystem")}: ${
    findLabel(labelData, data.project, lang, "ecos", data.ecos) ||
    t("dataManagement.undefined", { ns: "common" })
  }`;

  const date = t("popup.common.date", {
    date: formatDate(new Date()),
    ns: "all4trees",
  });

  const plot_size = t("popup.forestInventory.size", {
    ns: "all4trees",
    size: precise(data.plot_size),
  });

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        icon={<TreesIcon size={ICON_SIZE_HEADER} />}
        subtitle={subtitle}
        title={title}
        {...headerProps}
      >
        <div className="flex grid-cols-2 gap-3">
          <div>
            <h3>{ecos}</h3>
            <div className="flex col-span-4 flex-row items-center gap-1 text-muted-foreground">
              <Calendar size={ICON_SIZE} />
              <p className="pt-0.5">{date}</p>
            </div>
          </div>
          <span>{plot_size}</span>
        </div>
      </IndicatorPopupHeader>

      <GridSelector
        className="m-2"
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
