import { CatmullRomCurve3, Vector3 } from "three";
import { BAYS, FOUNDER_FRAME, PLAQUE, PLATE_CAMERA, ROOM, compartmentX } from "./layout";
import { APPS_PROGRESS, CATEGORIES, CONTACT_PROGRESS, FOUNDER_PROGRESS } from "./content";

/**
 * Camera travel as data. Each key is a pose (eye + look-at) pinned to a scroll
 * progress value. Positions and targets run through two separate
 * centripetal Catmull-Rom splines, so the eye and the gaze each move on a
 * smooth curve and never snap between keys.
 */

type V3 = [number, number, number];
export type CameraKey = { at: number; eye: V3; look: V3; name: string };

const apps = BAYS[3];
const cat = (index: number) => CATEGORIES[index].progress;

/**
 * F0 is the golden plate's own camera (layout.ts → PLATE_CAMERA), shared with
 * the plate projector. Nothing else may define the opening pose.
 */
const F0: CameraKey = { name: "F0 wide", at: 0, eye: [...PLATE_CAMERA.eye], look: [...PLATE_CAMERA.look] };

/** 16:9 and wider. */
const LANDSCAPE: CameraKey[] = [
  F0,
  { name: "F1 dolly", at: 0.12, eye: [3.02, 1.05, 3.15], look: [1.15, 1.02, -0.3] },
  { name: "F2 case 1", at: cat(0), eye: [compartmentX(0) + 0.5, 1.12, 2.3], look: [compartmentX(0) + 0.28, 0.64, 0] },
  { name: "F2 case 2", at: cat(1), eye: [compartmentX(1) + 0.15, 1.12, 2.3], look: [compartmentX(1) + 0.08, 0.64, 0] },
  { name: "F2 case 3", at: cat(2), eye: [compartmentX(2) - 0.2, 1.12, 2.3], look: [compartmentX(2) - 0.12, 0.64, 0] },
  { name: "F2 case 4", at: cat(3), eye: [compartmentX(3) - 0.3, 1.12, 2.3], look: [compartmentX(3) - 0.2, 0.64, 0] },
  { name: "F3 shelving", at: 0.57, eye: [3.05, 1.6, 2.5], look: [2.9, 1.85, -1.7] },
  { name: "F4 bay sign", at: 0.7, eye: [6.6, 1.65, 3.5], look: [ROOM.x1, 2.2, apps.z - 0.3] },
  { name: "F5 slots", at: APPS_PROGRESS, eye: [ROOM.x1 - 4.35, 1.7, apps.z], look: [ROOM.x1, 1.7, apps.z] },
  { name: "F6 contact", at: CONTACT_PROGRESS, eye: [ROOM.x1 - 3.3, 1.58, PLAQUE.z - 1.0], look: [ROOM.x1, PLAQUE.y - 0.04, PLAQUE.z - 0.12] },
  { name: "F7 founder", at: FOUNDER_PROGRESS, eye: [FOUNDER_FRAME.x - 0.5, 1.6, ROOM.z1 - 2.1], look: [FOUNDER_FRAME.x - 0.12, FOUNDER_FRAME.y - 0.02, ROOM.z1] },
];

/** Portrait: tighter on the counter, one compartment at a time. */
const PORTRAIT: CameraKey[] = [
  F0,
  { name: "F1 dolly", at: 0.12, eye: [2.6, 1.15, 4.1], look: [1.2, 1.05, 0] },
  { name: "F2 case 1", at: cat(0), eye: [compartmentX(0) + 0.1, 1.15, 2.5], look: [compartmentX(0), 0.86, 0] },
  { name: "F2 case 2", at: cat(1), eye: [compartmentX(1) + 0.1, 1.15, 2.5], look: [compartmentX(1), 0.86, 0] },
  { name: "F2 case 3", at: cat(2), eye: [compartmentX(2) + 0.1, 1.15, 2.5], look: [compartmentX(2), 0.86, 0] },
  { name: "F2 case 4", at: cat(3), eye: [compartmentX(3) + 0.1, 1.15, 2.5], look: [compartmentX(3), 0.86, 0] },
  { name: "F3 shelving", at: 0.57, eye: [3.3, 1.6, 5.2], look: [2.9, 1.95, -1.7] },
  { name: "F4 bay sign", at: 0.7, eye: [5.6, 1.7, 3.9], look: [ROOM.x1, 2.3, apps.z] },
  { name: "F5 slots", at: APPS_PROGRESS, eye: [ROOM.x1 - 7.1, 1.75, apps.z], look: [ROOM.x1, 1.75, apps.z] },
  { name: "F6 contact", at: CONTACT_PROGRESS, eye: [ROOM.x1 - 4.5, 1.62, PLAQUE.z - 0.5], look: [ROOM.x1, PLAQUE.y - 0.25, PLAQUE.z] },
  { name: "F7 founder", at: FOUNDER_PROGRESS, eye: [FOUNDER_FRAME.x - 0.2, 1.6, ROOM.z1 - 3.1], look: [FOUNDER_FRAME.x, FOUNDER_FRAME.y - 0.3, ROOM.z1] },
];

export type CameraPath = {
  sample: (progress: number, eye: Vector3, look: Vector3) => void;
  keys: CameraKey[];
};

function build(keys: CameraKey[]): CameraPath {
  const eyes = new CatmullRomCurve3(keys.map((key) => new Vector3(...key.eye)), false, "centripetal");
  const looks = new CatmullRomCurve3(keys.map((key) => new Vector3(...key.look)), false, "centripetal");
  const last = keys.length - 1;

  return {
    keys,
    sample(progress, eye, look) {
      const p = Math.min(1, Math.max(0, progress));
      let i = 0;
      while (i < last - 1 && p > keys[i + 1].at) i += 1;
      const span = keys[i + 1].at - keys[i].at;
      const local = span > 0 ? (p - keys[i].at) / span : 0;
      // Ease in/out of the long transitional legs; glide linearly along the case.
      const gliding = keys[i].name.startsWith("F2") && keys[i + 1].name.startsWith("F2");
      // A light ease only: a full smoothstep brings the camera to a stop at every key, which
      // reads as stop-and-go under a steady scroll. The damping in the rig does the smoothing.
      const eased = gliding ? local : local + (local * local * (3 - 2 * local) - local) * 0.25;
      const t = (i + eased) / last;
      eyes.getPoint(t, eye);
      looks.getPoint(t, look);
    },
  };
}

export const landscapePath = build(LANDSCAPE);
export const portraitPath = build(PORTRAIT);

/**
 * Vertical field of view for a viewport aspect. ~40° on 16:9 (a natural
 * 45 mm-ish look); narrower viewports widen it so the horizontal coverage of
 * the goal frame is kept as long as that stays believable.
 */
export function fovFor(aspect: number): number {
  if (aspect < 1) return 56;
  const base = 40;
  const reference = 16 / 9;
  if (aspect >= reference) return base;
  const horizontal = Math.tan((base * Math.PI) / 360) * reference;
  return Math.min(50, (Math.atan(horizontal / aspect) * 360) / Math.PI);
}

/** Critically damped spring towards a target (Game Programming Gems 4, 1.10). */
export function smoothDamp(
  current: number,
  target: number,
  velocity: { v: number },
  smoothTime: number,
  delta: number,
): number {
  const omega = 2 / Math.max(0.0001, smoothTime);
  const x = omega * delta;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (velocity.v + omega * change) * delta;
  velocity.v = (velocity.v - omega * temp) * exp;
  return target + (change + temp) * exp;
}
