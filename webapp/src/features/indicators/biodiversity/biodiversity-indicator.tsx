import type { FC } from "react";
import { IndicatorContainer } from "../components/indicator-container";
import { TreesIcon } from "lucide-react";
import { useTranslation } from "@i18n";
import { useBiodiversityIndicatorElements } from "./use-biodiversity-indicator-elements";

type BiodiversityIndicatorProps = {
  onClose: () => void;
};

export const BiodiversityIndicator: FC<BiodiversityIndicatorProps> = ({
  onClose,
}) => {
  // @todo: Get data from API;
  const { t } = useTranslation("translations");
  const elements = useBiodiversityIndicatorElements();

  return (
    <IndicatorContainer
      onCrossClick={onClose}
      title="Point #se-4" // Get from data
      subtitle={t("indicators.biodiversity.title")}
      icon={<TreesIcon size={18} />}
      elements={elements}
    />
  );
};
