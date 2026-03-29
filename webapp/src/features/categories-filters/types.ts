import type { ReactNode } from "react";

import type { CategoryIdentifier } from "@shared/api/categories-filters";

export type CategoryGroupItem = {
  icon?: ReactNode;
  identifier: CategoryIdentifier;
  label: string;
};

export type { CategoryIdentifier } from "@shared/api/categories-filters";
