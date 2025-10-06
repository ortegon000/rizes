/**
 * Animaciones del timeline de la sección Team
 */

import gsap from "gsap";

/**
 * Crea el parallax del team (imagen y descripción)
 */
function createTeamParallax(): void {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#team",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    })
    .to("#team-image", { y: "80%" }, 0)
    .to("#team-description", { y: -200, ease: "power1.inOut" }, 0.2);
}

/**
 * Crea la secuencia de transición de team a footer
 * Incluye: customers fade, lastLogo appearance, y footer reveal
 */
function createTeamToFooterSequence(): void {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#team-description",
        start: "bottom center-=200",
        end: "+=2000",
        scrub: 1,
      },
    })
    .to("#customers", { opacity: 1 }, 0)
    .to("#customers", { opacity: 0 }, ">2")
    .to("#lastLogo", { opacity: 1 }, ">-0.3")
    .to("#lastLogoImage", { scale: 1, ease: "power1.inOut" }, "<")
    .to("#lastLogo", { backgroundColor: "#1d1b22" }, ">")
    .to("#lastLogo", { y: -100 }, ">0.5")
    .to("#footer", { y: 0 }, "<");
}

/**
 * Inicializa todas las animaciones relacionadas con Team
 */
export function createTeamTimeline(): void {
  createTeamParallax();
  createTeamToFooterSequence();
}
