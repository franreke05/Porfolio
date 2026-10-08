"use client";

import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { type RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type DirectionalLight,
  DoubleSide,
  Euler,
  type InstancedMesh,
  type Material,
  Matrix4,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  type PerspectiveCamera,
  type PointLight,
  Quaternion,
  Vector3,
  setConsoleFunction,
} from "three";
import { fovFor, landscapePath, portraitPath, smoothDamp } from "./camera-path";
import { CATEGORIES, CONTACT_ROWS, type ContactRow, FOUNDER_KEY, SLOT_PROJECTS, categoryKey, projectKey } from "./content";
import { CoverSlot, createSlotFrame } from "./cover-slot";
import { FounderPortrait } from "./founder-portrait";
import { BAY, BAYS, COUNTER, FOUNDER_FRAME, LOUNGE, PARTITION, PENDANT, PLAQUE, PLATE_CAMERA, ROOM, SLOT, SUN, UNIT, WINDOWS, compartmentW, compartmentX } from "./layout";
import { type LeafCluster, type MaterialKey, buildModel, coverQuad, slotX } from "./model";
import { LAYER_GLASS, LAYER_LETTERING, PLATE_HOLD, PLATE_OUT, PlatePass, coverFov } from "./plate";
import { type ShowroomStore } from "./store";
import { PLATE_TILES, type PlateTiles, type ShowroomTextures, createTextures, disposeTextures } from "./textures";

export type ShowroomSceneProps = {
  storeRef: RefObject<ShowroomStore>;
  mobile: boolean;
  /** Reduced motion: hold the opening frame, no travel, no parallax. */
  still: boolean;
  /** QA captures against the clean plate: no in-scene lettering on the case. */
  qa: boolean;
  /** A compartment, a slot or the portrait was clicked: open its panel ("<group>/<slug>"). */
  onOpenEntry: (key: string) => void;
  /** A line on the closing plaque was clicked. */
  onPlaque: (row: ContactRow) => void;
  onReady: () => void;
  onLost: () => void;
};

// @react-three/fiber 9 still builds its clock with THREE.Clock, which three
// r183+ announces as deprecated on every construction. Nothing here can act
// on it, so that single notice is dropped; every other three message passes.
setConsoleFunction((type, message, ...rest) => {
  if (typeof message === "string" && message.startsWith("THREE.Clock:")) return;
  console[type](message, ...rest);
});

declare global {
  interface Window {
    __showroomReady?: boolean;
    __showroom?: { snap: () => void; measure: () => Record<string, number>; view: (eye: number[] | null, look?: number[]) => void };
  }
}

const SHADOWED: Partial<Record<MaterialKey, [cast: boolean, receive: boolean]>> = {
  plaster: [true, true],
  concrete: [true, true],
  ceiling: [true, false],
  beam: [false, true],
  metal: [true, false],
  graphite: [true, true],
  oak: [true, true],
  walnut: [true, true],
  leather: [true, true],
  stone: [true, true],
  ceramic: [true, true],
  paper: [true, true],
  book: [true, true],
  trunk: [true, false],
  board: [true, true],
  panel: [false, true],
  alu: [true, true],
};

/**
 * PBR set. Nothing is a flat value: every surface carries a roughness map
 * (and the mineral ones a faint bump), so highlights break up the way they
 * do on real plaster, timber, leather and brushed metal.
 */
function createMaterials(t: ShowroomTextures) {
  const std = (parameters: ConstructorParameters<typeof MeshStandardMaterial>[0]) => new MeshStandardMaterial(parameters);
  const materials: Record<MaterialKey | "leaf" | "rug" | "caseBoard" | "slotBoard" | "sunPatch" | "sunWash", Material> = {
    // Albedos are neutral, daylight values: the plate's warmth comes from the lights (see plate-palette.ts).
    plaster: std({ map: t.plaster, color: "#c0b6a8", roughness: 1, roughnessMap: t.mottle, bumpMap: t.mottle, bumpScale: 0.25 }),
    concrete: std({ map: t.concrete, color: "#eceef4", roughness: 1, roughnessMap: t.mottle, bumpMap: t.concrete, bumpScale: 0.9 }),
    ceiling: std({ map: t.wood, color: "#c6c0c0", roughness: 1, roughnessMap: t.woodRough }),
    beam: std({ map: t.wood, color: "#b4aca6", roughness: 1, roughnessMap: t.woodRough }),
    metal: std({ color: "#0d0c0b", roughness: 0.5, roughnessMap: t.mottle, metalness: 0.4, envMapIntensity: 0.5 }),
    graphite: std({ map: t.graphite, color: "#b4c0c6", roughness: 0.6, roughnessMap: t.mottle, metalness: 0.25 }),
    oak: std({ map: t.wood, color: "#f6f2ee", roughness: 0.9, roughnessMap: t.woodRough, bumpMap: t.woodRough, bumpScale: 0.2 }),
    walnut: std({ map: t.wood, color: "#aea8a4", roughness: 0.95, roughnessMap: t.woodRough, bumpMap: t.woodRough, bumpScale: 0.2 }),
    leather: std({ color: "#6e4a32", roughness: 0.68, roughnessMap: t.mottle, bumpMap: t.mottle, bumpScale: 0.35 }),
    stone: std({ map: t.concrete, color: "#6a696e", roughness: 0.8, roughnessMap: t.mottle }),
    ceramic: std({ color: "#5e5a55", roughness: 0.85, roughnessMap: t.mottle }),
    paper: std({ color: "#e9e1d2", roughness: 0.92 }),
    book: std({ color: "#55463a", roughness: 0.88 }),
    trunk: std({ color: "#47382a", roughness: 0.92 }),
    led: std({ color: "#000000", emissive: "#ffb26b", emissiveIntensity: 0.95 }),
    // Display-case glass: a thin slab with a faint green body and clean reflections.
    glass: new MeshPhysicalMaterial({ color: "#dbe9e2", transparent: true, opacity: 0.13, roughness: 0.03, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2.2, depthWrite: false }),
    pane: new MeshPhysicalMaterial({ color: "#eef2ee", transparent: true, opacity: 0.07, roughness: 0.02, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.6, depthWrite: false }),
    // White placeholder boards: a little self-light, as the LED lines above them give in the plate.
    board: std({ map: t.placeholder, color: "#a9a6a2", roughness: 0.95, emissive: "#ffffff", emissiveMap: t.placeholder, emissiveIntensity: 0.03 }),
    panel: std({ map: t.graphite, color: "#bfbcb8", roughness: 1, roughnessMap: t.mottle }),
    alu: std({ color: "#7c7a78", roughness: 0.45, roughnessMap: t.mottle, metalness: 0.5 }),
    glow: new MeshBasicMaterial({ color: "#ffb070", alphaMap: t.occlusion, transparent: true, opacity: 0.38, depthWrite: false, blending: AdditiveBlending }),
    ao: new MeshBasicMaterial({ color: "#1a120b", alphaMap: t.occlusion, transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false }),
    // Catalogue placeholders stand in full light at the far end: matte off-white, no self-light.
    slotBoard: std({ map: t.placeholder, color: "#8a8784", roughness: 1 }),
    caseBoard: std({ map: t.placeholderWide, color: "#d6d3ce", roughness: 0.95, emissive: "#ffffff", emissiveMap: t.placeholderWide, emissiveIntensity: 0.08 }),
    sunPatch: new MeshBasicMaterial({ map: t.sunPatch, color: "#ffc48e", transparent: true, opacity: 0.6, depthWrite: false, blending: AdditiveBlending }),
    sunWash: new MeshBasicMaterial({ map: t.sunPatch, color: "#ffb878", transparent: true, opacity: 0.34, depthWrite: false, blending: AdditiveBlending }),
    leaf: std({ color: "#ffffff", roughness: 0.7, side: DoubleSide }),
    rug: std({ map: t.rug, color: "#b4b6bc", roughness: 1, bumpMap: t.rug, bumpScale: 0.6 }),
  };
  return materials;
}

/* ───────────────────────────── camera ───────────────────────────── */

/** Distance (m) of the point the pointer parallax pivots about: the far wall of frame 0. */
const PARALLAX_PIVOT = 11;

/**
 * What the camera frames while an entry's panel is open: the object's centre,
 * the way it faces, the box that must stay in view and how far the eye rises
 * above it. The distance follows from the lens and from the part of the frame
 * the panel leaves free.
 */
type FocusSpec = { object: [number, number, number]; normal: [number, number, number]; size: [number, number]; lift: number };
const FOCUS: Record<string, FocusSpec> = {};
CATEGORIES.forEach((_, index) => {
  FOCUS[categoryKey(index)] = { object: [compartmentX(index), 0.55, -0.05], normal: [0, 0, 1], size: [compartmentW(index) + 0.12, 0.9], lift: 0.42 };
});
SLOT_PROJECTS.forEach((project, slot) => {
  const top = slot < 4;
  const along = top ? slotX(4, slot) : slotX(3, slot - 4);
  FOCUS[projectKey(project.slug)] = {
    object: [ROOM.x1 - BAY.depth, SLOT.rowY[top ? 0 : 1] - 0.05, BAYS[3].z + along],
    normal: [-1, 0, 0],
    size: [SLOT.w + 0.16, SLOT.h + 0.24],
    lift: 0,
  };
});
FOCUS[FOUNDER_KEY] = { object: [FOUNDER_FRAME.x, FOUNDER_FRAME.y - 0.05, ROOM.z1], normal: [0, 0, -1], size: [0.62, 0.9], lift: 0 };

/** Free part of the frame beside (desktop) or above (phone) the open panel, and the lens shift that centres it. */
const FREE = {
  side: { w: 0.5, h: 0.5, shiftX: 0.145, shiftY: 0 },
  below: { w: 0.82, h: 0.27, shiftX: 0, shiftY: 0.265 },
} as const;

function Rig({ storeRef, still, mobile, onReady }: Pick<ShowroomSceneProps, "storeRef" | "still" | "mobile" | "onReady">) {
  const get = useThree((state) => state.get);
  const invalidate = useThree((state) => state.invalidate);
  const debugView = useRef<{ eye: number[]; look: number[] } | null>(null);
  const rig = useRef({
    velocity: { v: 0 },
    eye: new Vector3(),
    look: new Vector3(),
    pivot: new Vector3(),
    yaw: 0,
    pitch: 0,
    shift: 0,
    shiftX: 0,
    aspect: 0,
    frames: 0,
    focus: null as FocusSpec | null,
    focusW: 0,
    focusEye: new Vector3(),
    focusLook: new Vector3(),
    goalEye: new Vector3(),
    goalLook: new Vector3(),
    lean: 0,
  });

  useEffect(() => {
    const store = storeRef.current;
    store.invalidate = () => invalidate();
    store.snap = true;
    invalidate();
    if (process.env.NODE_ENV !== "production") {
      window.__showroom = {
        snap: () => {
          store.snap = true;
          invalidate();
        },
        view: (eye, look) => {
          debugView.current = eye && look ? { eye, look } : null;
          invalidate();
        },
        measure: () => {
          const { gl, advance } = get();
          gl.info.autoReset = false;
          gl.info.reset();
          advance(performance.now());
          const result = { calls: gl.info.render.calls, triangles: gl.info.render.triangles, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures };
          gl.info.autoReset = true;
          return result;
        },
      };
    }
    return () => {
      store.invalidate = () => {};
      window.__showroomReady = false;
      delete window.__showroom;
    };
  }, [get, invalidate, storeRef]);

  useFrame((state, dt) => {
    const r = rig.current;
    const store = storeRef.current;
    const camera = state.camera as PerspectiveCamera;
    const gl = state.gl;
    const delta = Math.min(dt, 0.1);
    const target = still ? 0 : store.target;
    const snapping = store.snap || still;
    if (store.snap || still) {
      store.current = target;
      r.velocity.v = 0;
      store.snap = false;
    } else {
      store.current = smoothDamp(store.current, target, r.velocity, 0.48, delta);
    }

    const aspect = state.size.width / Math.max(1, state.size.height);
    (aspect < 1 ? portraitPath : landscapePath).sample(store.current, r.eye, r.look);
    if (debugView.current) {
      r.eye.fromArray(debugView.current.eye);
      r.look.fromArray(debugView.current.look);
    }

    // An open panel pulls the camera off the path to frame its object; closing it lets go.
    const aimed = still ? null : (FOCUS[store.focus ?? ""] ?? null);
    const free = mobile ? FREE.below : FREE.side;
    const focusGoal = aimed ? 1 : 0;
    if (aimed) {
      const tan = Math.tan((fovFor(aspect) * Math.PI) / 360);
      const distance = Math.max(aimed.size[0] / (free.w * 2 * tan * aspect), aimed.size[1] / (free.h * 2 * tan));
      r.goalLook.fromArray(aimed.object);
      r.goalEye.fromArray(aimed.normal).multiplyScalar(distance).add(r.goalLook);
      r.goalEye.y += aimed.lift;
      const fresh = !r.focus || r.focusW < 0.02 || snapping;
      const follow = fresh ? 1 : 1 - Math.exp(-delta * 4.5);
      r.focusEye.lerp(r.goalEye, follow);
      r.focusLook.lerp(r.goalLook, follow);
      r.focus = aimed;
    }
    r.focusW = snapping ? focusGoal : r.focusW + (focusGoal - r.focusW) * (1 - Math.exp(-delta * 3.4));
    if (Math.abs(focusGoal - r.focusW) < 0.001) r.focusW = focusGoal;
    const framing = r.focusW * r.focusW * (3 - 2 * r.focusW);
    const settling = r.focus !== null && (r.focusW !== focusGoal || (aimed !== null && r.focusEye.distanceToSquared(r.goalEye) > 1e-6));
    if (r.focus && framing > 0) {
      r.eye.lerp(r.focusEye, framing);
      r.look.lerp(r.focusLook, framing);
    }

    camera.position.copy(r.eye);
    camera.lookAt(r.look);

    // The contact sheet: the camera leans in a few centimetres, for life.
    const leanGoal = store.lean && !still ? 1 : 0;
    r.lean += (leanGoal - r.lean) * (1 - Math.exp(-delta * 2.2));
    if (Math.abs(leanGoal - r.lean) < 0.002) r.lean = leanGoal;
    if (r.lean !== 0) camera.translateZ(-0.07 * r.lean * r.lean * (3 - 2 * r.lean));

    // A breath of pointer parallax on the opening frame only: the eye trucks a
    // few centimetres and re-aims at a pivot on the far side of the room, so
    // the distance holds still while the lounge and the counter slide over it.
    const weight = still ? 0 : Math.max(0, 1 - store.current / 0.08);
    const limit = 0.05;
    const ease = 1 - Math.exp(-delta * 4);
    r.yaw += (store.pointer.x * limit * weight - r.yaw) * ease;
    r.pitch += (store.pointer.y * limit * 0.5 * weight - r.pitch) * ease;
    if (r.yaw !== 0 || r.pitch !== 0) {
      r.pivot.copy(r.look).sub(r.eye).setLength(PARALLAX_PIVOT).add(r.eye);
      camera.translateX(r.yaw);
      camera.translateY(r.pitch);
      camera.lookAt(r.pivot);
    }

    // While the plate is on, the lens stays inside the plate's frustum (cover);
    // it opens to its natural value as the plate dissolves into the room.
    const open = Math.min(1, Math.max(0, (store.current - PLATE_HOLD) / (PLATE_OUT - PLATE_HOLD)));
    const cover = coverFov(aspect);
    const opened = open * open * (3 - 2 * open);
    const fov = cover + (fovFor(aspect) - cover) * opened;
    // The plate was shot with a lens shift (see PLATE_CAMERA); it relaxes with the fov.
    // A framed object sits in the part of the frame its panel leaves free: the same lens shift, sideways or up.
    const shift = PLATE_CAMERA.shiftY * (1 - opened) + free.shiftY * framing;
    const shiftX = free.shiftX * framing * aspect;
    if (Math.abs(camera.fov - fov) > 0.01 || Math.abs(r.shift - shift) > 0.00002 || Math.abs(r.shiftX - shiftX) > 0.00002 || r.aspect !== aspect) {
      camera.fov = fov;
      r.shift = shift;
      r.shiftX = shiftX;
      r.aspect = aspect;
      camera.aspect = aspect;
      if (shift !== 0 || shiftX !== 0) camera.setViewOffset(aspect, 1, shiftX, shift, aspect, 1);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    }

    // The scene is static: bake the sun's shadow map during the first frames only.
    r.frames += 1;
    if (r.frames <= 6) {
      gl.shadowMap.needsUpdate = true;
      invalidate();
      if (r.frames === 6) {
        window.__showroomReady = true;
        onReady();
      }
    }

    const travelling = Math.abs(target - store.current) > 0.0002 || Math.abs(r.velocity.v) > 0.0004;
    const drifting =
      Math.abs(store.pointer.x * limit * weight - r.yaw) > 0.0002 || Math.abs(store.pointer.y * limit * 0.5 * weight - r.pitch) > 0.0002;
    if (travelling || drifting || settling || r.lean !== leanGoal) invalidate();
  });

  return null;
}

/* ───────────────────────────── lights ───────────────────────────── */

function Sun({ mobile }: { mobile: boolean }) {
  const light = useRef<DirectionalLight>(null);
  const get = useThree((state) => state.get);
  const length = Math.hypot(...SUN.dir);
  const position = SUN.target.map((value, axis) => value - (SUN.dir[axis] / length) * 22) as [number, number, number];
  const size = mobile ? 1024 : 2048;

  useLayoutEffect(() => {
    const sun = light.current;
    if (!sun) return;
    sun.target.position.set(...SUN.target);
    sun.target.updateMatrixWorld();
    if (sun.shadow.map) {
      sun.shadow.map.dispose();
      sun.shadow.map = null;
    }
    sun.shadow.mapSize.set(size, size);
    const { gl, invalidate } = get();
    gl.shadowMap.needsUpdate = true;
    invalidate();
  }, [get, size]);

  return (
    <directionalLight ref={light} position={position} color="#ffe6c0" intensity={10.5} castShadow shadow-bias={-0.0005} shadow-normalBias={0.03} shadow-radius={4}>
      <orthographicCamera attach="shadow-camera" args={[-11, 11, 8, -8, 2, 46]} />
    </directionalLight>
  );
}

function CaseLights({ storeRef }: { storeRef: RefObject<ShowroomStore> }) {
  const lights = useRef<Array<PointLight | null>>([]);
  const base = 0.75;
  useFrame((state, dt) => {
    let moving = false;
    lights.current.forEach((light, index) => {
      if (!light) return;
      const goal = storeRef.current.hover === index ? base * 1.9 : base;
      const next = light.intensity + (goal - light.intensity) * (1 - Math.exp(-Math.min(dt, 0.1) * 9));
      if (Math.abs(goal - next) > 0.004) moving = true;
      light.intensity = Math.abs(goal - next) > 0.004 ? next : goal;
    });
    if (moving) state.invalidate();
  });
  return (
    <>
      {CATEGORIES.map((category, index) => (
        <pointLight
          key={category.id}
          ref={(node) => {
            lights.current[index] = node;
          }}
          position={[compartmentX(index), COUNTER.caseY1 - 0.07, -0.13]}
          color="#ffb070"
          intensity={base}
          distance={1.25}
          decay={2}
        />
      ))}
    </>
  );
}

/* ───────────────────────────── foliage ───────────────────────────── */

function Leaves({ clusters, material }: { clusters: LeafCluster[]; material: Material }) {
  const mesh = useRef<InstancedMesh>(null);
  const count = clusters.reduce((sum, cluster) => sum + cluster.count, 0);
  const geometry = useMemo(() => {
    const leaf = new BufferGeometry();
    leaf.setAttribute(
      "position",
      new BufferAttribute(new Float32Array([0, -0.5, 0, 0.2, 0, 0.04, 0, 0.5, 0, 0, -0.5, 0, 0, 0.5, 0, -0.2, 0, 0.04]), 3),
    );
    leaf.computeVertexNormals();
    return leaf;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    const target = mesh.current;
    if (!target) return;
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const matrix = new Matrix4();
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const euler = new Euler();
    const color = new Color();
    const tones = ["#5f6a3a", "#7a8148", "#4b5633", "#878a4e", "#667140"];
    let index = 0;
    clusters.forEach((cluster) => {
      for (let i = 0; i < cluster.count; i += 1) {
        const u = random() * 2 - 1;
        const phi = random() * Math.PI * 2;
        const ring = Math.sqrt(1 - u * u);
        const reach = 0.45 + 0.55 * Math.sqrt(random());
        position.set(
          cluster.at[0] + Math.cos(phi) * ring * cluster.radius[0] * reach,
          cluster.at[1] + u * cluster.radius[1] * reach,
          cluster.at[2] + Math.sin(phi) * ring * cluster.radius[2] * reach,
        );
        euler.set(random() * Math.PI, random() * Math.PI * 2, random() * Math.PI);
        quaternion.setFromEuler(euler);
        const size = cluster.size * (0.7 + random() * 0.7);
        scale.set(size, size, size);
        matrix.compose(position, quaternion, scale);
        target.setMatrixAt(index, matrix);
        target.setColorAt(index, color.set(tones[Math.floor(random() * tones.length)]));
        index += 1;
      }
    });
    target.instanceMatrix.needsUpdate = true;
    if (target.instanceColor) target.instanceColor.needsUpdate = true;
    target.computeBoundingSphere();
  }, [clusters]);

  return <instancedMesh ref={mesh} name="foliage" args={[geometry, material, count]} castShadow frustumCulled={false} />;
}

/* ───────────────────────────── world ───────────────────────────── */

function setCursor(over: boolean) {
  document.body.style.cursor = over ? "pointer" : "";
}

function World({ storeRef, mobile, still, qa, onOpenEntry, onPlaque, onReady }: Omit<ShowroomSceneProps, "onLost">) {
  const [textures, setTextures] = useState<ShowroomTextures | null>(null);
  const [sansFont, setSansFont] = useState("system-ui, sans-serif");
  const invalidate = useThree((state) => state.invalidate);

  // Lettering is drawn with the fonts the page already loaded.
  useEffect(() => {
    let alive = true;
    let made: ShowroomTextures | null = null;
    const style = getComputedStyle(document.documentElement);
    const sans = style.getPropertyValue("--font-geist-sans").trim() || "system-ui, sans-serif";
    const serif = style.getPropertyValue("--font-fraunces").trim() || "Georgia, serif";
    const fonts = document.fonts
      ? Promise.all([document.fonts.load(`400 34px ${sans}`), document.fonts.load(`500 40px ${sans}`), document.fonts.load(`300 40px ${sans}`), document.fonts.load(`500 40px ${serif}`), document.fonts.ready])
      : Promise.resolve([]);
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 2500));
    // Plate-derived material tiles (a few kB each, same origin); a miss falls back to a canvas.
    const tiles: PlateTiles = {};
    const images = Promise.all(
      PLATE_TILES.map(
        (name) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => {
              tiles[name] = image;
              resolve();
            };
            image.onerror = () => resolve();
            image.src = `/showroom/${name}.webp`;
          }),
      ),
    );
    Promise.all([Promise.race([fonts, timeout]).catch(() => undefined), Promise.race([images, new Promise((resolve) => window.setTimeout(resolve, 4000))])])
      .then(() => {
        if (!alive) return;
        made = createTextures({ sans, serif }, tiles);
        setSansFont(sans);
        setTextures(made);
      });
    return () => {
      alive = false;
      if (made) disposeTextures(made);
    };
  }, []);

  const model = useMemo(() => buildModel(), []);
  const slotFrame = useMemo(() => createSlotFrame(), []);
  const covers = useMemo(() => CATEGORIES.map((_, index) => coverQuad(index)), []);
  // The rug is a quad read off the plate, not an axis-aligned rectangle.
  const rug = useMemo(() => {
    const [a, b, c, d] = LOUNGE.rug;
    const corners = [a, b, c, a, c, d];
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(corners.flatMap(([x, z]) => [x, 0.012, z])), 3));
    geometry.setAttribute("uv", new BufferAttribute(new Float32Array(corners.flatMap(([x, z]) => [x / 3.2, z / 3.2])), 2));
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  const materials = useMemo(() => (textures ? createMaterials(textures) : null), [textures]);
  const street = useMemo(() => {
    if (!textures) return null;
    // Slightly overexposed late-afternoon exterior, in two depths for parallax.
    const far = new MeshBasicMaterial({ map: textures.exteriorFar });
    far.color.setRGB(1.45, 1.34, 1.2);
    far.toneMapped = false;
    const near = new MeshBasicMaterial({ map: textures.exteriorNear, transparent: true, depthWrite: false });
    near.color.setRGB(1.34, 1.24, 1.0);
    near.toneMapped = false;
    return { far, near };
  }, [textures]);

  useEffect(
    () => () => {
      Object.values(model.geometries).forEach((geometry) => geometry.dispose());
      slotFrame.dispose();
      rug.dispose();
      covers.forEach((cover) => cover.dispose());
    },
    [model, slotFrame, rug, covers],
  );
  useEffect(
    () => () => {
      if (materials) Object.values(materials).forEach((material) => material.dispose());
      street?.far.dispose();
      street?.near.dispose();
    },
    [materials, street],
  );

  if (!textures || !materials || !street) return null;

  const hoverCase = (index: number) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    storeRef.current.hover = index;
    setCursor(true);
    invalidate();
  };
  const leaveCase = (index: number) => () => {
    if (storeRef.current.hover === index) storeRef.current.hover = -1;
    setCursor(false);
    invalidate();
  };
  const overLink = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setCursor(true);
  };

  const C = COUNTER;
  const apps = BAYS[3];
  const roomW = ROOM.x1 - ROOM.x0;
  const roomD = ROOM.z1 - ROOM.z0;
  const roomCx = (ROOM.x0 + ROOM.x1) / 2;
  const roomCz = (ROOM.z0 + ROOM.z1) / 2;
  const px = PLAQUE.size / 1024;

  return (
    <>
      <Rig storeRef={storeRef} still={still} mobile={mobile} onReady={onReady} />
      <PlatePass />

      {/* Key: one low golden sun through the windows. Everything else is fill
          or a warm interior accent, well below the key. */}
      <Sun mobile={mobile} />
      <hemisphereLight args={["#ffdace", "#d4ae95", 2.6]} />
      <pointLight position={[2.4, 0.4, 2.6]} color="#ffbf8c" intensity={4} distance={9} decay={2} />
      <pointLight position={[PENDANT.x, PENDANT.y - 0.12, PENDANT.z]} color="#ffbf7e" intensity={2.5} distance={6} decay={2} />
      <pointLight position={[UNIT.signX + 0.4, 2.1, PARTITION.z1 + 1.0]} color="#ffd9b0" intensity={0.8} distance={5} decay={2} />
      <pointLight position={[ROOM.x1 - 2.6, 3.2, apps.z + 0.4]} color="#ffe8d2" intensity={1.4} distance={10} decay={2} />
      {/* Floor bounce: an unshadowed up-light that only reaches the ceiling and the undersides. */}
      <directionalLight position={[0, -10, 0]} color="#ffb880" intensity={0.25} />
      <CaseLights storeRef={storeRef} />
      <Environment resolution={64} frames={1} environmentIntensity={0.35}>
        <color attach="background" args={["#1d1611"]} />
        <Lightformer form="rect" intensity={3.2} color="#ffdcae" position={[-8, 2.2, 1]} rotation-y={Math.PI / 2} scale={[16, 5, 1]} />
        <Lightformer form="rect" intensity={0.4} color="#f1d9bd" position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[14, 14, 1]} />
        <Lightformer form="rect" intensity={0.4} color="#c9a57c" position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[14, 14, 1]} />
        <Lightformer form="rect" intensity={0.3} color="#f3dcc0" position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[12, 4, 1]} />
      </Environment>

      {/* Architecture and furniture, one mesh per material. */}
      {(Object.keys(model.geometries) as MaterialKey[]).map((key) => (
        <mesh
          key={key}
          name={key}
          geometry={model.geometries[key]}
          material={materials[key]}
          castShadow={SHADOWED[key]?.[0] ?? false}
          receiveShadow={SHADOWED[key]?.[1] ?? false}
          renderOrder={key === "glass" || key === "pane" ? 3 : key === "ao" || key === "glow" ? 1 : 0}
          onUpdate={(mesh) => mesh.layers.set(key === "glass" || key === "pane" ? LAYER_GLASS : 0)}
        />
      ))}
      <Leaves clusters={model.leaves} material={materials.leaf} />

      {/* Polished concrete floor: soft, blurred reflections, never a mirror. */}
      <mesh rotation-x={-Math.PI / 2} position={[roomCx, 0, roomCz]} receiveShadow>
        <planeGeometry args={[roomW, roomD]} />
        {mobile ? (
          <meshStandardMaterial map={textures.floor} roughnessMap={textures.floorRough} roughness={0.6} color="#c4bcb8" />
        ) : (
          <MeshReflectorMaterial
            map={textures.floor}
            roughnessMap={textures.floorRough}
            color="#c4bcb8"
            roughness={0.38}
            metalness={0}
            mirror={0.34}
            mixStrength={2}
            mixBlur={0.85}
            blur={[300, 100]}
            resolution={512}
            depthScale={0.5}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.2}
          />
        )}
      </mesh>

      {/* Rug */}
      <mesh geometry={rug} material={materials.rug} receiveShadow />

      {/* Sun streaks the plate shows on the window wall: an additive decal. */}
      <mesh position={[ROOM.x0 + 0.036, 2.85, WINDOWS.darkWall[0] + 1.0]} rotation-y={Math.PI / 2} material={materials.sunPatch} renderOrder={1}>
        <planeGeometry args={[2.0, 3.0]} />
      </mesh>

      {/* The same low sun at the far end of the room, where the plate never looked:
          gridded window light on the contact wall, across the catalogue front and
          long on the floor before them (the plate's own light pattern). */}
      <mesh position={[ROOM.x1 - PLAQUE.depth - 0.012, 2.05, PLAQUE.z + 0.15]} rotation-y={-Math.PI / 2} material={materials.sunPatch} renderOrder={1}>
        <planeGeometry args={[2.5, 3.5]} />
      </mesh>
      <mesh position={[ROOM.x1 - BAY.depth - 0.07, 1.95, apps.z - 0.55]} rotation-y={-Math.PI / 2} material={materials.sunWash} renderOrder={1}>
        <planeGeometry args={[2.3, 3.1]} />
      </mesh>
      <mesh position={[ROOM.x1 - 2.5, 0.021, apps.z + 1.2]} rotation={[-Math.PI / 2, 0, 0.5]} material={materials.sunWash} renderOrder={1}>
        <planeGeometry args={[4.6, 6.4]} />
      </mesh>

      {/* Contact shadows, baked once: everything below 1.1 m grounds itself. */}
      <ContactShadows frames={1} position={[roomCx, 0.017, roomCz]} scale={[roomW, roomD]} far={1.1} blur={1.6} opacity={0.62} resolution={mobile ? 512 : 1024} color="#1a120b" />

      {/* The street beyond the glass, out of focus, in two depths. */}
      <mesh position={[ROOM.x0 - 8, 3.6, 1]} rotation-y={Math.PI / 2} material={street.far}>
        <planeGeometry args={[40, 15]} />
      </mesh>
      <mesh position={[ROOM.x0 - 3.4, 3.1, 1]} rotation-y={Math.PI / 2} material={street.near} renderOrder={1} onUpdate={(mesh) => mesh.layers.set(LAYER_GLASS)}>
        <planeGeometry args={[30, 9]} />
      </mesh>

      {/* Glass case: printed plates, plinth lettering, click targets. */}
      {CATEGORIES.map((category, index) => {
        const cx = compartmentX(index);
        return (
          <group key={category.id}>
            <mesh geometry={covers[index]} material={materials.caseBoard} receiveShadow />
            <mesh position={[cx, (C.caseY0 + C.plinthY1) / 2, -0.006]} visible={!qa} onUpdate={(mesh) => mesh.layers.set(LAYER_LETTERING)}>
              <planeGeometry args={[Math.min(compartmentW(index), 0.86), Math.min(compartmentW(index), 0.86) * (264 / 640)]} />
              <meshBasicMaterial map={textures.plinths[index]} transparent depthWrite={false} />
            </mesh>
            <mesh
              position={[cx, (C.caseY0 + C.caseY1) / 2, -C.recess / 2]}
              onPointerOver={hoverCase(index)}
              onPointerOut={leaveCase(index)}
              onClick={(event) => {
                event.stopPropagation();
                onOpenEntry(categoryKey(index));
              }}
            >
              <boxGeometry args={[compartmentW(index), C.caseY1 - C.caseY0, C.recess]} />
              <meshBasicMaterial visible={false} />
            </mesh>
          </group>
        );
      })}

      {/* "NUESTROS PRODUCTOS" on the unit's header band. */}
      <mesh position={[UNIT.signX, (UNIT.headerY0 + UNIT.y1 - 0.05) / 2, PARTITION.z1 + UNIT.panel + 0.052]}>
        <planeGeometry args={[1.85, 1.85 * (80 / 1024)]} />
        <meshBasicMaterial map={textures.header} transparent depthWrite={false} />
      </mesh>

      {/* Bay signs and the seven catalogue niches. */}
      {BAYS.map((bay, index) => {
        const width = Math.min(bay.w - 0.4, 1.9);
        return (
          <group key={bay.id} position={[ROOM.x1, 0, bay.z]} rotation-y={-Math.PI / 2}>
            <mesh position={[0, BAY.signY, BAY.depth + 0.032]}>
              <planeGeometry args={[width, width * (96 / 1024)]} />
              <meshBasicMaterial map={textures.signs[index]} transparent depthWrite={false} />
            </mesh>
            {index === 3
              ? SLOT_PROJECTS.map((project, slot) => {
                  const top = slot < 4;
                  return (
                    <CoverSlot
                      key={project.slug}
                      slug={project.slug}
                      name={project.name}
                      position={[top ? slotX(4, slot) : slotX(3, slot - 4), SLOT.rowY[top ? 0 : 1], 0]}
                      frame={slotFrame}
                      frameMaterial={materials.metal}
                      placeholder={materials.slotBoard}
                      label={textures.labels[slot]}
                      onOpen={(slug) => onOpenEntry(projectKey(slug))}
                      onHover={setCursor}
                    />
                  );
                })
              : null}
          </group>
        );
      })}

      {/* Closing plaque: the contact details as signage, each line a real link. */}
      <group position={[ROOM.x1 - PLAQUE.depth, PLAQUE.y, PLAQUE.z]} rotation-y={-Math.PI / 2}>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[PLAQUE.size, PLAQUE.size]} />
          <meshBasicMaterial map={textures.contact} transparent depthWrite={false} />
        </mesh>
        {CONTACT_ROWS.map((row) => (
          <mesh
            key={row.href + row.label}
            position={[-0.04, PLAQUE.size / 2 - (row.row - row.size * 0.32) * px, 0.004]}
            onPointerOver={overLink}
            onPointerOut={() => setCursor(false)}
            onClick={(event) => {
              event.stopPropagation();
              onPlaque(row);
            }}
          >
            <planeGeometry args={[PLAQUE.size - 0.26, (row.size + 20) * px]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        ))}
      </group>

      {/* The founder, framed on the front wall round the corner from the plaque. */}
      <FounderPortrait storeRef={storeRef} still={still} font={sansFont} onOpen={() => onOpenEntry(FOUNDER_KEY)} onHover={setCursor} />
    </>
  );
}

export default function ShowroomScene({ onLost, mobile, ...props }: ShowroomSceneProps) {
  // Resolution follows the frame rate: the scene is drawn twice per frame (plate pass + room),
  // so on a large or high-density display a fixed ratio is what makes the scroll stutter.
  const maxDpr = mobile ? 1.5 : 1.75;
  const [dpr, setDpr] = useState(() =>
    typeof window === "undefined" ? 1 : Math.min(maxDpr, Math.max(1, window.devicePixelRatio || 1)),
  );
  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      frameloop="demand"
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: PLATE_CAMERA.fov, near: 0.1, far: 70, position: [...PLATE_CAMERA.eye] }}
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          onLost();
        });
      }}
    >
      <PerformanceMonitor
        bounds={() => [48, 58]}
        flipflops={3}
        onDecline={() => setDpr((value) => Math.max(0.7, Math.round((value - 0.25) * 100) / 100))}
        onIncline={() => setDpr((value) => Math.min(maxDpr, Math.round((value + 0.25) * 100) / 100))}
        onFallback={() => setDpr(mobile ? 0.8 : 1)}
      />
      <World mobile={mobile} {...props} />
    </Canvas>
  );
}
