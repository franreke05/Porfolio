import { BoxGeometry, BufferAttribute, BufferGeometry, CircleGeometry, Matrix4, PlaneGeometry, SphereGeometry, Vector3 } from "three";
import { box, cyl, merge, place, rbox, slab, stick } from "./geo";
import { BAY, BAYS, COUNTER, DESK, LOUNGE, PARTITION, PENDANT, PLAQUE, PLATE_CAMERA, ROOM, SLOT, TRACKS, UNIT, WINDOWS, compartmentW, compartmentX0 } from "./layout";

/**
 * The static showroom, modelled from the blocking in layout.ts and merged
 * into one geometry per material. Architecture is built from sharp slabs;
 * everything a hand could touch is a bevelled box.
 */

export type MaterialKey =
  | "plaster"
  | "concrete"
  | "ceiling"
  | "beam"
  | "metal"
  | "graphite"
  | "oak"
  | "walnut"
  | "leather"
  | "stone"
  | "ceramic"
  | "paper"
  | "book"
  | "trunk"
  | "led"
  | "glass"
  | "pane"
  | "board"
  | "panel"
  | "alu"
  | "glow"
  | "ao";

export type LeafCluster = { at: [number, number, number]; radius: [number, number, number]; count: number; size: number };

const C = COUNTER;
export const CASE_X0 = C.posts[0];
export const CASE_X1 = C.posts[4];

/** Local x of slot `index` in a row of `count`. */
export const slotX = (count: number, index: number) => (index - (count - 1) / 2) * (SLOT.w + SLOT.gap);

export function buildModel() {
  const parts = {} as Record<MaterialKey, BufferGeometry[]>;
  const add = (key: MaterialKey, ...geometries: BufferGeometry[]) => {
    (parts[key] ??= []).push(...geometries);
  };
  const leaves: LeafCluster[] = [];
  const { x0, x1, z0, z1, height: H, wall: W } = ROOM;

  /** Fake ambient occlusion: a soft gradient strip, dark along its local +Y edge. */
  const ao = (w: number, h: number, position: [number, number, number], rotation: [number, number, number]) =>
    add("ao", place(new PlaneGeometry(w, h), position, rotation));

  /** Light spilling from an LED line: a soft additive strip, brightest along its local +Y edge. */
  const glow = (w: number, h: number, position: [number, number, number], rotation: [number, number, number] = [0, 0, 0]) =>
    add("glow", place(new PlaneGeometry(w, h), position, rotation));

  /* ── Shell ── */
  // Window wall: solid from floor to ceiling except the bays.
  let cursor: number = z0;
  [...WINDOWS.bays]
    .sort((a, b) => a.z0 - b.z0)
    .forEach((bay) => {
      if (bay.z0 > cursor) add("plaster", slab(x0 - W, x0, 0, H, cursor, bay.z0));
      if (bay.sill > 0) add("plaster", slab(x0 - W, x0, 0, bay.sill, bay.z0, bay.z1));
      add("plaster", slab(x0 - W, x0, bay.head, H, bay.z0, bay.z1));
      cursor = bay.z1;
    });
  if (z1 > cursor) add("plaster", slab(x0 - W, x0, 0, H, cursor, z1));
  add(
    "plaster",
    slab(x0 - W, x1 + W, 0, H, z0 - W, z0),
    slab(x1, x1 + W, 0, H, z0, z1),
    slab(x0 - W, x1 + W, 0, H, z1, z1 + W),
  );
  add("ceiling", slab(x0 - W, x1 + W, H, H + 0.2, z0 - W, z1 + W, 2.4));
  // No timber beam over the far end: frame 0 shows a clear ceiling there.
  for (let z = z0 + 3.25; z < z1; z += 2.4) add("beam", box(x0, x1, H - 0.16, H, z - 0.05, z + 0.05, 2.4, 0.008));

  // Exposed concrete: piers against the window wall, the lintel beam over
  // the far window, and the partition that carries the display unit.
  WINDOWS.piers.forEach(([a, b, depth]) => add("concrete", box(x0, x0 + depth, 0, H, a, b, 1.6, 0.012)));
  const lintel = WINDOWS.lintel;
  add(
    "concrete",
    box(x0, x0 + lintel.depth, lintel.y0, H, lintel.z0, lintel.z1, 1.6, 0.012),
    box(PARTITION.x0, PARTITION.x1, 0, H, PARTITION.z0, PARTITION.z1, 1.6, 0.012),
  );

  // The dark stretch of the window wall, between the near window and the first pier.
  add("panel", slab(x0, x0 + 0.03, 0, H, WINDOWS.darkWall[0], WINDOWS.darkWall[1]));

  // Where walls meet floor and ceiling the light dies off a little.
  const wallsFacingZ: Array<[number, number, number]> = [
    [x0, x1, z0 + 0.004],
    [PARTITION.x0, PARTITION.x1, PARTITION.z1 + 0.004],
  ];
  wallsFacingZ.forEach(([a, b, z]) => {
    ao(b - a, 0.34, [(a + b) / 2, 0.17, z], [0, 0, Math.PI]);
    ao(b - a, 0.6, [(a + b) / 2, H - 0.3, z], [0, 0, 0]);
  });
  ao(z1 - z0, 0.34, [x1 - 0.004, 0.17, (z0 + z1) / 2], [0, -Math.PI / 2, Math.PI]);
  ao(z1 - z0, 0.6, [x1 - 0.004, H - 0.3, (z0 + z1) / 2], [0, -Math.PI / 2, 0]);
  ao(WINDOWS.darkWall[1] - WINDOWS.darkWall[0], 0.4, [x0 + 0.034, 0.2, (WINDOWS.darkWall[0] + WINDOWS.darkWall[1]) / 2], [0, Math.PI / 2, Math.PI]);

  // Window steel: end posts, mullions and transoms on the glass line of each bay.
  const bar = WINDOWS.bar;
  WINDOWS.bays.forEach((bay) => {
    const g = bay.glass;
    const post = (z: number, w: number) => add("metal", slab(g - 0.04, g + 0.04, bay.sill, bay.head, z - w / 2, z + w / 2));
    post(bay.z0 + bay.post / 2, bay.post);
    post(bay.z1 - bay.post / 2, bay.post);
    bay.mullions.forEach((z) => post(z, bar));
    [bay.sill + bar / 2, ...bay.transoms, bay.head - bar / 2].forEach((y) =>
      add("metal", slab(g - 0.04, g + 0.04, y - bar / 2, y + bar / 2, bay.z0, bay.z1)),
    );
    add("pane", slab(g - 0.006, g + 0.006, bay.sill, bay.head, bay.z0, bay.z1));
  });

  // Black tracks under the ceiling, in front of the far wall.
  TRACKS.forEach(([a, b, c, d, e, f]) => add("metal", box(a, b, c, d, e, f)));

  /* ── Pendant ── */
  const dome = new SphereGeometry(PENDANT.radius, 36, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  dome.scale(1, PENDANT.rise, 1);
  const rimDisc = new CircleGeometry(PENDANT.radius - 0.012, 36);
  rimDisc.rotateX(Math.PI / 2);
  rimDisc.translate(0, 0.004, 0);
  // Lean about the horizontal axis square to the plate camera's line of sight.
  const sight = new Vector3(PLATE_CAMERA.look[0] - PLATE_CAMERA.eye[0], 0, PLATE_CAMERA.look[2] - PLATE_CAMERA.eye[2]).normalize();
  const lean = new Matrix4().makeRotationAxis(new Vector3(-sight.z, 0, sight.x), PENDANT.tilt);
  lean.setPosition(PENDANT.x, PENDANT.y, PENDANT.z);
  dome.applyMatrix4(lean);
  rimDisc.applyMatrix4(lean);
  const domeTop = PENDANT.y + PENDANT.radius * PENDANT.rise;
  add("metal", dome, cyl(PENDANT.x, PENDANT.z, domeTop - 0.03, domeTop + 0.11, 0.058, 0.058, 14));
  add("metal", stick([PENDANT.x, domeTop + 0.11, PENDANT.z], [PENDANT.x, H, PENDANT.z], 0.008));
  add("led", rimDisc);

  /* ── Counter ── */
  const zr = -C.recess;
  const bodyTop = C.height - C.top;
  add(
    "graphite",
    box(C.x0, C.x1, C.toe, bodyTop, -C.depth, zr),
    box(C.x0 + 0.03, C.x1 + C.wing, 0, C.toe, -C.depth + 0.03, -C.toeRecess),
    box(C.x0, CASE_X0, C.toe, bodyTop, zr, 0),
    box(CASE_X0, CASE_X1, C.toe, C.caseY0, zr, 0),
    box(CASE_X0, CASE_X1, C.caseY1, bodyTop, zr, 0),
    box(CASE_X1, C.x1, C.toe, bodyTop, zr, 0),
  );
  for (let i = 1; i < 4; i += 1) {
    const x = C.posts[i];
    add("graphite", box(x - C.divider / 2, x + C.divider / 2, C.caseY0, C.caseY1, zr, 0, 1.6, 0.004));
  }
  add("oak", box(C.x0 - C.overhang, C.x1 + C.wing, bodyTop, C.height, -C.depth - C.overhang, C.overhang, 1.6, 0.01));
  // Timber lining of the case (back and both cheeks) and the timber end section.
  add(
    "oak",
    box(CASE_X0, CASE_X1, C.plinthY1, C.caseY1, zr, zr + 0.014),
    box(CASE_X0, CASE_X0 + 0.012, C.plinthY1, C.caseY1, zr, -0.012),
    box(CASE_X1 - 0.012, CASE_X1, C.plinthY1, C.caseY1, zr, -0.012),
    box(C.x1, C.x1 + C.wing, C.toe, bodyTop, -C.depth, -0.012),
  );
  // Shade under the overhang of the worktop.
  ao(C.x1 - C.x0, 0.09, [(C.x0 + C.x1) / 2, bodyTop - 0.045, 0.003], [0, 0, 0]);
  for (let i = 0; i < 4; i += 1) {
    const a = compartmentX0(i);
    const w = compartmentW(i);
    const cx = a + w / 2;
    add("graphite", box(a, a + w, C.caseY0, C.plinthY1, zr, -0.008, 1.6, 0.004));
    add("led", slab(a + 0.03, a + w - 0.03, C.caseY1 - 0.014, C.caseY1, -0.06, -0.035));
    add("glass", slab(a, a + w, C.plinthY1, C.caseY1, -0.011, -0.002));
    glow(w - 0.06, 0.3, [cx, C.caseY1 - 0.16, zr + 0.017]);
    // Clear acrylic easel behind the inclined cover (the printed face is its own mesh).
    add("glass", place(new BoxGeometry(C.plate.boards[i].w + 0.06, C.plate.h + 0.04, 0.01), coverPlate(i).position, coverPlate(i).rotation));
  }

  // On the counter: monitor (seen from behind), small box, pen pot, plant, lamp, books.
  const top = C.height;
  const M = DESK.monitor;
  add(
    "alu",
    box(M.x - M.w / 2, M.x + M.w / 2, M.y - M.h / 2, M.y + M.h / 2, M.z - 0.012, M.z + 0.012, 1.6, 0.008),
    place(box(-0.08, 0.08, -0.13, 0.13, -0.008, 0.008, 1.6, 0.004), [M.x - 0.06, top + 0.12, M.z + 0.04], [-0.3, 0, 0]),
    box(M.x - 0.2, M.x + 0.08, top, top + 0.012, M.z - 0.06, M.z + 0.12),
  );
  const pen = DESK.penPot;
  add(
    "metal",
    cyl(pen.x, pen.z, top, top + pen.h, pen.r, pen.r * 0.92, 16),
    stick([pen.x - 0.01, top + pen.h - 0.02, pen.z], [pen.x - 0.03, top + pen.h + 0.07, pen.z - 0.01], 0.004),
    stick([pen.x + 0.01, top + pen.h - 0.02, pen.z], [pen.x + 0.03, top + pen.h + 0.06, pen.z + 0.01], 0.004),
    box(DESK.box.x0, DESK.box.x1, top, top + DESK.box.h, DESK.box.z - 0.06, DESK.box.z + 0.06),
    cyl(DESK.dish.x, DESK.dish.z, top, top + DESK.dish.h, DESK.dish.r, DESK.dish.r * 0.8, 20),
  );
  lamp(add, DESK.lamp.x, top, DESK.lamp.z, DESK.lamp.h);
  add("paper", box(DESK.books.x0, DESK.books.x1, top, top + DESK.books.h, DESK.books.z - 0.1, DESK.books.z + 0.1, 1.6, 0.003));
  add("book", box(DESK.uprightBooks.x0, DESK.uprightBooks.x1, top, top + DESK.uprightBooks.h, DESK.uprightBooks.z - 0.08, DESK.uprightBooks.z + 0.08, 1.6, 0.003));
  const pot = DESK.pot;
  add("ceramic", cyl(pot.x, pot.z, top, top + pot.h, pot.r, pot.r * 0.8, 24));
  tree(add, leaves, [pot.x, top + pot.h, pot.z], 0.5, 0.32, 300, 0.05);

  /* ── Wood display unit ── */
  const U = UNIT;
  const uz = PARTITION.z1;
  const uf = uz + U.shelfDepth;
  add(
    "walnut",
    box(U.x0, U.x1, U.y0, U.y1, uz, uz + U.panel),
    box(U.x1 - 0.05, U.x1, U.y0, U.y1, uz + U.panel, uf),
    box(U.x0 + 0.05, U.x1 - 0.05, U.y0, U.y0 + 0.05, uz + U.panel, uf),
    box(U.x0 + 0.05, U.x1 - 0.05, U.headerY0, U.y1, uz + U.panel, uz + U.panel + 0.05),
  );
  U.uprights.forEach((x, index) =>
    add("metal", box(x, x + U.upright, 0, index === 0 ? U.y1 - U.uprightDrop : U.headerY0 - 0.06, uz, uf + 0.012, 1.6, 0.004)),
  );
  glow(U.x1 - U.x0 - 0.2, 0.42, [(U.x0 + U.x1) / 2, U.headerY0 - 0.21, uz + U.panel + 0.004]);
  // Late sun raking the header band.
  glow(U.x1 - U.x0 - 0.1, U.y1 - U.headerY0 - 0.05, [(U.x0 + U.x1) / 2, (U.headerY0 + U.y1 - 0.05) / 2, uz + U.panel + 0.054]);
  U.shelves.forEach((y) => glow(U.x1 - U.x0 - 0.2, 0.3, [(U.x0 + U.x1) / 2, y - 0.15, uz + U.panel + 0.004]));
  add("led", slab(U.x0 + 0.1, U.x1 - 0.1, U.headerY0 - 0.014, U.headerY0, uz + U.panel + 0.01, uz + U.panel + 0.04));
  U.shelves.forEach((y) => {
    add("walnut", box(U.x0 + 0.05, U.x1 - 0.05, y, y + U.shelf, uz + U.panel, uf - 0.01, 1.6, 0.008));
    add("led", slab(U.x0 + 0.1, U.x1 - 0.1, y - 0.012, y, uz + U.panel + 0.02, uz + U.panel + 0.05));
  });
  const short = U.shortShelf;
  add("walnut", box(short.x0, short.x1, short.y, short.y + 0.04, uz + U.panel, uf - 0.02, 1.6, 0.008));
  ao(U.x1 - U.x0, 0.24, [(U.x0 + U.x1) / 2, U.y0 - 0.12, uz + 0.005], [0, 0, 0]);
  const upper = U.shelves[U.shelves.length - 1] + U.shelf;
  U.boards.forEach((x) =>
    add("board", place(new BoxGeometry(U.board.w, U.board.h, 0.014), [x, upper + U.board.h / 2 + 0.002, uz + 0.225], [-U.board.lean, 0, 0])),
  );
  // Small pot on the long shelf, hanging plant on the short one.
  add("ceramic", cyl(1.81, uz + 0.18, upper, upper + 0.12, 0.06, 0.05, 20));
  leaves.push({ at: [1.81, upper + 0.2, uz + 0.18], radius: [0.12, 0.1, 0.1], count: 70, size: 0.04 });
  add("ceramic", cyl(1.72, uz + 0.17, short.y + 0.04, short.y + 0.16, 0.07, 0.055, 20));
  leaves.push({ at: [1.7, short.y + 0.26, uz + 0.2], radius: [0.16, 0.14, 0.12], count: 90, size: 0.045 });
  // It trails over the shelf edge, as a hanging plant does.
  leaves.push({ at: [1.65, short.y - 0.3, uz + 0.28], radius: [0.1, 0.36, 0.06], count: 110, size: 0.04 });

  /* ── Category bays: cabinets standing proud of the right wall ── */
  const D = BAY.depth;
  const wb = (key: MaterialKey, d0: number, d1: number, y0: number, y1: number, a: number, b: number, bevel = 0.006) =>
    add(key, box(x1 - d1, x1 - d0, y0, y1, a, b, 1.6, bevel));
  BAYS.forEach((bay, index) => {
    const a = bay.z - bay.w / 2;
    const b = bay.z + bay.w / 2;
    const fasciaY0 = BAY.signY - 0.16;
    wb("walnut", 0, 0.02, BAY.y0, BAY.y1, a, b);
    wb("walnut", 0.02, D, BAY.y0, BAY.y1, a, a + 0.045);
    wb("walnut", 0.02, D, BAY.y0, BAY.y1, b - 0.045, b);
    wb("walnut", 0.02, D, BAY.y1 - 0.045, BAY.y1, a + 0.045, b - 0.045);
    wb("walnut", 0.02, D, BAY.y0, BAY.y0 + 0.045, a + 0.045, b - 0.045);
    wb("walnut", D - BAY.face, D, fasciaY0, BAY.y1 - 0.045, a + 0.045, b - 0.045);
    wb("graphite", D, D + 0.03, BAY.signY - 0.105, BAY.signY + 0.105, a + 0.14, b - 0.14, 0.004);
    add("led", slab(x1 - D + 0.035, x1 - D + 0.06, fasciaY0 - 0.012, fasciaY0, a + 0.1, b - 0.1));
    ao(bay.w, 0.22, [x1 - 0.005, BAY.y0 - 0.11, bay.z], [0, -Math.PI / 2, 0]);

    if (index !== 3) {
      wb("walnut", 0.02, D - 0.01, 1.31, 1.35, a + 0.045, b - 0.045);
      const spots = index === 1 ? [-0.3, 0.3] : [index === 0 ? -0.25 : 0.2];
      spots.forEach((offset) =>
        add("board", place(new BoxGeometry(0.32, 0.48, 0.012), [x1 - 0.1, 1.35 + 0.238, bay.z + offset], [-0.1, -Math.PI / 2, 0])),
      );
      return;
    }

    // The catalogue front: one thick wood face with seven real openings.
    const rows = [
      { y: SLOT.rowY[0], xs: [0, 1, 2, 3].map((i) => slotX(4, i)) },
      { y: SLOT.rowY[1], xs: [0, 1, 2].map((i) => slotX(3, i)) },
    ];
    const hw = SLOT.w / 2;
    const hh = SLOT.h / 2;
    const face = (y0: number, y1: number, la: number, lb: number) => wb("walnut", D - BAY.face, D, y0, y1, bay.z + la, bay.z + lb, 0.004);
    const left = -bay.w / 2 + 0.045;
    const right = bay.w / 2 - 0.045;
    face(rows[0].y + hh, fasciaY0, left, right);
    face(rows[1].y + hh, rows[0].y - hh, left, right);
    face(BAY.y0 + 0.045, rows[1].y - hh, left, right);
    rows.forEach((row) => {
      let from = left;
      row.xs.forEach((x) => {
        face(row.y - hh, row.y + hh, from, x - hw);
        from = x + hw;
      });
      face(row.y - hh, row.y + hh, from, right);
    });
  });

  // Closing plaque: the contact details as physical signage.
  const P = PLAQUE;
  add("graphite", box(x1 - P.depth, x1, P.y - P.size / 2, P.y + P.size / 2, P.z - P.size / 2, P.z + P.size / 2, 1.6, 0.005));
  ao(P.size + 0.1, 0.16, [x1 - 0.004, P.y - P.size / 2 - 0.08, P.z], [0, -Math.PI / 2, 0]);

  /* ── Lounge ── */
  const S = LOUNGE.sofa;
  const cushions = 3;
  const span = (S.z1 - S.z0 - 2 * S.armWidth) / cushions;
  add(
    "leather",
    rbox(S.x0, S.x1, 0.2, S.seat - 0.14, S.z0, S.z1, 0.04),
    rbox(S.x0, S.x1 + 0.01, 0.2, S.arm, S.z0, S.z0 + S.armWidth, 0.06),
    rbox(S.x0, S.x1 + 0.01, 0.2, S.arm, S.z1 - S.armWidth, S.z1, 0.06),
    rbox(S.x0, S.x0 + 0.22, 0.2, S.back - 0.08, S.z0 + S.armWidth - 0.02, S.z1 - S.armWidth + 0.02, 0.06),
  );
  for (let i = 0; i < cushions; i += 1) {
    const a = S.z0 + S.armWidth + i * span;
    add("leather", rbox(S.x0 + 0.2, S.x1 + 0.02, S.seat - 0.15, S.seat, a + 0.006, a + span - 0.006, 0.055));
    add("leather", place(rbox(-0.11, 0.11, -0.27, 0.27, -span / 2 + 0.012, span / 2 - 0.012, 0.07), [S.x0 + 0.33, S.back - 0.27, a + span / 2], [0, 0, -0.16]));
  }
  [
    [S.x0 + 0.06, S.z0 + 0.06],
    [S.x1 - 0.06, S.z0 + 0.06],
    [S.x0 + 0.06, S.z1 - 0.06],
    [S.x1 - 0.06, S.z1 - 0.06],
  ].forEach(([x, z]) => add("metal", cyl(x, z, 0, 0.2, 0.016, 0.012, 10)));

  const T = LOUNGE.table;
  add("stone", cyl(T.x, T.z, T.h - 0.07, T.h, T.r, T.r - 0.012, 48), cyl(T.x + T.baseShift[0], T.z + T.baseShift[1], 0, T.h - 0.07, T.base, T.base * 1.04, 40));
  add("ceramic", cyl(T.x - 0.17, T.z + 0.11, T.h, T.h + 0.17, 0.11, 0.09, 20));
  leaves.push({ at: [T.x - 0.17, T.h + 0.3, T.z + 0.11], radius: [0.2, 0.16, 0.2], count: 150, size: 0.04 });

  // Tall planter with an olive-like tree, by the first pier.
  const L = LOUNGE.planter;
  add("concrete", cyl(L.x, L.z, 0, L.h, L.r, L.base, 32));
  tree(add, leaves, [L.x, L.h - 0.02, L.z], 0.9, 0.5, 420, 0.055);

  // Far wall: one framed print, to give the back wall scale.
  const A = LOUNGE.art;
  const fz = z0 + 0.03;
  const am = (A.x0 + A.x1) / 2;
  add(
    "oak",
    slab(A.x0, A.x1, A.y0, A.y0 + 0.03, z0, fz),
    slab(A.x0, A.x1, A.y1 - 0.03, A.y1, z0, fz),
    slab(A.x0, A.x0 + 0.03, A.y0, A.y1, z0, fz),
    slab(A.x1 - 0.03, A.x1, A.y0, A.y1, z0, fz),
  );
  add("paper", slab(A.x0 + 0.03, A.x1 - 0.03, A.y0 + 0.03, A.y1 - 0.03, z0, z0 + 0.012));
  add("ceramic", slab(am - 0.25, am + 0.25, A.y0 + 0.45, A.y1 - 0.45, z0 + 0.012, z0 + 0.016));

  const merged = {} as Record<MaterialKey, BufferGeometry>;
  (Object.keys(parts) as MaterialKey[]).forEach((key) => {
    merged[key] = merge(parts[key]);
  });
  return { geometries: merged, leaves };
}

/** Pose of the inclined cover plate inside compartment i (centre of the plate). */
export function coverPlate(index: number) {
  const { h, lean, boards } = COUNTER.plate;
  const board = boards[index];
  return {
    position: [board.x + board.skew / 2, COUNTER.plinthY1 + 0.012 + (h / 2) * Math.cos(lean), board.z - (h / 2) * Math.sin(lean)] as [number, number, number],
    rotation: [-lean, 0, 0] as [number, number, number],
  };
}

/** The printed face of cover plate i, in world space: a quad on the plate's own board (see COUNTER.plate). */
export function coverQuad(index: number): BufferGeometry {
  const { h, lean, boards } = COUNTER.plate;
  const { x, z, w, skew } = boards[index];
  const lift = 0.007;
  const y0 = COUNTER.plinthY1 + 0.012 + lift * Math.sin(lean);
  const z0 = z + lift * Math.cos(lean);
  const y1 = y0 + h * Math.cos(lean);
  const z1 = z0 - h * Math.sin(lean);
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array([x - w / 2, y0, z0, x + w / 2, y0, z0, x + w / 2 + skew, y1, z1, x - w / 2 + skew, y1, z1]), 3),
  );
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.computeVertexNormals();
  return geometry;
}

type Add = (key: MaterialKey, ...geometries: BufferGeometry[]) => void;

/** Slim table lamp: disc base, stem, small dark shade with a warm underside. */
function lamp(add: Add, x: number, y: number, z: number, height: number) {
  add(
    "metal",
    cyl(x, z, y, y + 0.014, 0.07, 0.075, 24),
    stick([x, y + 0.014, z], [x, y + height - 0.08, z], 0.007),
    cyl(x, z, y + height - 0.09, y + height, 0.07, 0.13, 28),
  );
  add("led", place(new CircleGeometry(0.118, 24), [x, y + height - 0.088, z], [Math.PI / 2, 0, 0]));
}

/** Thin trunk, a few branches and an airy crown of small leaves. */
function tree(add: Add, leaves: LeafCluster[], base: [number, number, number], height: number, crown: number, count: number, size: number) {
  const [x, y, z] = base;
  const fork: [number, number, number] = [x + 0.03, y + height * 0.55, z - 0.02];
  add("trunk", stick(base, fork, 0.012 + height * 0.005));
  const tips: Array<[number, number, number]> = [
    [x - crown * 0.5, y + height * 0.95, z + crown * 0.25],
    [x + crown * 0.45, y + height * 1.05, z - crown * 0.3],
    [x + crown * 0.1, y + height * 1.2, z + crown * 0.4],
    [x - crown * 0.15, y + height * 1.12, z - crown * 0.45],
  ];
  tips.forEach((tip) => add("trunk", stick(fork, tip, 0.006 + height * 0.0025)));
  const share = Math.floor(count / (tips.length + 1));
  tips.forEach((tip) => leaves.push({ at: tip, radius: [crown * 0.6, crown * 0.5, crown * 0.6], count: share, size }));
  leaves.push({ at: [x, y + height * 0.98, z], radius: [crown * 0.75, crown * 0.6, crown * 0.75], count: share, size });
}
