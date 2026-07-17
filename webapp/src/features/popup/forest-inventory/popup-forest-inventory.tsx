import { cx } from "class-variance-authority";
import { TreesIcon } from "lucide-react";
import { Activity, type FC, use, useState } from "react";
import { useTranslation } from "react-i18next";

import { useBiodiversityIndicatorElements } from "@features/indicators/biodiversity";
import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { useSoilIndicatorElements } from "@features/indicators/soil";
import { findLabel } from "@features/indicators/utils";

import { i18nInstance } from "@shared/i18n";
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
  const lang = i18nInstance.language;
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.BIODIVERSITY);
  const externalData = use(externalDataPromise);
  const labelData = externalData.for_label;

  const biodiversityElements = useBiodiversityIndicatorElements(
    data,
    labelData,
  );
  const soilElements = useSoilIndicatorElements(data, labelData);

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
    findLabel(labelData, data.project, lang, "loc2", data.for) ||
    t("common:dataManagement.undefined");

  const ecos = `${t("all4trees:popup.forestInventory.ecos")}: ${
    findLabel(labelData, data.project, lang, "ecos", data.ecos) ||
    t("dataManagement.undefined", { ns: "common" })
  }`;

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        date={t("popup.forestInventory.date", {
          date: formatDate(new Date()),
          ns: "all4trees",
        })}
        ecos={ecos}
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
