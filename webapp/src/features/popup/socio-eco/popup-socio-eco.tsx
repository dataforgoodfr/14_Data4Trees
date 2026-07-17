import { LABEL_DATA } from "@entities/resources";
import { cx } from "class-variance-authority";
import { UsersIcon } from "lucide-react";
import { Activity, type FC, use, useState } from "react";

import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { useEconomicIndicatorElements } from "@features/indicators/economy";
import { findLabel } from "@features/indicators/labels";
import { useSocialIndicatorElements } from "@features/indicators/social/use-social-indicator-elements";
import { IndicatorPopupHeader } from "@features/popup/components/indicator-popup-header";

import { LAYERS } from "@shared/api/layers";
import { formatDate } from "@shared/lib/utils";
import { GridSelector } from "@shared/ui/grid-selector";
import { i18nInstance, useTranslation } from "@i18n";

import type { LabelData } from "../forest-inventory/types";
import type { RenderPopupProps } from "../renderPopup";
import type { SocioEcoData } from "./types";

type SocioEcoIndicatorProps = RenderPopupProps<SocioEcoData>;

type TabKind = "resources" | "economy";

const TABS: Record<string, TabKind> = {
  ECONOMY: "economy",
  RESOURCES: "resources",
} as const;

export const SocioEcoIndicator: FC<SocioEcoIndicatorProps> = ({
  data,
  externalDataPromise,
  className,
  ...headerProps
}) => {
  const { t } = useTranslation("all4trees");
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.RESOURCES);
  const lang = i18nInstance.language;

  const externalData = use(externalDataPromise);
  const labelData =
    externalData[LABEL_DATA.get(LAYERS.ENQUETE) || ""] || ([] as LabelData[]);

  const socialElements = useSocialIndicatorElements(data);
  const economicElements = useEconomicIndicatorElements(data);

  const title = t("popup.socioEco.title", {
    village: findLabel(labelData, data.project, lang, "loc2", data.loc2),
  });
  const tabs = {
    [TABS.RESOURCES]: t("indicators.resources.title"),
    [TABS.ECONOMY]: t("indicators.economy.title"),
  };

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        date={t("popup.socioEco.date", { date: formatDate(new Date()) })}
        icon={<UsersIcon size={ICON_SIZE_HEADER} />}
        subtitle={t("popup.socioEco.subtitleCount", {
          count: data.household_nb,
        })}
        title={title}
        {...headerProps}
      />

      <GridSelector
        className="m-sm text-base"
        onChange={(value) => setSelectedTab(value as TabKind)}
        options={[
          {
            id: TABS.RESOURCES,
            label: tabs[TABS.RESOURCES],
          },
          {
            id: TABS.ECONOMY,
            label: tabs[TABS.ECONOMY],
          },
        ]}
        value={selectedTab}
      />

      <IndicatorScrollContainer>
        <Activity mode={selectedTab === TABS.RESOURCES ? "visible" : "hidden"}>
          <IndicatorElements elements={socialElements} />
        </Activity>

        <Activity mode={selectedTab === TABS.ECONOMY ? "visible" : "hidden"}>
          <IndicatorElements elements={economicElements} />
        </Activity>
      </IndicatorScrollContainer>
    </div>
  );
};
