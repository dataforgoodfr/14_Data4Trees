import {
  type CqlExpression,
  cql,
  type Where,
  whereToCql,
} from "@shared/lib/coordo";

import type { CalculationFilter, CalculationFiltersState } from "./types";

/**
 * "Selected values, or not provided": the "Non renseigné" codes are merged into
 * the `in` list, and `isNull` is ORed when the missing option covers null rows.
 *
 * With nothing left to OR (no value, no code, no null), `in []` matches
 * nothing, like any group with nothing checked.
 */
const buildMissingClause = (filter: CalculationFilter): CqlExpression => {
  const { propertyName, missing } = filter;
  const values = [...filter.values, ...(missing?.values ?? [])];

  return (
    cql.or(
      values.length > 0 ? cql.inList(propertyName, values) : undefined,
      missing?.includeNull ? cql.isNull(propertyName) : undefined,
    ) ?? cql.inList(propertyName, [])
  );
};

/**
 * Compile the persisted state into the CQL2 filter sent to `setLayerFilters`,
 * or `undefined` when it restricts nothing.
 *
 * Groups are ANDed. Each one is an `in [values]` — a range is already resolved
 * to the list of options it spans — except when its "Non renseigné" box is
 * checked: `where` ANDs one operator per key, so it cannot say "`in` OR
 * `isNull`", and those groups are built with the `cql` builder instead.
 *
 * An unchecked "Non renseigné" needs nothing: `in [values]` already excludes
 * the codes and the null rows.
 */
export const buildCalculationFilter = (
  state: CalculationFiltersState,
): CqlExpression | undefined => {
  const where: Where = {};
  const missingClauses: CqlExpression[] = [];

  for (const filter of Object.values(state)) {
    if (filter.missing?.checked) {
      missingClauses.push(buildMissingClause(filter));
    } else {
      where[filter.propertyName] = { in: filter.values };
    }
  }

  return cql.and(whereToCql(where), ...missingClauses);
};
