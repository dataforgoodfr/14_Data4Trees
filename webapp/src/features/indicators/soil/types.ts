/**
 * Backend data from the Forest inventory dedicated to Soil category
 */

export type SoilData = {
  soil_structure: number;
  soil_composition: number;
  ero_rainfall: number;
  ero_wind: number;
  ero_soil_cover: number;
  ero_slope: number;
  ero_soil_stability: number;
  ero_water_seepage: number;
  soil_fauna_density: number;
  soil_fauna_diversity: number;
  soil_fauna_abundance: any;
  surface_fauna_density: number;
  surface_fauna_diversity: number;
  surface_fauna_abundance: any;
  ero_couv_slope_and_cover: string;
  ero_rainfall_and_wind: string;
};
