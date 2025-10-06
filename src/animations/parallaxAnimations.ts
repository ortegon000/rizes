/**
 * Configuración y creación de animaciones parallax con GSAP ScrollTrigger
 */

import gsap from "gsap";

interface ParallaxConfig {
  trigger: string;
  target: string;
  y: number;
  start?: string;
  end?: string;
  scrub?: number;
}

/**
 * Configuraciones de parallax para diferentes secciones
 */
const PARALLAX_CONFIGS: ParallaxConfig[] = [
  {
    trigger: "#text-images-1",
    target: "#text-images-1-right",
    y: -300,
  },
  {
    trigger: "#text-images-2",
    target: "#text-images-2-right",
    y: -300,
  },
  {
    trigger: "#text-images-3",
    target: "#text-images-3-left",
    y: -300,
  },
  {
    trigger: "#text-images-4",
    target: "#text-images-4-right",
    y: -300,
  },
  {
    trigger: "#banner-1",
    target: "#banner-1-image",
    y: -300,
  },
  {
    trigger: "#text-images-5",
    target: "#text-images-5-right",
    y: 600,
  },
];

/**
 * Crea todas las animaciones parallax basadas en la configuración
 */
export function createParallaxAnimations(): void {
  PARALLAX_CONFIGS.forEach((config) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: config.trigger,
          start: config.start || "top bottom",
          end: config.end || "bottom top",
          scrub: config.scrub || 1,
        },
      })
      .to(config.target, { y: config.y }, 0);
  });
}

/**
 * Crea una animación parallax individual
 * Útil para casos personalizados fuera de la configuración estándar
 */
export function createSingleParallax(config: ParallaxConfig): gsap.core.Timeline {
  return gsap
    .timeline({
      scrollTrigger: {
        trigger: config.trigger,
        start: config.start || "top bottom",
        end: config.end || "bottom top",
        scrub: config.scrub || 1,
      },
    })
    .to(config.target, { y: config.y }, 0);
}
