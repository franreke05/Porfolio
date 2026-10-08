"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  DepthTexture,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
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
  NoColorSpace,
  NormalBlending,
  PerspectiveCamera,
  ShaderMaterial,
  type Texture,
  TextureLoader,
  WebGLRenderTarget,
} from "three";
import { PLATE_CAMERA } from "./layout";

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
  varying vec4 vProj;
  varying vec3 vWorld;
  void main() {
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
  uniform float uMix;
  uniform float uNear;
  uniform float uFar;
  uniform float uExact;
  uniform float uMoved;
  uniform float uDpr;
  uniform vec3 uEye;
  varying vec4 vProj;
  varying vec3 vWorld;

  float seenAt(vec2 uv) {
    float stored = texture2D(uDepth, uv).r;
    return uNear * uFar / (uFar - stored * (uFar - uNear));
  }

  // Nearest thing the plate camera sees within a few plate pixels of uv (metres).
  float nearAt(vec2 uv) {
    return texture2D(uNearest, uv).r;
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
    vec3 colour = textureLod(uPlate, uv, 0.0).rgb;
    float cover = visible;

    if (visible < 0.999) {
      // Hidden from the plate camera: this surface was behind something in the
      // plate. Borrow the plate from the nearest spot where the plate looks at
      // least this deep (edge extension), so the hole opened by parallax is
      // patched with the neighbouring plate colour, not with another render.
      float slack = 0.15 + 0.05 * depth;
      vec3 fill = vec3(0.0);
      float found = 0.0;
      float radius = 7.0;
      float reach = 0.0;
      int extra = 1;
      for (int ring = 0; ring < 8; ring++) {
        for (int step = 0; step < 8; step++) {
          float angle = float(step) * 0.7853982 + float(ring) * 0.37;
          vec2 tap = uv + vec2(cos(angle), sin(angle)) * radius * px;
          if (tap.x < 0.0 || tap.x > 1.0 || tap.y < 0.0 || tap.y > 1.0) continue;
          // Only spots with nothing nearer around them: the plate's soft
          // silhouettes must not bleed the near object into the patch.
          if (nearAt(tap) > depth - slack) {
            fill += textureLod(uPlate, tap, 2.0).rgb;
            found += 1.0;
          }
        }
        if (found > 0.0) {
          if (reach == 0.0) reach = radius;
          if (extra == 0) break;
          extra -= 1;
        }
        radius *= 1.7;
      }
      if (found > 0.0) {
        colour = mix(fill / found, colour, visible);
        // A patch borrowed from far away is a guess: only narrow openings are
        // patched once the camera travels, the rest is the modelled room.
        float mend = mix(1.0 - smoothstep(9.0, 30.0, reach), 1.0, uExact);
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
  const frames = useRef(0);

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
        uniform vec2 uStep;
        uniform float uRaw;
        uniform float uNear;
        uniform float uFar;
        varying vec2 vUv;
        void main() {
          float nearest = 1000.0;
          for (int i = -6; i <= 6; i++) {
            float value = texture2D(uSource, vUv + uStep * float(i)).r;
            if (uRaw > 0.5) value = uNear * uFar / (uFar - value * (uFar - uNear));
            nearest = min(nearest, value);
          }
          gl_FragColor = vec4(nearest, 0.0, 0.0, 1.0);
        }
      `,
    });
    const quad = new Mesh(new PlaneGeometry(2, 2), erode);
    quad.frustumCulled = false;
    const stage = new Scene();
    stage.add(quad);
    const flat = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    return { projector, target, material, nearest, erode, quad, stage, flat };
  }, []);

  useEffect(
    () => () => {
      rig.target.depthTexture?.dispose();
      rig.target.dispose();
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

    // Modelled foliage never matches the plate plants leaf for leaf: it stays
    // out of the projection and only enters as the plate dissolves.
    const foliage = scene.getObjectByName("foliage");
    const trunks = scene.getObjectByName("trunk");
    frames.current += 1;
    const baking = frames.current <= 8;
    // The modelled foliage carries the plate too: each leaf shows the plate
    // pixel it covers, so the plants keep their depth as the camera moves.
    if (foliage) foliage.visible = true;
    if (trunks) trunks.visible = true;

    gl.autoClear = true;
    camera.layers.set(0);
    camera.layers.enable(LAYER_GLASS);
    gl.render(scene, camera);
    gl.autoClear = false;
    if (mix > 0.004) {
      camera.layers.set(0);
      scene.overrideMaterial = rig.material;
      gl.render(scene, camera);
      scene.overrideMaterial = null;
    }
    camera.layers.set(LAYER_LETTERING);
    gl.render(scene, camera);
    camera.layers.set(0);
    gl.autoClear = true;

    // Projector depth, rendered after the frame during start-up (the scene is
    // static). Foliage is left out so it cannot punch leaf-shaped holes.
    if (baking) {
      if (foliage) foliage.visible = false;
      if (trunks) trunks.visible = false;
      rig.projector.layers.set(0);
      gl.setRenderTarget(rig.target);
      gl.clear();
      gl.render(scene, rig.projector);
      // Spread the nearest depth sideways, then down.
      const pass = rig.erode.uniforms;
      pass.uSource.value = rig.target.depthTexture;
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
      if (foliage) foliage.visible = true;
      if (trunks) trunks.visible = true;
      if (wire && frames.current === 8 && !wires.current) {
        wires.current = buildWire(scene);
        scene.add(wires.current);
      }
      state.invalidate();
    }
  }, 1);

  return null;
}
