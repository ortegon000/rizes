"use client";
import { useEffect, useRef } from "react";
import {
  MultiSequenceCanvas,
  handleScrollCanvasSequence,
  type CanvasSequenceHandle,
} from "@utils/canvas";
import type { SeqManifest } from "@utils/types/canvas.types";

export default function ServiceVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let handle: CanvasSequenceHandle | null = null;

    const initServiceVideo = async () => {
      if (!canvasRef.current) return;

      try {
        const res = await fetch("/videos/manifest.json", {
          cache: "force-cache",
        });

        if (!res.ok) {
          throw new Error(`Failed to load manifest: ${res.status}`);
        }

        const data = await res.json();
        const videos = data.videos as SeqManifest[];
        const serviceVideoManifest = videos.find(
          (v) => v.id === "servicesVideo"
        );

        if (!serviceVideoManifest) {
          console.error(
            "Service video manifest not found. Buscando ID: 'servicesVideo'"
          );
          console.error(
            "IDs disponibles:",
            videos.map((v) => v.id)
          );
          return;
        }

        if (cancelled || !canvasRef.current) return;

        const manager = new MultiSequenceCanvas(canvasRef.current);

        if (cancelled) {
          manager.destroy();
          return;
        }

        handle = handleScrollCanvasSequence({
          canvasManager: manager,
          manifest: serviceVideoManifest,
          target: canvasRef.current.parentElement!,
          scrub: {
            trigger: "#services-details",
            start: "center bottom",
            end: "bottom top",
          },
        });
      } catch (error) {
        console.error("Error initializing service video:", error);
      }
    };

    void initServiceVideo();

    return () => {
      cancelled = true;
      handle?.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover"
      style={{ opacity: 1, visibility: "visible", display: "block" }}
    />
  );
}
