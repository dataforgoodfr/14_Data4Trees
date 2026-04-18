type SpriteSheet = {
  id: string;
  url: string;
};

export const SPRITE_MAPLIBRE: SpriteSheet = {
  id: "sprite-maplibre",
  url: "https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite",
};

/**
 * Helper to show how icons can be referenced in a multi-sprites context
 * @link https://maplibre.org/maplibre-style-spec/sprite/#multiple-sprite-sources
 */
export function getSpriteIconId({
  spriteId,
  iconId,
}: {
  spriteId: string;
  iconId: string;
}) {
  return `${spriteId}:${iconId}`;
}
