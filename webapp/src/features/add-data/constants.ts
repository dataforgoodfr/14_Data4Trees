// Datapackage folders (under backend `catalog/`) a user can push new data into.
// The value is the catalog folder name, also used as the datapackage `form`.
export const ADD_DATA_FORMS = [
  "inventaire_for",
  "inventaire_bio",
  "enquete",
  "seed",
] as const;

export type AddDataForm = (typeof ADD_DATA_FORMS)[number];

// Kind of resource the uploaded file represents.
export const RESOURCE_KINDS = {
  ExternalData: "external_data",
  FormData: "form_data",
} as const;

export type ResourceKind = (typeof RESOURCE_KINDS)[keyof typeof RESOURCE_KINDS];

// Extensions accepted by coordo's file loaders.
export const ACCEPTED_EXTENSIONS = ".csv,.xls,.xlsx,.zip";

export const isCsvFileName = (fileName: string): boolean =>
  fileName.toLowerCase().endsWith(".csv");
