/**
 * Animaciones del timeline del Hero
 * Gestiona las transiciones del logo, intro y description
 */

import gsap from "gsap";

/**
 * Agrega las animaciones del hero key (logo inicial)
 */
function addHeroKeyAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .to("#hero-key", { scale: 1 }, 0)
    .to("#hero-key-logo", { opacity: 0, scale: 0.5 }, "<")
    .to("#hero-key-logo-mask", { maskSize: "200px", ease: "power4.out", duration: 1 }, "<")
    .to("#hero-key-background", { display: "none" }, ">-0.2")
    .to("#hero-key-logo-mask", { opacity: 0 }, ">-0.5");
}

/**
 * Agrega las animaciones del hero intro
 */
function addHeroIntroAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .fromTo(
      "#hero-intro-entrance",
      { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
      { maskImage: "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)" },
      ">-0.45"
    )
    .fromTo(
      "#hero-intro-exit",
      { maskImage: "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)" },
      { maskImage: "radial-gradient(circle at 50% -150%, transparent 50%, black 50%)" },
      ">"
    )
    .to("#hero-intro", { opacity: 0 }, "<");
}

/**
 * Agrega las animaciones de la descripción del hero
 */
function addHeroDescriptionAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .fromTo(
      "#hero-description-entrance",
      { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
      { maskImage: "radial-gradient(circle at 50% -150%, black 50%, transparent 50%)" },
      ">-0.25"
    )
    .to("#hero-description", { opacity: 0 }, ">0.25");
}

/**
 * Verifica si el overlay del hero debe mostrarse
 */
function shouldShowHeroOverlay(): boolean {
  const heroKey = document.getElementById("hero-key");
  return heroKey?.getAttribute("data-overlay-hidden") !== "true";
}

/**
 * Crea el timeline principal del hero con todas sus animaciones
 */
export function createHeroTimeline(container: HTMLElement | null): gsap.core.Timeline {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: "+=4000",
      scrub: 1,
    },
  });

  // Solo agregar animación del key si el overlay está visible
  if (shouldShowHeroOverlay()) {
    addHeroKeyAnimation(timeline);
  }

  // Agregar animaciones del intro y descripción
  addHeroIntroAnimation(timeline);
  addHeroDescriptionAnimation(timeline);

  return timeline;
}
