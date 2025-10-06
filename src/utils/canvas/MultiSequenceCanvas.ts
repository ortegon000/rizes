/**
 * Clase para manejar canvas con múltiples secuencias de video/imágenes
 * Optimizado para animaciones suaves estilo Apple con soporte para object-fit: cover
 */

import { getFrameUrl, calculateCoverDimensions } from './helpers';
import type { SeqManifest } from '../types/canvas.types';

export class MultiSequenceCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private images: HTMLImageElement[] = [];
  private frameObj = { frame: 0 }; // Objeto para animar con GSAP
  private manifest: SeqManifest | null = null;
  private resizeHandler: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Obtener contexto 2D con configuración optimizada
    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    });

    if (!context) {
      throw new Error("No se pudo obtener el contexto 2D del canvas");
    }

    this.ctx = context;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Configurar tamaño inicial
    this.updateCanvasSize();

    // Listener para resize (responsive)
    this.resizeHandler = () => this.updateCanvasSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  /**
   * Actualiza el tamaño del canvas para ocupar todo su contenedor
   * Soporta pantallas retina usando devicePixelRatio
   */
  private updateCanvasSize(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    // Canvas ocupa todo el contenedor (pantalla completa)
    this.canvas.width = containerWidth * dpr;
    this.canvas.height = containerHeight * dpr;

    // CSS size (tamaño visible) - pantalla completa
    this.canvas.style.width = `${containerWidth}px`;
    this.canvas.style.height = `${containerHeight}px`;

    // Resetear transformaciones y escalar el contexto para dispositivos retina
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    // Re-renderizar si ya hay imágenes cargadas
    if (this.images.length > 0) {
      this.render();
    }
  }

  /**
   * Precarga todas las imágenes de una secuencia
   * @param manifest - Configuración de la secuencia a cargar
   */
  async loadSequence(manifest: SeqManifest): Promise<void> {
    this.manifest = manifest;

    // Crear array de imágenes
    this.images = Array.from({ length: manifest.count }, (_, i) => {
      const img = new Image();
      img.src = getFrameUrl(manifest, i);
      return img;
    });

    // Esperar a que cargue el primer frame para renderizar
    await new Promise<void>((resolve) => {
      if (this.images[0].complete) {
        resolve();
      } else {
        this.images[0].onload = () => resolve();
      }
    });

    this.render();
  }

  /**
   * Renderiza el frame actual con comportamiento object-fit: cover
   * La imagen cubre todo el canvas sin deformarse, cortando los bordes si es necesario
   */
  render(): void {
    if (!this.images.length) return;

    const frameIndex = Math.round(this.frameObj.frame);
    const img = this.images[frameIndex];

    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = this.canvas.width / dpr;
    const canvasHeight = this.canvas.height / dpr;

    // Calcular dimensiones para object-fit: cover
    const { drawWidth, drawHeight, offsetX, offsetY } = calculateCoverDimensions(
      canvasWidth,
      canvasHeight,
      img.width,
      img.height
    );

    // Limpiar canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Dibujar imagen centrada con object-fit: cover
    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  /**
   * Obtiene el objeto frame para animar con GSAP
   */
  getFrameObject(): { frame: number } {
    return this.frameObj;
  }

  /**
   * Obtiene el número total de frames de la secuencia actual
   */
  getTotalFrames(): number {
    return this.manifest ? this.manifest.count : 0;
  }

  /**
   * Limpia recursos y event listeners
   */
  destroy(): void {
    this.images.forEach(img => {
      img.src = '';
    });
    this.images = [];
    window.removeEventListener('resize', this.resizeHandler);
  }
}
