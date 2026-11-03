/**
 * Configuraciones para las secuencias de canvas de video
 */

import type { RefObject } from "react";
import {
  MultiSequenceCanvas,
  handleScrollCanvasSequence,
  type CanvasSequenceHandle,
} from "@utils/canvas";
import type {
  SeqManifest,
  ScrollTriggerConfig,
  FadeConfig,
} from "@utils/types/canvas.types";

export interface CanvasRefs {
  canvas1: RefObject<HTMLCanvasElement | null>;
  canvas2: RefObject<HTMLCanvasElement | null>;
  canvas3: RefObject<HTMLCanvasElement | null>;
  canvas4: RefObject<HTMLCanvasElement | null>;
  canvas5: RefObject<HTMLCanvasElement | null>;
  square: RefObject<HTMLCanvasElement | null>;
}

export type CanvasSequencesTeardown = () => void;

interface VideoConfig {
  id: string;
  canvasKey: keyof CanvasRefs;
  scrub: ScrollTriggerConfig;
  fadeIn?: FadeConfig;
  fadeOut?: FadeConfig;
}

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
 * pinSpacing: true para que al soltar el pin el canvas siga el scroll.
 * Sin fadeOut para no ocultarlo al terminar el pin.
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

async function loadManifest(signal?: AbortSignal): Promise<SeqManifest[]> {
  try {
    const res = await fetch("/videos/manifest.json", {
      cache: "force-cache",
      signal,
    });

    if (!res.ok) {
      throw new Error(`Failed to load manifest: ${res.status}`);
    }

    const data = await res.json();
    return data.videos as SeqManifest[];
  } catch (error) {
    if (signal?.aborted) return [];
    console.error("Error loading video manifest:", error);
    return [];
  }
}

function validateCanvasRefs(canvasRefs: CanvasRefs): boolean {
  const allRefsReady = Object.values(canvasRefs).every(
    (ref) => ref.current !== null
  );

  if (!allRefsReady) {
    console.error("Canvas refs not ready");
    return false;
  }

  return true;
}

function initializeVideoSequence(
  canvas: HTMLCanvasElement,
  manifest: SeqManifest,
  config: VideoConfig
): CanvasSequenceHandle {
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
 * Registra secuencias de canvas. Devuelve teardown que destruye managers + triggers.
 * Los frames JPG siguen cargándose por proximidad.
 */
export async function initializeCanvasSequences(
  canvasRefs: CanvasRefs,
  signal?: AbortSignal
): Promise<CanvasSequencesTeardown> {
  const handles: CanvasSequenceHandle[] = [];
  const teardown = () => {
    handles.forEach((h) => h.kill());
    handles.length = 0;
  };

  if (!validateCanvasRefs(canvasRefs) || signal?.aborted) {
    return teardown;
  }

  const videos = await loadManifest(signal);

  if (signal?.aborted || videos.length === 0) {
    if (videos.length === 0 && !signal?.aborted) {
      console.error("No videos found in manifest");
    }
    return teardown;
  }

  for (const config of VIDEO_CONFIGS) {
    if (signal?.aborted) {
      teardown();
      return teardown;
    }
    const canvas = canvasRefs[config.canvasKey].current;
    const video = videos.find((v) => v.id === config.id);
    if (video && canvas) {
      handles.push(initializeVideoSequence(canvas, video, config));
    } else {
      console.warn(`Video ${config.id} or canvas not found`);
    }
  }

  if (signal?.aborted) {
    teardown();
    return teardown;
  }

  const squareCanvas = canvasRefs.square.current;
  const squareVideo = videos.find((v) => v.id === SQUARE_VIDEO_CONFIG.id);
  if (squareVideo && squareCanvas) {
    handles.push(
      initializeVideoSequence(squareCanvas, squareVideo, SQUARE_VIDEO_CONFIG)
    );
  } else {
    console.warn("Square video or canvas not found");
  }

  if (signal?.aborted) {
    teardown();
  }

  return teardown;
}
