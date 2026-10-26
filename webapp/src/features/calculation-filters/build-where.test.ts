import { describe, expect, it } from "vitest";

import { cql } from "@shared/lib/coordo";

import { buildCalculationFilter } from "./build-where";
import {
  CALCULATION_FILTER_KINDS,
  type MissingSelection,
  type RangeCalculationFilter,
  type ValuesCalculationFilter,
} from "./types";

const AGE_MISSING = { includeNull: true, values: ["98", "99"] };
const URB_RUR_MISSING = { includeNull: true, values: [] };

const valuesFilter = (
  propertyName: string,
  values: string[],
  missing?: MissingSelection,
): ValuesCalculationFilter => ({
  kind: CALCULATION_FILTER_KINDS.VALUES,
  propertyName,
  values,
  ...(missing && { missing }),
});

const rangeFilter = (
  propertyName: string,
  values: string[],
  missing?: MissingSelection,
): RangeCalculationFilter => ({
  kind: CALCULATION_FILTER_KINDS.RANGE,
  max: values.at(-1) ?? "",
  min: values[0] ?? "",
  propertyName,
  values,
  ...(missing && { missing }),
});

describe("buildCalculationFilter", () => {
  it("restricts nothing for an empty state", () => {
    expect(buildCalculationFilter({})).toBeUndefined();
  });

  it("compiles a values group to an in-list", () => {
    expect(
      buildCalculationFilter({ typ: valuesFilter("typ", ["1", "2"]) }),
    ).toEqual(cql.inList("typ", ["1", "2"]));
  });

  it("keeps an empty values group, which matches nothing", () => {
    expect(buildCalculationFilter({ typ: valuesFilter("typ", []) })).toEqual(
      cql.inList("typ", []),
    );
  });

  it("compiles a narrowed range to the in-list of the options it spans", () => {
    expect(
      buildCalculationFilter({ coh: rangeFilter("coh", ["2022", "2023"]) }),
    ).toEqual(cql.inList("coh", ["2022", "2023"]));
  });

  it("ANDs the groups", () => {
    expect(
      buildCalculationFilter({
        coh: rangeFilter("coh", ["2022", "2023"]),
        typ: valuesFilter("typ", ["1", "2"]),
      }),
    ).toEqual(
      cql.and(
        cql.inList("coh", ["2022", "2023"]),
        cql.inList("typ", ["1", "2"]),
      ),
    );
  });

  describe("missing option", () => {
    it("unchecked: a plain in-list, which excludes the codes and null", () => {
      expect(
        buildCalculationFilter({
          age: rangeFilter("age", ["1", "2"], {
            ...AGE_MISSING,
            checked: false,
          }),
        }),
      ).toEqual(cql.inList("age", ["1", "2"]));
    });

    it("unchecked with nothing else selected matches nothing", () => {
      expect(
        buildCalculationFilter({
          urb_rur: valuesFilter("urb_rur", [], {
            ...URB_RUR_MISSING,
            checked: false,
          }),
        }),
      ).toEqual(cql.inList("urb_rur", []));
    });

    it("checked: merges the codes into the in-list and ORs isNull", () => {
      expect(
        buildCalculationFilter({
          age: rangeFilter("age", ["1", "2"], {
            ...AGE_MISSING,
            checked: true,
          }),
        }),
      ).toEqual(
        cql.or(cql.inList("age", ["1", "2", "98", "99"]), cql.isNull("age")),
      );
    });

    it("checked without codes: in-list OR isNull", () => {
      expect(
        buildCalculationFilter({
          urb_rur: valuesFilter("urb_rur", ["2"], {
            ...URB_RUR_MISSING,
            checked: true,
          }),
        }),
      ).toEqual(cql.or(cql.inList("urb_rur", ["2"]), cql.isNull("urb_rur")));
    });

    it("checked alone, without codes: isNull only", () => {
      expect(
        buildCalculationFilter({
          urb_rur: valuesFilter("urb_rur", [], {
            ...URB_RUR_MISSING,
            checked: true,
          }),
        }),
      ).toEqual(cql.isNull("urb_rur"));
    });

    it("checked alone, with codes: the codes OR isNull", () => {
      expect(
        buildCalculationFilter({
          age: valuesFilter("age", [], { ...AGE_MISSING, checked: true }),
        }),
      ).toEqual(cql.or(cql.inList("age", ["98", "99"]), cql.isNull("age")));
    });

    it("checked, without null: the codes only", () => {
      expect(
        buildCalculationFilter({
          age: valuesFilter("age", ["1"], {
            checked: true,
            includeNull: false,
            values: ["98", "99"],
          }),
        }),
      ).toEqual(cql.inList("age", ["1", "98", "99"]));
    });

    it("checked alone, with neither codes nor null: matches nothing", () => {
      expect(
        buildCalculationFilter({
          age: valuesFilter("age", [], {
            checked: true,
            includeNull: false,
            values: [],
          }),
        }),
      ).toEqual(cql.inList("age", []));
    });

    it("ANDs the missing groups with the plain ones", () => {
      expect(
        buildCalculationFilter({
          age: rangeFilter("age", ["1", "2"], {
            ...AGE_MISSING,
            checked: true,
          }),
          typ: valuesFilter("typ", ["1", "2"]),
          urb_rur: valuesFilter("urb_rur", ["2"], {
            ...URB_RUR_MISSING,
            checked: true,
          }),
        }),
      ).toEqual(
        cql.and(
          cql.inList("typ", ["1", "2"]),
          cql.or(cql.inList("age", ["1", "2", "98", "99"]), cql.isNull("age")),
          cql.or(cql.inList("urb_rur", ["2"]), cql.isNull("urb_rur")),
        ),
      );
    });
  });
});
