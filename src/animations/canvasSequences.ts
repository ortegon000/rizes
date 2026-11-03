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
  fadeIn?: FadeConfig;
  fadeOut?: FadeConfig;
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
    scrub: { trigger: "#canvas-1-spacer", start: "-20% top", end: "bottom top" },
    fadeIn: { trigger: "#hero-scroll-space", start: "70% top", end: "100% top" },
    fadeOut: { trigger: "#text-images-1", start: "top bottom", end: "20% top" },
  },
  {
    id: "video2",
    canvasKey: "canvas2",
      scrub: { trigger: "#canvas-2-spacer", start: "-20% top", end: "bottom top" },
      fadeIn: { trigger: "#text-images-1", start: "40% top", end: "60% top" },
      fadeOut: { trigger: "#text-images-2", start: "top bottom", end: "20% top" },
  },
  {
    id: "video3",
    canvasKey: "canvas3",
      scrub: { trigger: "#canvas-3-spacer", start: "-20% top", end: "bottom top" },
      fadeIn: { trigger: "#text-images-2", start: "40% top", end: "60% top" },
      fadeOut: { trigger: "#text-images-3", start: "top bottom", end: "20% top" },
  },
  {
    id: "video4",
    canvasKey: "canvas4",
      scrub: { trigger: "#canvas-4-spacer", start: "-20% top", end: "bottom top" },
      fadeIn: { trigger: "#text-images-3", start: "40% top", end: "60% top" },
      fadeOut: { trigger: "#text-images-4", start: "top bottom", end: "20% top" },
  },
  {
    id: "video5",
    canvasKey: "canvas5",
      scrub: { trigger: "#canvas-5-spacer", start: "-20% top", end: "bottom top" },
      fadeIn: { trigger: "#text-images-4", start: "40% top", end: "60% top" },
      fadeOut: { trigger: "#services", start: "top bottom", end: "20% top" },
  },
];

/**
 * Configuración especial para el square video.
 * pinSpacing: true para que, al soltar el pin, el canvas siga el scroll hacia arriba
 * (con false “salta” fuera de vista). Sin fadeOut: no debe ocultarse al terminar el pin.
 */
const SQUARE_VIDEO_CONFIG: VideoConfig = {
  id: "squareVideo",
  canvasKey: "square",
  scrub: {
    trigger: "#text-images-5-canvas-container",
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: true,
  },
  fadeIn: {
    trigger: "#text-images-5-canvas-container",
    start: "top 500%",
    end: "top top",
  },
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
 * Inicializa una secuencia de video individual (frames se cargan por proximidad)
 */
function initializeVideoSequence(
  canvas: HTMLCanvasElement,
  manifest: SeqManifest,
  config: VideoConfig
) {
  const manager = new MultiSequenceCanvas(canvas);

  return handleScrollCanvasSequence({
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
function initializeStandardVideos(
  canvasRefs: CanvasRefs,
  videos: SeqManifest[]
) {
  return VIDEO_CONFIGS.flatMap((config) => {
    const canvas = canvasRefs[config.canvasKey].current;
    const video = videos.find((v) => v.id === config.id);

    if (video && canvas) {
      return [initializeVideoSequence(canvas, video, config)];
    }

    console.warn(`Video ${config.id} or canvas not found`);
    return [];
  });
}

/**
 * Inicializa el square video (con configuración especial)
 */
function initializeSquareVideo(canvasRefs: CanvasRefs, videos: SeqManifest[]) {
  const canvas = canvasRefs.square.current;
  const video = videos.find((v) => v.id === SQUARE_VIDEO_CONFIG.id);

  if (video && canvas) {
    return initializeVideoSequence(canvas, video, SQUARE_VIDEO_CONFIG);
  }

  console.warn("Square video or canvas not found");
  return null;
}

/**
 * Función principal para registrar secuencias de canvas.
 * Solo descarga el manifesto; los frames JPG se cargan al acercarse al spacer.
 */
export async function initializeCanvasSequences(
  canvasRefs: CanvasRefs
): Promise<void> {
  if (!validateCanvasRefs(canvasRefs)) {
    return;
  }

  const videos = await loadManifest();

  if (videos.length === 0) {
    console.error("No videos found in manifest");
    return;
  }

  initializeStandardVideos(canvasRefs, videos);
  initializeSquareVideo(canvasRefs, videos);
}
