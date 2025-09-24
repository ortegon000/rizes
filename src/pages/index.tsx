'use client';
// import { useAnimationOrchestrator } from "@hooks/useAnimationOrchestrator";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Hero from "@components/hero";
import Intro from "@components/intro";
import Description from "@components/description";
import ScrollVideo from "@components/scrollVideo";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // const containerRef = useAnimationOrchestrator();

  const container = useRef<HTMLDivElement>(null);
  // NUEVO: Creamos una ref específica para el elemento video
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {

      // CAMBIO: Usamos la ref directamente, es más seguro que un selector
      const videoEl = videoRef.current;

      // Si por alguna razón el video no existe, salimos para evitar errores.
      if (!videoEl) return;

      // Creamos una función para encapsular toda la lógica de la animación.
      // Así, podemos llamarla cuando estemos seguros de que el video está listo.
      const setupAnimation = () => {
        // Nos aseguramos de que el video esté pausado
        videoEl.pause();
        videoEl.currentTime = 0;

        console.log("Video listo. Duración:", videoEl.duration);

        // Creamos el objeto proxy para el scrubbing
        const videoScrubber = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=10000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            markers: true,
          },
        });

        // hero
        tl.to("#hero-key", { scale: 1 }, 0)
          .to("#hero-key-logo", { opacity: 0, scale: 0.5 }, "<")
          .to(
            "#hero-key-logo-mask",
            {
              maskSize: "200px",
              ease: "power2.out",
            },
            "<"
          )
          .to("#hero-key", { opacity: 0 }, ">-0.2")
          .to("#hero-key-logo-mask", { opacity: 0 }, ">-0.5")

          // intro
          .fromTo(
            "#hero-intro-entrance",
            { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
            { maskImage: "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)" },
            '>-0.45'
          )
          .fromTo(
            "#hero-intro-exit",
            { maskImage: "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)" },
            { maskImage: "radial-gradient(circle at 50% -150%, transparent 50%, black 50%)" },
            ">-0.1",
          )
          .to("#hero-intro", { opacity: 0 }, "<")

          // description
          .fromTo(
            "#hero-description-entrance",
            { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
            { maskImage: "radial-gradient(circle at 50% -150%, black 50%, transparent 50%)" },
            ">"
          )
          .to("#hero-description", { backgroundColor: "transparent" }, ">")
          .to("#hero-description", { opacity: 0 }, ">0.5")

        // --- Animación del video scroll ---
        tl.to(
          "#video-1",
          {
            filter: "blur(0px)",
            ease: "power2.inOut",
          },
          "<-0.5"
        )
          .to(
            videoScrubber,
            {
              frame: videoEl.duration, // ¡Perfecto!
              ease: "none",
              // CAMBIO: ¡Elimina esta línea! Con scrub, la duración
              // la define el espacio que ocupa en la timeline,
              // no un valor en segundos. Esto causa conflictos.
              // duration: 2, 
              onUpdate: () => {
                if (videoEl.duration) {
                  videoEl.currentTime = videoScrubber.frame;
                }
              },
            },
            "<" // Sincronizado con el blur
          );

        // CAMBIO MÁS IMPORTANTE: Forzar la actualización de ScrollTrigger
        // Le dice a ScrollTrigger: "Oye, ya todo está en su sitio (incluyendo Lenis),
        // vuelve a calcular todas tus posiciones AHORA".
        ScrollTrigger.refresh();
      };

      // --- El punto CLAVE ---
      // Verificamos si los metadatos ya están cargados.
      // readyState > 0 significa que al menos los metadatos están listos.
      if (videoEl.readyState > 0) {
        console.log("El video ya estaba listo.");
        setupAnimation();
      } else {
        // Si no, agregamos un listener para esperar.
        console.log("Esperando a que el video cargue metadatos...");
        videoEl.addEventListener("loadedmetadata", setupAnimation);
      }

      // Devolvemos una función de limpieza para remover el listener
      // si el componente se desmonta antes de que el video cargue.
      return () => {
        videoEl.removeEventListener("loadedmetadata", setupAnimation);
      }
    },
    { scope: container }
  );

  return (
    // <div ref={containerRef} className="relative w-full">

    <div className="relative h-screen w-full" ref={container}>
      <Hero zIndex={1000} />
      <Intro zIndex={990} />
      <Description zIndex={980} />
      <Description zIndex={980} />

      {/* CAMBIO: Pasamos la ref al componente */}
      <ScrollVideo
        ref={videoRef}
        id="video-1"
        src="/videos/output_scroll.mp4"
        zIndex={970}
      />
    </div>

    // </div>
  );
}