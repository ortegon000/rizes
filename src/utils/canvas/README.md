# Canvas Sequence Animation System

Sistema modular y optimizado para animaciones de secuencias de imágenes con scroll, inspirado en las animaciones de Apple.

## 📁 Estructura

```
src/utils/
├── canvas/
│   ├── index.ts                    # Exportaciones principales
│   ├── MultiSequenceCanvas.ts      # Clase principal del canvas
│   ├── scrollCanvasHandler.ts     # Handler de animaciones con scroll
│   ├── helpers.ts                 # Funciones helper
│   └── README.md                  # Esta documentación
└── types/
    └── canvas.types.ts            # Tipos TypeScript
```

## 🚀 Uso Básico

```typescript
import { MultiSequenceCanvas, handleScrollCanvasSequence } from '@utils/canvas';
import type { SeqManifest } from '@utils/types/canvas.types';

// 1. Crear instancia del canvas
const canvasElement = document.querySelector('canvas');
const manager = new MultiSequenceCanvas(canvasElement);

// 2. Cargar manifest de la secuencia
const manifest: SeqManifest = {
  id: 'video1',
  baseUrl: '/videos/video1/frame_',
  ext: '.jpg',
  count: 105,
  pad: 5,
  width: 1920,
  height: 1080
};

// 3. Configurar animación con scroll
handleScrollCanvasSequence({
  canvasManager: manager,
  manifest: manifest,
  target: canvasElement.parentElement,
  scrub: { 
    trigger: '#section', 
    start: 'top bottom', 
    end: 'bottom top' 
  },
  fadeIn: { 
    trigger: '#section', 
    start: 'top 90%', 
    end: 'top 60%' 
  },
  fadeOut: { 
    trigger: '#next-section', 
    start: 'top 80%', 
    end: 'top 40%' 
  }
});
```

## 📦 Componentes

### MultiSequenceCanvas

Clase principal que maneja el renderizado de secuencias de imágenes en un canvas.

**Características:**
- ✅ Renderizado con `object-fit: cover` (cubre todo el viewport sin deformar)
- ✅ Soporte para pantallas Retina (devicePixelRatio)
- ✅ Responsive (se ajusta automáticamente al resize)
- ✅ Optimizado para performance

**Métodos:**
- `loadSequence(manifest)` - Carga una secuencia de imágenes
- `render()` - Renderiza el frame actual
- `getFrameObject()` - Obtiene el objeto frame para GSAP
- `getTotalFrames()` - Obtiene el total de frames
- `destroy()` - Limpia recursos

### handleScrollCanvasSequence

Función que configura las animaciones de scroll usando GSAP ScrollTrigger.

**Características:**
- ✅ Fade in/out suaves con curvas personalizadas
- ✅ Scrub de frames sincronizado con scroll
- ✅ Pin de elementos
- ✅ Control de visibilidad inteligente

## 🎨 Tipos

```typescript
type SeqManifest = {
  id: string;           // Identificador único
  baseUrl: string;      // URL base de los frames
  ext: string;          // Extensión de archivo (.jpg, .png, etc)
  count: number;        // Total de frames
  pad: number;          // Padding de números (ej: 00001)
  width: number;        // Ancho original
  height: number;       // Alto original
};

type ScrollTriggerConfig = {
  trigger: string | Element;  // Elemento trigger
  start?: string;             // Punto de inicio
  end?: string;               // Punto final
  pin?: boolean;              // Pinear elemento
};

type FadeConfig = {
  trigger: string | Element;  // Elemento trigger
  start?: string;             // Punto de inicio del fade
  end?: string;               // Punto final del fade
};
```

## 🛠️ Funciones Helper

### `padNumber(n: number, len: number)`
Rellena un número con ceros a la izquierda.

```typescript
padNumber(5, 5) // "00005"
```

### `getFrameUrl(manifest, index)`
Genera la URL completa de un frame específico.

```typescript
getFrameUrl({ baseUrl: '/frames/f_', ext: '.jpg', pad: 5 }, 10)
// "/frames/f_00010.jpg"
```

### `calculateCoverDimensions(canvasW, canvasH, imgW, imgH)`
Calcula dimensiones para renderizar con efecto `object-fit: cover`.

```typescript
const { drawWidth, drawHeight, offsetX, offsetY } = 
  calculateCoverDimensions(1920, 1080, 3840, 2160);
```

## 🎯 Mejores Prácticas

1. **Limpieza de recursos**: Siempre llama a `destroy()` cuando el componente se desmonte
2. **Refs de React**: Usa `useRef` para mantener referencias al canvas
3. **Lazy loading**: Considera cargar secuencias solo cuando sean necesarias
4. **Optimización de imágenes**: Usa formatos optimizados (WebP, AVIF) cuando sea posible
5. **Caché**: Configura headers de caché para los frames estáticos

## 📝 Ejemplo Completo (React + Next.js)

```typescript
import { useRef, useEffect } from 'react';
import { MultiSequenceCanvas, handleScrollCanvasSequence } from '@utils/canvas';

export default function VideoSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<MultiSequenceCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Crear manager
    const manager = new MultiSequenceCanvas(canvasRef.current);
    managerRef.current = manager;

    // Cargar y configurar
    const manifest = { /* ... */ };
    handleScrollCanvasSequence({
      canvasManager: manager,
      manifest,
      target: canvasRef.current.parentElement!,
      scrub: { trigger: '#section', start: 'top bottom', end: 'bottom top' },
      fadeIn: { trigger: '#section', start: 'top 90%', end: 'top 60%' },
      fadeOut: { trigger: '#next', start: 'top 80%', end: 'top 40%' }
    });

    // Cleanup
    return () => {
      manager.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
```

## 🔧 Troubleshooting

**El canvas no se ve:**
- Verifica que el elemento tenga dimensiones (width/height)
- Asegúrate de que las imágenes existan en las rutas especificadas
- Revisa la consola por errores de carga

**Performance lento:**
- Reduce el número de frames
- Optimiza el tamaño de las imágenes
- Considera usar formato WebP

**Deformación en móvil:**
- El sistema usa `object-fit: cover` automáticamente
- Verifica que el contenedor tenga las dimensiones correctas

## 📄 License

MIT
