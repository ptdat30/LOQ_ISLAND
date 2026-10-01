// Fish image asset registry powered by Vite eager glob import
const imageModules = import.meta.glob<{ default: string }>(
  '../../../assets/fish/*.png',
  { eager: true }
);

export const FISH_IMAGES: Record<string, string> = {};

for (const imgPath in imageModules) {
  const match = imgPath.match(/\/([^/]+)\.png$/);
  if (match) {
    const fishId = match[1];
    FISH_IMAGES[fishId] = imageModules[imgPath].default;
  }
}

/**
 * Returns the resolved image URL for a given fish ID, or undefined if not found.
 */
export function getFishImageUrl(fishId: string | null | undefined): string | undefined {
  if (!fishId) return undefined;
  return FISH_IMAGES[fishId];
}
