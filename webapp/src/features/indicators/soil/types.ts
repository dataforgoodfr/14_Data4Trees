/**
 * Backend data from the Forest inventory dedicated to Soil category
 */

export type SoilData = {
  soil_structure_idx: number;
  soil_eros_rainfall_and_wind: string;
  soil_eros_cover: number;
  soil_eros_slope: number;
  soil_eros_stability: number;
  soil_eros_water_infiltration: number;
  soil_fauna_density: number;
  soil_fauna_diversity: number;
  soil_fauna_abundance: any;
  soil_fauna_abundance_pop: string[];
  soil_fauna_total_pop: number;
  soil_surface_fauna_density: number;
  soil_surface_fauna_diversity: number;
  soil_surface_fauna_abundance: any;
  soil_surface_fauna_abundance_pop: string[];
  soil_surface_fauna_total_pop: number;
};
