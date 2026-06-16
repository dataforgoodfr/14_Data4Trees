export const SVG_SIZE_DEFAULT = 72;
export const TARGET_SIZE_DEFAULT = 48;

export function getIconSize({
  assetSize = SVG_SIZE_DEFAULT,
  targetSize = TARGET_SIZE_DEFAULT,
}: {
  assetSize?: number;
  targetSize?: number;
}) {
  if (!assetSize) {
    return 1;
  }
  return targetSize / assetSize;
}
