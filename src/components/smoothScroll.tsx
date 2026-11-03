'use client';
import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getLenisInstance, setLenisInstance } from '@utils/lenisInstance';
import { prefersReducedMotion } from '@utils/motionPref';

/** Default GSAP lagSmoothing — restored on teardown after we force 0 for Lenis. */
const GSAP_LAG_SMOOTHING_DEFAULT = 500;

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Native scroll when the user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    const onScroll = () => {
      ScrollTrigger.update();
    };
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', onScroll);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(GSAP_LAG_SMOOTHING_DEFAULT);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      if (getLenisInstance() === lenis) setLenisInstance(null);
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
