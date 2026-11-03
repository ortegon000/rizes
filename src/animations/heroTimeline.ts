/**
 * Animaciones del timeline del Hero
 * Gestiona las transiciones del logo, intro y descripción durante hero-scroll-space.
 */

import gsap from "gsap";

const HERO_MASK_END_PX = 200;

/** Tamaño inicial en px (mismo unit que el final → GSAP interpola bien). */
function heroMaskStartPx(): number {
  const edge = Math.max(window.innerWidth, window.innerHeight);
  // Debe ser lo bastante grande para quedar “dentro” de un trazo del logo (full-bleed),
  // pero lejos de miles de vw (eso rompe el GPU de Chrome de forma intermitente).
  return Math.round(edge * 18);
}

/**
 * Agrega las animaciones del hero key (logo inicial).
 * Anima la CSS var para que -webkit-mask-size y mask-size no se desincronicen.
 */
function addHeroKeyAnimation(timeline: gsap.core.Timeline): void {
  const startPx = heroMaskStartPx();
  gsap.set("#hero-key-logo-mask", {
    "--hero-mask-size": `${startPx}px`,
  });

  timeline
    .to("#hero-key", { scale: 1 }, 0)
    .to(
      "#hero-key-logo-mask",
      {
        "--hero-mask-size": `${HERO_MASK_END_PX}px`,
        ease: "power4.out",
        duration: 1,
      },
      "<"
    )
    .to(
      "#hero-key-background",
      { autoAlpha: 0, duration: 0.35, ease: "power1.out" },
      ">-0.15"
    )
    .to(
      "#hero-key-logo-mask",
      { autoAlpha: 0, duration: 0.4, ease: "power1.out" },
      ">-0.2"
    );
}

/**
 * Gradientes de máscara con prefijo webkit (Chrome/Safari).
 */
function maskGradientPair(value: string) {
  return {
    maskImage: value,
    webkitMaskImage: value,
  };
}

/**
 * Agrega las animaciones del hero intro
 */
function addHeroIntroAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .fromTo(
      "#hero-intro-entrance",
      maskGradientPair(
        "radial-gradient(circle at 50% 10%, black 70%, transparent 100%)"
      ),
      maskGradientPair(
        "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)"
      ),
      "<-0.3"
    )
    .fromTo(
      "#hero-intro-exit",
      maskGradientPair(
        "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)"
      ),
      maskGradientPair(
        "radial-gradient(circle at 50% -150%, transparent 50%, black 50%)"
      ),
      ">"
    )
    .to("#hero-intro", { autoAlpha: 0 }, "<");
}

/**
 * Agrega las animaciones de la descripción del hero
 */
function addHeroDescriptionAnimation(timeline: gsap.core.Timeline): void {
  timeline
    .fromTo(
      "#hero-description-entrance",
      maskGradientPair(
        "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)"
      ),
      maskGradientPair(
        "radial-gradient(circle at 50% -150%, black 50%, transparent 50%)"
      ),
      ">-0.3"
    )
    .to("#hero-description", { autoAlpha: 0 }, ">0.3");
}

/**
 * Verifica si el overlay del hero debe mostrarse
 */
function shouldShowHeroOverlay(): boolean {
  const heroKey = document.getElementById("hero-key");
  return heroKey?.getAttribute("data-overlay-hidden") !== "true";
}

export function createHeroTimeline(): gsap.core.Timeline {
  const heroSpacer = document.getElementById("hero-scroll-space");

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroSpacer,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      id: "hero-timeline",
    },
  });

  if (shouldShowHeroOverlay()) {
    addHeroKeyAnimation(timeline);
  }

  addHeroIntroAnimation(timeline);
  addHeroDescriptionAnimation(timeline);

  return timeline;
}
