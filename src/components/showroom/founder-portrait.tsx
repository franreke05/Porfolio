"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  ClampToEdgeWrapping,
  type Group,
  LinearFilter,
  type Mesh,
  type MeshBasicMaterial,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
} from "three";
import { FOUNDER, FOUNDER_PROGRESS } from "./content";
import { FOUNDER_FRAME, ROOM } from "./layout";
import { type ShowroomStore } from "./store";

type Props = {
  storeRef: RefObject<ShowroomStore>;
  /** Reduced motion: no easing, no sweep, no breathing. */
  still: boolean;
  /** Lettering face, already loaded by the page. */
  font: string;
  onOpen: () => void;
  onHover: (over: boolean) => void;
};

/** A soft diagonal band of light on black: slid across the glass with the texture offset. */
function sheen(): CanvasTexture {
  const element = document.createElement("canvas");
  element.width = 256;
  element.height = 64;
  const ctx = element.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 256, 64);
    ctx.transform(1, 0, -0.9, 1, 28, 0);
    const band = ctx.createLinearGradient(88, 0, 168, 0);
    band.addColorStop(0, "rgba(255, 214, 160, 0)");
    band.addColorStop(0.5, "rgba(255, 214, 160, 1)");
    band.addColorStop(1, "rgba(255, 214, 160, 0)");
    ctx.fillStyle = band;
    ctx.fillRect(40, -4, 180, 72);
  }
  const texture = new CanvasTexture(element);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/** The engraved plate: name and role, cream on the dark strip. */
function nameplate(font: string): CanvasTexture {
  const element = document.createElement("canvas");
  element.width = 1024;
  element.height = 128;
  const ctx = element.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#f5eee1";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `500 46px ${font}`;
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "5px";
    ctx.fillText(`${FOUNDER.name} · ${FOUNDER.role}`.toUpperCase(), 512, 68);
  }
  const texture = new CanvasTexture(element);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const F = FOUNDER_FRAME;
const MAT_W = F.w + F.mat * 2;
const MAT_H = F.h + F.mat * 2;
const OUT_W = MAT_W + F.frame * 2;
const OUT_H = MAT_H + F.frame * 2;
const PLATE_W = 0.36;
const PLATE_H = PLATE_W * (128 / 1024);
const PLATE_Y = -OUT_H / 2 - 0.075;
/** Click target: from the top of the frame to just under the plate. */
const HIT_Y0 = PLATE_Y - PLATE_H / 2 - 0.02;
const HIT_Y1 = OUT_H / 2 + 0.02;

/**
 * The founder, as an object of the room: a thin dark frame, a cream mat and
 * the photograph behind glass, with a small engraved plate underneath.
 * Hover or keyboard focus brings it a couple of centimetres off the wall with
 * a slight turn while a warm light crosses the glass; at rest the highlight
 * barely breathes. Click opens "Sobre nosotros".
 */
export function FounderPortrait({ storeRef, still, font, onOpen, onHover }: Props) {
  const invalidate = useThree((state) => state.invalidate);
  const body = useRef<Group>(null);
  const sweepMesh = useRef<Mesh>(null);
  const restMesh = useRef<Mesh>(null);
  const plateMesh = useRef<Mesh>(null);
  const anim = useRef({ hover: 0, sweep: 1, was: false, timer: 0 });
  const [photo, setPhoto] = useState<Texture | null>(null);

  const sweep = useMemo(() => sheen(), []);
  const rest = useMemo(() => {
    const texture = sheen();
    texture.offset.x = 0.2;
    return texture;
  }, []);
  const plate = useMemo(() => nameplate(font), [font]);

  useEffect(() => {
    let alive = true;
    let loaded: Texture | null = null;
    new TextureLoader().load(FOUNDER.print, (texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 8;
      loaded = texture;
      if (!alive) {
        texture.dispose();
        return;
      }
      setPhoto(texture);
      invalidate();
    });
    return () => {
      alive = false;
      loaded?.dispose();
    };
  }, [invalidate]);

  useEffect(() => {
    const state = anim.current;
    return () => {
      window.clearTimeout(state.timer);
      sweep.dispose();
      rest.dispose();
    };
  }, [sweep, rest]);
  useEffect(() => () => plate.dispose(), [plate]);

  useFrame((state, dt) => {
    const a = anim.current;
    const store = storeRef.current;
    const delta = Math.min(dt, 0.1);
    const on = store.founder;
    if (on && !a.was) a.sweep = 0;
    a.was = on;

    const goal = on ? 1 : 0;
    a.hover = still ? goal : a.hover + (goal - a.hover) * (1 - Math.exp(-delta * 7));
    if (Math.abs(goal - a.hover) < 0.002) a.hover = goal;
    if (!still && a.sweep < 1) a.sweep = Math.min(1, a.sweep + delta / 1.15);
    else if (still) a.sweep = 1;

    const h = a.hover;
    if (body.current) {
      body.current.position.z = h * 0.024;
      body.current.rotation.y = h * -0.046;
      body.current.rotation.x = h * 0.012;
    }
    const sweepMaterial = sweepMesh.current?.material as MeshBasicMaterial | undefined;
    if (sweepMaterial) {
      const t = a.sweep;
      sweepMaterial.map?.offset.setX(0.75 - 1.5 * (t * t * (3 - 2 * t)));
      sweepMaterial.opacity = Math.sin(Math.PI * t) * 0.5;
    }
    // At rest: a faint highlight on the glass that barely breathes, only while the portrait is on stage.
    const near = store.current > FOUNDER_PROGRESS - 0.07;
    const restMaterial = restMesh.current?.material as MeshBasicMaterial | undefined;
    if (restMaterial) restMaterial.opacity = 0.07 + (still ? 0 : 0.03 * Math.sin(state.clock.elapsedTime * 0.9)) + h * 0.05;
    const plateMaterial = plateMesh.current?.material as MeshBasicMaterial | undefined;
    if (plateMaterial && plateMesh.current) {
      plateMaterial.opacity = 0.5 + h * 0.5;
      plateMesh.current.position.y = PLATE_Y - (1 - h) * 0.004;
    }

    if (a.hover !== goal || a.sweep < 1) state.invalidate();
    else if (near && !still && !a.timer && document.visibilityState === "visible") {
      // The breathing needs only a few frames a second.
      a.timer = window.setTimeout(() => {
        a.timer = 0;
        invalidate();
      }, 90);
    }
  });

  const over = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    storeRef.current.founder = true;
    onHover(true);
    invalidate();
  };
  const out = () => {
    storeRef.current.founder = false;
    onHover(false);
    invalidate();
  };

  return (
    <group position={[F.x, F.y, ROOM.z1]} rotation-y={Math.PI} name="founder-portrait">
      <group ref={body}>
        {/* Frame: a dark box with the mat and the print set a little into it. */}
        <mesh position={[0, 0, F.depth / 2]} castShadow>
          <boxGeometry args={[OUT_W, OUT_H, F.depth]} />
          <meshStandardMaterial color="#15110d" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, F.depth + 0.0012]}>
          <planeGeometry args={[MAT_W, MAT_H]} />
          <meshStandardMaterial color="#cfc6b6" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0, F.depth + 0.0024]}>
          <planeGeometry args={[F.w, F.h]} />
          {photo ? (
            <meshStandardMaterial map={photo} color="#b9b2a8" roughness={0.9} emissive="#ffffff" emissiveMap={photo} emissiveIntensity={0.16} />
          ) : (
            <meshStandardMaterial color="#8d8478" roughness={0.95} />
          )}
        </mesh>
        {/* Glass: the resting highlight and the sweep, both additive. */}
        <mesh ref={restMesh} position={[0, 0, F.depth + 0.004]} renderOrder={2}>
          <planeGeometry args={[MAT_W, MAT_H]} />
          <meshBasicMaterial map={rest} transparent opacity={0.07} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh ref={sweepMesh} position={[0, 0, F.depth + 0.005]} renderOrder={2}>
          <planeGeometry args={[MAT_W, MAT_H]} />
          <meshBasicMaterial map={sweep} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>

      {/* Engraved plate under the frame. */}
      <mesh position={[0, PLATE_Y, 0.004]}>
        <boxGeometry args={[PLATE_W + 0.03, PLATE_H + 0.014, 0.008]} />
        <meshStandardMaterial color="#1b1612" roughness={0.6} metalness={0.35} />
      </mesh>
      <mesh ref={plateMesh} position={[0, PLATE_Y, 0.0092]}>
        <planeGeometry args={[PLATE_W, PLATE_H]} />
        <meshBasicMaterial map={plate} transparent opacity={0.5} depthWrite={false} />
      </mesh>

      <mesh
        position={[0, (HIT_Y0 + HIT_Y1) / 2, F.depth + 0.03]}
        onPointerOver={over}
        onPointerOut={out}
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
      >
        <planeGeometry args={[OUT_W + 0.06, HIT_Y1 - HIT_Y0]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
