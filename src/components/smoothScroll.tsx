
'use client';
import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // 1. Instanciar Lenis
        const lenis = new Lenis({
            duration: 1.2, // Velocidad del scroll (más alto = más lento)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva de easing
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        // 2. Sincronizar GSAP ScrollTrigger con Lenis
        // Cada vez que Lenis se desplaza, le dice a ScrollTrigger que se actualice.
        lenis.on('scroll', ScrollTrigger.update);

        // 3. Sincronizar el "ticker" (el motor de renderizado) de GSAP con Lenis
        // Esto asegura que ambas librerías se actualicen en el mismo fotograma (requestAnimationFrame)
        // para una suavidad máxima.
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000); // Lenis necesita el tiempo en milisegundos
        });

        // Pone en pausa el ticker de GSAP por defecto para ahorrar recursos
        gsap.ticker.lagSmoothing(0);

        // 4. Función de limpieza
        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return <>{children}</>;
}