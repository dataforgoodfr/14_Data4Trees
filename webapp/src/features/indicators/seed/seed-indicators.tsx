import { cx } from "class-variance-authority";
import type { LayerMetadata } from "coordo";
import { UsersIcon } from "lucide-react";
import type { FC } from "react";

import { formatDate } from "@shared/lib/utils";
import { useTranslation } from "@i18n";

import { IndicatorPopupHeader } from "../../popup/components/indicator-popup-header";
import { ICON_SIZE_HEADER } from "../components/constants";
import { IndicatorElements } from "../components/indicator-elements";
import { IndicatorScrollContainer } from "../components/indicator-scroll-container";
import type { SeedData } from "./format-data";
import { useSeedIndicatorElements } from "./use-seed-indicator-elements";

type SeedIndicatorProps = {
  onClose: () => void;
  data: SeedData;
  metadata: LayerMetadata;
  className?: string;
};

export const SeedIndicator: FC<SeedIndicatorProps> = ({
  onClose,
  data,
  className,
}) => {
  const { t } = useTranslation("translations");

  const seedElements = useSeedIndicatorElements(data);

  const title = t("popup.seed", {
    id: data.id,
  });

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        icon={<UsersIcon size={ICON_SIZE_HEADER} />}
        onCrossClick={onClose}
        subtitle={formatDate(data.date_plantation)}
        title={title}
      />

      <IndicatorScrollContainer>
        <IndicatorElements elements={seedElements} />
      </IndicatorScrollContainer>
    </div>
  );
};
