import {
  DatabaseIcon,
  EarthIcon,
  LeafIcon,
  TreePineIcon,
  UsersIcon,
} from "lucide-react";

import { useTranslation } from "@i18n";

import { CATEGORY_IDENTIFIERS, ICON_SIZE } from "./constants";
import type { CategoryGroupItem } from "./types";

export const useCategoriesConfig = (): {
  actions: CategoryGroupItem[];
  data: CategoryGroupItem[];
  system: CategoryGroupItem[];
} => {
  const { t } = useTranslation("translations");

  // ----- Actions -----

  const actionInventary: CategoryGroupItem = {
    icon: (
      <TreePineIcon
        className="text-accent"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.ACTION_INVENTARY,
    label: t("filters.categories.actions.forestInventary"),
  };

  const actionDiversity: CategoryGroupItem = {
    icon: (
      <LeafIcon
        className="text-accent"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.ACTION_DIVERSITY,
    label: t("filters.categories.actions.treeDiversity"),
  };

  const actionSocioEco: CategoryGroupItem = {
    icon: (
      <UsersIcon
        className="text-info"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.ACTION_SOCIO,
    label: t("filters.categories.actions.socioEco"),
  };

  // ----- Data type -----

  const dataGround: CategoryGroupItem = {
    icon: (
      <TreePineIcon
        className="text-muted-foreground"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.DATA_GROUND,
    label: t("filters.categories.data.ground"),
  };

  const dataSatellite: CategoryGroupItem = {
    icon: (
      <EarthIcon
        className="text-muted-foreground"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.DATA_SATELLITE,
    label: t("filters.categories.data.satellite"),
  };

  const dataModel: CategoryGroupItem = {
    icon: (
      <DatabaseIcon
        className="text-muted-foreground"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.DATA_MODEL,
    label: t("filters.categories.data.model"),
  };

  // ----- Ecosystem -----

  const systemMangroveHigh: CategoryGroupItem = {
    identifier: CATEGORY_IDENTIFIERS.SYSTEM_MANGROVE_HIGH,
    label: t("filters.categories.system.mangroveHigh"),
  };

  const systemMangroveLow: CategoryGroupItem = {
    identifier: CATEGORY_IDENTIFIERS.SYSTEM_MANGROVE_LOW,
    label: t("filters.categories.system.mangroveLow"),
  };

  const systemForestPrimary: CategoryGroupItem = {
    identifier: CATEGORY_IDENTIFIERS.SYSTEM_FOREST_PRIMARY,
    label: t("filters.categories.system.forestPrimary"),
  };

  const systemForestSecondary: CategoryGroupItem = {
    identifier: CATEGORY_IDENTIFIERS.SYSTEM_FOREST_SECONDARY,
    label: t("filters.categories.system.forestSecondary"),
  };

  return {
    actions: [actionInventary, actionDiversity, actionSocioEco],
    data: [dataGround, dataSatellite, dataModel],
    system: [
      systemMangroveHigh,
      systemMangroveLow,
      systemForestPrimary,
      systemForestSecondary,
    ],
  };
};
