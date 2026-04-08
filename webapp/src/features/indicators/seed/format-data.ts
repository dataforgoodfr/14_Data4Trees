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
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value || "Donnée non renseignée",
    ]),
  ) as SeedData;
};

export type FormattedData = ReturnType<typeof useFormatSeedData>;
