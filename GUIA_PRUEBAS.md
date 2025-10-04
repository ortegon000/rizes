# 🧪 Guía de Prueba - Sistema de Canvas Mejorado

## 🚀 Inicio Rápido

```bash
# 1. Ejecutar el servidor de desarrollo
pnpm run dev

# 2. Abrir en navegador
http://localhost:3000
```

---

## ✅ Checklist de Pruebas

### 1. Transiciones Entre Videos

**Qué probar:**
- Scroll desde Hero hasta Video 1
- Transición Video 1 → Video 2
- Transición Video 2 → Video 3
- Transición Video 3 → Video 4
- Transición Video 4 → Video 5

**Qué observar:**
- ✅ Fade In suave (no aparece de golpe)
- ✅ Fade Out suave (no desaparece de golpe)
- ✅ Crossfade entre videos (superposición suave)
- ✅ No hay "saltos" o "parpadeos"
- ✅ Animación fluida a 60 FPS

**Cómo verificar FPS:**
1. Abrir Chrome DevTools (F12)
2. Ir a **Performance** tab
3. Click en **Record** (círculo)
4. Hacer scroll por los videos
5. Stop recording
6. Verificar que FPS se mantenga en ~60

---

### 2. Visibilidad de Canvas

**Qué probar:**
Inspeccionar cada canvas en diferentes posiciones de scroll

**Cómo:**
1. Abrir Chrome DevTools (F12)
2. Ir a **Elements** tab
3. Buscar `<canvas ref={canvas1Ref}>` etc.
4. Hacer scroll y observar los estilos

**Qué observar:**

**Cuando Video 1 está VISIBLE:**
```html
<div style="opacity: 1; visibility: visible; pointer-events: auto;">
  <canvas></canvas>
</div>
```

**Cuando Video 1 está OCULTO:**
```html
<div style="opacity: 0; visibility: hidden; pointer-events: none;">
  <canvas></canvas>
</div>
```

**Cuando Video 1 está en TRANSICIÓN (50% visible):**
```html
<div style="opacity: 0.5; visibility: visible; pointer-events: auto;">
  <canvas></canvas>
</div>
```

---

### 3. Verificar que NO se Enciman

**Problema anterior:** Todos los videos dibujaban en el mismo canvas

**Qué probar:**
1. Hacer scroll hasta Video 2 (debería estar visible)
2. Inspeccionar en DevTools
3. Verificar que Video 1 tenga `visibility: hidden`
4. Verificar que Video 2 tenga `visibility: visible`

**Resultado esperado:**
- Solo 1 video debe estar `visible` a la vez
- Durante transiciones, 2 videos pueden estar `visible` con diferentes opacidades
- Videos ocultos deben tener `visibility: hidden`

---

### 4. Animación de Frames

**Qué probar:**
Verificar que la animación de frames sea suave (no salte frames)

**Cómo:**
1. Hacer scroll MUY LENTO por un video
2. Observar que los frames cambien progresivamente
3. No debería haber "saltos" de frames

**Problema si falla:**
- Frames saltan (ej: frame 1 → frame 5 → frame 10)
- Solución: Verificar que `snap: "frame"` esté presente

---

### 5. Rendimiento en Móvil/Tablet

**Qué probar:**
Abrir en dispositivo móvil o usar Chrome DevTools Device Emulation

**Cómo (Chrome DevTools):**
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Seleccionar dispositivo (iPhone, iPad, etc.)
3. Hacer scroll por los videos

**Qué observar:**
- ✅ Animaciones siguen siendo fluidas
- ✅ No hay lag al hacer scroll
- ✅ Transiciones son suaves

---

### 6. Memoria y Recursos

**Qué probar:**
Verificar que no haya memory leaks

**Cómo:**
1. Abrir Chrome DevTools
2. Ir a **Memory** tab
3. Click en **Take heap snapshot**
4. Hacer scroll por TODOS los videos
5. Volver al inicio
6. Tomar otro snapshot
7. Comparar tamaños

**Resultado esperado:**
- Memoria debería estabilizarse (no crecer indefinidamente)
- Videos fuera de vista deberían liberar recursos

---

## 🎨 Ajustes de Configuración

### Si las transiciones son muy lentas:

```typescript
// En handleScrollCanvasSequence
ScrollTrigger.create({
  scrub: 0.3,  // Cambiar de 0.5 a 0.3 (más rápido)
  // ...
});
```

### Si las transiciones son muy rápidas:

```typescript
// En handleScrollCanvasSequence
ScrollTrigger.create({
  scrub: 0.8,  // Cambiar de 0.5 a 0.8 (más lento)
  // ...
});
```

### Si quieres transiciones más dramáticas:

```typescript
// Cambiar curvas de easing
inP = gsap.parseEase("power3.in")(st.progress);  // power2 → power3
outP = gsap.parseEase("power3.out")(st.progress);
```

### Si quieres transiciones más sutiles:

```typescript
// Cambiar curvas de easing
inP = gsap.parseEase("power1.in")(st.progress);  // power2 → power1
outP = gsap.parseEase("power1.out")(st.progress);
```

---

## 🐛 Problemas Comunes y Soluciones

### Problema: Videos parpadean

**Causa:** Threshold de visibilidad muy alto
**Solución:**
```typescript
const VISIBILITY_THRESHOLD = 0.001;  // Reducir de 0.01 a 0.001
```

### Problema: Transiciones muy bruscas

**Causa:** Scrub demasiado bajo o sin easing
**Solución:**
```typescript
scrub: 0.7,  // Aumentar scrub
inP = gsap.parseEase("power2.in")(st.progress);  // Agregar easing
```

### Problema: Videos se siguen encimando

**Causa:** Canvas refs no están asignados correctamente
**Solución:**
1. Verificar que cada `<canvas ref={canvas1Ref}>` esté correcto
2. Verificar que cada manager use el canvas correcto
3. Verificar en DevTools que haya 6 canvas diferentes

### Problema: FPS bajo (<30)

**Causa:** Demasiadas imágenes cargadas o navegador antiguo
**Solución:**
1. Reducir número de frames en manifest.json
2. Optimizar tamaño de imágenes
3. Usar navegador moderno (Chrome/Edge)

### Problema: Primer frame no aparece

**Causa:** Imagen no ha cargado antes de renderizar
**Solución:**
Ya está implementado con `await this.images[0].onload`

---

## 📊 Métricas Objetivo

| Métrica | Objetivo | Cómo Medir |
|---------|----------|------------|
| FPS | 60 | Chrome DevTools > Performance |
| Tiempo de carga | <2s | Network tab (primera imagen) |
| Memoria | <500MB | Memory tab > Heap snapshot |
| Transición | Suave | Observación visual |

---

## 🎯 Escenarios de Prueba

### Escenario 1: Scroll Normal
1. Iniciar en Hero
2. Scroll suave hacia abajo
3. Observar todas las transiciones
4. Llegar hasta Footer
5. Scroll hacia arriba de vuelta

**Resultado esperado:** Todo fluido, sin problemas

### Escenario 2: Scroll Rápido
1. Scroll muy rápido (rueda del mouse)
2. Ir y venir entre secciones
3. Observar comportamiento

**Resultado esperado:** Videos cargan correctamente, no hay lag

### Escenario 3: Scroll Lento
1. Scroll MUY lento (pixel por pixel)
2. Observar frame por frame
3. Verificar que no haya saltos

**Resultado esperado:** Animación perfectamente suave

### Escenario 4: Resize de Ventana
1. Hacer scroll hasta un video
2. Cambiar tamaño de ventana
3. Verificar que video se ajuste

**Resultado esperado:** Canvas se redimensiona correctamente

---

## 🔍 Debugging en Tiempo Real

### Ver estado de opacidad en consola:

Agregar en `applyFx()`:
```typescript
const applyFx = () => {
  const alpha = Math.max(0, Math.min(1, inP * (1 - outP)));
  
  // Debug
  console.log(`${manifest.id}: alpha=${alpha.toFixed(2)}, inP=${inP.toFixed(2)}, outP=${outP.toFixed(2)}`);
  
  el.style.opacity = String(alpha);
  // ... resto del código
};
```

### Ver qué canvas están visibles:

Agregar en consola del navegador:
```javascript
// Ver todos los canvas
document.querySelectorAll('canvas').forEach((canvas, i) => {
  const parent = canvas.parentElement;
  console.log(`Canvas ${i+1}:`, {
    opacity: parent.style.opacity,
    visibility: parent.style.visibility,
    zIndex: window.getComputedStyle(parent).zIndex
  });
});
```

---

## 📝 Notas de Desarrollo

### Videos Actuales
- Video 1: Aparece después de Hero/Intro/Description
- Video 2: Aparece en text-images-2
- Video 3: Aparece en text-images-3
- Video 4: Aparece en text-images-4
- Video 5: Aparece antes de Services
- Square Video: Aparece en text-images-5 (con pin)

### Z-Index Stack
```
Hero:        z-1000
Intro:       z-990
Description: z-980
Canvas 1:    z-970
Canvas 2:    z-969
Canvas 3:    z-968
Canvas 4:    z-967
Canvas 5:    z-966
```

---

## ✅ Checklist Final

Antes de dar por terminado, verificar:

- [ ] FPS constante a 60
- [ ] Transiciones suaves (no bruscas)
- [ ] No hay encimado de videos
- [ ] Visibilidad se controla correctamente
- [ ] Memoria no crece indefinidamente
- [ ] Funciona en móvil/tablet
- [ ] Funciona en diferentes navegadores
- [ ] No hay console.errors
- [ ] Todos los 6 canvas cargan correctamente

---

## 🎉 ¡Listo!

Si todas las pruebas pasan, el sistema está funcionando **mil veces más fluido** que antes.

**Disfruta de las animaciones suaves!** 🚀✨
