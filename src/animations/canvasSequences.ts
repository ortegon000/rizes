/**
 * Configuraciones para las secuencias de canvas de video
 */

import type { RefObject } from "react";
import { MultiSequenceCanvas, handleScrollCanvasSequence } from "@utils/canvas";
import type { SeqManifest, ScrollTriggerConfig, FadeConfig } from "@utils/types/canvas.types";

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
 */
const VIDEO_CONFIGS: VideoConfig[] = [
  {
    id: "video1",
    canvasKey: "canvas1",
    scrub: { trigger: "#text-images-1", start: "-150% bottom", end: "bottom top" },
    fadeIn: { trigger: "#hero-description", start: "65% top", end: "80% top" },
    fadeOut: { trigger: "#text-images-1", start: "20% center", end: "45% center" },
  },
  {
    id: "video2",
    canvasKey: "canvas2",
    scrub: { trigger: "#text-images-2", start: "-120% bottom", end: "bottom top" },
    fadeIn: { trigger: "#text-images-1", start: "65% top", end: "80% top" },
    fadeOut: { trigger: "#text-images-2", start: "20% center", end: "45% center" },
  },
  {
    id: "video3",
    canvasKey: "canvas3",
    scrub: { trigger: "#text-images-3", start: "-120% bottom", end: "bottom top" },
    fadeIn: { trigger: "#text-images-2", start: "65% top", end: "80% top" },
    fadeOut: { trigger: "#text-images-3", start: "20% center", end: "45% center" },
  },
  {
    id: "video4",
    canvasKey: "canvas4",
    scrub: { trigger: "#text-images-4", start: "-120% bottom", end: "bottom top" },
    fadeIn: { trigger: "#text-images-3", start: "65% top", end: "80% top" },
    fadeOut: { trigger: "#text-images-4", start: "20% center", end: "45% center" },
  },
  {
    id: "video5",
    canvasKey: "canvas5",
    scrub: { trigger: "#services", start: "-120% bottom", end: "bottom top" },
    fadeIn: { trigger: "#text-images-4", start: "65% top", end: "80% top" },
    fadeOut: { trigger: "#services", start: "90% bottom", end: "90% top" },
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
