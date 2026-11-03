/**
 * Configuración y creación de animaciones parallax con GSAP ScrollTrigger
 */

import gsap from "gsap";

interface ParallaxConfig {
  trigger: string;
  target: string;
  y: number;
  yMobile?: number;
  start?: string;
  end?: string;
  scrub?: number;
}

const PARALLAX_CONFIGS: ParallaxConfig[] = [
  {
    trigger: "#text-images-1",
    target: "#text-images-1-right",
    y: -300,
    yMobile: -150,
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
    y: 600,
    yMobile: 300,
  },
];

export type ParallaxTeardown = () => void;

/**
 * Crea animaciones parallax y devuelve teardown (incluye matchMedia.revert).
 */
export function createParallaxAnimations(): ParallaxTeardown {
  const matchMedias: gsap.MatchMedia[] = [];
  const timelines: gsap.core.Timeline[] = [];

  PARALLAX_CONFIGS.forEach((config) => {
    if (config.yMobile !== undefined) {
      const mm = gsap.matchMedia();
      matchMedias.push(mm);

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
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
        }
      );
    } else {
      timelines.push(
        gsap
          .timeline({
            scrollTrigger: {
              trigger: config.trigger,
              start: config.start || "top bottom",
              end: config.end || "bottom top",
              scrub: config.scrub || 1,
            },
          })
          .to(config.target, { y: config.y }, 0)
      );
    }
  });

  return () => {
    matchMedias.forEach((mm) => mm.revert());
    timelines.forEach((tl) => {
      tl.scrollTrigger?.kill();
      tl.kill();
    });
  };
}

/**
 * Crea una animación parallax individual
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
