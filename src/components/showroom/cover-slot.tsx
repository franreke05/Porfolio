"use client";

import { useLoader, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { type BufferGeometry, type Material, SRGBColorSpace, type Texture, TextureLoader } from "three";
import { box, merge } from "./geo";
import { BAY, SLOT } from "./layout";

/**
 * Shared niche fitting, in the bay's local space (z = distance from the
 * wall): dark liners that give the opening real depth, a small ledge under
 * it and the name plate mounted on the ledge front.
 */
export function createSlotFrame(): BufferGeometry {
  const w = SLOT.w / 2;
  const h = SLOT.h / 2;
  const t = 0.012;
  const front = BAY.depth - BAY.face;
  return merge([
    box(-w - t, w + t, -h - t, h + t, 0.02, 0.03, 1.6, 0.002),
    box(-w - t, -w, -h, h, 0.03, front, 1.6, 0.002),
    box(w, w + t, -h, h, 0.03, front, 1.6, 0.002),
    box(-w - t, w + t, h, h + t, 0.03, front, 1.6, 0.002),
    box(-w - t, w + t, -h - t, -h, 0.03, front, 1.6, 0.002),
    box(-w - 0.02, w + 0.02, -h - 0.028, -h, front, BAY.depth + 0.05, 1.6, 0.004),
    box(-w * 0.94, w * 0.94, -h - 0.104, -h - 0.03, BAY.depth, BAY.depth + 0.012, 1.6, 0.003),
  ]);
}

function CoverImage({ src }: { src: string }) {
  const texture = useLoader(TextureLoader, src);
  const map = useMemo(() => {
    const copy = texture.clone();
    copy.colorSpace = SRGBColorSpace;
    copy.needsUpdate = true;
    return copy;
  }, [texture]);
  return <meshStandardMaterial map={map} roughness={0.85} />;
}

export type CoverSlotProps = {
  slug: string;
  name: string;
  /** Optional 2:3 cover image. Without it the slot shows the pale placeholder. */
  coverSrc?: string;
  position: [number, number, number];
  frame: BufferGeometry;
  frameMaterial: Material;
  placeholder: Material;
  label: Texture;
  onOpen: (slug: string) => void;
  onHover: (over: boolean) => void;
};

/**
 * One independent catalogue niche: a 2:3 plane at the back of a recessed
 * opening, ready for a real cover, and a plate with the project name on the
 * ledge underneath.
 */
export function CoverSlot({ slug, name, coverSrc, position, frame, frameMaterial, placeholder, label, onOpen, onHover }: CoverSlotProps) {
  const over = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(true);
  };
  return (
    <group position={position} name={`slot-${slug}`} userData={{ slug, name }}>
      <mesh geometry={frame} material={frameMaterial} />
      <mesh
        position={[0, 0, 0.032]}
        onPointerOver={over}
        onPointerOut={() => onHover(false)}
        onClick={(event) => {
          event.stopPropagation();
          onOpen(slug);
        }}
        {...(coverSrc ? {} : { material: placeholder })}
      >
        <planeGeometry args={[SLOT.w, SLOT.h]} />
        {coverSrc ? (
          <Suspense fallback={<meshStandardMaterial color="#ece2cf" roughness={0.9} />}>
            <CoverImage src={coverSrc} />
          </Suspense>
        ) : null}
      </mesh>
      <mesh position={[0, -SLOT.h / 2 - 0.067, BAY.depth + 0.014]}>
        <planeGeometry args={[SLOT.w * 0.9, SLOT.w * 0.9 * (80 / 512)]} />
        <meshBasicMaterial map={label} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}
