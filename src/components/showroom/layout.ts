/**
 * Blocking of the ORYKAI showroom, in metres. Y is up.
 *
 * Origin: the counter's front-left foot. The counter runs along +X, its glass
 * front faces +Z (towards the visitor). The window wall is the LEFT wall
 * (x = ROOM.x0), the sun comes in through it heading +X / +Z.
 *
 * REVISION 4: every number that frame 0 can see was measured on the golden
 * plate (docs/source-of-truth/GOLDEN_REFERENCE.png, landmarks in
 * plate-landmarks.ts) and unprojected through PLATE_CAMERA, so the proxies
 * sit under the plate's own silhouettes. The single scale assumption is the
 * counter height (1.05 m); everything else follows from it.
 */

/**
 * The camera that took the golden plate — the ONE pose shared by key F0 of
 * the travel and by the plate projector. Solved from the plate's vanishing
 * points and the counter landmarks (see plate-landmarks.ts).
 *
 * `fov` is the vertical field of view of the full frame. `shiftY` is a lens
 * shift (three's view offset, in frame heights): the plate keeps its
 * verticals parallel while the horizon sits below the middle of the frame,
 * which a centred lens cannot do.
 */
export const PLATE_CAMERA = {
  eye: [3.8583, 0.9971, 4.62] as const,
  look: [0.9131, 1.1681, -0.6065] as const,
  fov: 37.44,
  shiftY: -0.0448,
  aspect: 1672 / 941,
} as const;

export const ROOM = {
  x0: -5.3,
  x1: 12,
  z0: -7.85,
  z1: 7,
  height: 6,
  wall: 0.5,
} as const;

/**
 * Window wall (x = ROOM.x0). Each bay is an opening between z0 and z1 whose
 * glass sits back at `glass`; `mullions` are z positions, `transoms` heights.
 * Bay 0 is the far window of the plate, bay 1 the near one (cut by the left
 * edge of frame 0), bay 2 lies behind the opening camera.
 */
export const WINDOWS = {
  bar: 0.09,
  bays: [
    { z0: -7.24, z1: -4.75, glass: -5.4, sill: 0, head: 5.405, post: 0.26, mullions: [-6.06], transoms: [2.89, 4.5] },
    { z0: -1.49, z1: 1.6, glass: -5.59, sill: 0.3, head: 4.66, post: 0.12, mullions: [], transoms: [2.81, 3.69] },
    { z0: 2.6, z1: 6.2, glass: -5.59, sill: 0.3, head: 4.66, post: 0.12, mullions: [4.4], transoms: [2.81, 3.69] },
  ],
  /** Dark stretch of the window wall between the near window and the first pier. */
  darkWall: [-3.85, -1.49] as const,
  /** Raw concrete piers standing proud of the wall: [z0, z1, depth]. */
  piers: [
    [-4.75, -3.85, 0.45],
    [ROOM.z0, -7.24, 0.95],
    [1.6, 2.6, 0.45],
  ] as ReadonlyArray<readonly [number, number, number]>,
  /** Concrete lintel beam over the far window, between the first two piers. */
  lintel: { z0: -7.24, z1: -4.75, y0: 5.73, depth: 0.45 },
} as const;

/** Sun direction (the way the light travels). Low late-afternoon sun. */
export const SUN = { dir: [1, -0.5, 0.35] as const, target: [3, 0, 1.5] as const };

export const COUNTER = {
  x0: 0,
  x1: 3.89,
  /** Timber end section past the last compartment (cut by the right edge of frame 0). */
  wing: 0.3,
  depth: 0.75,
  height: 1.05,
  top: 0.055,
  overhang: 0.008,
  /** Glass case in the counter's front: x of its left edge, the three posts and its right edge. */
  posts: [0.14, 1.229, 2.109, 2.977, 3.77] as const,
  divider: 0.022,
  /** Recessed toe-kick. */
  toe: 0.1,
  toeRecess: 0.07,
  caseY0: 0.125,
  plinthY1: 0.49,
  caseY1: 0.936,
  recess: 0.4,
  /**
   * Inclined cover plates, fitted corner by corner to the plate's white
   * boards: shared height and lean from vertical; per board the centre x and
   * z of its lower edge, its width, and `skew` (x drift of the upper edge —
   * the plate draws the four boards as near-identical parallelograms).
   */
  plate: {
    h: 0.411,
    lean: (32 * Math.PI) / 180,
    boards: [
      { x: 0.768, z: -0.048, w: 0.651, skew: 0.014 },
      { x: 1.668, z: -0.08, w: 0.632, skew: 0.029 },
      { x: 2.518, z: -0.107, w: 0.627, skew: 0.033 },
      { x: 3.359, z: -0.092, w: 0.578, skew: 0.043 },
    ],
  },
} as const;

/** Left edge x of glass compartment i (0..3). */
export const compartmentX0 = (index: number) => COUNTER.posts[index] + (index === 0 ? 0 : COUNTER.divider / 2);
/** Clear width of glass compartment i. */
export const compartmentW = (index: number) =>
  COUNTER.posts[index + 1] - (index === 3 ? 0 : COUNTER.divider / 2) - compartmentX0(index);
/** Centre x of glass compartment i (0..3). */
export const compartmentX = (index: number) => compartmentX0(index) + compartmentW(index) / 2;

/** Partition wall that carries the wood display unit, behind the counter. */
export const PARTITION = { x0: 1.25, x1: 8.2, z0: -2.3, z1: -1.9 } as const;

export const UNIT = {
  x0: 1.36,
  x1: 7.55,
  y0: 0.3,
  y1: 2.82,
  panel: 0.05,
  shelfDepth: 0.3,
  shelf: 0.055,
  /** Underside heights of the long shelves. */
  shelves: [1.445] as const,
  /** Short shelf carrying the hanging plant, by the left upright. */
  shortShelf: { x0: 1.45, x1: 2.0, y: 2.02 },
  headerY0: 2.39,
  /** Black steel uprights: the left one runs full height, the next stops under the header. */
  uprights: [1.36, 3.91] as const,
  upright: 0.05,
  /** The left upright stops a little under the top of the header. */
  uprightDrop: 0.046,
  boards: [2.26, 2.885, 3.52] as const,
  board: { w: 0.465, h: 0.705, lean: 0.07 },
  signX: 2.9,
} as const;

/**
 * `tilt` leans the shade a few degrees away from the plate camera: the plate
 * draws its rim flatter than a level shade would look from that eye.
 */
export const PENDANT = { x: 1.222, z: -0.35, y: 2.47, radius: 0.334, rise: 0.72, tilt: (4.2 * Math.PI) / 180 } as const;

/** Black tracks under the ceiling in front of the far wall: [x0, x1, y0, y1, z0, z1]. */
export const TRACKS = [
  [-4.0, 1.25, 5.88, 5.97, -7.05, -6.95],
  [-4.3, 1.25, 5.41, 5.54, -7.84, -7.76],
] as const;

/** On the worktop. Positions read off the plate at the given depth. */
export const DESK = {
  monitor: { x: 0.98, z: -0.4, w: 0.67, h: 0.39, y: 1.305 },
  pot: { x: 0.21, z: -0.4, r: 0.13, h: 0.18 },
  penPot: { x: 1.483, z: -0.4, r: 0.066, h: 0.13 },
  box: { x0: 0.574, x1: 0.707, h: 0.12, z: -0.4 },
  lamp: { x: 3.835, z: -0.55, h: 0.29 },
  books: { x0: 3.43, x1: 3.77, h: 0.09, z: -0.55 },
  uprightBooks: { x0: 2.12, x1: 2.36, h: 0.18, z: -0.6 },
  dish: { x: 3.07, z: -0.55, r: 0.08, h: 0.04 },
} as const;

/** Category bays on the right wall, facing -X. z = centre, w = width. */
export const BAYS = [
  { id: "posicionamiento", z: -3.75, w: 1.7 },
  { id: "creacion", z: -1.8, w: 1.7 },
  { id: "automatizaciones", z: 0.15, w: 1.7 },
  { id: "apps", z: 3.3, w: 3.5 },
] as const;

/** Bays are real cabinets standing proud of the wall. */
export const BAY = { y0: 0.35, y1: 3.05, signY: 2.82, depth: 0.2, face: 0.03 } as const;

/** Closing plaque with the contact details, on the right wall past the last bay. */
export const PLAQUE = { z: 6.05, y: 1.72, size: 1.3, depth: 0.035 } as const;

/**
 * The founder's framed portrait, hung on the front wall (z = ROOM.z1, facing
 * -Z) round the corner from the contact plaque. Behind the opening camera, so
 * frame 0 never sees it. `x`/`y` = centre of the 4:5 photo; `mat` and
 * `frame` are border widths.
 */
export const FOUNDER_FRAME = { x: 11.15, y: 1.64, w: 0.4, h: 0.5, mat: 0.055, frame: 0.02, depth: 0.035 } as const;

/** 2:3 cover slot. */
export const SLOT = { w: 0.5, h: 0.75, gap: 0.28, rowY: [2.03, 1.0] as const } as const;

export const LOUNGE = {
  /** Long sofa against the window wall, facing the counter. */
  sofa: { x0: -5.25, x1: -4.4, z0: -2.85, z1: 0.15, seat: 0.5, arm: 0.9, back: 1.04, armWidth: 0.3 },
  /** The plate draws the drum 15 px left of the top: baseShift is that offset, [x, z]. */
  table: { x: -3.74, z: -0.515, r: 0.525, h: 0.42, base: 0.42, baseShift: [-0.075, 0.05] as const },
  /** Rug corners on the floor, [x, z], counter-clockwise seen from above. */
  rug: [
    [-0.81, -2.98],
    [-4.73, -1.25],
    [-6.24, 4.17],
    [-2.32, 2.45],
  ] as ReadonlyArray<readonly [number, number]>,
  planter: { x: -4.44, z: -3.86, r: 0.31, base: 0.24, h: 0.72 },
  /** Framed print on the far wall. */
  art: { x0: -3.52, x1: -2.29, y0: 1.92, y1: 3.61 },
} as const;
