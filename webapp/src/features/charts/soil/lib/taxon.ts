import type { LayerMetadata } from "coordo";

import { findCategoricalLabel } from "@shared/lib/utils";

export function formatTaxonLevelLabel(
  element: string,
  metadata: LayerMetadata,
  dataType: "tsbf" | "barbA",
): string {
  // 'taxon1 = element' is for typescript... taxon1 should never be undefined, but typescript doesn't know that
  const [taxon1 = element, taxon2, taxon3] = element.split("-");
  if (taxon2 === undefined) {
    return findCategoricalLabel(metadata, `${dataType}_tax1`, taxon1) || taxon1;
  }
  if (taxon3 === undefined) {
    return findCategoricalLabel(metadata, `${dataType}_tax2`, taxon2) || taxon2;
  }
  return findCategoricalLabel(metadata, `${dataType}_tax3`, taxon3) || taxon3;
}
