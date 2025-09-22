// pages/index.tsx
'use client';
import { useGlobalTimeline } from "@hooks/useGlobalTimeline";

import Hero from "@components/hero";
import Intro from "@components/intro";
import Description from "@components/description";
import ScrollVideo from "@components/scrollVideo";

export default function Home() {
  const timelineRef = useGlobalTimeline();

  return (
    <div ref={timelineRef}>
      {/* 
        ¡IMPORTANTE! Este div genera el scroll. 
        Su altura determina cuánto scroll necesitas para ver todas las animaciones.
        Una buena regla es ~200vh por cada animación principal.
        Hero + Intro1 + Intro2 + Video = 4 animaciones -> 800vh
      */}
      <div className="h-[1000vh] w-full"></div>

      {/* Hero */}
      <Hero zIndex={1000} />

      {/* Intro 1 */}
      {/* <Intro zIndex={990} /> */}

      {/* Intro 2 */}
      <Description zIndex={980} />

      {/* First Scroll Video */}
      <ScrollVideo src='/videos/output_scroll.mp4' id="video-1" zIndex={970} />
    </div>
  );
}