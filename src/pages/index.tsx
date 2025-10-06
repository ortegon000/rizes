'use client';

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
// import Image from "next/image";

import Header from "@components/header";
import Hero from "@components/hero";
import Intro from "@components/intro";
import Description from "@components/description";
// import ScrollVideo from "@components/scrollVideo";
import TextImages from "@components/textImages";
import TextImages2 from "@components/textImages2";
import TextImages3 from "@components/textImages3";
import TextImages4 from "@components/textImages4";
import Services from "@components/services";
import Banner1 from "@components/banner1";
import ServiceDetails from "@components/serviceDetails";
import Team from "@components/team";
import Customers from "@components/customers";
import { lockScrollLenis, unlockScrollLenis } from "@utils/lenisLock";

import { KeepScrolling } from "@svg/KeepScrolling"

import Image1_1 from "@images/text-image-1/1.webp";
import Image1_2 from "@images/text-image-1/2.webp";
import Image1_3 from "@images/text-image-1/3.webp";

import Image2_1 from "@images/text-image-2/1.webp";
import Image2_2 from "@images/text-image-2/2.webp";
import Image2_3 from "@images/text-image-2/3.webp";

import Image3_1 from "@images/text-image-3/1.webp";
import Image3_2 from "@images/text-image-3/2.webp";
import Image3_3 from "@images/text-image-3/3.webp";

import Image4_1 from "@images/text-image-4/1.webp";
import Image4_2 from "@images/text-image-4/2.webp";

import Image5_1 from "@images/text-image-5/1.webp";
import Image5_2 from "@images/text-image-5/2.webp";
import Image5_3 from "@images/text-image-5/3.webp";
import Image5_4 from "@images/text-image-5/4.webp";

import Banner1Image from "@images/banner-1.webp";
import LastLogo from "@components/lastLogo";
import Footer from "@components/footer";


gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

/* ============================
   NEW: Handler mejorado para múltiples secuencias en UN SOLO canvas
   - Usa un solo canvas reutilizable
   - Cambia frames según la secuencia activa
   - Preload por ventana deslizante
================================ */
type SeqManifest = {
  id: string;
  baseUrl: string;
  ext: string;
  count: number;
  pad: number;
  width: number;
  height: number;
};

const padNum = (n: number, len: number) => n.toString().padStart(len, "0");
const urlAt = (m: SeqManifest, i: number) => `${m.baseUrl}${padNum(i, m.pad)}${m.ext}`;

// Clase que maneja un solo canvas con múltiples secuencias (Estilo Apple AirPods)
class MultiSequenceCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private images: HTMLImageElement[] = [];
  private frameObj = { frame: 0 }; // Objeto para animar con GSAP
  private manifest: SeqManifest | null = null;
  private resizeHandler: () => void;
  // private originalWidth: number;
  // private originalHeight: number;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    // this.originalWidth = width;
    // this.originalHeight = height;
    
    this.ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    })!;
    this.ctx.imageSmoothingEnabled = true; // Activado para mejor calidad
    this.ctx.imageSmoothingQuality = 'high';

    // Ajustar dimensiones del canvas según el viewport manteniendo aspect ratio
    this.updateCanvasSize();

    // Listener para resize (responsive)
    this.resizeHandler = () => this.updateCanvasSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  // Actualizar tamaño del canvas manteniendo aspect ratio
  private updateCanvasSize() {
    const container = this.canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Usar devicePixelRatio para mejor calidad en pantallas retina
    const dpr = window.devicePixelRatio || 1;

    // Canvas ocupa todo el contenedor (pantalla completa)
    this.canvas.width = containerWidth * dpr;
    this.canvas.height = containerHeight * dpr;

    // CSS size (tamaño visible) - pantalla completa
    this.canvas.style.width = `${containerWidth}px`;
    this.canvas.style.height = `${containerHeight}px`;

    // Resetear transformaciones y escalar el contexto para dispositivos retina
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
    this.ctx.scale(dpr, dpr);

    // Re-renderizar si ya hay imágenes cargadas
    if (this.images.length > 0) {
      this.render();
    }
  }

  // Precargar TODAS las imágenes de una secuencia
  async loadSequence(manifest: SeqManifest): Promise<void> {
    this.manifest = manifest;

    // Crear array de imágenes
    this.images = Array.from({ length: manifest.count }, (_, i) => {
      const img = new Image();
      img.src = urlAt(manifest, i);
      return img;
    });

    // Esperar a que cargue el primer frame para renderizar
    await new Promise<void>((resolve) => {
      if (this.images[0].complete) {
        resolve();
      } else {
        this.images[0].onload = () => resolve();
      }
    });

    this.render();
  }

  // Renderizar frame actual con object-fit: cover (cubre todo sin deformar)
  render() {
    if (!this.images.length) return;

    const frameIndex = Math.round(this.frameObj.frame);
    const img = this.images[frameIndex];

    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = this.canvas.width / dpr;
    const canvasHeight = this.canvas.height / dpr;

    // Calcular aspect ratios
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    // Lógica de object-fit: cover
    // La imagen debe cubrir todo el canvas, cortando lo que sobre
    if (imgRatio > canvasRatio) {
      // Imagen más ancha que el canvas - ajustar por altura
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Imagen más alta que el canvas - ajustar por anchura
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    // Limpiar canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Dibujar imagen centrada con object-fit: cover
    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Obtener objeto frame para animar con GSAP
  getFrameObject() {
    return this.frameObj;
  }

  // Obtener número total de frames
  getTotalFrames(): number {
    return this.manifest ? this.manifest.count : 0;
  }

  // Limpiar recursos
  destroy() {
    this.images.forEach(img => {
      img.src = '';
    });
    this.images = [];
    window.removeEventListener('resize', this.resizeHandler);
  }
}// Handler mejorado estilo Apple AirPods - Animación suave con snap
function handleScrollCanvasSequence({
  canvasManager,
  manifest,
  target,
  scrub,
  fadeIn,
  fadeOut,
}: {
  canvasManager: MultiSequenceCanvas;
  manifest: SeqManifest;
  target: string | Element;
  scrub: { trigger: string | Element; start?: string; end?: string; pin?: boolean };
  fadeIn: { trigger: string | Element; start?: string; end?: string };
  fadeOut: { trigger: string | Element; start?: string; end?: string };
}) {
  const el = (typeof target === "string" ? document.querySelector(target)! : target) as HTMLElement;
  if (!el) return;

  // Estado visual inicial - empieza invisible y con pointer-events-none
  gsap.set(el, {
    opacity: 0, 
    visibility: "hidden",
    transform: "translateZ(0)",
    pointerEvents: "none"
  });

  // Cargar secuencia
  canvasManager.loadSequence(manifest).then(() => {
    const frameObj = canvasManager.getFrameObject();
    const totalFrames = canvasManager.getTotalFrames();

    // Animación principal de frames con GSAP (estilo Apple)
    gsap.to(frameObj, {
      frame: totalFrames - 1,
      ease: "none",
      snap: "frame", // Snap a frames completos para animación más suave
      scrollTrigger: {
        trigger: scrub.trigger,
        start: scrub.start || "top bottom",
        end: scrub.end || "bottom top",
        scrub: 0.5, // Scrub suave como en el ejemplo de Apple
        pin: !!scrub.pin,
        anticipatePin: scrub.pin ? 1 : 0,
        invalidateOnRefresh: true,
      },
      onUpdate: () => canvasManager.render(),
    });

    // Sistema de opacidad y visibilidad mejorado
    let inP = 0, outP = 0;
    const VISIBILITY_THRESHOLD = 0.01; // Threshold para mostrar/ocultar

    const applyFx = () => {
      const alpha = Math.max(0, Math.min(1, inP * (1 - outP)));

      // Control de opacidad suave
      el.style.opacity = String(alpha);

      // Control de visibilidad - solo visible cuando hay opacidad significativa
      if (alpha > VISIBILITY_THRESHOLD) {
        el.style.visibility = "visible";
        el.style.pointerEvents = "auto";
      } else {
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
      }
    };

    // Fade In con curva personalizada para transición más suave
    ScrollTrigger.create({
      trigger: fadeIn.trigger,
      start: fadeIn.start || "top center",
      end: fadeIn.end || "bottom center",
      scrub: 0.5, // Scrub suave para opacidad
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        // Curva ease-in para fade in más suave
        inP = gsap.parseEase("power2.in")(st.progress);
        applyFx();
      },
    });

    // Fade Out con curva personalizada
    ScrollTrigger.create({
      trigger: fadeOut.trigger,
      start: fadeOut.start || "top center",
      end: fadeOut.end || "bottom center",
      scrub: 0.5, // Scrub suave para opacidad
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        // Curva ease-out para fade out más suave
        outP = gsap.parseEase("power2.out")(st.progress);
        applyFx();
      },
    });

    // Aplicar estado inicial
    applyFx();
  });
}
/* ============================ END NEW ============================ */

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  // Canvas independientes para cada video (evita encimado)
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const canvas3Ref = useRef<HTMLCanvasElement>(null);
  const canvas4Ref = useRef<HTMLCanvasElement>(null);
  const canvas5Ref = useRef<HTMLCanvasElement>(null);

  // Canvas exclusivo para el square video
  const squareCanvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {

      // Listeners existentes
      const handleRefreshScrollTrigger = () => {
        setTimeout(() => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          ScrollTrigger.refresh();
          setTimeout(() => { setupAnimation(); }, 100);
        }, 100);
      };
      const handleDisableScrollTriggers = () => {
        setTimeout(() => {
          const triggers = ScrollTrigger.getAll();
          triggers.forEach(trigger => trigger.disable());
        }, 50);
      };
      window.addEventListener('refreshScrollTrigger', handleRefreshScrollTrigger);
      window.addEventListener('disableScrollTriggers', handleDisableScrollTriggers);

      const setupAnimation = () => {
        // Hero timeline existente
        const heroTimeline = gsap.timeline({
          scrollTrigger: { trigger: container.current, start: "top top", end: "+=4000", scrub: 1 },
        });

        const heroKey = document.getElementById('hero-key');
        const isOverlayHidden = heroKey?.getAttribute('data-overlay-hidden') === 'true';

        if (!isOverlayHidden) {
          heroTimeline
            .to("#hero-key", { scale: 1 }, 0)
            .to("#hero-key-logo", { opacity: 0, scale: 0.5 }, "<")
            .to("#hero-key-logo-mask", { maskSize: "200px", ease: "power4.out", duration: 1 }, "<")
            .to("#hero-key-background", { display: "none" }, ">-0.2")
            .to("#hero-key-logo-mask", { opacity: 0 }, ">-0.5");
        }

        heroTimeline
          .fromTo("#hero-intro-entrance",
            { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
            { maskImage: "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)" },
            '>-0.45'
          )
          .fromTo("#hero-intro-exit",
            { maskImage: "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)" },
            { maskImage: "radial-gradient(circle at 50% -150%, transparent 50%, black 50%)" },
            ">"
          )
          .to("#hero-intro", { opacity: 0 }, "<")
          .fromTo("#hero-description-entrance",
            { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
            { maskImage: "radial-gradient(circle at 50% -150%, black 50%, transparent 50%)" },
            ">-0.25"
          )
          .to("#hero-description", { opacity: 0 }, ">0.25");

        /* ========== NEW: Inicialización con CANVAS INDEPENDIENTES ==========
           - Cada video tiene su propio canvas (evita encimado)
           - Sistema de opacidad y visibilidad mejorado
           - Carga manifest.json centralizado con todos los videos
        ============================================================================ */
        const initSequences = async () => {
          if (!canvas1Ref.current || !canvas2Ref.current || !canvas3Ref.current ||
            !canvas4Ref.current || !canvas5Ref.current || !squareCanvasRef.current) {
            console.error("Canvas refs no listas");
            return;
          }

          // Cargar manifest centralizado
          const res = await fetch("/videos/manifest.json", { cache: "force-cache" });
          if (!res.ok) {
            console.error("manifest 404/err", res.status);
            return;
          }

          const data = await res.json();
          const videos = data.videos as SeqManifest[];

          // ===== Canvas independientes para cada video (mejor separación) =====

          // Video 1 - Canvas propio
          const video1 = videos.find(v => v.id === "video1");
          if (video1 && canvas1Ref.current) {
            const manager1 = new MultiSequenceCanvas(
              canvas1Ref.current,
              video1.width,
              video1.height
            );
            handleScrollCanvasSequence({
              canvasManager: manager1,
              manifest: video1,
              target: canvas1Ref.current.parentElement!,
              scrub: { trigger: "#text-images-1", start: "-150% bottom", end: "bottom top" },
              fadeIn: { trigger: "#hero-description", start: "65% top", end: "80% top" },
              fadeOut: { trigger: "#text-images-1", start: "20% center", end: "45% center" },
            });
          }

          // Video 2 - Canvas propio
          const video2 = videos.find(v => v.id === "video2");
          if (video2 && canvas2Ref.current) {
            const manager2 = new MultiSequenceCanvas(
              canvas2Ref.current,
              video2.width,
              video2.height
            );
            handleScrollCanvasSequence({
              canvasManager: manager2,
              manifest: video2,
              target: canvas2Ref.current.parentElement!,
              scrub: { trigger: "#text-images-2", start: "-120% bottom", end: "bottom top" },
              fadeIn: { trigger: "#text-images-1", start: "65% top", end: "80% top" },
              fadeOut: { trigger: "#text-images-2", start: "20% center", end: "45% center" },
            });
          }

          // Video 3 - Canvas propio
          const video3 = videos.find(v => v.id === "video3");
          if (video3 && canvas3Ref.current) {
            const manager3 = new MultiSequenceCanvas(
              canvas3Ref.current,
              video3.width,
              video3.height
            );
            handleScrollCanvasSequence({
              canvasManager: manager3,
              manifest: video3,
              target: canvas3Ref.current.parentElement!,
              scrub: { trigger: "#text-images-3", start: "-120% bottom", end: "bottom top" },
              fadeIn: { trigger: "#text-images-2", start: "65% top", end: "80% top" },
              fadeOut: { trigger: "#text-images-3", start: "20% center", end: "45% center" },
            });
          }

          // Video 4 - Canvas propio
          const video4 = videos.find(v => v.id === "video4");
          if (video4 && canvas4Ref.current) {
            const manager4 = new MultiSequenceCanvas(
              canvas4Ref.current,
              video4.width,
              video4.height
            );
            handleScrollCanvasSequence({
              canvasManager: manager4,
              manifest: video4,
              target: canvas4Ref.current.parentElement!,
              scrub: { trigger: "#text-images-4", start: "-120% bottom", end: "bottom top" },
              fadeIn: { trigger: "#text-images-3", start: "65% top", end: "80% top" },
              fadeOut: { trigger: "#text-images-4", start: "20% center", end: "45% center" },
            });
          }

          // Video 5 - Canvas propio
          const video5 = videos.find(v => v.id === "video5");
          if (video5 && canvas5Ref.current) {
            const manager5 = new MultiSequenceCanvas(
              canvas5Ref.current,
              video5.width,
              video5.height
            );
            handleScrollCanvasSequence({
              canvasManager: manager5,
              manifest: video5,
              target: canvas5Ref.current.parentElement!,
              scrub: { trigger: "#services", start: "-120% bottom", end: "bottom top" },
              fadeIn: { trigger: "#text-images-4", start: "65% top", end: "80% top" },
              fadeOut: { trigger: "#services", start: "90% bottom", end: "90% top" },
            });
          }

          // ===== Square Video (integrado en TextImages4) =====
          const squareVideo = videos.find(v => v.id === "squareVideo");
          if (squareVideo && squareCanvasRef.current) {
            const squareManager = new MultiSequenceCanvas(
              squareCanvasRef.current,
              squareVideo.width,
              squareVideo.height
            );

            handleScrollCanvasSequence({
              canvasManager: squareManager,
              manifest: squareVideo,
              target: squareCanvasRef.current.parentElement!,
              scrub: { trigger: "#text-images-5-canvas-container", start: "top top", end: "bottom top", pin: true },
              fadeIn: { trigger: "#text-images-5-canvas-container", start: "top 500%", end: "top top" },
              fadeOut: { trigger: "#text-images-5-canvas-container", start: "bottom top", end: "bottom top+=100" },
            });
          }

        };

        initSequences();

        // Parallax existentes
        gsap.timeline({ scrollTrigger: { trigger: "#text-images-1", start: "top bottom", end: "bottom top", scrub: 1 } })
          .to("#text-images-1-right", { y: -300 }, 0);
        gsap.timeline({ scrollTrigger: { trigger: "#text-images-2", start: "top bottom", end: "bottom top", scrub: 1 } })
          .to("#text-images-2-right", { y: -300 }, 0);
        gsap.timeline({ scrollTrigger: { trigger: "#text-images-3", start: "top bottom", end: "bottom top", scrub: 1 } })
          .to("#text-images-3-left", { y: -300 }, 0);
        gsap.timeline({ scrollTrigger: { trigger: "#text-images-4", start: "top bottom", end: "bottom top", scrub: 1 } })
          .to("#text-images-4-right", { y: -300 }, 0);
        gsap.timeline({ scrollTrigger: { trigger: "#banner-1", start: "top bottom", end: "bottom top", scrub: 1 } })
          .to("#banner-1-image", { y: -300 }, 0);
        gsap.timeline({ scrollTrigger: { trigger: "#text-images-5", start: "top bottom", end: "bottom top", scrub: 1 } })
          .to("#text-images-5-right", { y: 600 }, 0);

        gsap.timeline({ scrollTrigger: { trigger: "#team", start: "top bottom", end: "bottom bottom", scrub: 1 } })
          .to("#team-image", { y: "80%" }, 0)
          .to("#team-description", { y: -200, ease: "power1.inOut" }, 0.2);

        gsap.timeline({ scrollTrigger: { trigger: "#team-description", start: "bottom center-=200", end: "+=2000", scrub: 1 } })
          .to("#customers", { opacity: 1 }, 0)
          .to("#customers", { opacity: 0 }, ">2")
          .to("#lastLogo", { opacity: 1 }, ">-0.3")
          .to("#lastLogoImage", { scale: 1, ease: "power1.inOut" }, "<")
          .to("#lastLogo", { backgroundColor: "#1d1b22" }, ">")
          .to("#lastLogo", { y: -100 }, ">0.5")
          .to("#footer", { y: 0 }, "<");

        ScrollTrigger.refresh();
      };

      setupAnimation();

      return () => {
        window.removeEventListener('refreshScrollTrigger', handleRefreshScrollTrigger);
        window.removeEventListener('disableScrollTriggers', handleDisableScrollTriggers);
      };
    },
    { scope: container }
  );

  const handleMenuChange = (isOpen: boolean) => {
    if (isOpen) lockScrollLenis();
    else unlockScrollLenis();
  };

  return (
    <>
      <Header onMenuChange={handleMenuChange} />

      <div className="relative w-full" ref={container}>

        <div className="fixed w-full">
          <Hero zIndex={1000} />
          <Intro zIndex={990} />
          <Description zIndex={980} />

          {/* Video 1 */}
          <div className="pointer-events-none fixed inset-0 z-[970]" aria-hidden="true">
            <canvas ref={canvas1Ref} className="block w-full h-full" />
          </div>

          {/* Video 2 */}
          <div className="pointer-events-none fixed inset-0 z-[969]" aria-hidden="true">
            <canvas ref={canvas2Ref} className="block w-full h-full" />
          </div>

          {/* Video 3 */}
          <div className="pointer-events-none fixed inset-0 z-[968]" aria-hidden="true">
            <canvas ref={canvas3Ref} className="block w-full h-full" />
          </div>

          {/* Video 4 */}
          <div className="pointer-events-none fixed inset-0 z-[967]" aria-hidden="true">
            <canvas ref={canvas4Ref} className="block w-full h-full" />
          </div>

          {/* Video 5 */}
          <div className="pointer-events-none fixed inset-0 z-[966]" aria-hidden="true">
            <canvas ref={canvas5Ref} className="block w-full h-full" />
          </div>

          <Customers />
          <LastLogo />
          <Footer />

          <div className="fixed bottom-6 right-0 left-0 mx-auto text-center text-yellow-500 text-shadow-md tracking-wider text-sm text-shadow-black/40 z-[3000]">
            Sige Bajando
            <KeepScrolling className="w-12 h-12 mx-auto drop-shadow drop-shadow-black/40 animate-bounce-pulse text-yellow-500" />
          </div>
        </div>

        <div id="normalScrolling" className="relative z-[2000] pt-[7000px] pb-[225dvh]">

          <TextImages
            id="text-images-1"
            title={
              <>
                <p className="text-3xl md:text-5xl max-w-md mr-0 ml-auto bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-normal md:tracking-wide leading-normal md:leading-14">
                  <strong>Somos una empresa 100% mexicana</strong> que combina <strong>precisión, pasión y visión estratégica.</strong>
                </p>
              </>
            }
            subtitle={
              <>
                <p className="mt-12 text-3xl md:text-5xl max-w-md mr-0 ml-auto bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-normal md:tracking-wide leading-normal md:leading-14">
                  Ejecución impecable, <strong>control presupuestal inteligente</strong> y atención a cada detalle.
                </p>
              </>
            }
            image1={Image1_1}
            image2={Image1_2}
            image3={Image1_3}
          />

          <div className="mt-[150dvh]">
            <TextImages
              id="text-images-2"
              title={
                <>
                  <p className="text-3xl md:text-5xl max-w-md mr-0 ml-auto bg-gradient-to-r font-black from-red-400 to-blue-400 bg-clip-text text-transparent tracking-normal md:tracking-wide leading-normal md:leading-14">
                    <span className="text-2xl tracking-normal leading-10 block font-medium">Con Rizes las fronteras no son más que una palabra...</span>
                    ¡Conoce el verdadero significado de romper las fronteras!
                  </p>
                </>
              }
              subtitle={
                <>
                  <p className="mt-12 text-xl md:text-3xl max-w-md mr-0 ml-auto text-white">
                    Que los planes se lleven a cabo tal y como los sueñas, ya sean en una playa, en otro país, desde el polo norte o al polo sur...
                  </p>
                </>
              }
              image1={Image2_1}
              image2={Image2_2}
              image3={Image2_3}
            />
          </div>

          <div className="mt-[150dvh]">
            <TextImages2
              id="text-images-3"
              title={
                <>
                  <p className="text-2xl md:text-3xl max-w-md text-white text-center lg:text-left mx-auto lg:mx-0">
                    Contamos con la capacidad, el equipo y la visión para ejecutar eventos en cualquier rincón del mundo, sin comprometer lo que nos define:
                  </p>
                </>
              }
              subtitle={
                <>
                  <p className="mt-8 md:mt-12 text-4xl md:text-5xl max-w-md text-white font-black text-center lg:text-left mx-auto lg:mx-0">
                    excelencia, detalle y una calidad que se siente en cada momento.
                  </p>
                </>
              }
              description={
                <>
                  <p className="mt-8 md:mt-12 text-2xl md:text-3xl max-w-md text-white font-black text-center lg:text-left mx-auto lg:mx-0">
                    Globalmente <br /> impecable. <br /> Emocionalmente <br /> perfecta.
                  </p>
                </>
              }
              image1={Image3_1}
              image2={Image3_2}
              image3={Image3_3}
            />
          </div>

          <div className="mt-[150dvh]">
            <TextImages3
              id="text-images-4"
              title={
                <>
                  <p className="text-4xl md:text-5xl w-full max-w-screen-lg mx-auto font-black bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-tight md:leading-14 text-center lg:text-left">
                    La tecnología está de nuestro lado para que tus ideas le den la vuelta al mundo en <span className="font-normal text-2xl md:text-3xl">segundos con el impacto que estás buscando.</span>
                  </p>
                </>
              }
              subtitle={
                <>
                  <p className="mt-8 md:mt-12 text-2xl md:text-3xl max-w-md mx-auto lg:mr-12 lg:ml-auto text-white font-bold text-center lg:text-right">
                    El significado de “conexión” cambiará cuando notes el impacto que puedes generar con nuestros eventos digitales e híbridos.
                  </p>
                </>
              }
              description={
                <>
                  <p className="text-2xl md:text-3xl max-w-md text-white font-bold mx-auto lg:mx-0 text-center lg:text-left">
                    Ejecución impecable, <strong>control presupuestal inteligente</strong> y atención a cada detalle.
                  </p>
                </>
              }
              image1={Image4_1}
              image2={Image4_2}
            />
          </div>

          <div className="mt-[100dvh]">
            <Services />
          </div>

          <div className="mt-[10dvh]">
            <Banner1 id="banner-1" image={Banner1Image} text="Sentirás tranquilidad gracias al profesionalismo de nuestro equipo en todo momento." />
          </div>

          <div className="mt-[-10dvh]">
            <TextImages4
              id="text-images-5"
              canvasRef={squareCanvasRef}
              title={
                <>
                  <p className="text-4xl md:text-6xl w-full max-w-md mt-[100px] font-black bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-normal md:tracking-wide leading-normal md:leading-14">
                    Lograrás ser el evento que marque tendencia.
                  </p>
                </>
              }
              subtitle={
                <>
                  <p className="mt-[100px] text-4xl max-w-md text-white">
                    Garantiza a tus invitados el mejor momento del año gracias a la <span className="font-bold text-4xl">personalización</span> de sus eventos.
                  </p>
                </>
              }
              description={
                <>
                  <p className="mt-12 relative z-20 text-4xl max-w-md ml-auto mr-12 text-white">
                    ¡Deja que <span className="font-bold">los creativos hagan lo que saben para ti!</span>
                  </p>
                </>
              }
              text1={
                <>
                  <p className="mt-[100px] text-2xl md:ext-4xl max-w-md text-white">
                    Fusionamos innovación, tecnología y visión creativa para dar vida a convenciones, conferencias y viajes corporativos que inspiran.
                  </p>
                </>
              }
              text2={
                <>
                  <p className="mt-[100px] text-4xl max-w-md text-white">
                    Creamos momentos que hablan el idioma de tu marca y se quedan en la memoria de quienes los viven.
                  </p>
                </>
              }
              image1={Image5_1}
              image2={Image5_2}
              image3={Image5_3}
              image4={Image5_4}
            />
          </div>

          <div className="mt-[10dvh]">
            <ServiceDetails />
          </div>

          <div className="mt-[20dvh]">
            <Team />
          </div>

        </div>
      </div>
    </>
  );
}
