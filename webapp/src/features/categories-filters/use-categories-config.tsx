import { Binoculars, TreePineIcon, UsersIcon } from "lucide-react";

import { useTranslation } from "@i18n";

import { CATEGORY_IDENTIFIERS, ICON_SIZE } from "./constants";
import type { CategoryGroupItem } from "./types";

export const useCategoriesConfig = (): { actions: CategoryGroupItem[] } => {
  const { t } = useTranslation("all4trees");

  // ----- Actions -----

  const actionInventory: CategoryGroupItem = {
    icon: (
      <TreePineIcon
        className="text-forest-inventory"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.ACTION_INVENTORY_FOR,
    label: t("layers.forestInventory"),
  };

  const actionDiversity: CategoryGroupItem = {
    icon: (
      <Binoculars
        className="text-bio-inventory"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.ACTION_INVENTORY_BIO,
    label: t("layers.bioInventory"),
  };

  const actionSocioEco: CategoryGroupItem = {
    icon: (
      <UsersIcon
        className="text-socio-eco"
        size={ICON_SIZE}
      />
    ),
    identifier: CATEGORY_IDENTIFIERS.ACTION_SOCIO,
    label: t("layers.socioEco"),
  };

  return {
    actions: [actionInventory, actionDiversity, actionSocioEco],
  };
};
