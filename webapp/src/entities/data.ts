export type ExternalData = {
  for_label: LabelData[];
  bio_label: LabelData[];
  hh_label: LabelData[];
  bio_sp: BioSpeciesData[];
  for_mf_tax1: any[];
  for_mf_tax2: any[];
  for_mf_tax3: any[];
  // Index signature pour accepter d'autres clés dynamiques si besoin
  [key: string]: any[];
};

export type LabelData = {
  proj: string;
  list_name: string;
  name: number;
  "label::fr": string;
  "label::en": string;
};

export type BioSpeciesData = {
  proj: string;
  tax3: number;
  "stat::fr": string;
  "stat::en": string;
};
