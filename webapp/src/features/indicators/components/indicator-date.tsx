import type { FC } from "react";
import { CalendarIcon } from "lucide-react";
import { useTranslation } from "@i18n";
import { ICON_SIZE } from "./constants";

type IndicatorDateProps = {
  date: string;
};

export const IndicatorDate: FC<IndicatorDateProps> = ({ date }) => {
  const { t } = useTranslation("translations");

  return (
    <div className="flex flex-row items-center justify-between gap-sm flex-1">
      <div className="flex flex-row items-center gap-xs">
        <CalendarIcon size={ICON_SIZE} />
        <p> {t("indicators.common.date")}</p>
      </div>
      <p>{date}</p>
    </div>
  );
};
