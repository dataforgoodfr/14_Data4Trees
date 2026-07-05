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

export type ExternalData = {
  for_label: LabelData[];
  for_mf_tax1: TaxonLabelData[];
  for_mf_tax2: any[];
  for_mf_tax3: any[];
  for_score: any[];
  // Index signature pour accepter d'autres clés dynamiques si besoin
  [key: string]: any[];
};

export type LabelData = {
  proj: string;
  list_name: string;
  name: number;
  label: string;
};

export type TaxonLabelData = {};
