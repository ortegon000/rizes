/**
 * Configuración y creación de animaciones parallax con GSAP ScrollTrigger
 * 
 * ✅ Ya usa buenos valores relativos ("top bottom", "bottom top")
 * ✅ Añadido soporte responsive opcional
 */

import gsap from "gsap";

interface ParallaxConfig {
  trigger: string;
  target: string;
  y: number;
  yMobile?: number; // ✅ Opcional: valor diferente para mobile
  start?: string;
  end?: string;
  scrub?: number;
}

/**
 * Configuraciones de parallax para diferentes secciones
 * 
 * ✅ Los valores ya son buenos (relativos al trigger)
 * ✅ Puedes añadir yMobile para ajuste responsive
 */
const PARALLAX_CONFIGS: ParallaxConfig[] = [
  {
    trigger: "#text-images-1",
    target: "#text-images-1-right",
    y: -300,
    yMobile: -150, // ✅ 50% en mobile para mejor rendimiento
  },
  {
    trigger: "#text-images-2",
    target: "#text-images-2-right",
    y: -300,
    yMobile: -150,
  },
  {
    trigger: "#text-images-3",
    target: "#text-images-3-left",
    y: -300,
      yMobile: -150,
  },
  {
    trigger: "#text-images-4",
    target: "#text-images-4-right",
    y: -150,
    yMobile: -150,
  },
  {
    trigger: "#banner-1",
    target: "#banner-1-image",
    y: -300,
    yMobile: -150,
  },
  {
    trigger: "#text-images-5",
    target: "#text-images-5-right",
    y: 600, // ✅ Movimiento opuesto (hacia abajo)
    yMobile: 300,
  },
];

/**
 * Crea todas las animaciones parallax basadas en la configuración
 * 
 * ✅ Ahora con soporte responsive usando matchMedia
 */
export function createParallaxAnimations(): void {
  PARALLAX_CONFIGS.forEach((config) => {
      // ✅ Si tiene valor mobile, usar matchMedia para responsive
      if (config.yMobile !== undefined) {
          const mm = gsap.matchMedia();

          mm.add({
              isDesktop: "(min-width: 768px)",
              isMobile: "(max-width: 767px)",
          }, (context) => {
              const { isDesktop } = context.conditions as { isDesktop: boolean };
              const yValue = isDesktop ? config.y : config.yMobile!;

              gsap
                  .timeline({
                      scrollTrigger: {
                          trigger: config.trigger,
                          start: config.start || "top bottom",
                          end: config.end || "bottom top",
                          scrub: config.scrub || 1,
                      },
                  })
                  .to(config.target, { y: yValue }, 0);
          });
      } else {
      // ✅ Valor único para todos los dispositivos
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
    }
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
