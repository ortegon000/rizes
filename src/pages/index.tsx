// pages/index.tsx
'use client';
import Hero from "@components/hero";
import Intro from "@components/intro";
import { useGlobalTimeline } from "@hooks/useGlobalTimeline";
import { Logo } from "@assets/svg/Logo";

export default function Home() {
  const timelineRef = useGlobalTimeline();

  return (
    <div ref={timelineRef}>

      {/* Hero */}
      <Hero zIndex={1000} />

      {/* Intro 1 */}
      <Intro id="hero-text-intro" zIndex={990}>
        <div className="flex justify-center items-center w-full h-full">
          <div className="translate-y-[-20px]">
            <Logo className="w-[200px] h-auto object-contain text-white mx-auto" />
            <p className="text-7xl font-bold text-center bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Bienvenido a la <br /> Experiencia Rizes</p>
            <p className="text-white text-3xl text-center">Vibra, sueña, explota.</p>
          </div>
        </div>
      </Intro>

      {/* Intro 2 */}
      <Intro id="hero-text-description" zIndex={90}>
        <div className="flex justify-center items-center w-full h-full">
          <div className="translate-y-[-20px]">
            <p className="text-7xl font-bold text-center bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              Cumplimos 30 años <br /> creando  emociones <br /> que dejan huella.
            </p>
          </div>
        </div>
      </Intro>
    </div>
  );
}