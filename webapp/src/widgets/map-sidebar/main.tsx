import { AlertCircleIcon, ListFilterIcon } from "lucide-react";
import { Activity, useEffect, useRef, useState } from "react";

import { CalculationFilters } from "@features/calculation-filters";
import { CategoriesFilters } from "@features/categories-filters";
import { MapFilters } from "@features/map-filters";

import type {
  CalculationFilters as CalculationFiltersPayload,
  Filters,
} from "@shared/api/types";
import { useApi } from "@shared/hooks/useApi";
import { GridSelector } from "@shared/ui/grid-selector";
import { useTranslation } from "@i18n";

import { Alert, AlertDescription } from "@ui/alert";
import { Separator } from "@ui/separator";

const FILTER_KIND = {
  CALCULATION: "calculation",
  DISPLAY: "display",
} as const;

export function MapSidebar() {
  const { t } = useTranslation("all4trees");
  const [selectedFilterKind, setSelectedFilterKind] = useState<string>(
    FILTER_KIND.DISPLAY,
  );
  const [mapFilters, setMapFilters] = useState<Filters | null>(null);
  const hasLoadedFilters = useRef<boolean | null>(null);

  const client = useApi();

  useEffect(() => {
    const fetchFilters = async () => {
      const filters = await client.getFilters();
      setMapFilters(filters);
      hasLoadedFilters.current = true;
    };
    if (mapFilters == null && !hasLoadedFilters.current) {
      fetchFilters();
    }
  }, [mapFilters, client.getFilters]);

  const [calculationFilters, setCalculationFilters] =
    useState<CalculationFiltersPayload | null>(null);
  const [calculationFiltersStatus, setCalculationFiltersStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  // Fetched once: the options are the form lists, they do not depend on the
  // map state.
  useEffect(() => {
    client
      .getCalculationFilters()
      .then((filters) => {
        setCalculationFilters(filters);
        setCalculationFiltersStatus("loaded");
      })
      .catch((error: unknown) => {
        console.error(error);
        setCalculationFiltersStatus("error");
      });
  }, [client.getCalculationFilters]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="px-4 py-2 font-semibold flex flex-row items-center flex-start gap-2">
        <ListFilterIcon size={18} />
        {t("filters.sidebarLayout.title")}
      </h3>

      <Separator />

      <GridSelector
        className="mx-2 my-3"
        onChange={(value) => setSelectedFilterKind(value)}
        options={[
          {
            id: FILTER_KIND.DISPLAY,
            label: t("filters.sidebarLayout.displayFilters"),
          },
          {
            id: FILTER_KIND.CALCULATION,
            label: t("filters.sidebarLayout.calculationFilters"),
          },
        ]}
        value={selectedFilterKind}
      />

      <div
        className="px-4 mb-3 overflow-y-scroll custom-scrollbar flex flex-col gap-6"
        style={{
          "--scrollbar-thumb": "var(--info-foreground)",
          "--scrollbar-track": "var(--background)",
        }}
      >
        <Activity
          mode={
            selectedFilterKind === FILTER_KIND.DISPLAY ? "visible" : "hidden"
          }
        >
          <CategoriesFilters />
          {hasLoadedFilters.current ? (
            <MapFilters filters={mapFilters} />
          ) : (
            <div className="mb-4 h-8 w-8 self-center animate-spin rounded-full border-4 border-primary border-t-transparent" />
          )}
        </Activity>

        <Activity
          mode={
            selectedFilterKind === FILTER_KIND.CALCULATION
              ? "visible"
              : "hidden"
          }
        >
          {calculationFiltersStatus === "loading" && (
            <div className="mb-4 h-8 w-8 self-center animate-spin rounded-full border-4 border-primary border-t-transparent" />
          )}
          {calculationFiltersStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                {t("filters.calculation.loadError")}
              </AlertDescription>
            </Alert>
          )}
          <CalculationFilters filters={calculationFilters} />
        </Activity>
      </div>
    </div>
  );
}
