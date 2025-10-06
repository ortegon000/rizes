/**
 * Animaciones del timeline de la sección Team
 */

import gsap from "gsap";

/**
 * Crea el parallax del team (imagen y descripción)
 */
// function createTeamParallax(): void {
//   gsap
//     .timeline({
//       scrollTrigger: {
//         trigger: "#team",
//         start: "top bottom",
//         end: "bottom bottom",
//         scrub: 1,
//       },
//     })
//     .to("#team-image", { y: "80%" }, 0)
//     .to("#team-description", { y: -200, ease: "power1.inOut" }, 0.2);
// }

/**
 * Crea la secuencia de transición de team a footer
 * NOTA: Las animaciones de opacity de customers, lastLogo y footer
 * ahora están gestionadas por finalTimeline.ts
 * Aquí solo mantenemos las transformaciones específicas de lastLogo
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
      .to("#lastLogoImage", { scale: 1, ease: "power1.inOut" }, 0)
      .to("#last-logo", { backgroundColor: "#1d1b22" }, ">")
      .to("#last-logo", { y: -100 }, ">0.5")
    .to("#footer", { y: 0 }, "<");
}

/**
 * Inicializa todas las animaciones relacionadas con Team
 */
export function createTeamTimeline(): void {
    //   createTeamParallax();
    //   createTeamToFooterSequence();
}
