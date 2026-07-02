import { darken, lighten } from "color2k";

import type { ExternalData } from "@features/popup/forest-inventory/types";

import { getChartPalette } from "@shared/lib/palette";

import type { SunburstNode } from "../../soil/types";
import { formatTaxonLevelLabel } from "./taxon";

export function buildSunburstNodes(
  dataEntries: [string, number][],
  metadata: ExternalData,
  project: string,
): SunburstNode[] {
  const nodes = new Map<string, SunburstNode>();
  for (const [key, value] of dataEntries) {
    const parts = key.split("-");
    nodes.set(key, {
      depth: parts.length - 1,
      id: key,
      label: formatTaxonLevelLabel(key, metadata, project),
      parent: parts.slice(0, -1).join("-") || "",
      value,
    });

    for (let i = 1; i < parts.length; i++) {
      const parentPath = parts.slice(0, i).join("-");
      const parentNode = nodes.get(parentPath);
      if (parentNode) {
        parentNode.value += value;
        nodes.set(parentPath, parentNode);
      } else {
        nodes.set(parentPath, {
          depth: parentPath.split("-").length - 1,
          id: parentPath,
          label: formatTaxonLevelLabel(parentPath, metadata, project),
          parent: parts.slice(0, i - 1).join("-") || "",
          value: value,
        });
      }
    }
  }

  return Array.from(nodes.values());
}

export const getLevelPalettes = () => {
  const palette = getChartPalette();
  const lvl1Palette = palette.map((color) => darken(color, 0.1));
  const lvl3Palette = palette.map((color) => lighten(color, 0.1));
  return [lvl1Palette, palette, lvl3Palette];
};

export function buildNodeColors(nodes: SunburstNode[]) {
  const palettes = getLevelPalettes();
  return nodes
    .sort((a, b) => a.depth - b.depth)
    .map((node, index) => {
      const palette = palettes[node.depth];
      return palette[index % palette.length];
    });
}
