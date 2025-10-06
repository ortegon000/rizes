/**
 * EndCalculator - Utilidad para calcular valores de `end` dinámicamente en ScrollTrigger
 * 
 * Esta clase proporciona métodos para calcular valores de finalización de animaciones
 * basados en diferentes criterios (frames, viewports, elementos), eliminando la necesidad
 * de valores hardcodeados como "+=4000" o "-150%".
 * 
 * @example
 * ```typescript
 * // Para canvas con 120 frames
 * end: EndCalculator.forCanvasFrames(120, { speed: 'normal', responsive: true })
 * 
 * // Para timeline de 4 viewports
 * end: EndCalculator.viewports(4, { min: 3000, max: 5000 })
 * 
 * // Hasta llegar a un elemento
 * end: EndCalculator.untilElement("next-section")
 * ```
 */

export type ScrollSpeed = 'slow' | 'normal' | 'fast';

export interface CanvasFramesConfig {
  /** Velocidad de scroll: slow (20px/frame), normal (15px/frame), fast (10px/frame) */
  speed?: ScrollSpeed;
  /** Si debe ajustarse automáticamente en mobile (reduce 30% la velocidad) */
  responsive?: boolean;
  /** Multiplicador personalizado (ej: 1.5 para 50% más lento) */
  customMultiplier?: number;
}

export interface ViewportsConfig {
  /** Altura mínima en píxeles */
  min?: number;
  /** Altura máxima en píxeles */
  max?: number;
}

export class EndCalculator {
  /**
   * Píxeles de scroll por frame según la velocidad
   */
  private static readonly SPEED_VALUES: Record<ScrollSpeed, number> = {
    slow: 20,    // Más píxeles = animación más lenta
    normal: 15,
    fast: 10,
  };

  /**
   * Breakpoint para considerar mobile
   */
  private static readonly MOBILE_BREAKPOINT = 768;

  /**
   * Multiplicador para mobile (reduce velocidad)
   */
  private static readonly MOBILE_MULTIPLIER = 0.7;

  /**
   * Calcula el end para secuencias de canvas basado en número de frames
   * 
   * @param frames - Número de frames del video/secuencia
   * @param config - Configuración de velocidad y responsive
   * @returns String con formato "+={pixels}"
   * 
   * @example
   * ```typescript
   * // Canvas de 120 frames a velocidad normal
   * end: EndCalculator.forCanvasFrames(120)
   * 
   * // Canvas de 90 frames, lento, responsive
   * end: EndCalculator.forCanvasFrames(90, { 
   *   speed: 'slow',
   *   responsive: true 
   * })
   * 
   * // Canvas con multiplicador custom (2x más lento)
   * end: EndCalculator.forCanvasFrames(120, { 
   *   customMultiplier: 2 
   * })
   * ```
   */
  static forCanvasFrames(frames: number, config: CanvasFramesConfig = {}): string {
    const {
      speed = 'normal',
      responsive = true,
      customMultiplier,
    } = config;

    // Obtener píxeles por frame según velocidad
    let pixelsPerFrame = this.SPEED_VALUES[speed];

    // Aplicar multiplicador custom si existe
    if (customMultiplier) {
      pixelsPerFrame *= customMultiplier;
    }

    // Ajustar para mobile si responsive está habilitado
    if (responsive && this.isMobile()) {
      pixelsPerFrame *= this.MOBILE_MULTIPLIER;
    }

    const totalPixels = Math.round(frames * pixelsPerFrame);
    
    return `+=${totalPixels}`;
  }

  /**
   * Calcula el end basado en múltiplos de viewport height
   * 
   * @param count - Número de viewports
   * @param config - Configuración de límites min/max
   * @returns String con formato "+={pixels}"
   * 
   * @example
   * ```typescript
   * // 4 viewports de altura
   * end: EndCalculator.viewports(4)
   * 
   * // 4 viewports con mínimo de 3000px
   * end: EndCalculator.viewports(4, { min: 3000, max: 5000 })
   * ```
   */
  static viewports(count: number, config: ViewportsConfig = {}): string {
    const { min, max } = config;
    
    const vh = window.innerHeight;
    let total = vh * count;

    // Aplicar límites si existen
    if (min !== undefined && total < min) {
      total = min;
    }
    if (max !== undefined && total > max) {
      total = max;
    }

    return `+=${Math.round(total)}`;
  }

  /**
   * Calcula el end hasta llegar a otro elemento
   * 
   * Retorna una función porque necesita calcular la posición cuando el DOM esté listo
   * 
   * @param elementId - ID del elemento de referencia (sin #)
   * @param offset - Offset adicional en píxeles (puede ser negativo)
   * @returns Función que retorna el valor calculado
   * 
   * @example
   * ```typescript
   * // Hasta el elemento "next-section"
   * end: EndCalculator.untilElement("next-section")
   * 
   * // Hasta 200px antes del elemento
   * end: EndCalculator.untilElement("next-section", -200)
   * ```
   */
  static untilElement(elementId: string, offset: number = 0): () => string {
    return () => {
      const element = document.getElementById(elementId);
      
      if (!element) {
        console.warn(
          `[EndCalculator] Element "${elementId}" not found. Using fallback: 1 viewport`
        );
        return this.viewports(1);
      }

      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const distance = rect.top + scrollTop + offset;

      return `+=${Math.round(distance)}`;
    };
  }

  /**
   * Calcula el end basado en la altura de un elemento
   * 
   * @param elementId - ID del elemento
   * @param multiplier - Multiplicador de la altura (ej: 2 = doble de la altura)
   * @returns Función que retorna el valor calculado
   * 
   * @example
   * ```typescript
   * // Altura del elemento
   * end: EndCalculator.elementHeight("hero-container")
   * 
   * // Doble de la altura del elemento
   * end: EndCalculator.elementHeight("hero-container", 2)
   * ```
   */
  static elementHeight(elementId: string, multiplier: number = 1): () => string {
    return () => {
      const element = document.getElementById(elementId);
      
      if (!element) {
        console.warn(
          `[EndCalculator] Element "${elementId}" not found. Using fallback: 1 viewport`
        );
        return this.viewports(1);
      }

      const height = element.offsetHeight * multiplier;
      return `+=${Math.round(height)}`;
    };
  }

  /**
   * Calcula el end para un timeline basado en múltiples secciones
   * 
   * @param sectionIds - Array de IDs de secciones
   * @param spacingMultiplier - Multiplicador de spacing entre secciones
   * @returns Función que retorna el valor calculado
   * 
   * @example
   * ```typescript
   * // Suma de alturas de 3 secciones
   * end: EndCalculator.sections(['section-1', 'section-2', 'section-3'])
   * 
   * // Con 50% de spacing extra entre secciones
   * end: EndCalculator.sections(['section-1', 'section-2'], 1.5)
   * ```
   */
  static sections(sectionIds: string[], spacingMultiplier: number = 1): () => string {
    return () => {
      let totalHeight = 0;
      const foundSections: string[] = [];

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          totalHeight += section.offsetHeight;
          foundSections.push(sectionId);
        } else {
          console.warn(`[EndCalculator] Section "${sectionId}" not found, skipping`);
        }
      });

      if (foundSections.length === 0) {
        console.warn('[EndCalculator] No sections found. Using fallback: 1 viewport');
        return this.viewports(1);
      }

      const adjustedHeight = totalHeight * spacingMultiplier;
      
      console.log(
        `[EndCalculator] Calculated height for ${foundSections.length} sections:`,
        Math.round(adjustedHeight)
      );

      return `+=${Math.round(adjustedHeight)}`;
    };
  }

  /**
   * Calcula valores diferentes para desktop y mobile
   * 
   * @param desktop - Valor para desktop
   * @param mobile - Valor para mobile
   * @returns El valor apropiado según el viewport
   * 
   * @example
   * ```typescript
   * end: EndCalculator.responsive(
   *   EndCalculator.viewports(4),
   *   EndCalculator.viewports(6)
   * )
   * ```
   */
  static responsive(desktop: string, mobile: string): string {
    return this.isMobile() ? mobile : desktop;
  }

  /**
   * Helper: Detecta si es mobile
   */
  private static isMobile(): boolean {
    return window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  /**
   * Obtiene información de debug sobre el cálculo
   * 
   * @param type - Tipo de cálculo
   * @param value - Valor calculado
   * @returns Objeto con información de debug
   */
  static debug(type: string, value: string | (() => string)): {
    type: string;
    value: string;
    isMobile: boolean;
    viewportHeight: number;
  } {
    const resolvedValue = typeof value === 'function' ? value() : value;
    
    return {
      type,
      value: resolvedValue,
      isMobile: this.isMobile(),
      viewportHeight: window.innerHeight,
    };
  }
}
