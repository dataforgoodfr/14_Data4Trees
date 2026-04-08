import { cx } from "class-variance-authority";
import type { LayerMetadata } from "coordo";
import { UsersIcon } from "lucide-react";
import { Activity, type FC, useState } from "react";

import { GridSelector } from "@shared/ui/grid-selector";
import { useTranslation } from "@i18n";

import { ICON_SIZE_HEADER } from "../components/constants";
import { IndicatorElements } from "../components/indicator-elements";
import { IndicatorPopupHeader } from "../components/indicator-popup-header";
import { IndicatorScrollContainer } from "../components/indicator-scroll-container";
import { useDateElement } from "../use-date-element";
import type { SocioEcoData } from "./types";
import { useSocioEcoIndicatorElements } from "./use-socio-eco-indicator-elements";

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

  const dateElement = useDateElement({ withDivider: false });
  const socioEcoElements = useSocioEcoIndicatorElements(data);

  const title = t("popup.socio-eco.title", {
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
        subtitle={dateElement[0].date}
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
          <IndicatorElements elements={socioEcoElements} />
        </Activity>

        <Activity mode={selectedTab === TABS.ECONOMY ? "visible" : "hidden"}>
          <h1>Elements</h1>
        </Activity>
      </IndicatorScrollContainer>
    </div>
  );
};
