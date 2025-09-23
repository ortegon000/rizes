'use client';
import { useAnimationOrchestrator } from "@hooks/useAnimationOrchestrator";
import Hero from "@components/hero";
import Intro from "@components/intro";
import Description from "@components/description";
import ScrollVideo from "@components/scrollVideo";
// import ScrollingText from "@components/scrollingText";

export default function Home() {
  const containerRef = useAnimationOrchestrator();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ================================================================ */}
      {/* TIPO 1: Secciones Pinned Autocontenidas (usando el store) */}
      {/* ================================================================ */}
      <Hero zIndex={1000} />
      <Intro zIndex={990} />
      <Description zIndex={980} />
      <ScrollVideo id="video-1" src="/videos/output_scroll.mp4" zIndex={970} />

      {/* ================================================================ */}
      {/* TIPO 2: Escena de Scrollytelling (usando data-attributes) */}
      {/* ================================================================ */}
      {/* Contenedor de la Escena */}
      {/* <div className="relative h-[300vh] w-full bg-black"> */}

      {/* Capa de Fondo - Se fijará con 'data-pin-target' */}
      {/* <div data-pin-target className="sticky top-0 h-screen w-full" style={{ zIndex: 20 }}>
            <video src="/videos/1.mp4" className="h-full w-full object-cover" muted loop playsInline />
          </div> */}

      {/* Capa de Contenido - Hará scroll con 'data-scroll-target' */}
      {/* <div className="absolute top-0 left-0 w-full" style={{ zIndex: 30 }}>
            <ScrollingText>
              <p>Este es el primer texto.</p>
            </ScrollingText>
            <ScrollingText>
              <p>Un segundo párrafo aparece.</p>
            </ScrollingText>
            <ScrollingText>
              <p>Y finalmente, el tercero.</p>
            </ScrollingText>
          </div> */}
      {/* </div> */}

      {/* ================================================================ */}
      {/* Puedes tener más secciones de cualquier tipo después */}
      {/* ================================================================ */}
      {/* <div className="relative h-screen bg-gray-900 flex items-center justify-center">
          <h2 className="text-5xl text-white">Fin de la Experiencia</h2>
        </div> */}
    </div>
  );
}