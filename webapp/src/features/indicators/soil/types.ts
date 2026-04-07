/**
 * Backend data from the Forest inventory dedicated to Soil category
 */
export type SoilData = {
  soil_structure: number | null;
  soil_composition: number | null;
  ero_rainfall: number | null;
  ero_wind: number | null;
  ero_soil_cover: number | null;
  ero_slope: number | null;
  ero_soil_stability: number | null;
  ero_water_seepage: number | null;
  soil_fauna_density: number | null;
  soil_fauna_diversity: number | null;
  soil_fauna_abundance: number | null;
  surface_fauna_density: number | null;
  surface_fauna_diversity: number | null;
  surface_fauna_abundance: number | null;
};
