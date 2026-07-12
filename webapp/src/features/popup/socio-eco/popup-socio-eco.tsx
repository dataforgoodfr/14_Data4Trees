import { cx } from "class-variance-authority";
import { UsersIcon } from "lucide-react";
import { Activity, type FC, useState } from "react";

import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { useEconomicIndicatorElements } from "@features/indicators/economy";
import { useSocialIndicatorElements } from "@features/indicators/social/use-social-indicator-elements";
import { findCategoricalLabel } from "@features/indicators/utils";
import { IndicatorPopupHeader } from "@features/popup/components/indicator-popup-header";

import type { LayerMetadata } from "@shared/lib/coordo";
import { formatDate } from "@shared/lib/utils";
import { GridSelector } from "@shared/ui/grid-selector";
import { useTranslation } from "@i18n";

import type { RenderPopupProps } from "../renderPopup";
import type { SocioEcoData } from "./types";

type SocioEcoIndicatorProps = RenderPopupProps<SocioEcoData>;

type TabKind = "resources" | "economy";

const TABS: Record<string, TabKind> = {
  ECONOMY: "economy",
  RESOURCES: "resources",
} as const;

const exctractVillageName = (
  metadata: LayerMetadata,
  data: SocioEcoData,
): string => {
  const label = findCategoricalLabel(metadata, "loc2", data.loc2);

  let villageName: string | undefined;
  if (label) {
    const jsonLabel = JSON.parse(label);
    villageName =
      jsonLabel["Malagasy(mg)"] ?? jsonLabel["Fran\u00e7ais(fr)"] ?? undefined;
  }

  return villageName || data.loc2;
};

export const SocioEcoIndicator: FC<SocioEcoIndicatorProps> = ({
  data,
  metadata,
  className,
  ...headerProps
}) => {
  const { t } = useTranslation("all4trees");
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.RESOURCES);

  const socialElements = useSocialIndicatorElements(data);
  const economicElements = useEconomicIndicatorElements(data);

  const title = t("popup.socioEco.title", {
    village: exctractVillageName(metadata, data),
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
        className="m-2 text-base"
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
