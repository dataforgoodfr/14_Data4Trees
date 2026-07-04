import { cx } from "class-variance-authority";
import { TreesIcon } from "lucide-react";
import { Activity, type FC, useState } from "react";

import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import type { UseIndicatorReturnType } from "@features/indicators/components/types";

import { useTranslation } from "@shared/i18n";
import { formatDate } from "@shared/lib/utils";
import { GridSelector } from "@shared/ui/grid-selector";

import { IndicatorPopupHeader } from "../components/indicator-popup-header";

type LoadedPopupForestInventoryProps = {
  className: string;
  title: string;
  subtitle: string;
  headerProps: any;
  biodiversityElements: UseIndicatorReturnType;
  soilElements: UseIndicatorReturnType;
};

type TabKind = "biodiversity" | "soil";

const TABS: Record<string, TabKind> = {
  BIODIVERSITY: "biodiversity",
  SOIL: "soil",
} as const;

export const LoadedPopupForestInventory: FC<
  LoadedPopupForestInventoryProps
> = ({
  className,
  title,
  subtitle,
  headerProps,
  biodiversityElements,
  soilElements,
}) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.BIODIVERSITY);

  const tabs = {
    [TABS.BIODIVERSITY]: t("indicators.biodiversity.title", {
      ns: "all4trees",
    }),
    [TABS.SOIL]: t("indicators.soil.title", {
      ns: "all4trees",
    }),
  };

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
