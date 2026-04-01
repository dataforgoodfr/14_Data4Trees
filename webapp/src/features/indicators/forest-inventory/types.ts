import type { BiodiversityData } from "../biodiversity/types";
import type { SoilData } from "../soil/types";

export type ForestInventoryData = {
  for: string;
  cod: number;
} & SoilData &
  BiodiversityData;
