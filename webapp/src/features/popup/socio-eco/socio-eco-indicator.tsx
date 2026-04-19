import { cx } from "class-variance-authority";
import type { LayerMetadata } from "coordo";
import { UsersIcon } from "lucide-react";
import { Activity, type FC, useState } from "react";

import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { useEconomicIndicatorElements } from "@features/indicators/economy";
import { useSocialIndicatorElements } from "@features/indicators/social/use-social-indicator-elements";
import { IndicatorPopupHeader } from "@features/popup/components/indicator-popup-header";

import { formatDate } from "@shared/lib/utils";
import { GridSelector } from "@shared/ui/grid-selector";
import { useTranslation } from "@i18n";

import type { SocioEcoData } from "./types";

type SocioEcoIndicatorProps = {
  onClose: () => void;
  data: SocioEcoData;
  metadata: LayerMetadata;
  className?: string;
};

type TabKind = "resources" | "economy";

const TABS: Record<string, TabKind> = {
  ECONOMY: "economy",
  RESOURCES: "resources",
} as const;

export const SocioEcoIndicator: FC<SocioEcoIndicatorProps> = ({
  onClose,
  data,
  className,
}) => {
  const { t } = useTranslation("translations");
  const [selectedTab, setSelectedTab] = useState<TabKind>(TABS.RESOURCES);

  const socialElements = useSocialIndicatorElements(data);
  const economicElements = useEconomicIndicatorElements(data);

  const title = t("popup.socioEco", {
    village: data.admi2,
  });

  const subtitles = {
    [TABS.RESOURCES]: t("indicators.resources.title"),
    [TABS.ECONOMY]: t("indicators.economy.title"),
  };

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        icon={<UsersIcon size={ICON_SIZE_HEADER} />}
        onCrossClick={onClose}
        subtitle={formatDate(new Date())}
        title={title}
      />

      <GridSelector
        className="m-sm"
        onChange={(value) => setSelectedTab(value as TabKind)}
        options={[
          {
            id: TABS.RESOURCES,
            label: subtitles[TABS.RESOURCES],
          },
          {
            id: TABS.ECONOMY,
            label: subtitles[TABS.ECONOMY],
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
