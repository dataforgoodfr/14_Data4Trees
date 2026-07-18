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
