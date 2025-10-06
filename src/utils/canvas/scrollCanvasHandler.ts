/**
 * Handler para animaciones de canvas con scroll usando GSAP ScrollTrigger
 * Implementa efectos de fade in/out y scrub de frames estilo Apple
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type { CanvasSequenceOptions } from "../types/canvas.types";

// Threshold para controlar visibilidad
const VISIBILITY_THRESHOLD = 0.01;

/**
 * Configura y maneja la animación de una secuencia de canvas con scroll
 * @param options - Configuración de la animación
 */
export function handleScrollCanvasSequence(options: CanvasSequenceOptions): void {
  const { canvasManager, manifest, target, scrub, fadeIn, fadeOut } = options;

  const el = (typeof target === "string" 
    ? document.querySelector(target)! 
    : target) as HTMLElement;

  if (!el) {
    console.error(`No se encontró el elemento target: ${target}`);
    return;
  }

    // Estado visual inicial - empieza visible (los fadeIn/fadeOut controlan la visibilidad)
  gsap.set(el, {
      opacity: 1,
      visibility: "visible",
    transform: "translateZ(0)",
    pointerEvents: "none"
  });

  // Cargar secuencia
  canvasManager.loadSequence(manifest).then(() => {
    setupScrollAnimation(canvasManager, el, scrub, fadeIn, fadeOut);
  });
}

/**
 * Configura las animaciones de scroll para el canvas
 */
function setupScrollAnimation(
  canvasManager: CanvasSequenceOptions['canvasManager'],
  element: HTMLElement,
  scrub: CanvasSequenceOptions['scrub'],
  fadeIn: CanvasSequenceOptions['fadeIn'],
  fadeOut: CanvasSequenceOptions['fadeOut']
): void {
  const frameObj = canvasManager.getFrameObject();
  const totalFrames = canvasManager.getTotalFrames();

  // Animación principal de frames con GSAP (estilo Apple)
  gsap.to(frameObj, {
    frame: totalFrames - 1,
    ease: "none",
    snap: "frame", // Snap a frames completos para animación más suave
    scrollTrigger: {
      trigger: scrub.trigger,
      start: scrub.start || "top bottom",
      end: scrub.end || "bottom top",
      scrub: 0.5, // Scrub suave como en el ejemplo de Apple
      pin: !!scrub.pin,
      anticipatePin: scrub.pin ? 1 : 0,
      invalidateOnRefresh: true,
    },
    onUpdate: () => canvasManager.render(),
  });

  // Configurar sistema de opacidad y visibilidad
  setupFadeEffects(element, fadeIn, fadeOut);
}

/**
 * Configura los efectos de fade in/out con scroll
 */
function setupFadeEffects(
  element: HTMLElement,
  fadeIn: CanvasSequenceOptions['fadeIn'],
  fadeOut: CanvasSequenceOptions['fadeOut']
): void {
  let inProgress = 0;
  let outProgress = 0;

  const applyVisibility = () => {
    const alpha = Math.max(0, Math.min(1, inProgress * (1 - outProgress)));

    // Control de opacidad suave
    element.style.opacity = String(alpha);

    // Control de visibilidad - solo visible cuando hay opacidad significativa
    if (alpha > VISIBILITY_THRESHOLD) {
      element.style.visibility = "visible";
      element.style.pointerEvents = "auto";
    } else {
      element.style.visibility = "hidden";
      element.style.pointerEvents = "none";
    }
  };

  // Fade In con curva personalizada para transición más suave
  ScrollTrigger.create({
    trigger: fadeIn.trigger,
    start: fadeIn.start || "top center",
    end: fadeIn.end || "bottom center",
    scrub: 0.5,
    invalidateOnRefresh: true,
    onUpdate: (st) => {
      // Curva ease-in para fade in más suave
      inProgress = gsap.parseEase("power2.in")(st.progress);
      applyVisibility();
    },
  });

  // Fade Out con curva personalizada
  ScrollTrigger.create({
    trigger: fadeOut.trigger,
    start: fadeOut.start || "top center",
    end: fadeOut.end || "bottom center",
    scrub: 0.5,
    invalidateOnRefresh: true,
    onUpdate: (st) => {
      // Curva ease-out para fade out más suave
      outProgress = gsap.parseEase("power2.out")(st.progress);
      applyVisibility();
    },
  });

  // Aplicar estado inicial
  applyVisibility();
}
