import { LAYERS } from "@shared/api/layers";

export const EXTERNAL_RESOURCES_BY_LAYER = new Map<string, string[]>([
  [
    LAYERS.INVENTORY_FOR,
    ["for_label", "for_mf_tax1", "for_mf_tax2", "for_mf_tax3", "for_score"],
  ],
  [LAYERS.INVENTORY_BIO, ["bio_label", "bio_sp"]],
  [LAYERS.ENQUETE, ["hh_label"]],
  [LAYERS.SEED_POINT, [""]],
]);

export const LABEL_DATA = new Map<string, string>([
  [LAYERS.INVENTORY_FOR, "for_label"],
  [LAYERS.INVENTORY_BIO, "bio_label"],
  [LAYERS.ENQUETE, "hh_label"],
]);
