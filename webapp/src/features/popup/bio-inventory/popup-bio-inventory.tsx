import { cx } from "class-variance-authority";
import { Calendar, Leaf } from "lucide-react";
import type { FC } from "react";

import { useExternalData } from "@features/external-data/context";
import { useBioInventoryIndicatorElements } from "@features/indicators/bio-inventory";
import {
  ICON_SIZE,
  ICON_SIZE_HEADER,
} from "@features/indicators/components/constants";
import { IndicatorElements } from "@features/indicators/components/indicator-elements";
import { IndicatorScrollContainer } from "@features/indicators/components/indicator-scroll-container";
import { findLabel } from "@features/indicators/labels";
import { IndicatorPopupHeader } from "@features/popup/components/indicator-popup-header";

import { formatDate } from "@shared/lib/utils";
import { i18nInstance, useTranslation } from "@i18n";

import type { RenderPopupProps } from "../renderPopup";
import type { BioInventoryData } from "./types";

type BioInventoryPopupContentProps = RenderPopupProps<BioInventoryData>;

export const BioInventoryPopupContent: FC<BioInventoryPopupContentProps> = ({
  data,
  className,
  ...headerProps
}) => {
  const { t } = useTranslation(["common", "all4trees"]);
  const lang = i18nInstance.language;
  const externalData = useExternalData();
  const labelData = externalData.bio_label;

  const biodiversityElements = useBioInventoryIndicatorElements(
    data,
    externalData,
  );

  const title = t("popup.bioInventory.title", {
    id: data.id,
    type: findLabel(labelData, data.project, lang, "typ", Number(data.type))?.toLowerCase() || '',
    ns: "all4trees",
  });

  const ecos = `${t("all4trees:popup.common.ecosystem")}: ${
    findLabel(labelData, data.project, lang, "ecos", data.ecos) ||
    t("dataManagement.undefined", { ns: "common" })
  }`;

  const date = formatDate(new Date());

  return (
    <div className={cx("flex flex-col", className ?? "")}>
      <IndicatorPopupHeader
        icon={<Leaf size={ICON_SIZE_HEADER} />}
        subtitle={
          findLabel(
            labelData,
            data.project,
            lang,
            "loc2",
            data.loc2,
          ) || t("dataManagement.undefined", { ns: "common" })
        }
        title={title}
        {...headerProps}
      >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center">
        <h3>{ecos}</h3>
        <div className="flex items-center gap-1">
          <Calendar size={ICON_SIZE} />
            <p>{date}</p>
        </div>
      </div>
      </IndicatorPopupHeader>

      <IndicatorScrollContainer>
        <IndicatorElements elements={biodiversityElements} />
      </IndicatorScrollContainer>
    </div>
  );
};
