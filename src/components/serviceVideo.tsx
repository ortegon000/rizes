"use client";
import { useEffect, useRef } from "react";
import { MultiSequenceCanvas, handleScrollCanvasSequence } from "@utils/canvas";
import type { SeqManifest } from "@utils/types/canvas.types";

export default function ServiceVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    const initServiceVideo = async () => {
      if (!canvasRef.current) return;

      try {
        // Cargar el manifest de videos
        const res = await fetch("/videos/manifest.json", { cache: "force-cache" });
        
        if (!res.ok) {
          throw new Error(`Failed to load manifest: ${res.status}`);
        }

        const data = await res.json();
        const videos = data.videos as SeqManifest[];
        
        // Buscar el video de servicesVideo
        const serviceVideoManifest = videos.find((v) => v.id === "servicesVideo");

        if (!serviceVideoManifest) {
          console.warn("Service video manifest not found");
          return;
        }

        if (cancelled) return;

        // Inicializar el canvas manager
        const manager = new MultiSequenceCanvas(canvasRef.current);

        console.log("ServiceVideo: Iniciando con manifest:", serviceVideoManifest);

        // Configurar la animación del canvas
        // Sin pin ni fixed, solo scroll normal con la imagen
        handleScrollCanvasSequence({
          canvasManager: manager,
          manifest: serviceVideoManifest,
          target: canvasRef.current.parentElement!,
          scrub: {
            trigger: canvasRef.current.parentElement!,
            start: "top bottom",
            end: "bottom top",
            // No usar pin aquí para que sea un scroll normal
          },
          // Sin fadeIn ni fadeOut - visible todo el tiempo
        });
        
        console.log("ServiceVideo: Configuración completada");
      } catch (error) {
        console.error("Error initializing service video:", error);
      }
    };

    initServiceVideo();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full object-cover"
      style={{ opacity: 1, visibility: 'visible', display: 'block' }}
    />
  );
}
