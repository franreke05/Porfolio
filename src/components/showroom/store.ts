/**
 * Mutable bridge between the page (scroll, pointer) and the render loop.
 * Nothing in here is React state: the camera reads it every frame.
 */
export type ShowroomStore = {
  /** Scroll progress the camera is heading to, 0..1. */
  target: number;
  /** Progress the camera is actually at. */
  current: number;
  pointer: { x: number; y: number };
  hover: number;
  /** Entry key ("servicios/…", "trabajo/…", "nosotros/…") the camera frames while its panel is open. */
  focus: string | null;
  /** The contact sheet is open: the camera leans in a few centimetres. */
  lean: boolean;
  /** The founder's portrait is hovered (pointer) or focused (keyboard). */
  founder: boolean;
  /** Jump instead of travelling (first frame, reduced motion, tests). */
  snap: boolean;
  invalidate: () => void;
};

export const createStore = (): ShowroomStore => ({
  target: 0,
  current: 0,
  pointer: { x: 0, y: 0 },
  hover: -1,
  focus: null,
  lean: false,
  founder: false,
  snap: true,
  invalidate: () => {},
});
