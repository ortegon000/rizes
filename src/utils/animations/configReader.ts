/**
 * AnimationConfigReader - Lee configuración de animaciones desde data attributes
 * 
 * Esta clase permite configurar animaciones de forma declarativa usando data attributes
 * en el HTML, lo que hace el código más mantenible y fácil de ajustar sin tocar TypeScript.
 * 
 * @example
 * ```tsx
 * // HTML
 * <section 
 *   id="text-images-1"
 *   data-scroll-section
 *   data-canvas-frames="120"
 *   data-scroll-speed="normal"
 *   data-parallax-distance="-300"
 * />
 * 
 * // TypeScript
 * const config = AnimationConfigReader.getCanvasConfig('text-images-1');
 * ```
 */

import type { ScrollSpeed } from './endCalculator';

export interface CanvasConfig {
  /** Número de frames del canvas */
  frames: number;
  /** Píxeles de scroll por frame */
  pixelsPerFrame: number;
  /** Velocidad de scroll */
  speed: ScrollSpeed;
  /** Valor calculado para `end` */
  end: string;
}

export interface ParallaxConfig {
  /** Selector del trigger */
  trigger: string;
  /** Selector del target a animar */
  target: string;
  /** Distancia de movimiento en Y */
  distance: number;
  /** Punto de inicio */
  start: string;
  /** Punto final */
  end: string;
  /** Velocidad de scrub */
  scrub: number;
}

export interface PinConfig {
  /** Duración del pin en viewports */
  duration: number;
  /** Elemento a pinear (si es diferente al trigger) */
  pinnedElement?: string;
  /** Espaciado superior */
  spacing: number;
}

export class AnimationConfigReader {
  /**
   * Valores de velocidad de scroll en px/frame
   */
  private static readonly SCROLL_SPEEDS: Record<string, number> = {
    fast: 10,
    normal: 15,
    slow: 20,
  };

  /**
   * Valores de distancia de parallax
   */
  private static readonly PARALLAX_DISTANCES: Record<string, number> = {
    slow: -100,
    medium: -300,
    fast: -600,
  };

  /**
   * Lee configuración de canvas desde data attributes
   * 
   * Data attributes soportados:
   * - data-canvas-frames: Número de frames (default: 100)
   * - data-scroll-speed: 'fast' | 'normal' | 'slow' (default: 'normal')
   * - data-canvas-duration: Duración custom en px (sobrescribe cálculo automático)
   * 
   * @param sectionId - ID de la sección (sin #)
   * @returns Configuración del canvas
   * 
   * @example
   * ```typescript
   * const config = AnimationConfigReader.getCanvasConfig('text-images-1');
   * // { frames: 120, speed: 'normal', pixelsPerFrame: 15, end: '+=1800' }
   * ```
   */
  static getCanvasConfig(sectionId: string): CanvasConfig {
    const section = document.getElementById(sectionId);
    
    if (!section) {
      console.warn(`[ConfigReader] Section "${sectionId}" not found, using defaults`);
      return this.getDefaultCanvasConfig();
    }

    // Leer frames
    const frames = parseInt(section.dataset.canvasFrames || '100');
    
    // Leer velocidad
    const speedName = (section.dataset.scrollSpeed || 'normal') as ScrollSpeed;
    const pixelsPerFrame = this.SCROLL_SPEEDS[speedName] || this.SCROLL_SPEEDS.normal;

    // Leer duración custom (opcional)
    const customDuration = section.dataset.canvasDuration;
    const calculatedEnd = customDuration 
      ? `+=${customDuration}`
      : `+=${frames * pixelsPerFrame}`;

    return {
      frames,
      pixelsPerFrame,
      speed: speedName,
      end: calculatedEnd,
    };
  }

  /**
   * Lee configuración de parallax desde data attributes
   * 
   * Data attributes soportados:
   * - data-parallax-speed: 'slow' | 'medium' | 'fast' (default: 'medium')
   * - data-parallax-distance: Distancia custom en px (ej: '-400')
   * - data-parallax-target: Selector del elemento a animar (default: '#ID-right')
   * - data-parallax-start: Start custom (default: 'top bottom')
   * - data-parallax-end: End custom (default: 'bottom top')
   * - data-parallax-scrub: Scrub custom (default: 1)
   * 
   * @param sectionId - ID de la sección (sin #)
   * @returns Configuración del parallax
   * 
   * @example
   * ```tsx
   * // HTML
   * <section 
   *   id="text-images-1" 
   *   data-parallax-speed="medium"
   *   data-parallax-target="#custom-element"
   * />
   * 
   * // TypeScript
   * const config = AnimationConfigReader.getParallaxConfig('text-images-1');
   * // { trigger: '#text-images-1', target: '#custom-element', distance: -300, ... }
   * ```
   */
  static getParallaxConfig(sectionId: string): ParallaxConfig {
    const section = document.getElementById(sectionId);

    if (!section) {
      console.warn(`[ConfigReader] Section "${sectionId}" not found, using defaults`);
      return this.getDefaultParallaxConfig(sectionId);
    }

    // Leer velocidad/distancia
    const speed = section.dataset.parallaxSpeed || 'medium';
    const customDistance = section.dataset.parallaxDistance;
    const distance = customDistance 
      ? parseInt(customDistance)
      : this.PARALLAX_DISTANCES[speed] || this.PARALLAX_DISTANCES.medium;

    // Leer target
    const customTarget = section.dataset.parallaxTarget;
    const target = customTarget || `#${sectionId}-right`;

    // Leer start/end
    const start = section.dataset.parallaxStart || 'top bottom';
    const end = section.dataset.parallaxEnd || 'bottom top';

    // Leer scrub
    const scrub = parseFloat(section.dataset.parallaxScrub || '1');

    return {
      trigger: `#${sectionId}`,
      target,
      distance,
      start,
      end,
      scrub,
    };
  }

  /**
   * Lee configuración de pin desde data attributes
   * 
   * Data attributes soportados:
   * - data-pin-duration: Duración en viewports (default: 1)
   * - data-pin-element: Selector del elemento a pinear (default: mismo trigger)
   * - data-pin-spacing: Spacing superior (default: 0)
   * 
   * @param sectionId - ID de la sección (sin #)
   * @returns Configuración del pin
   * 
   * @example
   * ```tsx
   * <div 
   *   id="hero-container"
   *   data-pin-duration="4"
   *   data-pin-spacing="100"
   * />
   * ```
   */
  static getPinConfig(sectionId: string): PinConfig {
    const section = document.getElementById(sectionId);

    if (!section) {
      console.warn(`[ConfigReader] Section "${sectionId}" not found, using defaults`);
      return { duration: 1, spacing: 0 };
    }

    const duration = parseFloat(section.dataset.pinDuration || '1');
    const pinnedElement = section.dataset.pinElement;
    const spacing = parseInt(section.dataset.pinSpacing || '0');

    return {
      duration,
      pinnedElement,
      spacing,
    };
  }

  /**
   * Lee todas las secciones con data-scroll-section
   * 
   * @returns Array de IDs de secciones
   * 
   * @example
   * ```typescript
   * const sections = AnimationConfigReader.getAllScrollSections();
   * // ['text-images-1', 'text-images-2', 'text-images-3']
   * ```
   */
  static getAllScrollSections(): string[] {
    const sections = document.querySelectorAll('[data-scroll-section]');
    return Array.from(sections)
      .map((section) => section.id)
      .filter((id) => id !== ''); // Filtrar secciones sin ID
  }

  /**
   * Lee todas las secciones con canvas
   * 
   * @returns Array de configuraciones de canvas
   */
  static getAllCanvasConfigs(): Array<{ sectionId: string; config: CanvasConfig }> {
    const canvasSections = document.querySelectorAll('[data-canvas-frames]');
    
    return Array.from(canvasSections)
      .map((section) => ({
        sectionId: section.id,
        config: this.getCanvasConfig(section.id),
      }))
      .filter((item) => item.sectionId !== '');
  }

  /**
   * Lee todas las secciones con parallax
   * 
   * @returns Array de configuraciones de parallax
   */
  static getAllParallaxConfigs(): Array<{ sectionId: string; config: ParallaxConfig }> {
    const parallaxSections = document.querySelectorAll('[data-parallax-speed], [data-parallax-distance]');
    
    return Array.from(parallaxSections)
      .map((section) => ({
        sectionId: section.id,
        config: this.getParallaxConfig(section.id),
      }))
      .filter((item) => item.sectionId !== '');
  }

  /**
   * Verifica si una sección tiene configuración de canvas
   */
  static hasCanvasConfig(sectionId: string): boolean {
    const section = document.getElementById(sectionId);
    return section?.hasAttribute('data-canvas-frames') || false;
  }

  /**
   * Verifica si una sección tiene configuración de parallax
   */
  static hasParallaxConfig(sectionId: string): boolean {
    const section = document.getElementById(sectionId);
    return (
      section?.hasAttribute('data-parallax-speed') ||
      section?.hasAttribute('data-parallax-distance') ||
      false
    );
  }

  /**
   * Configuración default de canvas
   */
  private static getDefaultCanvasConfig(): CanvasConfig {
    return {
      frames: 100,
      pixelsPerFrame: 15,
      speed: 'normal',
      end: '+=1500',
    };
  }

  /**
   * Configuración default de parallax
   */
  private static getDefaultParallaxConfig(sectionId: string): ParallaxConfig {
    return {
      trigger: `#${sectionId}`,
      target: `#${sectionId}-right`,
      distance: -300,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    };
  }

  /**
   * Debug: Imprime toda la configuración de una sección
   */
  static debugSection(sectionId: string): void {
    console.group(`[ConfigReader] Debug: ${sectionId}`);
    
    if (this.hasCanvasConfig(sectionId)) {
      console.log('Canvas Config:', this.getCanvasConfig(sectionId));
    }
    
    if (this.hasParallaxConfig(sectionId)) {
      console.log('Parallax Config:', this.getParallaxConfig(sectionId));
    }

    const section = document.getElementById(sectionId);
    if (section) {
      console.log('Data Attributes:', section.dataset);
    }

    console.groupEnd();
  }
}
