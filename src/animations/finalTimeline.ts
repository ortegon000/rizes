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
    .fromTo(
      "#customers",
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power2.out" },
      0 // Comienza al inicio del timeline
    )
    .to(
      "#customers",
      { opacity: 0, duration: 0.2, ease: "power2.in" },
      0.25 // FadeOut al 25% del timeline
    );
}

/**
 * Agrega las animaciones de LastLogo
 * FadeIn después de Customers, luego FadeOut
 */
function addLastLogoAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .fromTo(
      "#last-logo",
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power2.out" },
      0.3 // Aparece al 30% cuando Customers desaparece
    )
    .to(
      "#last-logo",
      { opacity: 0, duration: 0.2, ease: "power2.in" },
      0.55 // FadeOut al 55% para dar espacio a Footer
    );
}

/**
 * Agrega las animaciones de Footer
 * FadeIn al final y se queda visible
 */
function addFooterAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .fromTo(
      "#footer",
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
      0.6 // Aparece al 60% cuando LastLogo desaparece
  ).to("#keep-scrolling", {
      opacity: 0,
  }, "<");
  // Footer se queda visible (no se hace fadeOut)
}

/**
 * Crea el timeline final con Customers → LastLogo → Footer
 * 
 * ✅ Usa el final-scroll-space spacer para definir la duración
 */
export function createFinalTimeline(container: HTMLElement | null): gsap.core.Timeline {
  // ✅ Obtener el spacer que define la duración del timeline final
  const finalSpacer = document.getElementById('final-scroll-space');
  
  // Validación: Si no existe el spacer, usar fallback
  if (!finalSpacer) {
    console.warn('[finalTimeline] final-scroll-space not found, using container fallback');
    
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=2000", // Fallback
        scrub: 1,
      },
    });

    addCustomersAnimation(timeline);
    addLastLogoAnimation(timeline);
    addFooterAnimation(timeline);

    return timeline;
  }

  // Timeline principal usando el spacer
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: finalSpacer,
      start: "top top", // Comienza cuando el spacer llega al top del viewport (Team ya salió)
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
