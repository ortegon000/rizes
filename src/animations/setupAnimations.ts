/**
 * Orchestrador principal de todas las animaciones de la página.
 * Devuelve un teardown para liberar canvas managers, timelines y matchMedia.
 */

import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createHeroTimeline } from "./heroTimeline";
import { createFinalTimeline } from "./finalTimeline";
import {
  initializeCanvasSequences,
  type CanvasRefs,
} from "./canvasSequences";
import { createParallaxAnimations } from "./parallaxAnimations";
import { createTeamTimeline } from "./teamTimeline";

export type AnimationTeardown = () => void;

/**
 * Configura todas las animaciones. Si `signal` se aborta a mitad (remount/refresh),
 * no deja managers huérfanos y el teardown es no-op o limpia lo creado.
 */
export async function setupAnimations(
  canvasRefs: CanvasRefs,
  signal?: AbortSignal
): Promise<AnimationTeardown> {
  const cleanups: AnimationTeardown[] = [];
  let settled = false;

  const teardown: AnimationTeardown = () => {
    while (cleanups.length) {
      const fn = cleanups.pop();
      try {
        fn?.();
      } catch (error) {
        console.error("Error during animation teardown:", error);
      }
    }
  };

  if (signal?.aborted) {
    return teardown;
  }

  const heroTimeline = createHeroTimeline();
  cleanups.push(() => {
    heroTimeline.scrollTrigger?.kill();
    heroTimeline.kill();
  });

  const canvasTeardown = await initializeCanvasSequences(canvasRefs, signal);
  cleanups.push(canvasTeardown);

  if (signal?.aborted) {
    teardown();
    return () => undefined;
  }

  cleanups.push(createParallaxAnimations());

  createTeamTimeline();

  const finalTimeline = createFinalTimeline();
  cleanups.push(() => {
    finalTimeline.scrollTrigger?.kill();
    finalTimeline.kill();
  });

  ScrollTrigger.refresh();
  settled = true;

  if (signal?.aborted) {
    teardown();
    return () => undefined;
  }

  return () => {
    if (!settled) return;
    teardown();
  };
}
