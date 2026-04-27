import type { BiodiversityData } from "@features/indicators/biodiversity/types";
import type { SoilData } from "@features/indicators/soil/types";

export type ForestInventoryData = {
  for: string;
  cod: number;
} & SoilData &
  BiodiversityData;
