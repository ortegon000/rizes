/**
 * Color journey for the page background.
 * A fixed viewport layer shifts through a few key hues on scroll —
 * same idea as the old long body gradient, without painting a 1900vh stripe.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

/** Distilled from the previous 31-stop body gradient. */
const ATMOSPHERE_STOPS = [
  "hsl(215, 60%, 10%)",
  "hsl(355, 60%, 13%)",
  "hsl(275, 58%, 14%)",
  "hsl(5, 64%, 18%)",
  "hsl(220, 60%, 12%)",
] as const;

export type AtmosphereTeardown = () => void;

export function createAtmosphereTimeline(): AtmosphereTeardown {
  const layer = document.getElementById("page-atmosphere");
  if (!layer) return () => undefined;

  gsap.set(layer, { backgroundColor: ATMOSPHERE_STOPS[0] });

  const tween = gsap.to(layer, {
    keyframes: ATMOSPHERE_STOPS.slice(1).map((backgroundColor) => ({
      backgroundColor,
    })),
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/** Static mid-journey tone when motion is reduced. */
export function applyStaticAtmosphere(): void {
  const layer = document.getElementById("page-atmosphere");
  if (!layer) return;
  gsap.set(layer, {
    backgroundColor: ATMOSPHERE_STOPS[Math.floor(ATMOSPHERE_STOPS.length / 2)],
  });
  ScrollTrigger.refresh();
}
