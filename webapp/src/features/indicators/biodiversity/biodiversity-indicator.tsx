import { TreesIcon } from "lucide-react";
import type { FC } from "react";

import { useTranslation } from "@i18n";

import { ICON_SIZE_HEADER } from "../components/constants";
import { IndicatorContainer } from "../components/indicator-container";
import {
  type BiodiversityData,
  useFormatBiodiversityData,
} from "./format-data";
import { useBiodiversityIndicatorElements } from "./use-biodiversity-indicator-elements";

type BiodiversityIndicatorProps = {
  onClose: () => void;
  data: BiodiversityData;
  className?: string;
};

export const BiodiversityIndicator: FC<BiodiversityIndicatorProps> = ({
  onClose,
  data,
  className,
}) => {
  const { t } = useTranslation("translations");
  const formattedData = useFormatBiodiversityData(data);
  const elements = useBiodiversityIndicatorElements(formattedData);

  return (
    <IndicatorContainer
      className={className}
      elements={elements}
      icon={<TreesIcon size={ICON_SIZE_HEADER} />}
      onCrossClick={onClose}
      subtitle={t("indicators.biodiversity.title")}
      title={formattedData.title}
    />
  );
};
