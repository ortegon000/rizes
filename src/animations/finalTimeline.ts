/**
 * Animaciones del timeline final
 * Gestiona las transiciones de Customers → LastLogo → Footer
 * Similar al heroTimeline pero para las secciones finales
 */

import gsap from "gsap";

/**
 * Agrega las animaciones de Customers
 * FadeIn desde opacity 0 hasta 1, luego FadeOut
 */
function addCustomersAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .to(
      "#customers",
      {
        opacity: 1,
      },
    )
    .to(
      "#customers",
      {
        opacity: 0,
      },
      ">" // Mantener visible por 0.5s antes de hacer fade out
    );
}

/**
 * Agrega las animaciones de LastLogo
 * FadeIn después de Customers, luego FadeOut
 */
function addLastLogoAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .to(
      "#last-logo",
      {
        opacity: 1,
      },
      ">-0.3"
    ).to(
      "#lastLogoImage",
      {
        scale: 1,
      },
      ">-0.25"
    )
    .to("#lastLogoImage", {
      y: "-30dvh",
    }, ">-0.25");
}

/**
 * Agrega las animaciones de Footer
 * FadeIn al final y se queda visible
 */
function addFooterAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .to(
      "#footer",
      {
        opacity: 1,
      },
      "<"
    )
    .to("#keep-scrolling",
      {
        opacity: 0,
      },
      "<"
    );
}

/**
 * Crea el timeline final con Customers → LastLogo → Footer
 * 
 * ✅ Usa el final-scroll-space spacer para definir la duración
 */
export function createFinalTimeline(): gsap.core.Timeline {
  // ✅ Obtener el spacer que define la duración del timeline final
  const finalSpacer = document.getElementById('final-scroll-space');

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: finalSpacer,
      start: "top center", // Comienza cuando el spacer llega al top del viewport (Team ya salió)
      end: "bottom bottom", // Termina cuando el bottom del spacer llega al bottom del viewport (100% progreso)
      scrub: 1,
    },
  });

  // Agregar animaciones en secuencia
  addCustomersAnimation(timeline);
  addLastLogoAnimation(timeline);
  addFooterAnimation(timeline);

  return timeline;
}
