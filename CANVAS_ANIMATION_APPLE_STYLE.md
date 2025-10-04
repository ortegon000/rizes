# Implementación de Canvas Animation estilo Apple AirPods

## 🎯 Cambios Realizados

Se implementó una nueva aproximación para las animaciones de canvas basada en el ejemplo de Apple AirPods Pro, que ofrece:

### ✨ Mejoras Principales

1. **Animación más suave con `snap: "frame"`**
   - GSAP ahora anima un objeto `{ frame: 0 }` en lugar de calcular frames manualmente
   - El `snap: "frame"` asegura que siempre se muestren frames completos
   - Scrub de 0.5 para mejor sincronización con el scroll

2. **Precarga simplificada**
   - Se cargan TODAS las imágenes de la secuencia al inicio
   - Ya no hay sistema de ventana deslizante (preload dinámico)
   - Mejor para secuencias cortas (<100 frames)

3. **Mejor calidad de renderizado**
   - `imageSmoothingEnabled: true` con calidad 'high'
   - Renderizado más nítido en dispositivos de alta resolución

4. **Arquitectura simplificada**
   - Cada video tiene su propio `MultiSequenceCanvas`
   - No hay cache compartido entre videos
   - Código más fácil de mantener y debuggear

## 📊 Comparación: Antes vs Ahora

### Antes (Sistema de Cache Dinámico)
```typescript
// Sistema complejo con cache y preload dinámico
warm(manifest, center, preload) {
  // Cargar frames en ventana deslizante
  // Limpiar frames lejanos
  // Gestionar múltiples videos en un canvas
}

ScrollTrigger.create({
  onUpdate: (st) => {
    const idx = Math.round(st.progress * (manifest.count - 1));
    canvasManager.warm(manifest, idx, preload);
    canvasManager.draw(manifest.id, idx);
  }
});
```

### Ahora (Estilo Apple)
```typescript
// Precarga simple de toda la secuencia
async loadSequence(manifest) {
  this.images = Array.from({ length: manifest.count }, (_, i) => {
    const img = new Image();
    img.src = urlAt(manifest, i);
    return img;
  });
}

// Animación GSAP suave
gsap.to(frameObj, {
  frame: totalFrames - 1,
  ease: "none",
  snap: "frame",  // ← Clave para suavidad
  scrollTrigger: {
    scrub: 0.5,   // ← Scrub suave
  },
  onUpdate: () => canvasManager.render()
});
```

## 🔑 Conceptos Clave

### 1. Objeto Frame Animable
```typescript
private frameObj = { frame: 0 };

// GSAP anima este objeto
gsap.to(frameObj, {
  frame: totalFrames - 1,
  snap: "frame"  // Redondea a frames completos
});
```

### 2. Snap de Frames
El `snap: "frame"` es crítico:
- Sin snap: frames parciales (0.5, 1.3, 2.7) → parpadeo
- Con snap: frames completos (0, 1, 2, 3) → animación fluida

### 3. Scrub Suave
```typescript
scrollTrigger: {
  scrub: 0.5  // 0.5 segundos de delay suave
}
```
- `scrub: true` → instantáneo, puede ser brusco
- `scrub: 0.5` → suave, como en Apple

## 📝 Código de Referencia (HTML Original)

```html
<!-- Ejemplo de Apple AirPods Pro -->
<script>
const canvas = document.getElementById("hero");
const ctx = canvas.getContext("2d");

const images = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const img = new Image();
  img.src = createURL(i);
  return img;
});

const airpods = { frame: 0 };

gsap.to(airpods, {
  frame: TOTAL_FRAMES - 1,
  ease: "none",
  snap: "frame",
  scrollTrigger: { scrub: .5 },
  onUpdate: render
});

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(images[airpods.frame], 0, 0);
}
</script>
```

## 🎨 Nueva Clase MultiSequenceCanvas

```typescript
class MultiSequenceCanvas {
  private frameObj = { frame: 0 };  // Objeto para GSAP
  private images: HTMLImageElement[] = [];

  async loadSequence(manifest) {
    // Precarga todas las imágenes
    this.images = Array.from({ length: manifest.count }, ...);
    await this.images[0].onload;
    this.render();
  }

  render() {
    const frameIndex = Math.round(this.frameObj.frame);
    const img = this.images[frameIndex];
    this.ctx.drawImage(img, 0, 0, ...);
  }

  getFrameObject() {
    return this.frameObj;  // Para GSAP
  }
}
```

## 🚀 Uso

```typescript
const manager = new MultiSequenceCanvas(canvas, width, height);

handleScrollCanvasSequence({
  canvasManager: manager,
  manifest: video1,
  target: canvasWrapperRef.current,
  scrub: { 
    trigger: "#text-images-1", 
    start: "-150% bottom", 
    end: "bottom top" 
  },
  fadeIn: { ... },
  fadeOut: { ... }
});
```

## ⚡ Ventajas

✅ Animación más suave y fluida
✅ Código más simple y mantenible
✅ Mejor calidad visual (image smoothing)
✅ Menos bugs de sincronización
✅ Arquitectura probada (Apple lo usa)

## ⚠️ Consideraciones

- **Memoria**: Carga todas las imágenes (ok para <100 frames)
- **Tiempo de carga inicial**: Espera al primer frame antes de mostrar
- **Múltiples videos**: Cada uno tiene su propio manager (mejor separación)

## 🔄 Migración desde sistema anterior

Si tienes secuencias muy largas (>200 frames), considera:

1. Dividir en múltiples secuencias más cortas
2. Usar lazy loading para secuencias fuera de viewport
3. Implementar sistema híbrido (preload inicial + lazy load)

## 📚 Referencias

- [Apple AirPods Pro Animation](https://www.apple.com/airpods-pro/)
- [GSAP ScrollTrigger - Snap](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP Scrub Property](https://greensock.com/docs/v3/Plugins/ScrollTrigger#scrub)
