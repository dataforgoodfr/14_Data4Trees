import { findLabel } from "@features/indicators/labels";
import type { LabelData } from "@features/popup/forest-inventory/types";

export function getDataTypePrefix(dataType: "tsbf" | "barbA" | null): string {
  return dataType ? `${dataType}_` : "";
}

export function getTaxonLabels(
  element: string,
  metadata: LabelData[],
  project: string,
  lang: string,
): [string, string, string] {
  const [taxon1, taxon2, taxon3] = element.split("-");
  const taxon1Label =
    findLabel(metadata, project, lang, "tax1", Number(taxon1)) || taxon1;
  const taxon2Label =
    findLabel(metadata, project, lang, "tax2", Number(taxon2)) || taxon2;
  const taxon3Label =
    findLabel(metadata, project, lang, "tax3", Number(taxon3)) || taxon3;
  return [taxon1Label, taxon2Label, taxon3Label];
}

export function formatTaxonLevelLabel(
  element: string,
  metadata: LabelData[],
  project: string,
  lang: string,
): string {
  const [taxon1Label, taxon2Label, taxon3Label] = getTaxonLabels(
    element,
    metadata,
    project,
    lang,
  );
  const parts = element.split("-");
  return parts.length === 1
    ? taxon1Label
    : parts.length === 2
      ? taxon2Label
      : taxon3Label;
}
