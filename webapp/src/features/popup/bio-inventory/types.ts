export type BioInventoryData = {
  id: number;
  loc1: number;
  loc2: number;
  type: number;
  cohort: number;
  project: string;
  ecos: number;
  start_date: Date;
  taxon: string;
  samp_area: number;
  samp_unit: number;
  density: number;
  dens_unit: string;
  richness: number;
  taxons_abundance_pop: string[];
  taxons_total_pop: number;
};
