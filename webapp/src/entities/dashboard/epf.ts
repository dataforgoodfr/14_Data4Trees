// > les epf regroupent tous les indicateurs indirects de biodiversité ("Tropical Biodiversity Index")
// > epf = eco-potentialité forestière, l'ancien nom de l'indice de biodiversité tropicale
// TODO: rename epf to something more meaningful?

import * as z from "zod";

import { ValueAndErrorSchema } from "@entities/dashboard/generic";

export const EpfDataSchema = z.object({
  bio_idx_deadWood: ValueAndErrorSchema,
  bio_idx_diametric_distribution: ValueAndErrorSchema,
  bio_idx_dominant_height: ValueAndErrorSchema,
  bio_idx_microhabitats: ValueAndErrorSchema,
  bio_idx_spatial_distribution: ValueAndErrorSchema,
  bio_idx_tree_density: ValueAndErrorSchema,
  bio_idx_tree_diversity: ValueAndErrorSchema,
  bio_idx_vertical_distribution: ValueAndErrorSchema,
});

export type EpfData = z.infer<typeof EpfDataSchema>;
