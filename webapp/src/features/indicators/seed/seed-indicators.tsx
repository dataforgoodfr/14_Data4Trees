import { cx } from "class-variance-authority";
import { UsersIcon } from "lucide-react";
import type { FC } from "react";

import { useTranslation } from "@i18n";

import { ICON_SIZE_HEADER } from "../components/constants";
import { IndicatorElements } from "../components/indicator-elements";
import { IndicatorPopupHeader } from "../components/indicator-popup-header";
import { IndicatorScrollContainer } from "../components/indicator-scroll-container";
import { useDateElement } from "../use-date-element";
import type { SeedData } from "./format-data";
import { useSeedIndicatorElements } from "./use-seed-indicator-elements";

type SeedIndicatorProps = {
  onClose: () => void;
  data: SeedData;
  className?: string;
};

export const SeedIndicator: FC<SeedIndicatorProps> = ({
  onClose,
  data,
  className,
}) => {
  const { t } = useTranslation("translations");

  const dateElement = useDateElement({
    dateStr: data.date_plantation,
    withDivider: false,
  });
  const seedElements = useSeedIndicatorElements(data);

  console.log("Raw socio-economic data received for formatting:", data);
  console.log("Socio-economic indicator elements for UI:", seedElements);
  const title = t("popup.seed.title", {
    id: data.id,
  });

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        icon={<UsersIcon size={ICON_SIZE_HEADER} />}
        onCrossClick={onClose}
        subtitle={dateElement[0].date}
        title={title}
      />

      <IndicatorScrollContainer>
        <IndicatorElements elements={seedElements} />
      </IndicatorScrollContainer>
    </div>
  );
};
