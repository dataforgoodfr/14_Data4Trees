import { useTranslation } from "react-i18next";

export type SeedData = {
  id: string;
  orga: string;
  responsable: string;
  date_plantation: string;
  type_plant: string;
  prelevement_mangrove: string;
};

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSeedData = (data: SeedData) => {
  const { t } = useTranslation("translations");
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value || t("indicators.undefined"),
    ]),
  ) as SeedData;
};

export type FormattedData = ReturnType<typeof useFormatSeedData>;
