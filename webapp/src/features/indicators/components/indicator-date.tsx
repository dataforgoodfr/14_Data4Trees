import type { FC } from "react";
import { CalendarIcon } from "lucide-react";
import { useTranslation } from "@i18n";

type IndicatorDateProps = {
  date: string;
};

export const IndicatorDate: FC<IndicatorDateProps> = ({ date }) => {
  const { t } = useTranslation("translations");

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-xs">
        <CalendarIcon size={12} />
        <p> {t("indicators.common.date")}</p>
      </div>
      <p> {date}</p>
    </div>
  );
};
