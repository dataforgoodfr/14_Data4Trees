import type { BiodiversityData } from "@features/indicators/biodiversity/types";
import type { SoilData } from "@features/indicators/soil/types";

export type ForestInventoryData = {
  id: string;
  code: number;
  type: number;
  cohort: number;
  loc1: number;
  loc2: number;
  project: string;
  isPublic: boolean;
  ecos: number;
  plot_size: number;
} & SoilData &
  BiodiversityData;
