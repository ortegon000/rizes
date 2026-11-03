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
  createParallaxAnimations,
  createSingleParallax,
  type ParallaxTeardown,
} from "./parallaxAnimations";
export { createTeamTimeline } from "./teamTimeline";
export {
  initializeCanvasSequences,
  type CanvasRefs,
  type CanvasSequencesTeardown,
} from "./canvasSequences";
