import { useTranslation } from "@shared/i18n";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

export type DashboardHeaderProps = {
  years: number[];
  selectedYear: number;
  onValueChange: (year: string) => void;
};

export function DashboardHeader({
  years,
  selectedYear,
  onValueChange: onvalueChange,
}: DashboardHeaderProps) {
  const { t } = useTranslation("all4trees");
  const username = localStorage.getItem("username") || "";
  return (
    <div>
      <div className="mt-4 flex flex-nowrap justify-between items-center">
        <div>
          <h1 className="font-bold text-xl tracking-wide">
            {t("dashboard.header.greeting", { username })}
          </h1>
        </div>
        <p>{t("dashboard.header.temporaryFilter")}</p>
      </div>

      <div className="mt-5 flex flex-nowrap justify-between">
        <h2 className="font-bold text-xl">{t("dashboard.header.catalog")}</h2>
        <div>
          <Select
            onValueChange={onvalueChange}
            value={selectedYear.toString()}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder={t("dashboard.select.year")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="inline">{t("dashboard.header.temporaryBeneficiary")}</p>
        </div>
      </div>
    </div>
  );
}
