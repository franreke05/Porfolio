import type { ContactIntent } from "@/lib/leads/model";
import type { StageId } from "./content";

/**
 * The line between the site header (in the layout) and the showroom (in the
 * page). The header asks for a stage or the contact sheet; the showroom
 * reports the stage the camera is on so the header can mark its link.
 */
export type ShowroomCommand =
  | { type: "stage"; stage: StageId; keyboard?: boolean }
  | { type: "contact"; intent?: ContactIntent };

type Handler = (command: ShowroomCommand) => void;
let handler: Handler | null = null;
let stage: StageId | null = "inicio";
const listeners = new Set<() => void>();

/** Returns false when no showroom is listening: the caller lets its link navigate. */
export function sendToShowroom(command: ShowroomCommand): boolean {
  if (!handler) return false;
  handler(command);
  return true;
}

export function listenToHeader(next: Handler): () => void {
  handler = next;
  return () => {
    if (handler === next) handler = null;
  };
}

export function reportStage(next: StageId | null) {
  if (next === stage) return;
  stage = next;
  listeners.forEach((notify) => notify());
}

export const subscribeToStage = (notify: () => void) => {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
};
export const currentStage = () => stage;
