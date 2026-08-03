export type ExternalData = {
  for_label: LabelData[];
  bio_label: LabelData[];
  hh_label: LabelData[];
  bio_sp: BioSpeciesData[];
  for_mf_tax1: FuncSpeciesData[];
  for_mf_tax2: FuncSpeciesData[];
  for_mf_tax3: FuncSpeciesData[];
  for_score: ScoringData[];
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

export type FuncSpeciesData = {
  proj: string;
  [key: `tax${number}`]: number | undefined;
  [key: `func::${string}`]: string;
};

export type scoreLabel = "veg" | "slop" | "infil";
export type scoreBound = "inf" | "sup";

export type ScoringData = {
  [key in `${scoreLabel}_${scoreBound}`]: number;
} & {
  proj: string;
  score: number;
};
