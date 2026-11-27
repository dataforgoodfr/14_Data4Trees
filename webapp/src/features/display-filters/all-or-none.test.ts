import { describe, expect, it } from "vitest";

import type { Filters } from "@shared/api/types";

import {
  getEmptyMapFilters,
  getUnrestrictedMapFilters,
  isMapFiltersEmpty,
  isMapFiltersUnrestricted,
} from "./all-or-none";
import { FILTER_KINDS, type MapFiltersState } from "./core/types";

const option = <T extends string | number>(value: T) => ({
  "label::en": String(value),
  "label::fr": String(value),
  value,
});

const leaf = <T extends string | number>(
  propertyName: string,
  ...values: T[]
) => ({ property_name: propertyName, values: values.map(option) });

const FILTERS: Filters = {
  cohort: {
    inventaire_bio: leaf("start_date", 2021),
    inventaire_for: leaf("cohort", 2021, 2022),
  },
  ecos: {
    inventaire_bio: leaf("ecos", 1),
    inventaire_for: leaf("ecos", 1, 2),
  },
  loc1: {
    enquete: leaf("loc1", "1"),
    inventaire_bio: leaf("loc1", 1),
    inventaire_for: leaf("loc1", 1, 2),
  },
  loc2: {
    enquete: leaf("loc2", "10"),
    inventaire_bio: leaf("loc2", 10),
    inventaire_for: leaf("loc2", 10, 11),
  },
  project: {
    enquete: leaf("proj", "A"),
    inventaire_bio: leaf("project", "A"),
    inventaire_for: leaf("project", "A", "B"),
  },
  type: {
    inventaire_bio: leaf("type", "x"),
    inventaire_for: leaf("type", "p"),
  },
  year: {
    enquete: leaf("year", "2025"),
    inventaire_bio: leaf("year", "2024"),
    inventaire_for: leaf("year", "2024", "2025"),
  },
};

describe("getEmptyMapFilters", () => {
  it("empties every group each panel offers, with its own property", () => {
    const empty = getEmptyMapFilters(FILTERS);

    expect(Object.keys(empty.byLayer.inventaire_for ?? {})).toEqual([
      "project",
      "type",
      "cohort",
      "loc1",
      "loc2",
      "ecos",
    ]);
    expect(empty.byLayer.inventaire_bio?.cohort).toEqual({
      kind: FILTER_KINDS.VALUES,
      propertyName: "start_date",
      values: [],
    });
    expect(empty.byLayer.enquete).toEqual({
      loc1: { kind: FILTER_KINDS.VALUES, propertyName: "loc1", values: [] },
      loc2: { kind: FILTER_KINDS.VALUES, propertyName: "loc2", values: [] },
      project: { kind: FILTER_KINDS.VALUES, propertyName: "proj", values: [] },
    });
    expect(empty.global).toEqual({
      year: {
        kind: FILTER_KINDS.VALUES,
        propertyNameByLayer: {
          enquete: "year",
          inventaire_bio: "year",
          inventaire_for: "year",
        },
        values: [],
      },
    });
  });

  it("reads as empty and not unrestricted", () => {
    const empty = getEmptyMapFilters(FILTERS);

    expect(isMapFiltersEmpty(empty, FILTERS)).toBe(true);
    expect(isMapFiltersUnrestricted(empty, FILTERS)).toBe(false);
  });
});

describe("isMapFiltersUnrestricted", () => {
  it("is true when nothing is stored", () => {
    const state = getUnrestrictedMapFilters();

    expect(state.global).toEqual({});
    expect(isMapFiltersUnrestricted(state, FILTERS)).toBe(true);
    expect(isMapFiltersEmpty(state, FILTERS)).toBe(false);
  });

  it("is true when stored groups select every option", () => {
    const state: MapFiltersState = {
      byLayer: {
        inventaire_for: {
          // Persisted as strings by an older build: compared as strings.
          loc1: {
            kind: FILTER_KINDS.VALUES,
            propertyName: "loc1",
            values: ["2", "1"],
          },
        },
      },
      global: {
        year: {
          kind: FILTER_KINDS.VALUES,
          propertyNameByLayer: {},
          values: ["2024", "2025"],
        },
      },
    };

    expect(isMapFiltersUnrestricted(state, FILTERS)).toBe(true);
  });

  it("is false when a single option is unchecked", () => {
    const state: MapFiltersState = {
      byLayer: {
        enquete: {
          project: {
            kind: FILTER_KINDS.VALUES,
            propertyName: "proj",
            values: [],
          },
        },
      },
      global: {},
    };

    expect(isMapFiltersUnrestricted(state, FILTERS)).toBe(false);
    expect(isMapFiltersEmpty(state, FILTERS)).toBe(false);
  });

  it("counts a stored group the panels no longer offer as a restriction", () => {
    const state: MapFiltersState = {
      byLayer: {
        enquete: {
          ecos: {
            kind: FILTER_KINDS.VALUES,
            propertyName: "ecos",
            values: [1],
          },
        },
      },
      global: {},
    };

    expect(isMapFiltersUnrestricted(state, FILTERS)).toBe(false);
  });

  it("counts a range as a restriction", () => {
    const state: MapFiltersState = {
      byLayer: {
        inventaire_for: {
          cohort: {
            kind: FILTER_KINDS.RANGE,
            min: 2022,
            propertyName: "cohort",
          },
        },
      },
      global: {},
    };

    expect(isMapFiltersUnrestricted(state, FILTERS)).toBe(false);
  });
});
