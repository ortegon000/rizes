/**
 * Handler para animaciones de canvas con scroll usando GSAP ScrollTrigger
 * Carga frames por proximidad al viewport y los libera al alejarse.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type { CanvasSequenceOptions } from "../types/canvas.types";

const VISIBILITY_THRESHOLD = 0.01;

/** Margen antes/después del scrub para precargar / mantener frames en memoria */
const PRELOAD_VIEWPORT_MARGIN = "100%";

export type CanvasSequenceHandle = {
  kill: () => void;
};

/**
 * Configura y maneja la animación de una secuencia de canvas con scroll.
 * No descarga los ~105 frames hasta que el trigger se acerca al viewport.
 */
export function handleScrollCanvasSequence(
  options: CanvasSequenceOptions
): CanvasSequenceHandle {
  const { canvasManager, manifest, target, scrub, fadeIn, fadeOut } = options;

  const el = (
    typeof target === "string" ? document.querySelector(target)! : target
  ) as HTMLElement;

  if (!el) {
    console.error(`No se encontró el elemento target: ${target}`);
    return { kill: () => undefined };
  }

  gsap.set(el, {
    opacity: 1,
    visibility: "visible",
    transform: "translateZ(0)",
    pointerEvents: "none",
  });

  const fadeTriggers = setupFadeEffects(el, fadeIn, fadeOut);

  let scrubTween: gsap.core.Tween | null = null;
  let loadToken = 0;

  const ensureFrameScrub = () => {
    if (scrubTween) return;

    const frameObj = canvasManager.getFrameObject();
    const totalFrames = canvasManager.getTotalFrames();
    if (totalFrames <= 0) return;

    scrubTween = gsap.to(frameObj, {
      frame: totalFrames - 1,
      ease: "none",
      snap: "frame",
      scrollTrigger: {
        trigger: scrub.trigger,
        start: scrub.start || "top bottom",
        end: scrub.end || "bottom top",
        scrub: 0.5,
        pin: !!scrub.pin,
        pinSpacing: scrub.pinSpacing !== undefined ? scrub.pinSpacing : true,
        anticipatePin: scrub.pin ? 1 : 0,
        invalidateOnRefresh: true,
      },
      onUpdate: () => canvasManager.render(),
    });

    ScrollTrigger.refresh();
  };

  const ensureLoaded = () => {
    const token = ++loadToken;
    void canvasManager.loadSequence(manifest).then(() => {
      if (token !== loadToken) return;
      ensureFrameScrub();
      canvasManager.render();
    });
  };

  const releaseIfFar = () => {
    loadToken += 1;
    canvasManager.unloadSequence({ keepManifest: true });
  };

  const proximityTrigger = ScrollTrigger.create({
    trigger: scrub.trigger,
    start: `top bottom+=${PRELOAD_VIEWPORT_MARGIN}`,
    end: `bottom top-=${PRELOAD_VIEWPORT_MARGIN}`,
    onEnter: ensureLoaded,
    onEnterBack: ensureLoaded,
    onLeave: releaseIfFar,
    onLeaveBack: releaseIfFar,
  });

  // Si ya estamos dentro de la zona (p. ej. refresh mid-page), cargar ya
  if (proximityTrigger.isActive) {
    ensureLoaded();
  }

  return {
    kill: () => {
      loadToken += 1;
      proximityTrigger.kill();
      fadeTriggers.forEach((t) => t.kill());
      scrubTween?.scrollTrigger?.kill();
      scrubTween?.kill();
      scrubTween = null;
      canvasManager.destroy();
    },
  };
}

function setupFadeEffects(
  element: HTMLElement,
  fadeIn?: CanvasSequenceOptions["fadeIn"],
  fadeOut?: CanvasSequenceOptions["fadeOut"]
): ScrollTrigger[] {
  const triggers: ScrollTrigger[] = [];
  let inProgress = fadeIn ? 0 : 1;
  let outProgress = fadeOut ? 0 : 0;

  const applyVisibility = () => {
    const alpha = Math.max(0, Math.min(1, inProgress * (1 - outProgress)));
    element.style.opacity = String(alpha);

    if (alpha > VISIBILITY_THRESHOLD) {
      element.style.visibility = "visible";
      element.style.pointerEvents = "auto";
    } else {
      element.style.visibility = "hidden";
      element.style.pointerEvents = "none";
    }
  };

  if (fadeIn) {
    triggers.push(
      ScrollTrigger.create({
        trigger: fadeIn.trigger,
        start: fadeIn.start || "top center",
        end: fadeIn.end || "bottom center",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (st) => {
          inProgress = gsap.parseEase("power2.in")(st.progress);
          applyVisibility();
        },
      })
    );
  }

  if (fadeOut) {
    triggers.push(
      ScrollTrigger.create({
        trigger: fadeOut.trigger,
        start: fadeOut.start || "top center",
        end: fadeOut.end || "bottom center",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (st) => {
          outProgress = gsap.parseEase("power2.out")(st.progress);
          applyVisibility();
        },
      })
    );
  }

  applyVisibility();
  return triggers;
}
