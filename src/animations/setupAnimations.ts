/**
 * Orchestrador principal de todas las animaciones de la página
 * Coordina hero, canvas sequences, parallax, team y final animations
 */

import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createHeroTimeline } from "./heroTimeline";
import { createFinalTimeline } from "./finalTimeline";
import { initializeCanvasSequences, type CanvasRefs } from "./canvasSequences";
import { createParallaxAnimations } from "./parallaxAnimations";
import { createTeamTimeline } from "./teamTimeline";

/**
 * Configura todas las animaciones de la página
 */
export async function setupAnimations(
  canvasRefs: CanvasRefs
): Promise<void> {
  // const startTime = performance.now();

    // 1. Hero timeline
    createHeroTimeline();

  // 2. Canvas sequences (async) - ⏳ Esto precarga TODAS las imágenes
  // const canvasStartTime = performance.now();
    await initializeCanvasSequences(canvasRefs);
  // const canvasEndTime = performance.now();
  // 

    // 3. Parallax animations
    createParallaxAnimations();

    // 4. Team timeline
    createTeamTimeline();

    // 5. Final timeline (Customers → LastLogo → Footer)
  createFinalTimeline();

    // 6. Refresh ScrollTrigger para asegurar cálculos correctos
    ScrollTrigger.refresh();

  // const endTime = performance.now();
  // console.log(`🎉 Setup completo en ${((endTime - startTime) / 1000).toFixed(2)}s`);
}
