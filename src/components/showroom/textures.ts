import { CanvasTexture, LinearFilter, MirroredRepeatWrapping, RepeatWrapping, SRGBColorSpace, Texture } from "three";
import { CATEGORIES, CONTACT_ROWS, COPYRIGHT, SLOT_PROJECTS } from "./content";

/**
 * Every surface and every letter of the showroom is drawn here, once, on
 * small canvases; the lettering uses the fonts the page has already loaded.
 *
 * The main materials take their grain from the golden plate itself
 * (public/showroom/*.webp: patches of the plate rectified through
 * PLATE_CAMERA, their lighting divided out and re-centred on the neutral
 * albedo of the canvas they replace), so what the plate projection does not
 * cover is made of the same oak, graphite and concrete. A tile that fails to
 * load falls back to its canvas.
 */

export const PLATE_TILES = ["oak", "floor-concrete", "graphite", "concrete", "sun-light"] as const;
export type PlateTile = (typeof PLATE_TILES)[number];
export type PlateTiles = Partial<Record<PlateTile, HTMLImageElement | null>>;

/** A plate-derived tile, mirrored on repeat so it needs no seam work; `fallback` when it did not load. */
function photo(image: HTMLImageElement | null | undefined, fallback: () => Texture, repeatX: number, repeatY: number, color = true): Texture {
  if (!image) return fallback();
  const texture = new Texture(image);
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = MirroredRepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  if (color) texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export type Fonts = { sans: string; serif: string };

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

function canvas(width: number, height: number) {
  const element = document.createElement("canvas");
  element.width = width;
  element.height = height;
  const ctx = element.getContext("2d") as CanvasRenderingContext2D;
  return { element, ctx };
}

function tiled(element: HTMLCanvasElement, repeatX = 1, repeatY = 1, color = true): CanvasTexture {
  const texture = new CanvasTexture(element);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  if (color) texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function flat(element: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(element);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/** Soft blobs that wrap around the edges, so the canvas tiles seamlessly. */
function blobs(ctx: CanvasRenderingContext2D, size: number, count: number, random: () => number, tones: string[], radius: [number, number], alpha: number) {
  if (alpha <= 0) return;
  for (let i = 0; i < count; i += 1) {
    const x = random() * size;
    const y = random() * size;
    const r = radius[0] + random() * (radius[1] - radius[0]);
    const tone = tones[Math.floor(random() * tones.length)];
    for (let ox = -1; ox <= 1; ox += 1) {
      for (let oy = -1; oy <= 1; oy += 1) {
        const cx = x + ox * size;
        const cy = y + oy * size;
        if (cx + r < 0 || cx - r > size || cy + r < 0 || cy - r > size) continue;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, tone);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    }
  }
  ctx.globalAlpha = 1;
}

function speckle(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number, random: () => number) {
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (random() - 0.5) * amount;
    data[i] += n;
    data[i + 1] += n;
    data[i + 2] += n;
  }
  ctx.putImageData(image, 0, 0);
}

/** Mineral surface: `clouds` controls the large mottling, `grain` the fine speckle. */
function mineral(seed: number, base: string, light: string, dark: string, grain: number, clouds: number) {
  const size = 512;
  const { element, ctx } = canvas(size, size);
  const random = rng(seed);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  blobs(ctx, size, 46, random, [light, dark], [50, 170], 0.13 * clouds);
  blobs(ctx, size, 180, random, [light, dark], [4, 22], 0.09 * clouds);
  speckle(ctx, size, size, grain, random);
  return element;
}

/** Soft, low-contrast grain. `tone` true = colour map, false = roughness map. */
function wood(seed: number, tone: boolean) {
  const size = 512;
  const { element, ctx } = canvas(size, size);
  const random = rng(seed);
  ctx.fillStyle = tone ? "#9a8474" : "#c2c2c2";
  ctx.fillRect(0, 0, size, size);
  const plank = size / 3;
  (tone ? ["rgba(70,50,32,0.12)", "rgba(255,226,190,0.08)", "rgba(60,42,28,0.06)"] : ["rgba(0,0,0,0.05)", "rgba(255,255,255,0.06)", "rgba(0,0,0,0.02)"]).forEach(
    (fill, index) => {
      ctx.fillStyle = fill;
      ctx.fillRect(0, index * plank, size, plank);
    },
  );
  for (let i = 0; i < 260; i += 1) {
    const y = random() * size;
    const amp = 1 + random() * 3;
    const cycles = 1 + Math.floor(random() * 3);
    const phase = random() * Math.PI * 2;
    ctx.beginPath();
    for (let x = 0; x <= size; x += 8) {
      const yy = y + Math.sin((x / size) * Math.PI * 2 * cycles + phase) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.lineWidth = 0.5 + random() * 1.6;
    const dark = random() > 0.35;
    const alpha = 0.025 + random() * 0.07;
    ctx.strokeStyle = tone ? (dark ? `rgba(58,40,26,${alpha * 1.5})` : `rgba(255,226,186,${alpha})`) : dark ? `rgba(255,255,255,${alpha * 1.4})` : `rgba(0,0,0,${alpha * 1.4})`;
    ctx.stroke();
  }
  // Darker joints between planks.
  ctx.fillStyle = tone ? "rgba(46,34,22,0.3)" : "rgba(255,255,255,0.3)";
  for (let i = 0; i < 3; i += 1) ctx.fillRect(0, i * plank, size, 1.1);
  speckle(ctx, size, size, tone ? 7 : 12, random);
  return element;
}

function graphite(seed: number) {
  const size = 256;
  const { element, ctx } = canvas(size, size);
  const random = rng(seed);
  ctx.fillStyle = "#77777a";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 520; i += 1) {
    ctx.fillStyle = random() > 0.5 ? `rgba(255,255,255,${random() * 0.028})` : `rgba(0,0,0,${random() * 0.035})`;
    ctx.fillRect(0, random() * size, size, 0.6 + random() * 1.4);
  }
  speckle(ctx, size, size, 10, random);
  return element;
}

function rug(seed: number) {
  const size = 256;
  const { element, ctx } = canvas(size, size);
  const random = rng(seed);
  ctx.fillStyle = "#d9cfbf";
  ctx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const even = ((x + y) / 4) % 2 === 0;
      ctx.fillStyle = even ? `rgba(255,250,238,${0.2 + random() * 0.2})` : `rgba(110,94,72,${0.1 + random() * 0.14})`;
      ctx.fillRect(x, y, even ? 4 : 3, even ? 2 : 4);
    }
  }
  blobs(ctx, size, 26, random, ["#efe8da", "#b9ab93"], [20, 70], 0.14);
  speckle(ctx, size, size, 22, random);
  return element;
}

/* ───────────────────────────── exterior ───────────────────────────── */

function softEllipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, tone: string, alpha: number, core = 0.5) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ry / rx);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  gradient.addColorStop(0, tone);
  gradient.addColorStop(core, tone);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
  ctx.restore();
}

/** The far street: pale sky, sunlit brick masses with window rows, out of focus. */
function exteriorFar(seed: number) {
  const w = 1024;
  const h = 512;
  const sharp = canvas(w, h);
  const random = rng(seed);
  const s = sharp.ctx;
  const sky = s.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#b4d2ea");
  sky.addColorStop(0.3, "#e6e6dc");
  sky.addColorStop(0.62, "#f6dcae");
  sky.addColorStop(0.8, "#c9a376");
  sky.addColorStop(1, "#7d6548");
  s.fillStyle = sky;
  s.fillRect(0, 0, w, h);
  let x = -40;
  while (x < w) {
    const bw = 110 + random() * 150;
    const top = 70 + random() * 150;
    const lit = random() > 0.45;
    s.fillStyle = lit ? ["#dcb092", "#e2b998", "#d2a284"][Math.floor(random() * 3)] : ["#b99078", "#ad8874"][Math.floor(random() * 2)];
    s.fillRect(x, top, bw, h - top);
    for (let wy = top + 22; wy < 400; wy += 38) {
      for (let wx = x + 14; wx < x + bw - 18; wx += 30) {
        s.fillStyle = random() > 0.35 ? "rgba(60,48,44,0.55)" : "rgba(255,232,190,0.75)";
        s.fillRect(wx, wy, 14, 22);
      }
    }
    x += bw + (random() > 0.6 ? 30 + random() * 60 : 0);
  }
  s.fillStyle = "rgba(104,86,62,0.9)";
  s.fillRect(0, 410, w, h - 410);

  const out = canvas(w, h);
  const o = out.ctx;
  if ("filter" in o) o.filter = "blur(2.5px)";
  o.drawImage(sharp.element, 0, 0);
  if ("filter" in o) o.filter = "none";
  // Low sun haze over the roofs.
  softEllipse(o, w * 0.5, 170, 520, 190, "#fff3d6", 0.4, 0.3);
  const texture = flat(out.element);
  texture.wrapS = RepeatWrapping;
  return texture;
}

/** Foliage close to the glass: backlit green-gold canopies on a transparent sheet. */
function exteriorNear(seed: number) {
  const w = 1024;
  const h = 512;
  const { element, ctx } = canvas(w, h);
  const random = rng(seed);
  const tones = ["#c9a74e", "#e3c069", "#f0d27c", "#a88c40", "#f6de98", "#d6b458"];
  for (let tree = 0; tree < 9; tree += 1) {
    const cx = (tree / 9) * w + random() * 80;
    const cy = 90 + random() * 150;
    const spread = 90 + random() * 70;
    ctx.fillStyle = "rgba(70,52,36,0.5)";
    ctx.fillRect(cx - 5, cy + 30, 10, h - cy);
    for (let i = 0; i < 90; i += 1) {
      const angle = random() * Math.PI * 2;
      const reach = Math.sqrt(random()) * spread;
      softEllipse(ctx, cx + Math.cos(angle) * reach * 1.25, cy + Math.sin(angle) * reach * 0.8, 10 + random() * 22, 8 + random() * 18, tones[Math.floor(random() * tones.length)], 0.5 + random() * 0.35, 0.45);
    }
  }
  const texture = flat(element);
  texture.wrapS = RepeatWrapping;
  return texture;
}

/* ───────────────────────────── lettering ───────────────────────────── */

function tracked(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, tracking: number, align: "left" | "center" = "left") {
  const widths = [...text].map((char) => ctx.measureText(char).width + tracking);
  const total = widths.reduce((sum, value) => sum + value, 0) - tracking;
  let cursor = align === "center" ? x - total / 2 : x;
  [...text].forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += widths[index];
  });
}

const CREAM = "#f3ead8";
const SAND = "#f2b961";

function arrowGlyph(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  const a = r * 0.4;
  ctx.beginPath();
  ctx.moveTo(x - a, y + a);
  ctx.lineTo(x + a, y - a);
  ctx.moveTo(x - a * 0.5, y - a);
  ctx.lineTo(x + a, y - a);
  ctx.lineTo(x + a, y + a * 0.5);
  ctx.stroke();
}

function plinthLabel(lines: [string, string], fonts: Fonts) {
  const w = 640;
  const h = 264;
  const { element, ctx } = canvas(w, h);
  ctx.fillStyle = CREAM;
  ctx.textBaseline = "alphabetic";
  ctx.font = `500 46px ${fonts.sans}`;
  ctx.fillText(lines[0], 96, 78);
  ctx.font = `400 38px ${fonts.sans}`;
  ctx.globalAlpha = 0.88;
  ctx.fillText(lines[1], 96, 126);
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = CREAM;
  ctx.lineWidth = 2.5;
  arrowGlyph(ctx, 116, 190, 20);
  return flat(element);
}

function lettering(text: string, fonts: Fonts, options: { w: number; h: number; size: number; tracking: number; color: string; weight?: number }) {
  const { element, ctx } = canvas(options.w, options.h);
  ctx.fillStyle = options.color;
  ctx.textBaseline = "middle";
  ctx.font = `${options.weight ?? 500} ${options.size}px ${fonts.sans}`;
  tracked(ctx, text, options.w / 2, options.h / 2 + 2, options.tracking, "center");
  return flat(element);
}

/** The closing plaque: wordmark, CTA, contact details, links, copyright. */
function contactPlaque(fonts: Fonts) {
  const size = 1024;
  const { element, ctx } = canvas(size, size);
  const left = 112;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = CREAM;
  ctx.font = `300 76px ${fonts.sans}`;
  tracked(ctx, "ORYKAI", left, 170, 24);
  ctx.font = `500 22px ${fonts.sans}`;
  ctx.globalAlpha = 0.85;
  tracked(ctx, "SOFTWARE", left + 6, 216, 15);
  ctx.globalAlpha = 0.3;
  ctx.fillRect(left, 268, size - left * 2, 1.5);
  CONTACT_ROWS.forEach((row) => {
    ctx.globalAlpha = row.kind === "link" ? 0.9 : 1;
    ctx.fillStyle = row.kind === "cta" ? SAND : CREAM;
    ctx.font = `${row.kind === "cta" ? 500 : 400} ${row.size}px ${row.kind === "cta" ? fonts.serif : fonts.sans}`;
    ctx.fillText(row.label, left, row.row);
    if (row.kind === "cta") {
      ctx.strokeStyle = SAND;
      ctx.lineWidth = 2.5;
      arrowGlyph(ctx, left + ctx.measureText(row.label).width + 44, row.row - 16, 21);
    }
  });
  ctx.fillStyle = CREAM;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(left, 908, size - left * 2, 1.5);
  ctx.globalAlpha = 0.6;
  ctx.font = `400 21px ${fonts.sans}`;
  tracked(ctx, COPYRIGHT, left, 956, 2);
  return flat(element);
}

/** Placeholder: a white board with a very thin X. */
function placeholder(w = 256, h = 384) {
  const { element, ctx } = canvas(w, h);
  ctx.fillStyle = "#f2efe8";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(60,50,40,0.36)";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(w - 10, h - 10);
  ctx.moveTo(w - 10, 10);
  ctx.lineTo(10, h - 10);
  ctx.stroke();
  ctx.strokeRect(9.5, 9.5, w - 19, h - 19);
  return flat(element);
}

/** Vertical falloff used by the fake ambient-occlusion strips (dark at v = 1). */
function occlusion() {
  const { element, ctx } = canvas(8, 64);
  // Read through alphaMap (green channel): white = opaque, on a black ground.
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 8, 64);
  const gradient = ctx.createLinearGradient(0, 0, 0, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.42)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 8, 64);
  return new CanvasTexture(element);
}

/**
 * Late sun through a gridded window, as it lands on a wall: slanted panes of
 * light split by mullion shadows and dappled by the street trees. Used as an
 * additive decal where the plate shows streaks the single sun cannot reach.
 */
function sunPatch(seed: number) {
  const size = 256;
  const sharp = canvas(size, size);
  const random = rng(seed);
  const s = sharp.ctx;
  s.fillStyle = "#000000";
  s.fillRect(0, 0, size, size);
  const cols = 3;
  const rows = 4;
  const cw = 58;
  const ch = 52;
  for (let c = 0; c < cols; c += 1) {
    for (let r = 0; r < rows; r += 1) {
      const x = 44 + c * (cw + 10);
      const y = 14 + r * (ch + 7) + c * 9;
      const level = (0.45 + 0.55 * ((c + 1) / cols)) * (0.75 + random() * 0.25);
      s.fillStyle = "rgba(255,255,255," + level.toFixed(3) + ")";
      s.beginPath();
      s.moveTo(x, y + 12);
      s.lineTo(x + cw, y);
      s.lineTo(x + cw, y + ch);
      s.lineTo(x, y + ch + 12);
      s.closePath();
      s.fill();
    }
  }
  // Leaf shadows.
  for (let i = 0; i < 26; i += 1) softEllipse(s, random() * size, random() * size, 14 + random() * 30, 10 + random() * 22, "#000000", 0.2 + random() * 0.3, 0.1);
  const out = canvas(size, size);
  out.ctx.fillStyle = "#000000";
  out.ctx.fillRect(0, 0, size, size);
  if ("filter" in out.ctx) out.ctx.filter = "blur(2.2px)";
  out.ctx.drawImage(sharp.element, 0, 0);
  const texture = new CanvasTexture(out.element);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export type ShowroomTextures = ReturnType<typeof createTextures>;

export function createTextures(fonts: Fonts, tiles: PlateTiles = {}) {
  return {
    floor: photo(tiles["floor-concrete"], () => tiled(mineral(11, "#dcd4c8", "#ece4d8", "#b8b0a4", 12, 0.9), 3.5, 3), 9, 18),
    floorRough: tiled(mineral(12, "#6e6e6e", "#a4a4a4", "#3e3e3e", 26, 1), 3.5, 3, false),
    concrete: photo(tiles.concrete, () => tiled(mineral(13, "#aaa399", "#c2bbb0", "#89837a", 22, 1), 1, 1), 1.6, 0.5),
    plaster: tiled(mineral(14, "#e8e1d4", "#e8e1d4", "#e8e1d4", 7, 0), 1, 1),
    mottle: tiled(mineral(15, "#b4b4b4", "#dedede", "#868686", 24, 1), 1, 1, false),
    wood: photo(tiles.oak, () => tiled(wood(21, true), 1, 1), 1, 4),
    woodRough: tiled(wood(21, false), 1, 1, false),
    graphite: photo(tiles.graphite, () => tiled(graphite(31), 1, 1), 1.2, 3),
    rug: tiled(rug(41), 5, 6),
    exteriorFar: exteriorFar(51),
    exteriorNear: exteriorNear(52),
    plinths: CATEGORIES.map((category) => plinthLabel(category.lines, fonts)),
    signs: CATEGORIES.map((category) => lettering(category.name, fonts, { w: 1024, h: 96, size: 40, tracking: 3, color: CREAM, weight: 400 })),
    header: lettering("NUESTROS PRODUCTOS", fonts, { w: 1024, h: 80, size: 38, tracking: 15, color: "#efe4d0", weight: 400 }),
    labels: SLOT_PROJECTS.map((project) => lettering(project.name, fonts, { w: 512, h: 80, size: 40, tracking: 1.5, color: CREAM, weight: 500 })),
    contact: contactPlaque(fonts),
    placeholder: placeholder(),
    placeholderWide: placeholder(384, 288),
    occlusion: occlusion(),
    sunPatch: photo(tiles["sun-light"], () => sunPatch(61), 1, 1),
  };
}

export function disposeTextures(textures: ShowroomTextures) {
  const walk = (value: Texture | Texture[]) => {
    if (Array.isArray(value)) value.forEach((item) => item.dispose());
    else value.dispose();
  };
  Object.values(textures).forEach(walk);
}
