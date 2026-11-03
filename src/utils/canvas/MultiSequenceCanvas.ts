/**
 * Clase para manejar canvas con múltiples secuencias de video/imágenes
 * Optimizado para animaciones suaves estilo Apple con soporte para object-fit: cover
 */

import { getFrameUrl, calculateCoverDimensions } from "./helpers";
import type { SeqManifest } from "../types/canvas.types";

export class MultiSequenceCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private images: (HTMLImageElement | null)[] = [];
  private frameObj = { frame: 0 };
  private manifest: SeqManifest | null = null;
  private resizeHandler: () => void;
  /** Incrementa en unload/destroy para invalidar cargas en vuelo */
  private loadGeneration = 0;
  private loaded = false;
  private loadingPromise: Promise<void> | null = null;

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
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";

    this.updateCanvasSize();

    this.resizeHandler = () => this.updateCanvasSize();
    window.addEventListener("resize", this.resizeHandler);
  }

  private updateCanvasSize(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = containerWidth * dpr;
    this.canvas.height = containerHeight * dpr;
    this.canvas.style.width = `${containerWidth}px`;
    this.canvas.style.height = `${containerHeight}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    if (this.loaded) {
      this.render();
    }
  }

  isSequenceLoaded(): boolean {
    return this.loaded;
  }

  getManifestId(): string | null {
    return this.manifest?.id ?? null;
  }

  /**
   * Precarga todas las imágenes de una secuencia.
   * Idempotente si ya está cargada la misma secuencia; cancela si hubo unload.
   */
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

  /**
   * Libera bitmaps decodificados para reducir presión de memoria.
   * El scrub GSAP puede seguir vivo; render() no-op hasta volver a cargar.
   */
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

    if (!options?.keepManifest) {
      this.manifest = null;
    }
  }

  render(): void {
    if (!this.images.length) return;

    const frameIndex = Math.round(this.frameObj.frame);
    const img = this.images[frameIndex];

    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = frameIndex - 1; i >= 0; i--) {
        const fallbackImg = this.images[i];
        if (fallbackImg?.complete && fallbackImg.naturalWidth > 0) {
          this.renderImage(fallbackImg);
          return;
        }
      }
      return;
    }

    this.renderImage(img);
  }

  private renderImage(img: HTMLImageElement): void {
    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = this.canvas.width / dpr;
    const canvasHeight = this.canvas.height / dpr;

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
    this.unloadSequence();
    this.manifest = null;
    window.removeEventListener("resize", this.resizeHandler);
  }
}
