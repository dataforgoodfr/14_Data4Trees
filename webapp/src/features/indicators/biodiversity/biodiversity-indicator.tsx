import type { FC } from "react";
import { IndicatorContainer } from "../components/indicator-container";
import { TreesIcon } from "lucide-react";
import { useTranslation } from "@i18n";
import { useBiodiversityIndicatorElements } from "./use-biodiversity-indicator-elements";
import { ICON_SIZE_HEADER } from "../components/constants";
import {
  useFormatBiodiversityData,
  type BiodiversityData,
} from "./format-data";

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
      onCrossClick={onClose}
      title={formattedData.title}
      subtitle={t("indicators.biodiversity.title")}
      icon={<TreesIcon size={ICON_SIZE_HEADER} />}
      elements={elements}
      className={className}
    />
  );
};
