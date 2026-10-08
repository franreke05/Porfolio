import { COUNTER, DESK, LOUNGE, PARTITION, PENDANT, PLATE_CAMERA, ROOM, TRACKS, UNIT, WINDOWS } from "./layout";

/**
 * Landmarks measured on the golden plate
 * (docs/source-of-truth/GOLDEN_REFERENCE.png, 1672 × 941, origin top-left),
 * each tied to the spot of the modelled room that must project onto it
 * through PLATE_CAMERA.
 *
 * `px` is the measurement: sub-pixel values come from luminance edge scans,
 * whole ones were read off 2× gridded crops (± 1–2 px). `at` is a world point;
 * `on` is a world edge, used where the plate gives a line but no end point
 * (the error is then the distance from `px` to the projected edge).
 *
 * How PLATE_CAMERA was solved from these:
 *  - verticals (piers, window post, unit upright, counter end) barely converge
 *    while the horizon sits at y ≈ 552, 82 px under the middle of the frame →
 *    pitch 1.6° plus a lens shift (principal point y ≈ 512.6);
 *  - the counter/unit horizontals vanish at x ≈ −1629 and the window-wall
 *    horizontals at x ≈ +1619, both on that horizon → focal 1388 px (37.4°
 *    vertical) and a yaw of 29.4° off the counter's normal;
 *  - position and scale from the counter alone: its top is 1.05 m high and its
 *    ends are 229 px/m and 342 px/m tall → eye 0.997 m up, 4.62 m in front of
 *    the glass, 3.86 m along it; the counter comes out 3.89 m long.
 * Levenberg–Marquardt over eye, yaw, pitch, focal, principal-point y and
 * counter length; roll held at zero. The proxies in layout.ts were then
 * unprojected from the remaining landmarks through that camera.
 */

type V3 = [number, number, number];
export type PlateLandmark = { id: string; px: [number, number]; at?: V3; on?: [V3, V3]; note: string };

const C = COUNTER;
const U = UNIT;
const uz = PARTITION.z1;
const uf = uz + U.shelfDepth + 0.012;
const header = uz + U.panel + 0.05;
const x0 = ROOM.x0;
const z0 = ROOM.z0;
const [far, near] = WINDOWS.bays;
const [pier1, pier2] = WINDOWS.piers;
const S = LOUNGE.sofa;
const T = LOUNGE.table;
const M = DESK.monitor;
const upper = U.shelves[U.shelves.length - 1] + U.shelf;

/** Corners of case cover i: lower-left, lower-right, upper-right, upper-left. */
function cover(index: number): V3[] {
  const { h, lean, boards } = C.plate;
  const { x, z, w, skew } = boards[index];
  const y = C.plinthY1 + 0.012;
  const y1 = y + h * Math.cos(lean);
  const z1 = z - h * Math.sin(lean);
  return [
    [x - w / 2, y, z],
    [x + w / 2, y, z],
    [x + w / 2 + skew, y1, z1],
    [x - w / 2 + skew, y1, z1],
  ];
}

/** Corners of wall board i, same order. */
function board(index: number): V3[] {
  const { w, h, lean } = U.board;
  const x = U.boards[index];
  const dy = (h / 2) * Math.cos(lean);
  const dz = (h / 2) * Math.sin(lean);
  const y = upper + h / 2 + 0.002;
  const z = uz + 0.225 + 0.007;
  return [
    [x - w / 2, y - dy, z + dz],
    [x + w / 2, y - dy, z + dz],
    [x + w / 2, y + dy, z - dz],
    [x - w / 2, y + dy, z - dz],
  ];
}

const COVER_PX: Array<Array<[number, number]>> = [
  [[671, 674], [805, 681], [837.5, 590], [702.5, 589]],
  [[869, 681], [1022.5, 692.5], [1052.5, 591.5], [900, 590]],
  [[1087, 692], [1263.5, 702.5], [1291, 592.5], [1110, 594]],
  [[1343.5, 706], [1538.5, 718.5], [1561, 597.5], [1361, 593.5]],
];
const BOARD_PX: Array<Array<[number, number]>> = [
  [[1156, 442], [1260, 438], [1264, 280], [1165, 289]],
  [[1298, 437], [1413, 434], [1416, 267.5], [1304, 277.5]],
  [[1457, 431], [1584, 427], [1586, 252], [1461, 264]],
];
const CORNER = ["lower-left", "lower-right", "upper-right", "upper-left"];

const sightX = -0.4907;
const sightZ = -0.8708;

/** Floor-plan unit vector from (x, z) towards the plate camera, and the one square to it (screen right). */
function facing(x: number, z: number) {
  const dx = PLATE_CAMERA.eye[0] - x;
  const dz = PLATE_CAMERA.eye[2] - z;
  const length = Math.hypot(dx, dz);
  return { tx: dx / length, tz: dz / length, rx: dz / length, rz: -dx / length };
}
const tableSide = facing(T.x, T.z);
const planterSide = facing(LOUNGE.planter.x, LOUNGE.planter.z);

export const PLATE_LANDMARKS: PlateLandmark[] = [
  // ── Counter ──
  { id: "counter top, left end", px: [582, 543.2], at: [C.x0, C.height, 0], note: "front edge of the worktop at the counter's left end" },
  { id: "counter top, right end", px: [1633, 531.5], at: [C.x1, C.height, 0], note: "same edge where the dark body ends, 40 px from the frame edge" },
  { id: "counter top, mid", px: [1000, 537.3], on: [[C.x0, C.height, 0], [C.x1, C.height, 0]], note: "worktop front edge between the monitor and the pen pot" },
  { id: "counter base, left", px: [589, 784], at: [C.x0 + 0.03, 0, -C.toeRecess], note: "foot of the recessed toe-kick, left end" },
  { id: "counter base, mid", px: [1110, 840], on: [[C.x0, 0, -C.toeRecess], [C.x1, 0, -C.toeRecess]], note: "toe-kick / floor line" },
  { id: "counter base, right", px: [1626, 897], at: [C.x1 - 0.03, 0, -C.toeRecess], note: "foot of the toe-kick under the right upright" },
  { id: "counter left edge", px: [581.6, 670], on: [[C.x0, 0, 0], [C.x0, 1, 0]], note: "vertical edge of the dark body (581.7 @ y600, 581.5 @ y740)" },
  { id: "case vertical 1", px: [606, 620], on: [[C.posts[0], 0, 0], [C.posts[0], 1, 0]], note: "inner edge of the left frame, where the lit timber cheek starts" },
  { id: "case vertical 2", px: [830, 650], on: [[C.posts[1], 0, 0], [C.posts[1], 1, 0]], note: "first post (831.6 @ y600, 828.2 @ y740)" },
  { id: "case vertical 3", px: [1048, 650], on: [[C.posts[2], 0, 0], [C.posts[2], 1, 0]], note: "second post" },
  { id: "case vertical 4", px: [1304.4, 650], on: [[C.posts[3], 0, 0], [C.posts[3], 1, 0]], note: "third post (1304.3 @ y600, 1304.5 @ y780)" },
  { id: "case vertical 5", px: [1585.5, 650], on: [[C.posts[4], 0, 0], [C.posts[4], 1, 0]], note: "right end of the glass (1584.3 @ y620, 1586.8 @ y820)" },
  { id: "counter right upright", px: [1633.7, 735], on: [[C.x1, 0, 0], [C.x1, 1, 0]], note: "outer edge of the right upright (1632.5 @ y620, 1635 @ y850)" },
  { id: "case top rail, left", px: [700, 567.8], on: [[C.x0, C.caseY1, 0], [C.x1, C.caseY1, 0]], note: "underside of the top rail, where the lit recess starts" },
  { id: "case top rail, right", px: [1550, 572.3], on: [[C.x0, C.caseY1, 0], [C.x1, C.caseY1, 0]], note: "same edge near the right end" },
  { id: "worktop underside", px: [650, 553.4], on: [[C.x0, C.height - C.top, 0], [C.x1, C.height - C.top, 0]], note: "timber slab over the dark body" },
  { id: "plinth top, left", px: [640, 676.9], on: [[C.x0, C.plinthY1, 0], [C.x1, C.plinthY1, 0]], note: "front top edge of the dark lower panels" },
  { id: "plinth top, right", px: [1320, 703.9], on: [[C.x0, C.plinthY1, 0], [C.x1, C.plinthY1, 0]], note: "same edge in the last compartment" },
  { id: "lower panel base, mid", px: [950, 791.7], on: [[C.x0, C.caseY0, 0], [C.x1, C.caseY0, 0]], note: "lower edge of the dark panels, above the toe-kick" },
  { id: "lower panel base, right", px: [1550, 849.6], on: [[C.x0, C.caseY0, 0], [C.x1, C.caseY0, 0]], note: "same edge near the right end" },
  // The four slanted boards in the case, corner by corner.
  ...COVER_PX.flatMap((corners, index) =>
    corners.map((px, corner): PlateLandmark => ({ id: `case board ${index + 1} ${CORNER[corner]}`, px, at: cover(index)[corner], note: "white placeholder board in the glass case" })),
  ),

  // ── Wall unit ──
  { id: "unit upright, top", px: [1018.5, 183], at: [U.x0, U.y1 - U.uprightDrop, uf], note: "top-left corner of the black upright" },
  { id: "unit upright, left edge", px: [1018.8, 350], on: [[U.x0, 0, uf], [U.x0, 3, uf]], note: "left edge of the upright (1018.5 @ y200, 1019.1 @ y500)" },
  { id: "unit top edge, left", px: [1060, 178.7], on: [[U.x0, U.y1, header], [U.x1, U.y1, header]], note: "top of the timber header against the concrete" },
  { id: "unit top edge, mid", px: [1350, 143.2], on: [[U.x0, U.y1, header], [U.x1, U.y1, header]], note: "same edge" },
  { id: "unit top edge, right", px: [1660, 105.8], on: [[U.x0, U.y1, header], [U.x1, U.y1, header]], note: "same edge at the frame edge (the plate turns this line 3° off the counter)" },
  { id: "header LED line, left", px: [1150, 256.7], on: [[U.x0, U.headerY0, header], [U.x1, U.headerY0, header]], note: "LED line under the header band" },
  { id: "header LED line, right", px: [1600, 213.2], on: [[U.x0, U.headerY0, header], [U.x1, U.headerY0, header]], note: "same line" },
  { id: "long shelf, left", px: [1100, 454.1], on: [[U.x0, U.shelves[0], uf - 0.022], [U.x1, U.shelves[0], uf - 0.022]], note: "underside of the long shelf's front edge" },
  { id: "long shelf, right", px: [1620, 436.2], on: [[U.x0, U.shelves[0], uf - 0.022], [U.x1, U.shelves[0], uf - 0.022]], note: "same edge" },
  { id: "short shelf", px: [1095, 327], on: [[U.shortShelf.x0, U.shortShelf.y + 0.02, uf - 0.032], [U.shortShelf.x1, U.shortShelf.y + 0.02, uf - 0.032]], note: "front edge of the short shelf under the hanging plant (y 324–330)" },
  { id: "second upright", px: [1629, 300], on: [[U.uprights[1], 0, uf], [U.uprights[1], 3, uf]], note: "left edge of the black upright right of board C" },
  ...BOARD_PX.flatMap((corners, index) =>
    corners.map((px, corner): PlateLandmark => ({ id: `wall board ${"ABC"[index]} ${CORNER[corner]}`, px, at: board(index)[corner], note: "white placeholder board leaning on the long shelf" })),
  ),
  { id: "partition edge", px: [1020, 100], on: [[PARTITION.x0, 0, PARTITION.z1], [PARTITION.x0, 6, PARTITION.z1]], note: "left edge of the concrete partition above the unit" },

  // ── Pendant ──
  { id: "pendant cable", px: [871, 40], on: [[PENDANT.x, PENDANT.y, PENDANT.z], [PENDANT.x, ROOM.height, PENDANT.z]], note: "cable, leaves the frame at the top (x 871 @ y0)" },
  { id: "pendant rim, left", px: [788, 191.5], at: [PENDANT.x + PENDANT.radius * sightZ, PENDANT.y, PENDANT.z - PENDANT.radius * sightX], note: "left extreme of the dome rim" },
  { id: "pendant rim, right", px: [954, 190.5], at: [PENDANT.x - PENDANT.radius * sightZ, PENDANT.y, PENDANT.z + PENDANT.radius * sightX], note: "right extreme of the dome rim" },
  { id: "pendant rim, bottom", px: [871, 206], at: [PENDANT.x + PENDANT.radius * sightX * Math.cos(PENDANT.tilt), PENDANT.y + PENDANT.radius * Math.sin(PENDANT.tilt), PENDANT.z + PENDANT.radius * sightZ * Math.cos(PENDANT.tilt)], note: "lowest point of the rim on screen (far edge of the opening, seen from below)" },
  { id: "pendant dome top", px: [871, 132], at: [PENDANT.x, PENDANT.y + PENDANT.radius * PENDANT.rise, PENDANT.z], note: "where the dome meets its cap" },

  // ── Window wall ──
  { id: "window 1 post", px: [91, 300], on: [[near.glass, 0, near.z0 + near.post], [near.glass, 4, near.z0 + near.post]], note: "glass-side edge of the near window's right post (94.1 @ y120, 87.7 @ y480)" },
  { id: "window 1 jamb", px: [135, 300], on: [[x0, 0, near.z0], [x0, 4, near.z0]], note: "corner of the reveal on the wall face" },
  { id: "window 1 transom A", px: [8, 153.3], on: [[near.glass, near.transoms[1], near.z0], [near.glass, near.transoms[1], near.z1]], note: "upper transom at the frame edge" },
  { id: "window 1 transom A'", px: [80, 174.2], on: [[near.glass, near.transoms[1], near.z0], [near.glass, near.transoms[1], near.z1]], note: "same transom by the post" },
  { id: "window 1 transom B", px: [85, 297], on: [[near.glass, near.transoms[0], near.z0], [near.glass, near.transoms[0], near.z1]], note: "lower transom (blurred by foliage, ± 4 px)" },
  { id: "window 2 mullion", px: [554, 430], on: [[far.glass, 0, far.mullions[0]], [far.glass, 5, far.mullions[0]]], note: "mullion (554.3 @ y260, 553.6 @ y600)" },
  { id: "window 2 far post", px: [612, 300], on: [[far.glass, 0, far.z0 + far.post], [far.glass, 5, far.z0 + far.post]], note: "glass-side edge of the far post" },
  { id: "window 2 head, left", px: [512, 105.4], on: [[far.glass, far.head - WINDOWS.bar, far.z0], [far.glass, far.head - WINDOWS.bar, far.z1]], note: "blind box → glass" },
  { id: "window 2 head, right", px: [600, 140.8], on: [[far.glass, far.head - WINDOWS.bar, far.z0], [far.glass, far.head - WINDOWS.bar, far.z1]], note: "same edge" },
  { id: "window 2 transom A, left", px: [512, 189.8], on: [[far.glass, far.transoms[1], far.z0], [far.glass, far.transoms[1], far.z1]], note: "upper transom" },
  { id: "window 2 transom A, right", px: [600, 217.9], on: [[far.glass, far.transoms[1], far.z0], [far.glass, far.transoms[1], far.z1]], note: "same transom" },
  { id: "window 2 transom B", px: [575, 366.8], on: [[far.glass, far.transoms[0], far.z0], [far.glass, far.transoms[0], far.z1]], note: "lower transom" },
  { id: "window 2 sill", px: [540, 654], on: [[far.glass, far.sill, far.z0], [far.glass, far.sill, far.z1]], note: "glass meets the floor (partly behind the planter)" },

  // ── Concrete ──
  { id: "pier 1 wall corner", px: [386.6, 330], on: [[x0, 0, pier1[1]], [x0, 5, pier1[1]]], note: "where the pier's front face meets the dark wall (389.2 @ y60, 384 @ y600)" },
  { id: "pier 1 arris", px: [430.4, 250], on: [[x0 + pier1[2], 0, pier1[1]], [x0 + pier1[2], 5, pier1[1]]], note: "lit face / shaded face (432 @ y100, 428.9 @ y400)" },
  { id: "pier 1 far edge", px: [504.4, 280], on: [[x0 + pier1[2], 0, pier1[0]], [x0 + pier1[2], 5, pier1[0]]], note: "edge against window 2 (505.7 @ y60, 503.1 @ y500)" },
  { id: "pier 1 base", px: [385, 670], at: [x0, 0, pier1[1]], note: "wall / floor junction at the pier" },
  { id: "pier 2 arris", px: [713, 300], on: [[x0 + pier2[2], 0, pier2[1]], [x0 + pier2[2], 5, pier2[1]]], note: "near corner of the far pier" },
  { id: "far wall start", px: [743.8, 300], on: [[x0 + pier2[2], 0, z0], [x0 + pier2[2], 5, z0]], note: "far pier / far wall (743.8 @ y180 and y300)" },
  { id: "lintel arris, left", px: [505, 28], on: [[x0 + WINDOWS.lintel.depth, WINDOWS.lintel.y0, WINDOWS.lintel.z0], [x0 + WINDOWS.lintel.depth, WINDOWS.lintel.y0, WINDOWS.lintel.z1]], note: "lower arris of the concrete beam over window 2" },
  { id: "lintel arris, right", px: [650, 97], on: [[x0 + WINDOWS.lintel.depth, WINDOWS.lintel.y0, WINDOWS.lintel.z0], [x0 + WINDOWS.lintel.depth, WINDOWS.lintel.y0, WINDOWS.lintel.z1]], note: "same arris by the far pier" },

  // ── Ceiling ──
  { id: "track A, left", px: [717, 57], on: [[TRACKS[0][0], TRACKS[0][3], TRACKS[0][5]], [TRACKS[0][1], TRACKS[0][3], TRACKS[0][5]]], note: "upper black track, top edge at its left end" },
  { id: "track A, right", px: [1020, 3], on: [[TRACKS[0][0], TRACKS[0][3], TRACKS[0][5]], [TRACKS[0][1], TRACKS[0][3], TRACKS[0][5]]], note: "same edge where the partition cuts it" },
  { id: "track B, mid", px: [900, 101.3], on: [[TRACKS[1][0], TRACKS[1][3], TRACKS[1][5]], [TRACKS[1][1], TRACKS[1][3], TRACKS[1][5]]], note: "lower black track at the head of the far wall" },
  { id: "track B, right", px: [1000, 84.7], on: [[TRACKS[1][0], TRACKS[1][3], TRACKS[1][5]], [TRACKS[1][1], TRACKS[1][3], TRACKS[1][5]]], note: "same edge" },

  // ── Far wall ──
  { id: "art, top-left", px: [807, 302], at: [LOUNGE.art.x0, LOUNGE.art.y1, z0 + 0.03], note: "framed print on the far wall" },
  { id: "art, bottom-right", px: [912, 460], at: [LOUNGE.art.x1, LOUNGE.art.y0, z0 + 0.03], note: "same frame" },
  { id: "lit opening", px: [965, 265], note: "top-left of the lit niche behind the counter (x 965–1020, from y 265 down). Lies on the far-wall plane; it has no proxy of its own." },

  // ── On the worktop ──
  { id: "monitor top-left", px: [755, 435], at: [M.x - M.w / 2, M.y + M.h / 2, M.z + 0.012], note: "back of the monitor" },
  { id: "monitor top-right", px: [890, 428.5], at: [M.x + M.w / 2, M.y + M.h / 2, M.z + 0.012], note: "back of the monitor" },
  { id: "monitor bottom-right", px: [902.5, 524], at: [M.x + M.w / 2, M.y - M.h / 2, M.z + 0.012], note: "back of the monitor" },
  { id: "monitor bottom-left", px: [762.5, 526], at: [M.x - M.w / 2, M.y - M.h / 2, M.z + 0.012], note: "back of the monitor" },
  { id: "pen pot rim", px: [935, 505], at: [DESK.penPot.x, C.height + DESK.penPot.h, DESK.penPot.z], note: "centre of the pen pot's rim (pot spans x 920–950)" },
  { id: "plant pot rim", px: [676, 500], at: [DESK.pot.x, C.height + DESK.pot.h, DESK.pot.z], note: "centre of the countertop plant pot's rim (pot spans x 652–700)" },
  { id: "lamp shade top", px: [1611, 449], at: [DESK.lamp.x, C.height + DESK.lamp.h, DESK.lamp.z], note: "top of the table lamp's shade (shade spans x 1567–1655)" },

  // ── Lounge ──
  { id: "sofa back, top line", px: [180, 545.5], on: [[S.x0 + 0.33, S.back, S.z0], [S.x0 + 0.33, S.back, S.z1]], note: "top of the back cushions (y 545 @ x15 … 546 @ x340)" },
  { id: "sofa arm, outer top", px: [371, 566], at: [S.x1, S.arm, S.z0], note: "far arm, its outer top corner" },
  { id: "sofa base, left", px: [205, 672], on: [[S.x1, 0.2, S.z0], [S.x1, 0.2, S.z1]], note: "underside of the seat frame" },
  { id: "sofa base, right", px: [370, 660], on: [[S.x1, 0.2, S.z0], [S.x1, 0.2, S.z1]], note: "same edge at the far arm" },
  { id: "table top, centre", px: [141, 649], at: [T.x, T.h, T.z], note: "centre of the coffee-table top ellipse (half-axes 100 × 7 px)" },
  { id: "table top, right", px: [241, 649], at: [T.x + T.r * tableSide.rx, T.h, T.z + T.r * tableSide.rz], note: "right extreme of the ellipse" },
  { id: "table base", px: [125, 730], at: [T.x + T.baseShift[0] + T.base * tableSide.tx, 0, T.z + T.baseShift[1] + T.base * tableSide.tz], note: "nearest point of the base on the floor" },
  { id: "rug front edge, left", px: [75, 785], on: [[LOUNGE.rug[3][0], 0, LOUNGE.rug[3][1]], [LOUNGE.rug[0][0], 0, LOUNGE.rug[0][1]]], note: "rug edge nearest the camera" },
  { id: "rug front edge, right", px: [582, 730], on: [[LOUNGE.rug[3][0], 0, LOUNGE.rug[3][1]], [LOUNGE.rug[0][0], 0, LOUNGE.rug[0][1]]], note: "same edge where the counter hides it" },
  { id: "rug back edge", px: [400, 702], on: [[LOUNGE.rug[0][0], 0, LOUNGE.rug[0][1]], [LOUNGE.rug[1][0], 0, LOUNGE.rug[1][1]]], note: "rug edge towards the far wall" },
  { id: "planter rim", px: [463, 588], at: [LOUNGE.planter.x, LOUNGE.planter.h, LOUNGE.planter.z], note: "centre of the floor planter's rim (pot spans x 425–502)" },
  { id: "planter base", px: [463, 676], at: [LOUNGE.planter.x + LOUNGE.planter.base * planterSide.tx, 0, LOUNGE.planter.z + LOUNGE.planter.base * planterSide.tz], note: "nearest point of the planter on the floor" },
];
