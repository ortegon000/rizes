// pages/index.tsx
'use client';
import { useAnimationOrchestrator } from "@hooks/useAnimationOrchestrator";
import Hero from "@components/hero";

export default function Home() {
  // Ya no necesitas pasar el conteo.
  const containerRef = useAnimationOrchestrator();

  return (
    <div ref={containerRef}>
      {/* Ya no hay espaciador. Los componentes crean su propio espacio. */}
      <Hero zIndex={1000} />
      {/* Cuando quieras añadir más, simplemente descoméntalos. */}
      {/* <Intro zIndex={990} /> */}
    </div>
  );
}