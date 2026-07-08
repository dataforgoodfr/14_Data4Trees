const getCssVarColor = (name: string, fallback: string) => {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
};

export const getChartPalette = () => [
  getCssVarColor("--chart-1", "#97cf17"),
  getCssVarColor("--chart-2", "#f98038"),
  getCssVarColor("--chart-3", "#2d6db4"),
  getCssVarColor("--chart-4", "#895bf5"),
];
