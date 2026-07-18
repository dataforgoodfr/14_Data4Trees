export const LAYERS = {
  BOUNDARIES: "boundaries",
  ENQUETE: "enquete",
  INVENTARY: "inventaire_for",
  SATELLITE: "satellite",
  SEED: "seed",
  SEED_POINT: "seed_point",
  TOWNS: "towns",
  VILLAGES: "villages",
} as const;

export const LAYERS_WITH_CLUSTERS: string[] = [
  LAYERS.ENQUETE,
  LAYERS.INVENTARY,
];
