import { cx } from "class-variance-authority";
import { Leaf } from "lucide-react";
import { type FC } from "react";

import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { IndicatorPopupHeader } from "@features/popup/components/indicator-popup-header";

import { findCategoricalLabel, formatDate } from "@shared/lib/utils";
import { useTranslation } from "@i18n";

import type { RenderPopupProps } from "../renderPopup";
import type { BioInventoryData } from "./types";
import { useBioInventoryIndicatorElements } from "@features/indicators/bio-inventory/use-bioinventory-indicator-elements";

type BioInventoryPopupContentProps = RenderPopupProps<BioInventoryData>;

export const BioInventoryPopupContent: FC<
  BioInventoryPopupContentProps
> = ({ data, metadata, className, ...headerProps }) => {
  const { t } = useTranslation(["common", "all4trees"]);

  const biodiversityElements = useBioInventoryIndicatorElements(data, metadata);

  console.log("BioInventoryPopupContent data", data, "metadata", metadata, "biodiversityElements", biodiversityElements);
  const title = t("popup.bioInventory.title", {
    id: data.id,
    ns: "all4trees",
  });

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        date={t("popup.bioInventory.date", {
          date: formatDate(new Date()),
          ns: "all4trees",
        })}
        icon={<Leaf size={ICON_SIZE_HEADER} />}
        subtitle={
          findCategoricalLabel(metadata, "loc2", data.forest) ||
          t("dataManagement.undefined", { ns: "common" })
        }
        title={title}
        {...headerProps}
      />

      <IndicatorScrollContainer>
          <IndicatorElements elements={biodiversityElements} />
      </IndicatorScrollContainer>
    </div>
  );
};
