import { LAYERS } from "@entities/layers";
import { LABEL_DATA } from "@entities/resources";
import { cx } from "class-variance-authority";
import { Leaf } from "lucide-react";
import { type FC, use } from "react";

import { useBioInventoryIndicatorElements } from "@features/indicators/bio-inventory/use-bioinventory-indicator-elements";
import { ICON_SIZE_HEADER } from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { findLabel } from "@features/indicators/utils";
import { IndicatorPopupHeader } from "@features/popup/components/indicator-popup-header";

import { formatDate } from "@shared/lib/utils";
import { i18nInstance, useTranslation } from "@i18n";

import type { LabelData } from "../forest-inventory/types";
import type { RenderPopupProps } from "../renderPopup";
import type { BioInventoryData } from "./types";

type BioInventoryPopupContentProps = RenderPopupProps<BioInventoryData>;

export const BioInventoryPopupContent: FC<BioInventoryPopupContentProps> = ({
  data,
  externalDataPromise,
  className,
  ...headerProps
}) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const lang = i18nInstance.language;
  const externalData = use(externalDataPromise);
  const labelData =
    externalData[LABEL_DATA.get(LAYERS.INVENTORY_BIO) || ""] ||
    ([] as LabelData[]);
  const biodiversityElements = useBioInventoryIndicatorElements(
    data,
    labelData,
  );

  console.log(
    "BioInventoryPopupContent data",
    data,
    "metadata",
    externalData,
    "biodiversityElements",
    biodiversityElements,
  );
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
          findLabel(labelData, data.proj, lang, "loc2", Number(data.forest)) ||
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
