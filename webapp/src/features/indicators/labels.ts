import type { LayerMetadata } from "coordo";

import type { LabelData } from "@features/popup/forest-inventory/types";

import type { BioSpeciesData } from "@entities/data";

export function findCategoricalLabel(
  metadata: LayerMetadata,
  fieldName: string,
  fieldValue: any,
): string | undefined {
  // Searching field category in main resource schema
  const resourceLabel = metadata?.resource?.schema?.fields
    .find((f) => f.name === fieldName)
    ?.categories?.find((c) => c.value === fieldValue)?.label;

  if (resourceLabel) {
    return resourceLabel;
  }

  // Searching field category in main resource's references' schemas
  return metadata?.references
    ?.find((ref) =>
      ref.schema.fields
        .find((f) => f.name === fieldName)
        ?.categories?.some((c) => c.value === fieldValue),
    )
    ?.schema.fields.find((f) => f.name === fieldName)
    ?.categories?.find((c) => c.value === fieldValue)?.label;
}

// Find status of corresponding taxon value.
export function findStatus(
  resourceData: BioSpeciesData[],
  project: string,
  lang: string,
  taxon: number,
): string | undefined {
  if (!resourceData || !Array.isArray(resourceData)) {
    return undefined;
  }

  // Find the record matching all criteria: project, list_name, and name
  const record = resourceData.find((item: BioSpeciesData) => {
    return item.proj?.trim() === project.trim() && item.tax3 === taxon;
  });

  return record?.[`stat::${lang}` as keyof BioSpeciesData] as string;
}

export function findLabel(
  resourceData: LabelData[],
  project: string,
  lang: string,
  fieldName: string,
  fieldValue: any,
): string | undefined {
  return findMatchingRecord(resourceData, project, fieldName, fieldValue)?.[
    `label::${lang}`
  ];
}

export function findMatchingRecord(
  resourceData: LabelData[],
  project: string,
  fieldName: string,
  fieldValue: any,
): any {
  if (!resourceData || !Array.isArray(resourceData)) {
    return undefined;
  }

  // Find the record matching all criteria: project, list_name, and name
  const record = resourceData.find((item: LabelData) => {
    if (typeof item.name !== typeof fieldValue) {
      console.warn(
        `Checking field values with different types ! fieldName=${fieldName} fieldValue type=${typeof fieldValue}; item.name type= ${typeof item.name}`,
      );
    }
    return (
      item.proj?.trim() === project.trim() &&
      item.list_name?.trim() === fieldName.trim() &&
      item.name === fieldValue
    );
  });

  console.log("Found matching record", record);
  return record;
}
