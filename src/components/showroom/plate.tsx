"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DepthTexture,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  type Material,
  HalfFloatType,
  LinearFilter,
  LinearMipmapLinearFilter,
  Matrix4,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  Vector2,
  Vector3,
  NoColorSpace,
  NormalBlending,
  PerspectiveCamera,
  ShaderMaterial,
  type Texture,
  TextureLoader,
  WebGLRenderTarget,
} from "three";
import { PLATE_CAMERA } from "./layout";
import { PLATE_CARDS } from "./plate-cards";

/**
 * Camera projection of the golden plate.
 *
 * The plate (public/showroom/golden-reference.webp) is projected from the
 * locked frame-0 camera onto the real room geometry: the whole scene is drawn
 * a second time with one unlit material that looks the plate up through the
 * projector's view-projection matrix. At frame 0 the picture is therefore
 * the plate itself, yet it lies on true depth, so it holds under parallax
 * and during the first dolly. A depth map rendered once from the projector
 * rejects fragments the projector could not see (those keep their PBR
 * material). The plate is never dissolved on a timer: it stays on the
 * geometry and gives way per fragment, only where it cannot hold.
 *
 * Layers: 0 = room (gets the plate), 1 = in-scene lettering drawn on top of
 * the plate, 2 = glass, which never receives the plate.
 */

export const PLATE_URL = "/showroom/golden-reference.webp";
export const PLATE_ASPECT = PLATE_CAMERA.aspect;
export const PLATE_FOV = PLATE_CAMERA.fov;
export const LAYER_LETTERING = 1;
export const LAYER_GLASS = 2;
/** Plate cut-outs of what cannot hold as geometry (foliage), one flat card per plant. */
const LAYER_CARD = 3;
const LAYER_SCRATCH = 4;
/**
 * The clean plate: the photograph with every free-standing prop painted out
 * (half size, it only ever shows smooth infill), and its matte at plate size:
 * R = where the clean plate replaces the photograph on whatever stands behind
 * a prop, G = cut-out alpha of the plants, B = which card owns the pixel.
 * Both are made offline from the proxies' own silhouettes (dev: /?qa=1&matte=1).
 */
export const BACK_URL = "/showroom/golden-background.webp";
export const MATTE_URL = "/showroom/golden-matte.png";
/** Camera travel (metres from the plate pose) over which the plant cards hand over to the modelled foliage. */
const CARD_HOLD = 1.9;
const CARD_OUT = 2.9;

/** Projector depth map: one texel per plate pixel. */
const DEPTH_W = 1672;
const DEPTH_H = 941;

/**
 * The plate stays on the geometry for the whole travel and gives way per
 * fragment (see FRAGMENT): where the projector never saw the surface, outside
 * its frame, where it meets the surface edge-on, and where the picture would
 * be enlarged past MAG_HOLD..MAG_OUT screen pixels per plate pixel.
 */
const MAG_HOLD = 2.7;
const MAG_OUT = 4.2;

/** The lens opens from the plate's frustum to its natural value between these two. */
export const PLATE_HOLD = 0.115;
export const PLATE_OUT = 0.2;

/** Vertical fov that keeps a viewport of this aspect inside the projector frustum (cover, never letterbox). */
export function coverFov(aspect: number): number {
  if (aspect <= PLATE_ASPECT) return PLATE_FOV;
  const half = Math.tan((PLATE_FOV * Math.PI) / 360) * (PLATE_ASPECT / aspect);
  return (Math.atan(half) * 360) / Math.PI;
}

const VERTEX = /* glsl */ `
  uniform mat4 uProjector;
  attribute float fg;
  varying vec4 vProj;
  varying vec3 vWorld;
  varying float vFg;
  void main() {
    vFg = fg;
    #include <begin_vertex>
    #include <project_vertex>
    vec4 world = vec4(transformed, 1.0);
    #ifdef USE_INSTANCING
      world = instanceMatrix * world;
    #endif
    world = modelMatrix * world;
    vWorld = world.xyz;
    vProj = uProjector * world;
  }
`;

const FRAGMENT = /* glsl */ `
  #define MAG_HOLD ${MAG_HOLD.toFixed(2)}
  #define MAG_OUT ${MAG_OUT.toFixed(2)}
  uniform sampler2D uPlate;
  uniform sampler2D uDepth;
  uniform sampler2D uNearest;
  uniform sampler2D uDepthBack;
  uniform sampler2D uBack;
  uniform sampler2D uMatte;
  uniform float uClean;
  uniform float uMix;
  uniform float uNear;
  uniform float uFar;
  uniform float uExact;
  uniform float uMoved;
  uniform float uDpr;
  uniform vec3 uEye;
  varying vec4 vProj;
  varying vec3 vWorld;
  varying float vFg;

  // A free-standing prop is tested against everything the projector saw; what
  // stands behind the props is tested against the room WITHOUT them, and shows
  // the clean plate there: a prop is never printed on the wall behind it.
  float seenAt(vec2 uv) {
    float stored = vFg > 0.5 ? texture2D(uDepth, uv).r : texture2D(uDepthBack, uv).r;
    return uNear * uFar / (uFar - stored * (uFar - uNear));
  }

  // Nearest thing the plate camera sees within a few plate pixels of uv (metres).
  float nearAt(vec2 uv) {
    vec2 nearest = texture2D(uNearest, uv).rg;
    return vFg > 0.5 ? nearest.r : nearest.g;
  }

  vec3 plateAt(vec2 uv, float lod) {
    vec3 photo = textureLod(uPlate, uv, lod).rgb;
    if (vFg > 0.5 || uClean < 0.5) return photo;
    float matte = texture2D(uMatte, uv).r * (1.0 - uExact);
    return matte > 0.0 ? mix(photo, texture2D(uBack, uv).rgb, matte) : photo;
  }

  float shownAt(vec2 uv, float depth) {
    return 1.0 - smoothstep(0.1, 0.32, depth - seenAt(uv));
  }

  void main() {
    if (vProj.w <= 0.0) discard;
    vec2 uv = vProj.xy / vProj.w * 0.5 + 0.5;

    // How much the plate is enlarged on screen at this fragment: the smaller
    // singular value of d(plate px)/d(screen px) is the direction in which the
    // picture is stretched most. Past ~3x a photograph reads as a blur, so
    // the modelled material takes over there, on a soft ramp.
    vec2 texel = uv * vec2(${DEPTH_W}.0, ${DEPTH_H}.0);
    vec2 jx = dFdx(texel);
    vec2 jy = dFdy(texel);
    float ja = dot(jx, jx);
    float jb = dot(jx, jy);
    float jc = dot(jy, jy);
    float least = 0.5 * (ja + jc - sqrt((ja - jc) * (ja - jc) + 4.0 * jb * jb));
    float enlarge = 1.0 / (sqrt(max(least, 1e-8)) * uDpr);
    // The floor is all soft light and blurred reflections: it bears far more enlargement.
    float soft = mix(1.0, 3.0, step(vWorld.y, 0.03));
    float crisp = 1.0 - smoothstep(MAG_HOLD * soft, MAG_OUT * soft, enlarge);

    // Surfaces the projector meets edge-on, or from behind, never carried the
    // picture: the plate would smear along them.
    float facing = 1.0;
    #ifndef USE_INSTANCING
      vec3 across = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
      facing = smoothstep(0.035, 0.11, dot(across, normalize(uEye - vWorld)));
    #endif
    // Resting on the plate pose every visible fragment is the plate, untouched.
    float hold = mix(crisp * facing, 1.0, uExact);
    // Just outside the plate its rim is stretched over a narrow band instead of
    // dropping straight to the modelled room.
    vec2 over = max(-uv, uv - 1.0);
    float rim = 1.0 - smoothstep(0.012, 0.05, max(over.x, over.y));
    if (rim <= 0.0 || hold <= 0.0) discard;
    // Once the camera has left the plate pose, the picture thins out towards
    // its own border, so its end is never a line across a wall or the floor.
    vec2 inside = min(uv, 1.0 - uv);
    rim *= mix(1.0, smoothstep(-0.012, 0.085, min(inside.x, inside.y)), uMoved);
    uv = clamp(uv, 0.0005, 0.9995);
    vec2 px = vec2(1.0 / ${DEPTH_W}.0, 1.0 / ${DEPTH_H}.0);
    float depth = vProj.w;

    // Projector depth test. While the camera rests on the plate pose the test
    // is dilated by one plate pixel, so frame 0 is the plate to the pixel; once
    // it moves the test is exact, so no outline of a near object is left
    // printed on what stands behind it.
    float seen = seenAt(uv);
    float wide = max(max(seenAt(uv + vec2(px.x, 0.0)), seenAt(uv - vec2(px.x, 0.0))), max(seenAt(uv + vec2(0.0, px.y)), seenAt(uv - vec2(0.0, px.y))));
    seen = mix(seen, max(seen, wide), uExact);
    float visible = 1.0 - smoothstep(0.1, 0.32, depth - seen);
    if (uExact < 1.0) {
      // Away from the plate pose a depth texel covers several screen pixels:
      // the test is filtered over its four neighbours, so the outline of what
      // the projector could not see is a soft edge, not a staircase.
      vec2 grid = uv / px - 0.5;
      vec2 part = fract(grid);
      vec2 corner = (floor(grid) + 0.5) * px;
      float filtered = mix(
        mix(shownAt(corner, depth), shownAt(corner + vec2(px.x, 0.0), depth), part.x),
        mix(shownAt(corner + vec2(0.0, px.y), depth), shownAt(corner + px, depth), part.x),
        part.y
      );
      visible = mix(filtered, visible, uExact);
      // The plate's silhouettes are soft and a proxy never hugs them to the
      // pixel: whatever lies within a few pixels of a much nearer object is
      // treated as hidden too, and patched like the rest of the hole.
      float fringe = smoothstep(0.25 + 0.06 * depth, 0.45 + 0.08 * depth, depth - nearAt(uv));
      visible = min(visible, 1.0 - fringe * (1.0 - uExact));
    }
    vec3 colour = plateAt(uv, 0.0);
    float cover = visible;

    if (visible < 0.999) {
      // Hidden from the plate camera: this surface was behind something in the
      // plate. The opening is patched by reflecting the plate about the edge of
      // the opening: the nearest spot beside, above or below where the plate
      // looks at least this deep is found to the pixel, and the patch shows
      // what lies as far beyond it as the fragment is short of it, a little
      // softer the further it reaches. The patch keeps the grain of the
      // picture next to it; an average of scattered taps reads as frosted glass.
      float slack = 0.15 + 0.05 * depth;
      vec2 along = vec2(0.0);
      float reach = 0.0;
      for (int ring = 1; ring <= 20; ring++) {
        float radius = float(ring) * 3.0;
        for (int side = 0; side < 4; side++) {
          vec2 way = side == 0 ? vec2(1.0, 0.0) : side == 1 ? vec2(-1.0, 0.0) : side == 2 ? vec2(0.0, 1.0) : vec2(0.0, -1.0);
          vec2 tap = uv + way * radius * px;
          if (reach > 0.0 || tap.x < 0.0 || tap.x > 1.0 || tap.y < 0.0 || tap.y > 1.0) continue;
          // Only spots with nothing nearer around them: the plate's soft
          // silhouettes must not bleed the near object into the patch.
          if (nearAt(tap) > depth - slack) {
            along = way;
            reach = radius;
          }
        }
        if (reach > 0.0) break;
      }
      if (reach > 0.0) {
        float inner = reach - 3.0;
        for (int halve = 0; halve < 3; halve++) {
          float middle = 0.5 * (inner + reach);
          if (nearAt(uv + along * middle * px) > depth - slack) reach = middle;
          else inner = middle;
        }
        vec2 mirror = clamp(uv + along * (2.0 * reach) * px, 0.0005, 0.9995);
        colour = mix(plateAt(mirror, 1.0 + reach / 10.0), colour, visible);
        // A patch carried from far away is a guess: beyond that the modelled room shows.
        float mend = mix(1.0 - smoothstep(24.0, 60.0, reach), 1.0, uExact);
        cover = mix(mend, 1.0, visible);
      }
    }

    float alpha = uMix * cover * rim * hold;
    if (alpha < 0.004) discard;
    // The plate already holds its lighting and is stored display-referred:
    // written out untouched, with no tone mapping, so frame 0 equals its pixels.
    gl_FragColor = vec4(colour, alpha);
  }
`;

const WIRE_TONES = ["#00ffff", "#ff00ff", "#ffff00", "#00ff66", "#ff5a3c", "#5aa0ff", "#ffffff", "#ff9a00"];

/** Edges of every opaque layer-0 mesh, drawn after the plate with the room's own depth. */
function buildWire(scene: { traverse: (visit: (object: unknown) => void) => void }): Group {
  const group = new Group();
  group.name = "wire";
  let index = 0;
  scene.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh || (mesh as unknown as { isInstancedMesh?: boolean }).isInstancedMesh) return;
    if (!mesh.layers.isEnabled(0) || !mesh.visible) return;
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    if (!material.visible || material.transparent || mesh.name === "trunk") return;
    const lines = new LineSegments(new EdgesGeometry(mesh.geometry, 12), new LineBasicMaterial({ color: new Color(WIRE_TONES[index % WIRE_TONES.length]), toneMapped: false }));
    index += 1;
    mesh.updateWorldMatrix(true, false);
    lines.applyMatrix4(mesh.matrixWorld);
    lines.layers.set(LAYER_LETTERING);
    group.add(lines);
  });
  return group;
}

export function PlatePass() {
  const [plate, setPlate] = useState<Texture | null>(null);
  const [clean, setClean] = useState<{ back: Texture; matte: Texture } | null>(null);
  const frames = useRef(0);

  // The clean plate and its matte: without them the projection still works, as one layer.
  useEffect(() => {
    let alive = true;
    const pair: Texture[] = [];
    const loader = new TextureLoader();
    const settle = (texture: Texture) => {
      texture.colorSpace = NoColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      pair.push(texture);
      if (!alive) texture.dispose();
    };
    loader.load(BACK_URL, (back) => {
      settle(back);
      loader.load(MATTE_URL, (matte) => {
        settle(matte);
        if (alive) setClean({ back, matte });
      });
    });
    return () => {
      alive = false;
      pair.forEach((texture) => texture.dispose());
    };
  }, []);

  useEffect(() => {
    let alive = true;
    let loaded: Texture | null = null;
    new TextureLoader().load(PLATE_URL, (texture) => {
      texture.colorSpace = NoColorSpace;
      // Level 0 is the plate itself; the blurred levels only feed the hole patch.
      texture.generateMipmaps = true;
      texture.minFilter = LinearMipmapLinearFilter;
      texture.magFilter = LinearFilter;
      loaded = texture;
      if (alive) setPlate(texture);
      else texture.dispose();
    });
    return () => {
      alive = false;
      loaded?.dispose();
    };
  }, []);

  const rig = useMemo(() => {
    const projector = new PerspectiveCamera(PLATE_FOV, PLATE_ASPECT, 0.1, 70);
    // The projector IS the plate camera: same pose, same lens shift.
    projector.position.set(...PLATE_CAMERA.eye);
    projector.lookAt(...PLATE_CAMERA.look);
    projector.setViewOffset(PLATE_ASPECT, 1, 0, PLATE_CAMERA.shiftY, PLATE_ASPECT, 1);
    projector.updateMatrixWorld();
    projector.updateProjectionMatrix();
    const depth = new DepthTexture(DEPTH_W, DEPTH_H);
    depth.minFilter = NearestFilter;
    depth.magFilter = NearestFilter;
    const target = new WebGLRenderTarget(DEPTH_W, DEPTH_H, { depthTexture: depth });
    // The same view with the free-standing props left out.
    const depthBack = new DepthTexture(DEPTH_W, DEPTH_H);
    depthBack.minFilter = NearestFilter;
    depthBack.magFilter = NearestFilter;
    const targetBack = new WebGLRenderTarget(DEPTH_W, DEPTH_H, { depthTexture: depthBack });
    // Depth-only material that drops the tagged props; it also paints the dev matte.
    const tag = new ShaderMaterial({
      uniforms: { uDrop: { value: 1 }, uPlant: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float fg;
        uniform float uDrop;
        varying float vFg;
        varying float vDepth;
        void main() {
          #include <begin_vertex>
          #include <project_vertex>
          vFg = fg;
          vDepth = -mvPosition.z;
          if (uDrop > 0.5 && fg > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uPlant;
        varying float vFg;
        varying float vDepth;
        void main() {
          gl_FragColor = uPlant > 0.5 ? vec4(0.0, 1.0, vDepth / 16.0, 1.0) : vec4(vFg, 0.0, 0.0, 1.0);
        }
      `,
    });
    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -2,
      uniforms: {
        uPlate: { value: null },
        uDepth: { value: target.depthTexture },
        uDepthBack: { value: targetBack.depthTexture },
        uBack: { value: null },
        uMatte: { value: null },
        uClean: { value: 0 },
        uProjector: { value: new Matrix4().multiplyMatrices(projector.projectionMatrix, projector.matrixWorldInverse) },
        uMix: { value: 0 },
        uNear: { value: projector.near },
        uExact: { value: 1 },
        uMoved: { value: 0 },
        uDpr: { value: 1 },
        uEye: { value: projector.position.clone() },
        uFar: { value: projector.far },
      },
    });
    // One-off min filter of the projector depth (separable, ±6 px), in metres.
    const spread = () => {
      const buffer = new WebGLRenderTarget(DEPTH_W, DEPTH_H, { type: HalfFloatType, depthBuffer: false });
      buffer.texture.minFilter = NearestFilter;
      buffer.texture.magFilter = NearestFilter;
      buffer.texture.generateMipmaps = false;
      return buffer;
    };
    const nearest = [spread(), spread()];
    material.uniforms.uNearest = { value: nearest[1].texture };
    const erode = new ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uSource: { value: null },
        uSourceBack: { value: null },
        uStep: { value: new Vector2() },
        uRaw: { value: 1 },
        uNear: { value: projector.near },
        uFar: { value: projector.far },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uSource;
        uniform sampler2D uSourceBack;
        uniform vec2 uStep;
        uniform float uRaw;
        uniform float uNear;
        uniform float uFar;
        varying vec2 vUv;
        void main() {
          // R: everything the projector saw. G: the room without its props.
          vec2 nearest = vec2(1000.0);
          for (int i = -6; i <= 6; i++) {
            vec2 at = vUv + uStep * float(i);
            vec2 value = texture2D(uSource, at).rg;
            if (uRaw > 0.5) {
              value = vec2(value.r, texture2D(uSourceBack, at).r);
              value = uNear * uFar / (uFar - value * (uFar - uNear));
            }
            nearest = min(nearest, value);
          }
          gl_FragColor = vec4(nearest, 0.0, 1.0);
        }
      `,
    });
    const quad = new Mesh(new PlaneGeometry(2, 2), erode);
    quad.frustumCulled = false;
    const stage = new Scene();
    stage.add(quad);
    const flat = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Plant cards: flat cut-outs of the plate, square to the projector, at each plant's depth.
    const cards = new Group();
    cards.name = "plate-cards";
    const fade = { value: 1 };
    const forward = new Vector3();
    projector.getWorldDirection(forward);
    const corner = (x: number, y: number, deep: number) => {
      const point = new Vector3((x / DEPTH_W) * 2 - 1, 1 - (y / DEPTH_H) * 2, 0.5).unproject(projector).sub(projector.position);
      return point.multiplyScalar(deep / point.dot(forward)).add(projector.position);
    };
    PLATE_CARDS.forEach((card) => {
      const [x0, y0, x1, y1] = card.rect;
      const points = [corner(x0, y1, card.depth), corner(x1, y1, card.depth), corner(x1, y0, card.depth), corner(x0, y0, card.depth)];
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new BufferAttribute(new Float32Array(points.flatMap((point) => [point.x, point.y, point.z])), 3));
      geometry.setIndex([0, 1, 2, 0, 2, 3]);
      const cut = new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uPlate: material.uniforms.uPlate, uMatte: material.uniforms.uMatte, uProjector: material.uniforms.uProjector, uFade: fade, uId: { value: card.id } },
        vertexShader: /* glsl */ `
          uniform mat4 uProjector;
          varying vec4 vProj;
          void main() {
            vProj = uProjector * modelMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D uPlate;
          uniform sampler2D uMatte;
          uniform float uFade;
          uniform float uId;
          varying vec4 vProj;
          void main() {
            vec2 uv = vProj.xy / vProj.w * 0.5 + 0.5;
            vec4 matte = texture2D(uMatte, uv);
            if (abs(matte.b * 255.0 / 24.0 - uId) > 0.5) discard;
            float alpha = matte.g * uFade;
            if (alpha < 0.004) discard;
            gl_FragColor = vec4(textureLod(uPlate, uv, 0.0).rgb, alpha);
          }
        `,
      });
      const mesh = new Mesh(geometry, cut);
      mesh.layers.set(LAYER_CARD);
      mesh.frustumCulled = false;
      cards.add(mesh);
    });
    return { projector, target, targetBack, tag, material, nearest, erode, quad, stage, flat, cards, fade };
  }, []);

  useEffect(
    () => () => {
      rig.target.depthTexture?.dispose();
      rig.target.dispose();
      rig.targetBack.depthTexture?.dispose();
      rig.targetBack.dispose();
      rig.tag.dispose();
      rig.cards.removeFromParent();
      rig.cards.children.forEach((card) => {
        (card as Mesh).geometry.dispose();
        ((card as Mesh).material as ShaderMaterial).dispose();
      });
      rig.nearest.forEach((buffer) => buffer.dispose());
      rig.erode.dispose();
      rig.quad.geometry.dispose();
      rig.material.dispose();
    },
    [rig],
  );

  const live = useRef(rig);

  // Dev only, /?qa=1&wire=1: the proxies as coloured edges over the plate, to check the match.
  const wire = useMemo(
    () => process.env.NODE_ENV !== "production" && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("wire"),
    [],
  );
  // Dev only, /?qa=1&matte=1: the frame as a matte (R props, G plants, B plant depth / 16 m), the input of the clean plate.
  const matteView = useMemo(
    () => process.env.NODE_ENV !== "production" && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("matte"),
    [],
  );
  const wires = useRef<Group | null>(null);
  useEffect(
    () => () => {
      wires.current?.traverse((object) => {
        const line = object as LineSegments;
        if (!line.isLineSegments) return;
        line.geometry.dispose();
        (line.material as LineBasicMaterial).dispose();
      });
      wires.current?.removeFromParent();
      wires.current = null;
    },
    [],
  );

  // Owns the frame: PBR room, then the plate over it, then the lettering.
  useFrame((state) => {
    const { gl, scene, camera } = state;
    const rig = live.current;
    // Dev-only: /?qa=1&plate=0 shows the pure modelled room for look-dev captures.
    const off = process.env.NODE_ENV !== "production" && window.location.search.includes("plate=0");
    const mix = !plate || off ? 0 : 1;
    const uniforms = rig.material.uniforms;
    uniforms.uPlate.value = plate;
    uniforms.uMix.value = mix;
    const moved = camera.position.distanceTo(rig.projector.position);
    uniforms.uExact.value = 1 - Math.min(1, Math.max(0, (moved - 0.004) / 0.02));
    uniforms.uMoved.value = Math.min(1, Math.max(0, (moved - 0.5) / 1.4));
    uniforms.uDpr.value = gl.getPixelRatio();
    uniforms.uBack.value = clean?.back ?? null;
    uniforms.uMatte.value = clean?.matte ?? null;
    uniforms.uClean.value = clean ? 1 : 0;

    // Modelled foliage never matches the plate plants leaf for leaf. While the
    // camera is near the plate pose each plant is a cut-out of the plate on a
    // card at its own depth, over the clean plate; further along the travel the
    // cards thin out and the modelled foliage grows in (dithered, never a ghost).
    const foliage = scene.getObjectByName("foliage") as Mesh | undefined;
    const trunks = scene.getObjectByName("trunk");
    frames.current += 1;
    const baking = frames.current <= 8;
    const carded = mix > 0 && clean !== null && rig.cards.children.length > 0;
    const grown = carded ? Math.min(1, Math.max(0, (moved - CARD_HOLD) / (CARD_OUT - CARD_HOLD))) : 1;
    rig.fade.value = 1 - grown;
    if (carded && !rig.cards.parent) scene.add(rig.cards);
    if (foliage) {
      const leaf = foliage.material as Material;
      leaf.opacity = grown * grown * (3 - 2 * grown);
      // Invisible leaves still cast their shadow while the sun's map is baked.
      foliage.visible = grown > 0 || baking;
    }
    if (trunks) trunks.visible = grown > 0.5 || baking;

    if (matteView) {
      // Props in red, then the plants in green over the same depth.
      const tag = rig.tag.uniforms;
      if (foliage) foliage.visible = false;
      if (trunks) trunks.visible = false;
      tag.uDrop.value = 0;
      tag.uPlant.value = 0;
      gl.autoClear = true;
      camera.layers.set(0);
      scene.overrideMaterial = rig.tag;
      gl.render(scene, camera);
      gl.autoClear = false;
      tag.uPlant.value = 1;
      [foliage, trunks].forEach((plant) => {
        if (!plant) return;
        plant.visible = true;
        plant.layers.set(LAYER_SCRATCH);
      });
      camera.layers.set(LAYER_SCRATCH);
      gl.render(scene, camera);
      scene.overrideMaterial = null;
      foliage?.layers.set(0);
      trunks?.layers.set(0);
      camera.layers.set(0);
      gl.autoClear = true;
      tag.uDrop.value = 1;
      tag.uPlant.value = 0;
      return;
    }

    gl.autoClear = true;
    camera.layers.set(0);
    camera.layers.enable(LAYER_GLASS);
    gl.render(scene, camera);
    gl.autoClear = false;
    if (mix > 0.004) {
      // The plants are not in the projection: their pixels ride on the cards.
      const leafy = foliage?.visible ?? false;
      const woody = trunks?.visible ?? false;
      if (foliage && carded) foliage.visible = false;
      if (trunks && carded) trunks.visible = false;
      camera.layers.set(0);
      scene.overrideMaterial = rig.material;
      gl.render(scene, camera);
      scene.overrideMaterial = null;
      if (foliage) foliage.visible = leafy;
      if (trunks) trunks.visible = woody;
      if (carded && grown < 1) {
        camera.layers.set(LAYER_CARD);
        gl.render(scene, camera);
      }
    }
    camera.layers.set(LAYER_LETTERING);
    gl.render(scene, camera);
    camera.layers.set(0);
    gl.autoClear = true;

    // Projector depth, rendered after the frame during start-up (the scene is
    // static). Foliage is left out so it cannot punch leaf-shaped holes.
    if (baking) {
      const leafy = foliage?.visible ?? false;
      const woody = trunks?.visible ?? false;
      if (foliage) foliage.visible = false;
      if (trunks) trunks.visible = false;
      rig.projector.layers.set(0);
      gl.setRenderTarget(rig.target);
      gl.clear();
      gl.render(scene, rig.projector);
      // Again without the props, and without the decals that write no depth.
      const decals: Mesh[] = [];
      scene.traverse((object) => {
        const mesh = object as Mesh;
        if (!mesh.isMesh || !mesh.visible || !mesh.layers.isEnabled(0)) return;
        const own = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        if (own.transparent || !own.depthWrite) decals.push(mesh);
      });
      decals.forEach((mesh) => (mesh.visible = false));
      scene.overrideMaterial = rig.tag;
      gl.setRenderTarget(rig.targetBack);
      gl.clear();
      gl.render(scene, rig.projector);
      scene.overrideMaterial = null;
      decals.forEach((mesh) => (mesh.visible = true));
      // Spread the nearest depth sideways, then down.
      const pass = rig.erode.uniforms;
      pass.uSource.value = rig.target.depthTexture;
      pass.uSourceBack.value = rig.targetBack.depthTexture;
      pass.uStep.value.set(1 / DEPTH_W, 0);
      pass.uRaw.value = 1;
      gl.setRenderTarget(rig.nearest[0]);
      gl.render(rig.stage, rig.flat);
      pass.uSource.value = rig.nearest[0].texture;
      pass.uStep.value.set(0, 1 / DEPTH_H);
      pass.uRaw.value = 0;
      gl.setRenderTarget(rig.nearest[1]);
      gl.render(rig.stage, rig.flat);
      gl.setRenderTarget(null);
      if (foliage) foliage.visible = leafy;
      if (trunks) trunks.visible = woody;
      if (wire && frames.current === 8 && !wires.current) {
        wires.current = buildWire(scene);
        scene.add(wires.current);
      }
      state.invalidate();
    }
  }, 1);

  return null;
}
