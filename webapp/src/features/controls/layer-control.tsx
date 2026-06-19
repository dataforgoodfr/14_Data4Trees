import {
  HouseIcon,
  LayersIcon,
  SatelliteIcon,
  SchoolIcon,
  SlashIcon,
  TreePineIcon,
  UsersIcon,
} from "lucide-react";
import { Activity, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { LAYERS } from "@shared/api/layers";
import { useTranslation } from "@shared/i18n";
import {
  LAYER_CONTROL_ELEMENTS,
  type LayerControlRenderAnchor,
  type LayerControlRenderLayerRow,
} from "@shared/lib/coordo";
import { Checkbox } from "@shared/ui/checkbox";
import { Field, FieldLabel } from "@shared/ui/field";

const ICON_SIZE = 18;

export const renderAnchor: LayerControlRenderAnchor = () => {
  const container = document.createElement("div");
  container.className = "cursor-pointer p-sm";
  const root = createRoot(container);
  root.render(<LayersIcon size={ICON_SIZE} />);
  return container;
};

function useLayerConfig(layerId: string) {
  const { t } = useTranslation("all4trees");

  switch (layerId) {
    case LAYERS.BOUNDARIES:
      return {
        label: t("layers.boundaries") as string,
        renderIcon: (checked?: boolean) => (
          <SlashIcon
            className={checked ? "text-accent-foreground" : "text-muted"}
            size={ICON_SIZE}
          />
        ),
      };
    case LAYERS.ENQUETE:
      return {
        label: t("filters.categories.actions.socioEco") as string,
        renderIcon: (checked?: boolean) => (
          <UsersIcon
            className={checked ? "text-socio-eco" : "text-muted"}
            size={ICON_SIZE}
          />
        ),
      };
    case LAYERS.INVENTARY:
      return {
        label: t("filters.categories.actions.forestInventary") as string,
        renderIcon: (checked?: boolean) => (
          <TreePineIcon
            className={checked ? "text-inventaire" : "text-muted"}
            size={ICON_SIZE}
          />
        ),
      };
    case LAYERS.SATELLITE:
      return {
        label: t("filters.categories.data.satellite") as string,
        renderIcon: (checked?: boolean) => (
          <SatelliteIcon
            className={checked ? "text-accent-foreground" : "text-muted"}
            size={ICON_SIZE}
          />
        ),
      };
    case LAYERS.VILLAGES:
      return {
        label: t("layers.villages") as string,
        renderIcon: (checked?: boolean) => (
          <HouseIcon
            className={checked ? "text-accent-foreground" : "text-muted"}
            size={ICON_SIZE}
          />
        ),
      };
    case LAYERS.TOWNS:
      return {
        label: t("layers.towns") as string,
        renderIcon: (checked?: boolean) => (
          <SchoolIcon
            className={checked ? "text-accent-foreground" : "text-muted"}
            size={ICON_SIZE}
          />
        ),
      };
    default:
      return { label: layerId };
  }
}

function LayerRow({
  layerId,
  isChecked: initialChecked,
  onClick,
}: {
  layerId: string;
  isChecked: boolean;
  onClick: (nextChecked?: boolean) => void;
}) {
  const [isChecked, setIsChecked] = useState(initialChecked);
  const prevCheckedRef = useRef(initialChecked);

  // Sync internal state with external changes (e.g., from map)
  useEffect(() => {
    if (prevCheckedRef.current !== initialChecked) {
      setIsChecked(initialChecked);
      prevCheckedRef.current = initialChecked;
    }
  }, [initialChecked]);

  const handleCheckedChange = (nextChecked: boolean | "indeterminate") => {
    const nextState =
      nextChecked === "indeterminate" ? !isChecked : nextChecked;
    setIsChecked(nextState);
    onClick(nextState);
  };

  const { label, renderIcon } = useLayerConfig(layerId);
  const key = `${LAYER_CONTROL_ELEMENTS.LAYER_ROW(layerId)}-container`;

  return (
    <Field
      key={key}
      orientation="horizontal"
    >
      <div className="flex items-center justify-center w-2xl h-2xl">
        {renderIcon?.(isChecked)}
        <Activity mode={renderIcon ? "hidden" : "visible"}>
          <Checkbox
            checked={isChecked}
            id={key}
            onCheckedChange={handleCheckedChange}
          />
        </Activity>
      </div>
      <FieldLabel
        className="font-normal cursor-pointer text-center truncate"
        htmlFor={key}
      >
        {label}
      </FieldLabel>
    </Field>
  );
}

export const renderLayerRow: LayerControlRenderLayerRow = ({
  layerId,
  isChecked,
  onClick,
}) => {
  const container = document.createElement("div");
  container.className =
    "cursor-pointer px-sm py-xs flex flex-row gap-sm mb-xs w-full rounded-sm hover:bg-accent";
  const root = createRoot(container);
  root.render(
    <LayerRow
      isChecked={isChecked}
      layerId={layerId}
      onClick={onClick}
    />,
  );
  return container;
};
