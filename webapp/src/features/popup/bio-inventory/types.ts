export type BioInventoryData = {
  id: number;
  conf: boolean;
  proj: string;
  ecos: number;
  region: number;
  forest: number;
  start_date: Date;
  taxon: string;
  type: number;
  samp_area: number;
  samp_unit: number;
  density: number;
  dens_unit: string;
  richness: number;
  taxons_abundance_pop: string[];
  taxons_total_pop: number;
};
