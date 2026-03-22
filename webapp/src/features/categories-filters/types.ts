import type { ReactNode } from "react";

import type { CATEGORY_IDENTIFIERS } from "./constants";

export type CategoryIdentifier =
  (typeof CATEGORY_IDENTIFIERS)[keyof typeof CATEGORY_IDENTIFIERS];

export type CategoryGroupItem = {
  icon?: ReactNode;
  identifier: CategoryIdentifier;
  label: string;
};

export type CategoryFiltersState = Record<CategoryIdentifier, boolean>;
