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
  taxons_relative_abundance: Record<string, number>;
  pop_by_taxon: string[];
  total_pop: number;
};
