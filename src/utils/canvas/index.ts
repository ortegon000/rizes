/**
 * Exportaciones principales del módulo de canvas
 */

export { MultiSequenceCanvas } from "./MultiSequenceCanvas";
export {
  handleScrollCanvasSequence,
  type CanvasSequenceHandle,
} from "./scrollCanvasHandler";
export { padNumber, getFrameUrl, calculateCoverDimensions } from "./helpers";
export type {
  SeqManifest,
  ScrollTriggerConfig,
  FadeConfig,
  CanvasSequenceOptions,
} from "../types/canvas.types";
