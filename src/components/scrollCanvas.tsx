"use client";
import { useEffect, useRef } from "react";
import { handleScrollCanvasSequence } from "@utils/handleScrollCanvas";

type Manifest = { baseUrl:string; ext:string; count:number; pad:number; width:number; height:number; };

export default function ScrollCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const res = await fetch("/sequence/v1/manifest.json", { cache: "force-cache" });
      const manifest = (await res.json()) as Manifest;
      if (cancelled) return;
      handleScrollCanvasSequence({
        canvas: canvasRef.current!,
        manifest,
        target: wrapRef.current!,
        preload: 80,
        scrub: { trigger: wrapRef.current!, start: "top top", end: "200% top", pin: true },
        fadeIn: { trigger: wrapRef.current!, start: "top 90%", end: "top 60%" },
        fadeOut:{ trigger: "#next-section", start: "top 80%", end: "top 40%" },
      });
    };
    run(); return () => { cancelled = true; };
  }, []);

  return (
    <div ref={wrapRef} id="video-seq" className="relative w-full h-[100vh]">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
