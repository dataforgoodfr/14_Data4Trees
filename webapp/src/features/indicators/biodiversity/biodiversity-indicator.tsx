import type { FC } from "react";
import { IndicatorContainer } from "../components/indicator-container";
import { TreesIcon } from "lucide-react";
import { useTranslation } from "@i18n";
import { useBiodiversityIndicatorElements } from "./use-biodiversity-indicator-elements";
import { ICON_SIZE_HEADER } from "../components/constants";
import { formatBiodiversityData } from "./format-data";

type BiodiversityIndicatorProps = {
  onClose: () => void;
};

export const BiodiversityIndicator: FC<BiodiversityIndicatorProps> = ({
  onClose,
}) => {
  const { t } = useTranslation("translations");
  // @todo: Get data from API or props and provide them here
  const data = formatBiodiversityData();
  const elements = useBiodiversityIndicatorElements(data);

  return (
    <IndicatorContainer
      onCrossClick={onClose}
      title={data.title}
      subtitle={t("indicators.biodiversity.title")}
      icon={<TreesIcon size={ICON_SIZE_HEADER} />}
      elements={elements}
    />
  );
};
