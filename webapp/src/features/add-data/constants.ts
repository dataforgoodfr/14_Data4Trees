// Kind of resource the uploaded file represents.
export const RESOURCE_KINDS = {
  ExternalData: "external_data",
  FormData: "form_data",
} as const;

export type ResourceKind = (typeof RESOURCE_KINDS)[keyof typeof RESOURCE_KINDS];

// coordo loader the backend selects, per resource kind. cf LoaderType
export const RESOURCE_TYPE_BY_KIND = {
  [RESOURCE_KINDS.ExternalData]: "file",
  [RESOURCE_KINDS.FormData]: "kobotoolbox",
} as const;

// Accepted upload extensions per kind (coordo's file / kobotoolbox loaders).
// Form data is the multi-sheet KoboToolbox answers workbook (.xlsx).
export const ACCEPTED_EXTENSIONS_BY_KIND = {
  [RESOURCE_KINDS.ExternalData]: ".csv,.xls,.xlsx",
  [RESOURCE_KINDS.FormData]: ".xlsx",
} as const;
