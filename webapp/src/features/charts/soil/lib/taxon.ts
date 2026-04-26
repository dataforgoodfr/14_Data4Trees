import type { LayerMetadata } from "node_modules/coordo/coordo-ts/src/types";

import { findCategoricalLabel } from "@shared/lib/utils";

export function getTaxonLabels(
  element: string,
  metadata: LayerMetadata,
  dataType: "tsbf" | "barbA",
): [string, string, string] {
  const [taxon1, taxon2, taxon3] = element.split("-");
  const taxon1Label =
    findCategoricalLabel(metadata, `tax1_${dataType}`, taxon1) || taxon1;
  const taxon2Label =
    findCategoricalLabel(metadata, `tax2_${dataType}`, taxon2) || taxon2;
  const taxon3Label =
    findCategoricalLabel(metadata, `tax3_${dataType}`, taxon3) || taxon3;
  return [taxon1Label, taxon2Label, taxon3Label];
}

export function formatTaxonLevelLabel(
  element: string,
  metadata: LayerMetadata,
  dataType: "tsbf" | "barbA",
): string {
  const [taxon1Label, taxon2Label, taxon3Label] = getTaxonLabels(
    element,
    metadata,
    dataType,
  );
  const parts = element.split("-");
  return parts.length === 1
    ? taxon1Label
    : parts.length === 2
      ? taxon2Label
      : taxon3Label;
}
