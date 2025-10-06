/**
 * Orchestrador principal de todas las animaciones de la página
 * Coordina hero, canvas sequences, parallax y team animations
 */

import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createHeroTimeline } from "./heroTimeline";
import { initializeCanvasSequences, type CanvasRefs } from "./canvasSequences";
import { createParallaxAnimations } from "./parallaxAnimations";
import { createTeamTimeline } from "./teamTimeline";
import type { RefObject } from "react";

/**
 * Configura todas las animaciones de la página
 */
export async function setupAnimations(
  container: RefObject<HTMLDivElement | null>,
  canvasRefs: CanvasRefs
): Promise<void> {
  // 1. Hero timeline
  createHeroTimeline(container.current);

  // 2. Canvas sequences (async)
  await initializeCanvasSequences(canvasRefs);

  // 3. Parallax animations
  createParallaxAnimations();

  // 4. Team timeline
  createTeamTimeline();

  // 5. Refresh ScrollTrigger para asegurar cálculos correctos
  ScrollTrigger.refresh();
}
