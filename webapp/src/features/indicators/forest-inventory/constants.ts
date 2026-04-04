export const FORESTS = [
  { label: "Djilor", value: "1" },
  { label: "Malka", value: "2" },
  { label: "Samba Dia", value: "3" },
  { label: "Takkite", value: "4" },
] as const;

export const FORESTS_MAP = new Map<string, (typeof FORESTS)[number]>();

FORESTS.forEach((forest) => {
  FORESTS_MAP.set(forest.value, forest);
});