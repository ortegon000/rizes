# 🚀 Plan de Implementación: Sistema de Animaciones Robusto

## 📋 Rama: `feature/animation-system-improvements`

---

## ✅ Completado

### 1. Utilidades Creadas
- ✅ `src/utils/animations/endCalculator.ts` - Cálculo dinámico de valores de end
- ✅ `src/utils/animations/configReader.ts` - Lectura de configuración desde data attributes
- ✅ `src/utils/animations/index.ts` - Exportaciones centralizadas
- ✅ Documentación completa de mejores prácticas

---

## 🔄 Siguiente: Implementación Paso a Paso

### **Paso 1: Preparar Index.tsx con Spacers** ⏱️ 30 min

#### 1.1 Añadir Spacer para Hero
```tsx
{/* Hero container (ya existe, verificar que esté fixed) */}
<div id="hero-container" className="fixed inset-0 z-[1000]">
  <Hero />
  <HeroIntro />
  <HeroDescription />
</div>

{/* ✅ NUEVO: Spacer que define duración del hero */}
<div 
  id="hero-scroll-space" 
  className="h-[400vh] md:h-[300vh]"
  data-animation-purpose="hero-timeline"
  aria-hidden="true"
/>
```

#### 1.2 Eliminar padding hardcodeado
```tsx
{/* ❌ ANTES */}
<div id="normalScrolling" className="relative z-[2000] pt-[7000px] pb-[415dvh] md:pb-[225dvh]">

{/* ✅ DESPUÉS */}
<div id="normalScrolling" className="relative z-[2000]">
```

#### 1.3 Añadir Spacers para Canvas
```tsx
{/* Antes de cada TextImages con canvas */}
<div 
  id="canvas-1-spacer" 
  className="h-[200vh]"
  data-canvas-frames="120"
  data-scroll-speed="normal"
  aria-hidden="true"
/>

<TextImages 
  id="text-images-1"
  data-parallax-speed="medium"
  {...props}
/>
```

---

### **Paso 2: Actualizar heroTimeline.ts** ⏱️ 20 min

```typescript
// src/animations/heroTimeline.ts
import { EndCalculator } from '@utils/animations';

export function createHeroTimeline(container: HTMLElement | null): gsap.core.Timeline {
  const heroSpacer = document.getElementById('hero-scroll-space');
  
  // ✅ Validación
  if (!heroSpacer) {
    console.error('[heroTimeline] hero-scroll-space not found');
    // Fallback a comportamiento anterior
    return gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: EndCalculator.viewports(4), // ✅ Más robusto que +=4000
        scrub: 1,
      },
    });
  }

  // ✅ Usa el spacer como trigger
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroSpacer,
      start: "top top",
      end: "bottom top", // ✅ Auto-ajustable al spacer
      scrub: 1,
      pin: container, // Pin el hero mientras scrollea el spacer
      pinSpacing: false,
      markers: process.env.NODE_ENV === 'development', // Solo en dev
    },
  });

  // Solo agregar animación del key si el overlay está visible
  if (shouldShowHeroOverlay()) {
    addHeroKeyAnimation(timeline);
  }

  addHeroIntroAnimation(timeline);
  addHeroDescriptionAnimation(timeline);

  return timeline;
}
```

---

### **Paso 3: Actualizar canvasSequences.ts** ⏱️ 1 hora

```typescript
// src/animations/canvasSequences.ts
import { EndCalculator, AnimationConfigReader } from '@utils/animations';
import type { CanvasFramesConfig } from '@utils/animations';

// ✅ OPCIÓN A: Configuración manual con EndCalculator
const VIDEO_CONFIGS: VideoConfig[] = [
  {
    id: "video1",
    canvasKey: "canvas1",
    scrub: { 
      trigger: "#canvas-1-spacer", // ✅ Spacer dedicado
      start: "top top",
      end: EndCalculator.forCanvasFrames(120, { 
        speed: 'normal',
        responsive: true,
      }),
    },
    fadeIn: { 
      trigger: "#hero-scroll-space", 
      start: "80% top",
      end: "100% top",
    },
    fadeOut: { 
      trigger: "#text-images-1", 
      start: "center center",
      end: "top top",
    },
  },
  // ... resto
];

// ✅ OPCIÓN B: Lectura automática desde data attributes
export async function initializeCanvasSequences(canvasRefs: CanvasRefs): Promise<void> {
  if (!validateCanvasRefs(canvasRefs)) return;

  const videos = await loadManifest();
  if (videos.length === 0) return;

  // Leer configuraciones desde HTML
  const canvasConfigs = AnimationConfigReader.getAllCanvasConfigs();
  
  canvasConfigs.forEach((item, index) => {
    const canvasKey = `canvas${index + 1}` as keyof CanvasRefs;
    const canvas = canvasRefs[canvasKey]?.current;
    const video = videos[index];

    if (!canvas || !video) return;

    const manager = new MultiSequenceCanvas(canvas);

    handleScrollCanvasSequence({
      canvasManager: manager,
      manifest: video,
      target: canvas.parentElement!,
      scrub: {
        trigger: `#${item.sectionId}`,
        start: "top top",
        end: item.config.end, // ✅ Calculado desde data attributes
      },
      fadeIn: { 
        trigger: "#hero-scroll-space",
        start: "80% top",
        end: "100% top",
      },
      fadeOut: { 
        trigger: `#text-images-${index + 1}`,
        start: "center center",
        end: "top top",
      },
    });
  });
}
```

---

### **Paso 4: Actualizar parallaxAnimations.ts** ⏱️ 30 min

```typescript
// src/animations/parallaxAnimations.ts
import { AnimationConfigReader } from '@utils/animations';

/**
 * Crea parallax usando data attributes del HTML
 */
export function createParallaxAnimations(): void {
  const parallaxConfigs = AnimationConfigReader.getAllParallaxConfigs();
  
  parallaxConfigs.forEach(({ sectionId, config }) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: config.trigger,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: process.env.NODE_ENV === 'development',
        },
      })
      .to(config.target, { y: config.distance }, 0);
  });

  console.log(`✅ Parallax animations initialized for ${parallaxConfigs.length} sections`);
}

// ✅ Mantener función manual para casos especiales
export function createSingleParallax(config: ParallaxConfig): gsap.core.Timeline {
  return gsap
    .timeline({
      scrollTrigger: {
        trigger: config.trigger,
        start: config.start || "top bottom",
        end: config.end || "bottom top",
        scrub: config.scrub || 1,
      },
    })
    .to(config.target, { y: config.y }, 0);
}
```

---

### **Paso 5: Actualizar Componentes con Data Attributes** ⏱️ 30 min

```tsx
// src/components/textImages.tsx
export default function TextImages({ id, ...props }: TextImagesProps) {
  return (
    <section 
      id={id} 
      className="relative min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8"
      data-scroll-section
      data-parallax-speed="medium" // ✅ Configuración declarativa
    >
      {/* Contenido */}
    </section>
  );
}
```

```tsx
// src/components/textImages4.tsx (el del square video)
export default function TextImages4({ id, ...props }: TextImages4Props) {
  return (
    <div>
      <div 
        id={`${id}-canvas-spacer`}
        className="h-[200vh]"
        data-canvas-frames="90" // ✅ 90 frames para este
        data-scroll-speed="slow" // ✅ Más lento que los otros
        aria-hidden="true"
      />
      
      <section 
        id={id} 
        className="relative min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4"
        data-scroll-section
        data-parallax-speed="fast" // ✅ Parallax más rápido
      >
        {/* Contenido */}
      </section>
    </div>
  );
}
```

---

### **Paso 6: Testing y Ajustes** ⏱️ 1 hora

#### 6.1 Habilitar markers en desarrollo
```typescript
// En todas las animaciones
scrollTrigger: {
  // ... config
  markers: process.env.NODE_ENV === 'development',
}
```

#### 6.2 Checklist de pruebas
```
□ Hero timeline se ejecuta correctamente
□ Canvas sequences se reproducen sin lag
□ Parallax se ve suave
□ Responsive funciona (mobile vs desktop)
□ No hay errores en consola
□ ScrollTrigger.refresh() funciona
□ Cambiar h-[400vh] a h-[500vh] ajusta todo automáticamente
□ Añadir nueva sección es fácil
```

#### 6.3 Debug helpers
```typescript
// Añadir temporalmente para debug
import { EndCalculator, AnimationConfigReader } from '@utils/animations';

// En useEffect o después de que DOM esté listo
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Hero end:', EndCalculator.debug(
      'hero',
      EndCalculator.viewports(4)
    ));

    AnimationConfigReader.debugSection('text-images-1');
    
    // Ver todas las configuraciones
    console.table(AnimationConfigReader.getAllCanvasConfigs());
    console.table(AnimationConfigReader.getAllParallaxConfigs());
  }
}, []);
```

---

## 📊 Orden de Implementación Recomendado

1. ✅ **Completado**: Crear utilidades (EndCalculator, ConfigReader)
2. ⏭️ **Próximo**: Implementar Hero con spacer (1 hora)
   - Es el cambio más visible
   - Elimina el `pt-[7000px]` problemático
   - Da confianza para continuar
3. ⏭️ Canvas 1 (Text Images 1) (30 min)
   - Probar el sistema con un solo canvas
   - Verificar que funciona antes de replicar
4. ⏭️ Resto de Canvas (1 hora)
   - Replicar patrón para canvas 2-5
5. ⏭️ Parallax (30 min)
   - Más simple, bajo riesgo
6. ⏭️ Testing completo (1 hora)
7. ⏭️ Cleanup y optimización (30 min)

**Total estimado: 4.5 horas**

---

## 🎯 Criterios de Éxito

### Antes de Merge:
- ✅ Todas las animaciones funcionan igual o mejor
- ✅ Responsive mobile/desktop correcto
- ✅ No hay errores en consola
- ✅ Performance igual o mejor (check FPS)
- ✅ Código más limpio y mantenible
- ✅ Tests manuales completos

### Métricas:
- ✅ Reducción de líneas hardcodeadas: -90%
- ✅ Tiempo para ajustar duración: de 2 horas → 2 minutos
- ✅ Tiempo para añadir sección: de 1 hora → 10 minutos

---

## 🔄 Rollback Plan

Si algo sale mal:
```bash
# Volver a master
git checkout master

# O resetear cambios específicos
git checkout master -- src/pages/index.tsx
```

Los documentos de mejores prácticas ya están en master, así que no se pierden.

---

## 📝 Notas Importantes

1. **No borrar código viejo inmediatamente** - Comentarlo primero
2. **Usar markers en desarrollo** - Facilita debug
3. **Probar en mobile Y desktop** - Comportamiento puede variar
4. **ScrollTrigger.refresh()** - Llamar después de cambios de DOM
5. **Console logs** - Mantener los informativos, borrar los de debug

---

## 🚀 Empezar Ahora

### Comando Rápido:
```bash
# Ya estamos en la rama correcta
# Siguiente: Editar index.tsx para añadir spacer del hero

# Ver diff antes de commit
git diff

# Commit incremental
git add src/pages/index.tsx
git commit -m "feat: add hero scroll spacer"
```

### Archivos a Editar (en orden):
1. `src/pages/index.tsx` - Añadir spacers, remover pt-[7000px]
2. `src/animations/heroTimeline.ts` - Usar spacer
3. `src/animations/canvasSequences.ts` - Usar EndCalculator
4. `src/animations/parallaxAnimations.ts` - Usar ConfigReader
5. `src/components/textImages*.tsx` - Añadir data attributes

---

**Estado Actual**: ✅ Utilidades listas, documentación completa
**Próximo Paso**: Implementar Hero con spacer (archivo: `src/pages/index.tsx`)

¿Listo para empezar con el Paso 1? 🚀
