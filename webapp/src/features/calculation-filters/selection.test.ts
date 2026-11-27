import { describe, expect, it } from "vitest";

import {
  areStatesEqual,
  readGroupSelection,
  toCalculationFilter,
  withGroupFilter,
} from "./selection";
import { CALCULATION_FILTER_KINDS, type CalculationFilterGroup } from "./types";

const option = (value: string) => ({
  "label::en": value,
  "label::fr": value,
  value,
});

const MISSING = {
  include_null: true,
  "label::en": "Not provided",
  "label::fr": "Non renseigné",
  values: ["98", "99"],
};

const TYP: CalculationFilterGroup = {
  key: "typ",
  kind: CALCULATION_FILTER_KINDS.VALUES,
  missing: null,
  options: ["0", "1", "2"].map(option),
  propertyName: "typ",
};

const COH: CalculationFilterGroup = {
  key: "coh",
  kind: CALCULATION_FILTER_KINDS.RANGE,
  missing: null,
  options: ["2021", "2022", "2023", "2024"].map(option),
  propertyName: "coh",
};

const AGE: CalculationFilterGroup = {
  key: "age",
  kind: CALCULATION_FILTER_KINDS.RANGE,
  missing: MISSING,
  options: ["1", "2", "3", "4"].map(option),
  propertyName: "age",
};

describe("readGroupSelection", () => {
  it("shows everything checked for an untouched group", () => {
    expect(readGroupSelection(AGE, undefined)).toEqual({
      missing: true,
      values: ["1", "2", "3", "4"],
    });
  });

  it("reads a range back from its bounds", () => {
    expect(
      readGroupSelection(COH, {
        kind: CALCULATION_FILTER_KINDS.RANGE,
        max: "2023",
        min: "2022",
        propertyName: "coh",
        values: ["2022", "2023"],
      }),
    ).toEqual({ missing: true, values: ["2022", "2023"] });
  });

  it("ignores a filter of another kind", () => {
    expect(
      readGroupSelection(COH, {
        kind: CALCULATION_FILTER_KINDS.VALUES,
        propertyName: "coh",
        values: ["2022"],
      }),
    ).toEqual({ missing: true, values: ["2021", "2022", "2023", "2024"] });
  });

  it("drops values the form no longer offers", () => {
    expect(
      readGroupSelection(TYP, {
        kind: CALCULATION_FILTER_KINDS.VALUES,
        propertyName: "typ",
        values: ["1", "7"],
      }),
    ).toEqual({ missing: true, values: ["1"] });
  });
});

describe("toCalculationFilter", () => {
  it("removes a group where every box is checked", () => {
    expect(
      toCalculationFilter(TYP, { missing: true, values: ["0", "1", "2"] }),
    ).toBeUndefined();
  });

  it("removes a range at full extent on a group without missing", () => {
    expect(
      toCalculationFilter(COH, {
        missing: true,
        values: ["2021", "2022", "2023", "2024"],
      }),
    ).toBeUndefined();
  });

  it("removes a range at full extent with missing checked", () => {
    expect(
      toCalculationFilter(AGE, {
        missing: true,
        values: ["1", "2", "3", "4"],
      }),
    ).toBeUndefined();
  });

  it("keeps a range at full extent with missing unchecked", () => {
    expect(
      toCalculationFilter(AGE, {
        missing: false,
        values: ["1", "2", "3", "4"],
      }),
    ).toEqual({
      kind: CALCULATION_FILTER_KINDS.RANGE,
      max: "4",
      min: "1",
      missing: { checked: false, includeNull: true, values: ["98", "99"] },
      propertyName: "age",
      values: ["1", "2", "3", "4"],
    });
  });

  it("keeps values in option order whatever the click order", () => {
    expect(
      toCalculationFilter(TYP, { missing: true, values: ["2", "0"] }),
    ).toEqual({
      kind: CALCULATION_FILTER_KINDS.VALUES,
      propertyName: "typ",
      values: ["0", "2"],
    });
  });

  it("keeps an empty selection, which matches nothing", () => {
    expect(toCalculationFilter(TYP, { missing: true, values: [] })).toEqual({
      kind: CALCULATION_FILTER_KINDS.VALUES,
      propertyName: "typ",
      values: [],
    });
  });

  it("round-trips through readGroupSelection", () => {
    const selection = { missing: true, values: ["2", "3"] };
    expect(
      readGroupSelection(AGE, toCalculationFilter(AGE, selection)),
    ).toEqual(selection);
  });
});

describe("withGroupFilter", () => {
  it("removes the group when the filter is undefined", () => {
    const typ = toCalculationFilter(TYP, { missing: true, values: ["1"] });
    if (!typ) throw new Error("unexpected empty filter");

    expect(withGroupFilter({ typ }, "typ", undefined)).toEqual({});
  });
});

describe("areStatesEqual", () => {
  it("ignores key order", () => {
    const typ = toCalculationFilter(TYP, { missing: true, values: ["1"] });
    const coh = toCalculationFilter(COH, {
      missing: true,
      values: ["2022"],
    });
    if (!typ || !coh) throw new Error("unexpected empty filter");

    expect(areStatesEqual({ coh, typ }, { coh, typ })).toBe(true);
    expect(areStatesEqual({ coh, typ }, { typ })).toBe(false);
  });
});
