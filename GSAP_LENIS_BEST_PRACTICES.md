# 🎯 Mejores Prácticas: GSAP + Lenis - Animaciones Responsivas y Robustas

## 📋 Tabla de Contenido
1. [Problema Actual](#problema-actual)
2. [Mejores Prácticas GSAP](#mejores-prácticas-gsap)
3. [Sistema de Altura Dinámico](#sistema-de-altura-dinámico)
4. [Valores Relativos vs Absolutos](#valores-relativos-vs-absolutos)
5. [Soluciones Recomendadas](#soluciones-recomendadas)
6. [Implementación Paso a Paso](#implementación-paso-a-paso)

---

## ❌ Problema Actual

### Lo que está causando problemas:

```tsx
// ❌ PROBLEMA 1: Altura hardcodeada
<div id="normalScrolling" className="pt-[7000px] pb-[415dvh] md:pb-[225dvh]">
```

```typescript
// ❌ PROBLEMA 2: End con valores absolutos
scrollTrigger: {
  trigger: container,
  start: "top top",
  end: "+=4000",  // 👈 Número mágico
  scrub: 1,
}

// ❌ PROBLEMA 3: Triggers con valores arbitrarios
scrub: { trigger: "#text-images-1", start: "-150% bottom", end: "bottom top" }
```

### Por qué es problemático:

1. **Valores Hardcodeados**: `pt-[7000px]` no se ajusta dinámicamente
2. **Números Mágicos**: `+=4000`, `-150%` dificultan ajustes
3. **Dependencia de Padding**: Cambiar `pb-[415dvh]` rompe las animaciones
4. **Mobile vs Desktop**: Diferentes duraciones hacen difícil sincronizar
5. **Falta de Sistema**: No hay relación entre altura de página y duración de animaciones

---

## ✅ Mejores Prácticas GSAP

### 1. **Usar Triggers Basados en Elementos (No en Píxeles)**

```typescript
// ❌ MAL - Valores arbitrarios
{
  start: "-150% bottom",
  end: "+=4000",
}

// ✅ BIEN - Relativo a elementos reales
{
  start: "top bottom",      // Cuando el top del trigger llega al bottom del viewport
  end: "bottom top",        // Cuando el bottom del trigger llega al top del viewport
}

// ✅ MEJOR - Usando elementos de referencia
{
  trigger: "#section-1",
  start: "top bottom",      
  end: () => `+=${document.getElementById('section-1')?.offsetHeight}`,
  endTrigger: "#section-2", // Termina cuando llega a otra sección
}
```

### 2. **Normalización con Variables CSS**

```css
/* globals.css */
:root {
  /* Duraciones base */
  --scroll-speed-fast: 0.5;
  --scroll-speed-normal: 1;
  --scroll-speed-slow: 2;
  
  /* Espaciado de secciones */
  --section-spacing: 100vh;
  --hero-height: 400vh;
  
  /* Parallax speeds */
  --parallax-slow: -100px;
  --parallax-medium: -300px;
  --parallax-fast: -600px;
}

@media (max-width: 768px) {
  :root {
    --hero-height: 600vh;
    --parallax-medium: -150px;
  }
}
```

```typescript
// Usar en animaciones
const heroHeight = getComputedStyle(document.documentElement)
  .getPropertyValue('--hero-height');

gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: "top top",
    end: `+=${heroHeight}`,
    scrub: 1,
  },
});
```

### 3. **Pin con Duración Calculada Automáticamente**

```typescript
// ❌ MAL - Pin con end arbitrario
{
  trigger: "#section",
  start: "top top",
  end: "+=4000",  // 👈 ¿Por qué 4000?
  pin: true,
}

// ✅ BIEN - Pin basado en contenido
{
  trigger: "#section",
  start: "top top",
  end: () => {
    // Pin dura lo mismo que el contenido del siguiente elemento
    const nextSection = document.querySelector("#next-section");
    return `+=${nextSection?.offsetHeight || window.innerHeight}`;
  },
  pin: true,
}

// ✅ MEJOR - Pin usando marcadores
{
  trigger: "#section",
  start: "top top",
  endTrigger: "#end-marker", // Un div vacío que marca el fin
  end: "top top",
  pin: true,
}
```

---

## 🏗️ Sistema de Altura Dinámico

### Arquitectura Recomendada:

```typescript
// src/utils/scrollMetrics.ts

interface ScrollMetrics {
  viewportHeight: number;
  totalHeight: number;
  sections: Record<string, SectionMetrics>;
}

interface SectionMetrics {
  id: string;
  start: number;      // Distancia desde el top
  end: number;
  height: number;
  duration: number;   // Cuánto scroll necesita
}

class ScrollMetricsManager {
  private metrics: ScrollMetrics;

  constructor() {
    this.metrics = this.calculate();
    this.setupResizeObserver();
  }

  /**
   * Calcula todas las métricas de scroll de la página
   */
  calculate(): ScrollMetrics {
    const sections = this.getSections();
    const sectionMetrics: Record<string, SectionMetrics> = {};

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      sectionMetrics[section.id] = {
        id: section.id,
        start: rect.top + scrollTop,
        end: rect.bottom + scrollTop,
        height: rect.height,
        duration: this.calculateDuration(section),
      };
    });

    return {
      viewportHeight: window.innerHeight,
      totalHeight: document.documentElement.scrollHeight,
      sections: sectionMetrics,
    };
  }

  /**
   * Calcula la duración ideal de scroll para una sección
   */
  private calculateDuration(section: HTMLElement): number {
    const hasCanvas = section.querySelector('canvas');
    const hasComplexAnim = section.hasAttribute('data-complex-animation');

    // Secciones con canvas necesitan más tiempo
    if (hasCanvas) return window.innerHeight * 3;
    if (hasComplexAnim) return window.innerHeight * 2;

    return window.innerHeight * 1.5;
  }

  /**
   * Obtiene todas las secciones animables
   */
  private getSections(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll('[data-scroll-section], section[id]')
    ) as HTMLElement[];
  }

  /**
   * Observa cambios de tamaño y recalcula
   */
  private setupResizeObserver(): void {
    const observer = new ResizeObserver(() => {
      this.metrics = this.calculate();
      this.notifyChange();
    });

    observer.observe(document.body);
  }

  /**
   * Notifica cambios para refresh de ScrollTrigger
   */
  private notifyChange(): void {
    window.dispatchEvent(new CustomEvent('scrollMetricsUpdate', {
      detail: this.metrics,
    }));
  }

  /**
   * Obtiene métricas de una sección específica
   */
  getSection(id: string): SectionMetrics | undefined {
    return this.metrics.sections[id];
  }

  /**
   * Calcula el end correcto para un timeline
   */
  getEndForSection(sectionId: string): string {
    const section = this.getSection(sectionId);
    if (!section) return '+=100%';

    return `+=${section.duration}`;
  }
}

// Singleton
export const scrollMetrics = new ScrollMetricsManager();
```

---

## 📐 Valores Relativos vs Absolutos

### Guía de Cuándo Usar Cada Uno:

| Situación | Usar | Ejemplo |
|-----------|------|---------|
| **Pin sections** | Relativo a elemento | `endTrigger: "#next-section"` |
| **Parallax** | Relativo a viewport | `y: "50vh"` o usar variables CSS |
| **Canvas sequences** | Relativo a frames | `end: () => frameCount * scrollSpeed` |
| **Fade in/out** | Relativo a trigger | `start: "top 80%", end: "top 50%"` |
| **Hero timelines** | Relativo a contenido | `end: () => heroContent.offsetHeight * 2` |

### Ejemplos Prácticos:

```typescript
// ✅ CANVAS - Duración basada en frames
const frameCount = 120;
const pixelsPerFrame = 20; // Cuántos px de scroll por frame

{
  trigger: "#canvas-section",
  start: "top top",
  end: `+=${frameCount * pixelsPerFrame}`, // 2400px
  scrub: 1,
  pin: true,
}

// ✅ PARALLAX - Velocidad proporcional
const parallaxSpeed = -0.3; // 30% del scroll

{
  trigger: "#section",
  start: "top bottom",
  end: "bottom top",
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;
    const distance = self.end - self.start;
    const yOffset = distance * parallaxSpeed * progress;
    
    gsap.set(target, { y: yOffset });
  },
}

// ✅ PIN - Basado en contenido siguiente
{
  trigger: "#pinned-section",
  start: "top top",
  endTrigger: "#next-section",
  end: "bottom bottom",
  pin: true,
}
```

---

## 🎯 Soluciones Recomendadas

### **Solución 1: Spacer Sections (Más Simple)**

Reemplaza el hardcoded `pt-[7000px]` con secciones marcadoras:

```tsx
// index.tsx
<div id="hero-scroll-space" className="h-[400vh] md:h-[300vh]" />

<div id="canvas-scroll-space" className="h-[200vh]" />

<section id="text-images-1" className="relative">
  {/* Contenido */}
</section>
```

```typescript
// heroTimeline.ts
export function createHeroTimeline(container: HTMLElement | null): gsap.core.Timeline {
  const scrollSpace = document.getElementById('hero-scroll-space');
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: scrollSpace,
      start: "top top",
      end: "bottom top", // 👈 Se ajusta automáticamente
      scrub: 1,
      pin: container, // Pin el hero mientras scrollea el spacer
    },
  });

  // ... animaciones
  return timeline;
}
```

**Ventajas:**
- ✅ Fácil de implementar
- ✅ Fácil de ajustar visualmente
- ✅ No requiere JavaScript complejo
- ✅ Se adapta automáticamente al contenido

**Desventajas:**
- ⚠️ Agrega elementos extra al DOM
- ⚠️ Padding gigante sigue siendo necesario

---

### **Solución 2: Dynamic End Calculator (Más Robusto)**

```typescript
// src/utils/animations/endCalculator.ts

interface EndCalculatorConfig {
  /** Frames del video o pasos de la animación */
  steps?: number;
  /** Píxeles de scroll por paso */
  pixelsPerStep?: number;
  /** Multiplicador de velocidad (1 = normal, 2 = lento) */
  speedMultiplier?: number;
  /** Elemento que marca el final */
  endElement?: string;
}

export class EndCalculator {
  /**
   * Calcula el end para secuencias de canvas
   */
  static forCanvasSequence(config: EndCalculatorConfig): string {
    const steps = config.steps || 120;
    const pixelsPerStep = config.pixelsPerStep || 15;
    const speedMultiplier = config.speedMultiplier || 1;

    const totalScroll = steps * pixelsPerStep * speedMultiplier;
    
    return `+=${totalScroll}`;
  }

  /**
   * Calcula el end basado en un elemento
   */
  static forElement(elementId: string, offsetMultiplier: number = 1): string | (() => string) {
    return () => {
      const element = document.getElementById(elementId);
      if (!element) return "+=100vh";

      const height = element.offsetHeight;
      return `+=${height * offsetMultiplier}`;
    };
  }

  /**
   * Calcula el end para timeline complejo
   */
  static forTimeline(sections: string[]): () => string {
    return () => {
      let totalHeight = 0;

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          totalHeight += section.offsetHeight;
        }
      });

      return `+=${totalHeight}`;
    };
  }

  /**
   * Calcula basado en viewport
   */
  static forViewport(multiplier: number): string {
    return `+=${window.innerHeight * multiplier}`;
  }
}
```

**Uso:**

```typescript
// canvasSequences.ts
import { EndCalculator } from '@utils/animations/endCalculator';

const VIDEO_CONFIGS: VideoConfig[] = [
  {
    id: "video1",
    canvasKey: "canvas1",
    scrub: { 
      trigger: "#text-images-1", 
      start: "top bottom", 
      end: EndCalculator.forCanvasSequence({ 
        steps: 120, 
        pixelsPerStep: 20,
        speedMultiplier: 1.2, // 20% más lento
      }),
    },
    // ...
  },
];

// heroTimeline.ts
export function createHeroTimeline(container: HTMLElement | null): gsap.core.Timeline {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: EndCalculator.forElement("normalScrolling", 0.5), // 50% de la altura
      scrub: 1,
    },
  });

  return timeline;
}
```

---

### **Solución 3: Data Attributes System (Más Declarativo)**

Marca las secciones con metadata:

```tsx
// index.tsx
<section 
  id="text-images-1"
  data-scroll-section
  data-animation-duration="200vh"
  data-parallax-speed="medium"
  className="relative"
>
  {/* Contenido */}
</section>

<div 
  id="text-images-1-canvas-container"
  data-canvas-frames="120"
  data-scroll-speed="slow"
>
  <canvas ref={canvasRefs.canvas1} />
</div>
```

```typescript
// src/utils/animations/attributeReader.ts

export class AnimationAttributeReader {
  /**
   * Lee la duración desde data attributes
   */
  static getDuration(elementId: string): string {
    const element = document.getElementById(elementId);
    if (!element) return "+=100vh";

    const duration = element.getAttribute('data-animation-duration');
    if (duration) return `+=${duration}`;

    // Fallback a cálculo automático
    return `+=${element.offsetHeight}`;
  }

  /**
   * Lee la velocidad del canvas
   */
  static getCanvasSpeed(elementId: string): number {
    const element = document.getElementById(elementId);
    const speed = element?.getAttribute('data-scroll-speed');

    const speeds: Record<string, number> = {
      'fast': 10,
      'normal': 15,
      'slow': 20,
    };

    return speeds[speed || 'normal'];
  }

  /**
   * Lee configuración de parallax
   */
  static getParallaxConfig(elementId: string): ParallaxConfig {
    const element = document.getElementById(elementId);
    const speed = element?.getAttribute('data-parallax-speed') || 'medium';

    const distances: Record<string, number> = {
      'slow': -100,
      'medium': -300,
      'fast': -600,
    };

    return {
      trigger: `#${elementId}`,
      target: element?.getAttribute('data-parallax-target') || `#${elementId}-right`,
      y: distances[speed],
      start: element?.getAttribute('data-parallax-start') || 'top bottom',
      end: element?.getAttribute('data-parallax-end') || 'bottom top',
    };
  }
}
```

---

## 🚀 Implementación Paso a Paso

### **Paso 1: Eliminar Valores Hardcodeados**

```tsx
// ❌ ANTES
<div id="normalScrolling" className="pt-[7000px] pb-[415dvh] md:pb-[225dvh]">

// ✅ DESPUÉS - Con spacers
<div id="hero-spacer" className="h-[400vh]" />
<div id="canvas-spacer" className="h-[200vh]" />

<div id="normalScrolling" className="relative">
  {/* Secciones normales sin padding gigante */}
</div>
```

### **Paso 2: Actualizar Animaciones con EndCalculator**

```typescript
// canvasSequences.ts
const VIDEO_CONFIGS: VideoConfig[] = [
  {
    id: "video1",
    canvasKey: "canvas1",
    scrub: { 
      trigger: "#text-images-1", 
      start: "top bottom",
      end: "bottom top", // 👈 Relativo al trigger
    },
    fadeIn: { 
      trigger: "#hero-description", 
      start: "bottom center",  // 👈 Puntos de referencia claros
      end: "bottom top",
    },
    fadeOut: { 
      trigger: "#text-images-1", 
      start: "center center", 
      end: "top top",
    },
  },
];
```

### **Paso 3: Hero Timeline con Marcadores**

```tsx
// index.tsx
<div id="hero-container">
  {/* Hero content */}
  
  <div id="hero-end-marker" className="h-0" /> {/* Marcador invisible */}
</div>
```

```typescript
// heroTimeline.ts
export function createHeroTimeline(container: HTMLElement | null): gsap.core.Timeline {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top top",
      endTrigger: "#hero-end-marker",
      end: "top top",
      scrub: 1,
      pin: true,
    },
  });

  return timeline;
}
```

### **Paso 4: Responsive con matchMedia**

```typescript
// src/utils/animations/responsive.ts

export function createResponsiveTimeline(
  config: {
    desktop: gsap.TweenVars;
    mobile: gsap.TweenVars;
  }
): gsap.core.Timeline {
  const mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)",
  }, (context) => {
    const { isDesktop } = context.conditions as { isDesktop: boolean };

    return gsap.timeline(isDesktop ? config.desktop : config.mobile);
  });

  return mm as unknown as gsap.core.Timeline;
}
```

**Uso:**

```typescript
// parallaxAnimations.ts
export function createParallaxAnimations(): void {
  PARALLAX_CONFIGS.forEach((config) => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
    }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean };

      gsap.timeline({
        scrollTrigger: {
          trigger: config.trigger,
          start: config.start || "top bottom",
          end: config.end || "bottom top",
          scrub: config.scrub || 1,
        },
      })
      .to(config.target, { 
        y: isDesktop ? config.y : config.y * 0.5, // 50% en mobile
      }, 0);
    });
  });
}
```

---

## 📊 Comparación de Soluciones

| Solución | Facilidad | Flexibilidad | Mantenibilidad | Recomendado Para |
|----------|-----------|--------------|----------------|------------------|
| **Spacer Sections** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | Proyectos pequeños/medianos |
| **EndCalculator** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Proyectos complejos |
| **Data Attributes** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Equipos grandes, CMS |
| **ScrollMetrics** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Aplicaciones enterprise |

---

## ✨ Recomendación Final

### Para tu proyecto actual:

**Combinación de Spacer Sections + EndCalculator**

```typescript
// 1. Eliminar pt-[7000px], usar spacers
<div id="hero-spacer" className="h-[400vh] md:h-[300vh]" />

// 2. Crear EndCalculator para canvas
export class EndCalculator {
  static forCanvasFrames(frames: number): string {
    const isMobile = window.innerWidth < 768;
    const pixelsPerFrame = isMobile ? 10 : 15;
    return `+=${frames * pixelsPerFrame}`;
  }
}

// 3. Actualizar configuraciones
const VIDEO_CONFIGS: VideoConfig[] = [
  {
    id: "video1",
    canvasKey: "canvas1",
    scrub: { 
      trigger: "#text-images-1", 
      start: "top bottom",
      end: "bottom top", // 👈 Auto-ajustable
    },
    // ...
  },
];

// 4. Usar markers en desarrollo
scrollTrigger: {
  // ... config
  markers: process.env.NODE_ENV === 'development',
}
```

### Ventajas de esta solución:

1. ✅ **Fácil de implementar** - No requiere refactor masivo
2. ✅ **Visual** - Spacers son fáciles de ajustar
3. ✅ **Robusto** - EndCalculator hace los cálculos complejos
4. ✅ **Responsive** - Se adapta automáticamente
5. ✅ **Mantenible** - Cambios en una sección no afectan otras
6. ✅ **Debug-friendly** - Markers ayudan a visualizar

---

## 🎓 Recursos Adicionales

- [GSAP ScrollTrigger Docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP matchMedia](https://greensock.com/docs/v3/GSAP/gsap.matchMedia())
- [Lenis Smooth Scroll](https://github.com/studio-freight/lenis)
- [GSAP Best Practices](https://greensock.com/docs/v3/GSAP/gsap.config())

---

**Conclusión**: La clave está en **eliminar valores absolutos** y usar **referencias relativas a elementos**. Esto hace que las animaciones sean **auto-ajustables** y **mantenibles**.
