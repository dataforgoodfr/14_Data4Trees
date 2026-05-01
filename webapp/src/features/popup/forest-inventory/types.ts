import type { BiodiversityData } from "@features/indicators/biodiversity/types";
import type { SoilData } from "@features/indicators/soil/types";

export type ForestInventoryData = {
  id: string;
  for: string;
  cod: number;
  projet: string;
  taille_placette: number;
} & SoilData &
  BiodiversityData;
