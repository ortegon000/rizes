/**
 * Canvas de secuencias con ventana deslizante de frames.
 * Solo mantiene en memoria ~WINDOW_RADIUS*2 frames alrededor del scrub actual.
 */

import { getFrameUrl, calculateCoverDimensions } from "./helpers";
import type { SeqManifest } from "../types/canvas.types";

/** Evita buffers enormes en pantallas 3x (ahorro GPU ~4/9 vs dpr sin tope). */
const MAX_DEVICE_PIXEL_RATIO = 2;
const RESIZE_DEBOUNCE_MS = 150;
/** Frames a cada lado del actual que se mantienen cargados. */
const WINDOW_RADIUS = 12;
/** Margen extra antes de liberar un frame fuera de ventana. */
const EVICT_PADDING = 4;
/** Descargas en paralelo por secuencia. */
const MAX_CONCURRENT_LOADS = 6;
const MOBILE_MAX_WIDTH = 768;

function cappedDevicePixelRatio(): number {
  return Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
}

function resolveManifestForDevice(manifest: SeqManifest): SeqManifest {
  const useMobile =
    typeof window !== "undefined" &&
    window.innerWidth < MOBILE_MAX_WIDTH &&
    Boolean(manifest.mobileBaseUrl);

  if (!useMobile || !manifest.mobileBaseUrl) return manifest;

  return {
    ...manifest,
    baseUrl: manifest.mobileBaseUrl,
    width: manifest.mobileWidth ?? Math.round(manifest.width / 2),
    height: manifest.mobileHeight ?? Math.round(manifest.height / 2),
  };
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
  private inFlight = new Map<number, Promise<void>>();
  private activeLoads = 0;
  private pendingLoads: number[] = [];

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
    if (!this.loaded) return;

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

  /**
   * Prepara la secuencia: primer frame listo + ventana alrededor en background.
   * No descarga los 105 frames de una vez.
   */
  async loadSequence(manifest: SeqManifest): Promise<void> {
    const resolved = resolveManifestForDevice(manifest);

    if (this.loaded && this.manifest?.id === resolved.id) {
      return;
    }

    if (this.loadingPromise && this.manifest?.id === resolved.id) {
      return this.loadingPromise;
    }

    this.unloadSequence({ keepManifest: false });
    this.manifest = resolved;
    const generation = ++this.loadGeneration;

    this.loadingPromise = (async () => {
      this.images = Array.from({ length: resolved.count }, () => null);

      await this.loadFrame(0, generation);
      if (generation !== this.loadGeneration) return;

      this.loaded = true;
      this.updateCanvasSize();
      this.render();

      void this.ensureWindow(0, generation);
    })();

    try {
      await this.loadingPromise;
    } finally {
      if (generation === this.loadGeneration) {
        this.loadingPromise = null;
      }
    }
  }

  private releaseFrame(index: number): void {
    const img = this.images[index];
    if (!img) return;
    img.onload = null;
    img.onerror = null;
    img.src = "";
    this.images[index] = null;
  }

  private enqueueLoad(index: number, generation: number): void {
    if (!this.manifest) return;
    if (index < 0 || index >= this.manifest.count) return;
    if (this.images[index]?.complete && (this.images[index]?.naturalWidth ?? 0) > 0) {
      return;
    }
    if (this.inFlight.has(index)) return;
    if (this.pendingLoads.includes(index)) return;
    this.pendingLoads.push(index);
    this.drainQueue(generation);
  }

  private drainQueue(generation: number): void {
    while (this.activeLoads < MAX_CONCURRENT_LOADS && this.pendingLoads.length) {
      const index = this.pendingLoads.shift();
      if (index === undefined) break;
      if (generation !== this.loadGeneration) continue;
      void this.loadFrame(index, generation);
    }
  }

  private loadFrame(index: number, generation: number): Promise<void> {
    if (!this.manifest) return Promise.resolve();
    if (index < 0 || index >= this.manifest.count) return Promise.resolve();

    const existing = this.images[index];
    if (existing?.complete && existing.naturalWidth > 0) {
      return Promise.resolve();
    }

    const inFlight = this.inFlight.get(index);
    if (inFlight) return inFlight;

    this.activeLoads += 1;
    const promise = new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";

      const finish = () => {
        this.activeLoads = Math.max(0, this.activeLoads - 1);
        this.inFlight.delete(index);
        this.drainQueue(generation);
        resolve();
      };

      img.onload = () => {
        if (generation !== this.loadGeneration) {
          img.src = "";
          finish();
          return;
        }
        this.images[index] = img;
        if (Math.round(this.frameObj.frame) === index) {
          this.lastDrawnFrame = -1;
          this.render();
        }
        finish();
      };
      img.onerror = () => {
        console.error(`Error cargando frame ${index} de ${this.manifest?.id}`);
        finish();
      };

      img.src = getFrameUrl(this.manifest!, index);
    });

    this.inFlight.set(index, promise);
    return promise;
  }

  /** Carga/evict frames alrededor del índice central. */
  private ensureWindow(center: number, generation = this.loadGeneration): void {
    if (!this.manifest || generation !== this.loadGeneration) return;

    const count = this.manifest.count;
    const mid = Math.round(center);
    const start = Math.max(0, mid - WINDOW_RADIUS);
    const end = Math.min(count - 1, mid + WINDOW_RADIUS);
    const keepStart = Math.max(0, start - EVICT_PADDING);
    const keepEnd = Math.min(count - 1, end + EVICT_PADDING);

    for (let i = 0; i < count; i++) {
      if (i < keepStart || i > keepEnd) {
        this.releaseFrame(i);
      }
    }

    const order: number[] = [];
    for (let dist = 0; dist <= WINDOW_RADIUS; dist++) {
      const a = mid - dist;
      const b = mid + dist;
      if (dist === 0) {
        if (a >= start && a <= end) order.push(a);
      } else {
        if (a >= start && a <= end) order.push(a);
        if (b >= start && b <= end) order.push(b);
      }
    }
    for (const index of order) {
      this.enqueueLoad(index, generation);
    }
  }

  unloadSequence(options?: { keepManifest?: boolean }): void {
    this.loadGeneration += 1;
    this.loadingPromise = null;
    this.loaded = false;
    this.inFlight.clear();
    this.pendingLoads = [];
    this.activeLoads = 0;

    for (let i = 0; i < this.images.length; i++) {
      this.releaseFrame(i);
    }
    this.images = [];
    this.releaseBackingStore();

    if (!options?.keepManifest) {
      this.manifest = null;
    }
  }

  render(): void {
    if (!this.loaded || !this.manifest) return;
    if (this.cssWidth <= 0 || this.cssHeight <= 0) {
      this.updateCanvasSize();
      if (this.cssWidth <= 0) return;
    }

    const frameIndex = Math.round(this.frameObj.frame);
    this.ensureWindow(frameIndex);

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
      for (let i = frameIndex + 1; i < this.images.length; i++) {
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
      img.naturalWidth || img.width,
      img.naturalHeight || img.height
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
