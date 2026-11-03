/**
 * Clase para manejar canvas con múltiples secuencias de video/imágenes
 * Optimizado para animaciones suaves estilo Apple con soporte para object-fit: cover
 */

import { getFrameUrl, calculateCoverDimensions } from "./helpers";
import type { SeqManifest } from "../types/canvas.types";

/** Evita buffers enormes en pantallas 3x (ahorro GPU ~4/9 vs dpr sin tope). */
const MAX_DEVICE_PIXEL_RATIO = 2;
const RESIZE_DEBOUNCE_MS = 150;

function cappedDevicePixelRatio(): number {
  return Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
}

export class MultiSequenceCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private images: (HTMLImageElement | null)[] = [];
  private frameObj = { frame: 0 };
  private manifest: SeqManifest | null = null;
  private resizeHandler: () => void;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private loadGeneration = 0;
  private loaded = false;
  private loadingPromise: Promise<void> | null = null;
  private lastDrawnFrame = -1;
  private cssWidth = 0;
  private cssHeight = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
    });

    if (!context) {
      throw new Error("No se pudo obtener el contexto 2D del canvas");
    }

    this.ctx = context;
    // "medium" es suficiente para scrub de frames y más barato que "high"
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "medium";

    this.updateCanvasSize();

    this.resizeHandler = () => {
      if (this.resizeTimer) clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.resizeTimer = null;
        this.updateCanvasSize();
      }, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", this.resizeHandler);
  }

  private updateCanvasSize(): void {
    if (!this.loaded) {
      // Sin secuencia activa no hace falta buffer GPU a resolución completa
      return;
    }

    const container = this.canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    if (containerWidth <= 0 || containerHeight <= 0) return;

    const dpr = cappedDevicePixelRatio();
    if (
      containerWidth === this.cssWidth &&
      containerHeight === this.cssHeight &&
      dpr === this.dpr
    ) {
      return;
    }

    this.cssWidth = containerWidth;
    this.cssHeight = containerHeight;
    this.dpr = dpr;

    this.canvas.width = Math.round(containerWidth * dpr);
    this.canvas.height = Math.round(containerHeight * dpr);
    this.canvas.style.width = `${containerWidth}px`;
    this.canvas.style.height = `${containerHeight}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "medium";

    this.lastDrawnFrame = -1;
    this.render();
  }

  /** Libera el backing store GPU del canvas (0×0) mientras no hay frames. */
  private releaseBackingStore(): void {
    this.cssWidth = 0;
    this.cssHeight = 0;
    this.dpr = 1;
    this.lastDrawnFrame = -1;
    this.canvas.width = 0;
    this.canvas.height = 0;
  }

  isSequenceLoaded(): boolean {
    return this.loaded;
  }

  getManifestId(): string | null {
    return this.manifest?.id ?? null;
  }

  async loadSequence(manifest: SeqManifest): Promise<void> {
    if (this.loaded && this.manifest?.id === manifest.id) {
      return;
    }

    if (this.loadingPromise && this.manifest?.id === manifest.id) {
      return this.loadingPromise;
    }

    this.unloadSequence({ keepManifest: false });
    this.manifest = manifest;
    const generation = ++this.loadGeneration;

    this.loadingPromise = (async () => {
      const imagePromises: Promise<void>[] = [];

      this.images = Array.from({ length: manifest.count }, (_, i) => {
        const img = new Image();
        img.decoding = "async";

        const promise = new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => {
            console.error(`Error cargando frame ${i} de ${manifest.id}`);
            resolve();
          };
        });

        imagePromises.push(promise);
        img.src = getFrameUrl(manifest, i);
        return img;
      });

      await Promise.all(imagePromises);

      if (generation !== this.loadGeneration) {
        return;
      }

      this.loaded = true;
      this.loadingPromise = null;
      this.updateCanvasSize();
      this.render();
    })();

    try {
      await this.loadingPromise;
    } finally {
      if (generation === this.loadGeneration) {
        this.loadingPromise = null;
      }
    }
  }

  unloadSequence(options?: { keepManifest?: boolean }): void {
    this.loadGeneration += 1;
    this.loadingPromise = null;
    this.loaded = false;

    for (const img of this.images) {
      if (!img) continue;
      img.onload = null;
      img.onerror = null;
      img.src = "";
    }
    this.images = [];
    this.releaseBackingStore();

    if (!options?.keepManifest) {
      this.manifest = null;
    }
  }

  render(): void {
    if (!this.loaded || !this.images.length) return;
    if (this.cssWidth <= 0 || this.cssHeight <= 0) {
      this.updateCanvasSize();
      if (this.cssWidth <= 0) return;
    }

    const frameIndex = Math.round(this.frameObj.frame);
    if (frameIndex === this.lastDrawnFrame) return;

    const img = this.images[frameIndex];

    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = frameIndex - 1; i >= 0; i--) {
        const fallbackImg = this.images[i];
        if (fallbackImg?.complete && fallbackImg.naturalWidth > 0) {
          this.renderImage(fallbackImg);
          this.lastDrawnFrame = frameIndex;
          return;
        }
      }
      return;
    }

    this.renderImage(img);
    this.lastDrawnFrame = frameIndex;
  }

  private renderImage(img: HTMLImageElement): void {
    const canvasWidth = this.cssWidth;
    const canvasHeight = this.cssHeight;

    const { drawWidth, drawHeight, offsetX, offsetY } = calculateCoverDimensions(
      canvasWidth,
      canvasHeight,
      img.width,
      img.height
    );

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  getFrameObject(): { frame: number } {
    return this.frameObj;
  }

  getTotalFrames(): number {
    return this.manifest ? this.manifest.count : 0;
  }

  destroy(): void {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
    this.unloadSequence();
    this.manifest = null;
    window.removeEventListener("resize", this.resizeHandler);
  }
}
