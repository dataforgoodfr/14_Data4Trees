import { AlertCircleIcon, InfoIcon, Loader2Icon } from "lucide-react";
import type { FC } from "react";

import {
  CheckboxGroup,
  getOptionLabel,
  RangeGroup,
  toCheckboxItems,
} from "@features/base-filters";

import type { CalculationFilters as CalculationFiltersPayload } from "@shared/api/types";
import { useTranslation } from "@shared/i18n";

import { Alert, AlertDescription } from "@ui/alert";
import { Button } from "@ui/button";

import { CALCULATION_FILTER_KINDS, type CalculationFilterGroup } from "./types";
import {
  MISSING_IDENTIFIER,
  useCalculationFilters,
} from "./use-calculation-filters";

/** A group key the app has no title for shows its raw column name. */
const GROUP_TITLE_KEYS = {
  age: "filters.calculation.groups.age",
  coh: "filters.calculation.groups.coh",
  educ: "filters.calculation.groups.educ",
  inc_main: "filters.calculation.groups.inc_main",
  inc_sit: "filters.calculation.groups.inc_sit",
  sex: "filters.calculation.groups.sex",
  typ: "filters.calculation.groups.typ",
  urb_rur: "filters.calculation.groups.urb_rur",
} as const;

const isTitledGroup = (key: string): key is keyof typeof GROUP_TITLE_KEYS =>
  key in GROUP_TITLE_KEYS;

/** Groups in backend order, which is the display order. */
const toGroups = (
  payload: CalculationFiltersPayload,
): CalculationFilterGroup[] =>
  Object.entries(payload.filters).map(([key, leaf]) => ({
    key,
    kind: leaf.kind,
    missing: leaf.missing,
    options: leaf.values,
    propertyName: leaf.property_name,
  }));

type CalculationFiltersProps = {
  filters: CalculationFiltersPayload | null;
};

/**
 * Filters that change which survey rows each enquete point is computed from.
 * They are sent to the backend only when "Apply changes" is clicked, since a
 * recomputation takes a couple of seconds.
 */
export const CalculationFilters: FC<CalculationFiltersProps> = ({
  filters,
}) => {
  const { t, i18n } = useTranslation("all4trees");
  const {
    apply,
    getCheckboxGroupProps,
    getRangeProps,
    hasError,
    isDirty,
    isDisabled,
    isLoading,
  } = useCalculationFilters();

  if (!filters) return null;

  const getTitle = (key: string) =>
    isTitledGroup(key) ? t(GROUP_TITLE_KEYS[key]) : key;

  const getMissingItems = (group: CalculationFilterGroup) =>
    group.missing
      ? [
          {
            identifier: MISSING_IDENTIFIER,
            label: getOptionLabel(
              { ...group.missing, value: MISSING_IDENTIFIER },
              i18n.language,
            ),
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Sticky, so the layout never shifts while groups are edited. */}
      <div className="sticky top-0 z-10 bg-background pb-2 flex flex-col gap-2">
        <Button
          className="w-full"
          disabled={!isDirty || isDisabled}
          onClick={apply}
        >
          {isLoading && <Loader2Icon className="animate-spin" />}
          {isLoading
            ? t("filters.calculation.applying")
            : t("filters.calculation.apply")}
        </Button>

        {hasError && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              {t("filters.calculation.error")}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Alert variant="info">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          {t("filters.calculation.info", { layer: t("layers.socioEco") })}
        </AlertDescription>
      </Alert>

      {toGroups(filters).map((group) => {
        // Codes repeat across groups, so the DOM ids need the group key.
        const namespace = `calculation-${group.key}`;
        const checkboxProps = getCheckboxGroupProps(group);

        if (group.kind === CALCULATION_FILTER_KINDS.RANGE) {
          const missingItems = getMissingItems(group);

          return (
            <RangeGroup
              disabled={isDisabled}
              key={group.key}
              labels={group.options.map((option) =>
                getOptionLabel(option, i18n.language),
              )}
              title={getTitle(group.key)}
              {...getRangeProps(group)}
            >
              {missingItems.length > 0 && (
                <CheckboxGroup
                  disabled={isDisabled}
                  items={missingItems}
                  namespace={namespace}
                  {...checkboxProps}
                />
              )}
            </RangeGroup>
          );
        }

        return (
          <CheckboxGroup
            disabled={isDisabled}
            items={[
              ...toCheckboxItems(group.options, i18n.language),
              ...getMissingItems(group),
            ]}
            key={group.key}
            namespace={namespace}
            title={getTitle(group.key)}
            {...checkboxProps}
          />
        );
      })}
    </div>
  );
};
