'use client';
import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

declare global { interface Window { lenis?: Lenis } }

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });
      lenisRef.current = lenis;
      window.lenis = lenis; // <- clave

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove((time) => { lenis.raf(time * 1000); }); // evita doble registro en HMR
        lenis.destroy();
        if (window.lenis === lenis) delete window.lenis;
          lenisRef.current = null;
      };
  }, []);

    return <>{children}</>;
}
