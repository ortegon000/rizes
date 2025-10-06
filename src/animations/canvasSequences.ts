/**
 * Configuraciones para las secuencias de canvas de video
 * 
 * ✅ Actualizado: Ahora usa canvas spacers y valores relativos
 */

import type { RefObject } from "react";
import { MultiSequenceCanvas, handleScrollCanvasSequence } from "@utils/canvas";
import type { SeqManifest, ScrollTriggerConfig, FadeConfig } from "@utils/types/canvas.types";
// import { EndCalculator } from "@utils/animations"; // ✅ Disponible para ajustes futuros

/**
 * Estructura de referencias de canvas
 */
export interface CanvasRefs {
  canvas1: RefObject<HTMLCanvasElement | null>;
  canvas2: RefObject<HTMLCanvasElement | null>;
  canvas3: RefObject<HTMLCanvasElement | null>;
  canvas4: RefObject<HTMLCanvasElement | null>;
  canvas5: RefObject<HTMLCanvasElement | null>;
  square: RefObject<HTMLCanvasElement | null>;
}

/**
 * Configuración de un video individual
 */
interface VideoConfig {
  id: string;
  canvasKey: keyof CanvasRefs;
  scrub: ScrollTriggerConfig;
  fadeIn: FadeConfig;
  fadeOut: FadeConfig;
}

/**
 * Configuraciones para todos los videos
 * 
 * ✅ Actualizado: Ahora usa canvas spacers en lugar de triggers negativos
 */
const VIDEO_CONFIGS: VideoConfig[] = [
  {
    id: "video1",
    canvasKey: "canvas1",
        // ✅ Usa el spacer dedicado con valores relativos
        scrub: { trigger: "#canvas-1-spacer", start: "top top", end: "bottom top" },
        // ✅ FadeIn cuando el hero está terminando
        fadeIn: { trigger: "#hero-scroll-space", start: "80% top", end: "100% top" },
        // ✅ FadeOut cuando entra la siguiente sección
        fadeOut: { trigger: "#text-images-1", start: "top bottom", end: "top center" },
  },
  {
    id: "video2",
    canvasKey: "canvas2",
      scrub: { trigger: "#canvas-2-spacer", start: "top top", end: "bottom top" },
      fadeIn: { trigger: "#text-images-1", start: "80% top", end: "100% top" },
      fadeOut: { trigger: "#text-images-2", start: "top bottom", end: "top center" },
  },
  {
    id: "video3",
    canvasKey: "canvas3",
      scrub: { trigger: "#canvas-3-spacer", start: "top top", end: "bottom top" },
      fadeIn: { trigger: "#text-images-2", start: "80% top", end: "100% top" },
      fadeOut: { trigger: "#text-images-3", start: "top bottom", end: "top center" },
  },
  {
    id: "video4",
    canvasKey: "canvas4",
      scrub: { trigger: "#canvas-4-spacer", start: "top top", end: "bottom top" },
      fadeIn: { trigger: "#text-images-3", start: "80% top", end: "100% top" },
      fadeOut: { trigger: "#text-images-4", start: "top bottom", end: "top center" },
  },
  {
    id: "video5",
    canvasKey: "canvas5",
      scrub: { trigger: "#canvas-5-spacer", start: "top top", end: "bottom top" },
      fadeIn: { trigger: "#text-images-4", start: "80% top", end: "100% top" },
      fadeOut: { trigger: "#services", start: "top bottom", end: "top center" },
  },
];

/**
 * Configuración especial para el square video
 */
const SQUARE_VIDEO_CONFIG: VideoConfig = {
  id: "squareVideo",
  canvasKey: "square",
  scrub: { trigger: "#text-images-5-canvas-container", start: "top top", end: "bottom top", pin: true },
  fadeIn: { trigger: "#text-images-5-canvas-container", start: "top 500%", end: "top top" },
  fadeOut: { trigger: "#text-images-5-canvas-container", start: "bottom top", end: "bottom top+=100" },
};

/**
 * Carga el manifest de videos desde el servidor
 */
async function loadManifest(): Promise<SeqManifest[]> {
  try {
    const res = await fetch("/videos/manifest.json", { cache: "force-cache" });
    
    if (!res.ok) {
      throw new Error(`Failed to load manifest: ${res.status}`);
    }

    const data = await res.json();
    return data.videos as SeqManifest[];
  } catch (error) {
    console.error("Error loading video manifest:", error);
    return [];
  }
}

/**
 * Valida que todas las referencias de canvas estén disponibles
 */
function validateCanvasRefs(canvasRefs: CanvasRefs): boolean {
  const allRefsReady = Object.values(canvasRefs).every((ref) => ref.current !== null);

  if (!allRefsReady) {
    console.error("Canvas refs not ready");
    return false;
  }

  return true;
}

/**
 * Inicializa una secuencia de video individual
 */
function initializeVideoSequence(
  canvas: HTMLCanvasElement,
  manifest: SeqManifest,
  config: VideoConfig
): void {
  const manager = new MultiSequenceCanvas(canvas);

  handleScrollCanvasSequence({
    canvasManager: manager,
    manifest,
    target: canvas.parentElement!,
    scrub: config.scrub,
    fadeIn: config.fadeIn,
    fadeOut: config.fadeOut,
  });
}

/**
 * Inicializa todas las secuencias de video estándar
 */
function initializeStandardVideos(canvasRefs: CanvasRefs, videos: SeqManifest[]): void {
  VIDEO_CONFIGS.forEach((config) => {
    const canvas = canvasRefs[config.canvasKey].current;
    const video = videos.find((v) => v.id === config.id);

    if (video && canvas) {
      initializeVideoSequence(canvas, video, config);
    } else {
      console.warn(`Video ${config.id} or canvas not found`);
    }
  });
}

/**
 * Inicializa el square video (con configuración especial)
 */
function initializeSquareVideo(canvasRefs: CanvasRefs, videos: SeqManifest[]): void {
  const canvas = canvasRefs.square.current;
  const video = videos.find((v) => v.id === SQUARE_VIDEO_CONFIG.id);

  if (video && canvas) {
    initializeVideoSequence(canvas, video, SQUARE_VIDEO_CONFIG);
  } else {
    console.warn("Square video or canvas not found");
  }
}

/**
 * Función principal para inicializar todas las secuencias de canvas
 */
export async function initializeCanvasSequences(canvasRefs: CanvasRefs): Promise<void> {
  // Validar refs
  if (!validateCanvasRefs(canvasRefs)) {
    return;
  }

  // Cargar manifest
  const videos = await loadManifest();
  
  if (videos.length === 0) {
    console.error("No videos found in manifest");
    return;
  }

  // Inicializar videos estándar
  initializeStandardVideos(canvasRefs, videos);

  // Inicializar square video
  initializeSquareVideo(canvasRefs, videos);

  console.log("✅ Canvas sequences initialized:", videos.map((v) => v.id));
}
