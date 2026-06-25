import type { LayerMetadata } from "coordo";

import { findCategoricalLabel } from "@shared/lib/utils";

export function getTaxonLabels(
  element: string,
  metadata: LayerMetadata,
  dataType: "tsbf" | "barbA",
): [string, string, string] {
  const [taxon1, taxon2, taxon3] = element.split("-");
  if (taxon1 === undefined || taxon2 === undefined || taxon3 === undefined) {
    throw new Error(
      `Invalid taxon element: ${element}. It should have three parts separated by a dash '-'.`,
    );
  }
  const taxon1Label =
    findCategoricalLabel(metadata, `${dataType}_tax1`, taxon1) || taxon1;
  const taxon2Label =
    findCategoricalLabel(metadata, `${dataType}_tax2`, taxon2) || taxon2;
  const taxon3Label =
    findCategoricalLabel(metadata, `${dataType}_tax3`, taxon3) || taxon3;
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
