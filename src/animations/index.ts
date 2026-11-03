/**
 * Exportaciones principales del módulo de animaciones
 */

export {
  setupAnimations,
  type AnimationTeardown,
} from "./setupAnimations";
export { createHeroTimeline } from "./heroTimeline";
export { createFinalTimeline } from "./finalTimeline";
export {
  createAtmosphereTimeline,
  applyStaticAtmosphere,
  type AtmosphereTeardown,
} from "./atmosphereTimeline";
export {
  createParallaxAnimations,
  createSingleParallax,
  type ParallaxTeardown,
} from "./parallaxAnimations";
export {
  initializeCanvasSequences,
  type CanvasRefs,
  type CanvasSequencesTeardown,
} from "./canvasSequences";
export { CANVAS_SEQUENCE_FRAME_COUNT } from "@utils/types/canvas.types";
