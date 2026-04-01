import { TreesIcon } from "lucide-react";
import type { FC } from "react";

import { useTranslation } from "@i18n";

import { ICON_SIZE_HEADER } from "../components/constants";
import { IndicatorContainer } from "../components/indicator-container";

import { useSocioEcoIndicatorElements as useSocioEcoIndicatorElements } from "./use-socio-eco-indicator-elements";
import { useFormatSocioEcoData as useFormatSocioEcoData, type SocioEcoData } from "./format-data";

type SocioEcoIndicatorProps = {
  onClose: () => void;
  data: SocioEcoData;
  className?: string;
};

export const SocioEcoIndicator: FC<SocioEcoIndicatorProps> = ({
  onClose,
  data,
  className,
}) => {
  const { t } = useTranslation("translations");
  const formattedData = useFormatSocioEcoData(data);
  const elements = useSocioEcoIndicatorElements(formattedData);

  return (
    <IndicatorContainer
      className={className}
      elements={elements}
      icon={<TreesIcon size={ICON_SIZE_HEADER} />}
      onCrossClick={onClose}
      subtitle={t("indicators.socio-eco.title")}
      title={formattedData.title}
    />
  );
};
