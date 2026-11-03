/**
 * Tipos para el sistema de canvas de secuencias de video
 */

import type { MultiSequenceCanvas } from '@utils/canvas/MultiSequenceCanvas';

/** Must match `count` in public/videos/manifest.json (and spacer data attrs). */
export const CANVAS_SEQUENCE_FRAME_COUNT = 105;

export type SeqManifest = {
  id: string;
  baseUrl: string;
  ext: string;
  count: number;
  pad: number;
  width: number;
  height: number;
};

export type ScrollTriggerConfig = {
  trigger: string | Element;
  start?: string;
  end?: string;
  pin?: boolean;
    pinSpacing?: boolean; // Controla si el pin crea spacing (default: true)
};

export type FadeConfig = {
  trigger: string | Element;
  start?: string;
  end?: string;
};

export type CanvasSequenceOptions = {
  canvasManager: MultiSequenceCanvas;
  manifest: SeqManifest;
  target: string | Element;
  scrub: ScrollTriggerConfig;
  fadeIn?: FadeConfig;
  fadeOut?: FadeConfig;
};

// Re-export para compatibilidad
export type { MultiSequenceCanvas };
