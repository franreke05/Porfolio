import { BoxGeometry, BufferGeometry, CylinderGeometry, Euler, Matrix4, Quaternion, Vector3 } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Modelling helpers. The room is built from boxes given as min/max extents
 * in metres and merged per material, so a whole wall, the counter carcass or
 * every window mullion costs a single draw call.
 */

const TILE = 1.6; // metres covered by one texture tile

/** Sharp axis-aligned box (walls, mullions): cheapest, UVs in world scale. */
export function slab(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, tile = TILE): BufferGeometry {
  const w = Math.abs(x1 - x0);
  const h = Math.abs(y1 - y0);
  const d = Math.abs(z1 - z0);
  const geometry = new BoxGeometry(w, h, d);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i += 1) {
    const face = Math.floor(i / 4);
    const su = face < 2 ? d : w;
    const sv = face === 2 || face === 3 ? d : h;
    // Offset by position so neighbouring boxes do not repeat the same patch.
    uv.setXY(i, (uv.getX(i) * su + x0 * 0.37 + z0 * 0.21) / tile, (uv.getY(i) * sv + y0 * 0.29) / tile);
  }
  geometry.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return geometry;
}

/** Planar UVs in metres, picked per vertex from its dominant normal axis. */
function worldUV(geometry: BufferGeometry, tile: number) {
  const p = geometry.attributes.position;
  const n = geometry.attributes.normal;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < p.count; i += 1) {
    const ax = Math.abs(n.getX(i));
    const ay = Math.abs(n.getY(i));
    const az = Math.abs(n.getZ(i));
    if (ax >= ay && ax >= az) uv.setXY(i, p.getZ(i) / tile, p.getY(i) / tile);
    else if (ay >= az) uv.setXY(i, p.getX(i) / tile, p.getZ(i) / tile);
    else uv.setXY(i, p.getX(i) / tile, p.getY(i) / tile);
  }
}

/**
 * Furniture box: every hard edge carries a tiny bevel so it catches a
 * highlight instead of ending in a razor-sharp CG corner.
 */
export function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, tile = TILE, bevel = 0.006): BufferGeometry {
  const w = Math.abs(x1 - x0);
  const h = Math.abs(y1 - y0);
  const d = Math.abs(z1 - z0);
  const radius = Math.min(bevel, Math.min(w, h, d) / 2.6);
  const geometry = new RoundedBoxGeometry(w, h, d, 2, radius);
  geometry.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  worldUV(geometry, tile);
  return geometry;
}

/** Soft-edged box (upholstery, cushions). */
export function rbox(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, radius = 0.05): BufferGeometry {
  const geometry = new RoundedBoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0), 3, radius);
  geometry.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return geometry;
}

/** Upright cylinder / cone frustum standing between y0 and y1. */
export function cyl(x: number, z: number, y0: number, y1: number, rTop: number, rBottom = rTop, segments = 28): BufferGeometry {
  const geometry = new CylinderGeometry(rTop, rBottom, y1 - y0, segments);
  geometry.translate(x, (y0 + y1) / 2, z);
  return geometry;
}

const matrix = new Matrix4();
const quaternion = new Quaternion();
const one = new Vector3(1, 1, 1);

/** Rotate a geometry about its own origin, then place it. */
export function place(geometry: BufferGeometry, position: [number, number, number], rotation: [number, number, number]): BufferGeometry {
  quaternion.setFromEuler(new Euler(rotation[0], rotation[1], rotation[2], "YXZ"));
  matrix.compose(new Vector3(...position), quaternion, one);
  geometry.applyMatrix4(matrix);
  return geometry;
}

/** A thin stick between two points (branches, lamp arms, legs). */
export function stick(a: [number, number, number], b: [number, number, number], radius: number): BufferGeometry {
  const from = new Vector3(...a);
  const to = new Vector3(...b);
  const length = from.distanceTo(to);
  const geometry = new CylinderGeometry(radius * 0.8, radius, length, 6);
  quaternion.setFromUnitVectors(new Vector3(0, 1, 0), to.clone().sub(from).normalize());
  matrix.compose(from.add(to).multiplyScalar(0.5), quaternion, one);
  geometry.applyMatrix4(matrix);
  return geometry;
}

export function merge(parts: BufferGeometry[]): BufferGeometry {
  const flat = parts.map((part) => {
    const next = part.index ? part.toNonIndexed() : part;
    if (next !== part) part.dispose();
    return next;
  });
  const merged = mergeGeometries(flat, false) ?? new BufferGeometry();
  flat.forEach((part) => part.dispose());
  return merged;
}
