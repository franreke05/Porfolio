/**
 * Plant cards of the golden plate. Foliage cannot hold as geometry, so each
 * plant of the photograph is a flat cut-out placed at its own depth:
 * `rect` is its box in plate pixels, `depth` its distance along the plate
 * camera's axis (metres), `id` the value of its pixels in the matte's blue
 * channel (id * 24). Generated with the matte (scratchpad ghost-build.cjs).
 */
export type PlateCard = { id: number; rect: [number, number, number, number]; depth: number };

export const PLATE_CARDS: PlateCard[] = [
  { id: 1, rect: [1031, 225, 1170, 480], depth: 6.53 },
  { id: 2, rect: [572, 300, 777, 505], depth: 6.15 },
  { id: 3, rect: [371, 403, 550, 591], depth: 11.42 },
  { id: 4, rect: [44, 551, 167, 627], depth: 8.03 },
];
