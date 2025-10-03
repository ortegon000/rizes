'use client';

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Header from "@components/header";
import Hero from "@components/hero";
import Intro from "@components/intro";
import Description from "@components/description";
import ScrollVideo from "@components/scrollVideo";
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

export default function Home() {

  const container = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRef4 = useRef<HTMLVideoElement>(null);
  const videoRef5 = useRef<HTMLVideoElement>(null);
  const squareVideo1Ref = useRef<HTMLVideoElement>(null);

  function handleScrollVideo({
    video,
    target,
    scrub,
    fadeIn,
    fadeOut,
  }: {
    video: HTMLVideoElement;
    target: string | Element;
    scrub: { trigger: string | Element; start?: string; end?: string; pin?: boolean };
    fadeIn: { trigger: string | Element; start?: string; end?: string };
    fadeOut: { trigger: string | Element; start?: string; end?: string };
    }) {

    const elCandidate = typeof target === "string" ? document.querySelector(target) : target;
    if (!elCandidate) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("handleScrollVideo: target not found", target);
      }
      return;
    }
    const el = elCandidate as Element;

    gsap.set(el, {
      opacity: 0,
      filter: "blur(20px)",
      transform: "translateZ(0)",
    });
    const overlay = el.querySelector('[data-role="video-overlay"]') as HTMLElement | null;
    if (overlay) {
      gsap.set(overlay, { opacity: 0 });
    }
    video.pause();
    video.currentTime = 0;

    const enforcePause = () => {
      if (!video.paused) video.pause();
    };

    if (video.readyState >= 2) enforcePause();
    else video.addEventListener("loadeddata", enforcePause, { once: true });

    let inP = 0;
    let outP = 0;

    const apply = () => {
      const alpha = Math.max(0, Math.min(1, inP * (1 - outP)));
      const blurAmount = 20 * (1 - alpha);

      gsap.set(el, {
        opacity: alpha,
        filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : "none",
      });
      if (overlay) {
        gsap.set(overlay, { opacity: alpha });
      }
      gsap.set(video, {
        filter: blurAmount > 0.5 ? `blur(${blurAmount * 0.5}px)` : "none",
        willChange: alpha > 0 && alpha < 1 ? "filter, opacity" : "auto",
      });
    };

    const initScrub = () => {
      ScrollTrigger.create({
        trigger: scrub.trigger,
        start: scrub.start || "top bottom",
        end: scrub.end || "bottom top",
        scrub: true,
        pin: !!scrub.pin,
        anticipatePin: !!scrub.pin ? 1 : 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!video.duration) return;
          // Directly set the time. Keep it simple.
          const newTime = self.progress * video.duration;
          if (Math.abs(video.currentTime - newTime) > 0.01) {
            video.currentTime = newTime;
          }
        },
        onLeaveBack: () => {
          video.currentTime = 0;
        },
        onToggle: (self) => {
          // When the trigger is not active, ensure the video is paused.
          if (!self.isActive) {
            video.pause();
          }
        },
      });
    };
    if (video.readyState >= 1) initScrub();
    else video.addEventListener("loadedmetadata", initScrub, { once: true });

    // FADE IN
    ScrollTrigger.create({
      trigger: fadeIn.trigger,
      start: fadeIn.start || "top center",
      end: fadeIn.end || "bottom center",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => { inP = self.progress; apply(); },
    });

    // FADE OUT
    ScrollTrigger.create({
      trigger: fadeOut.trigger,
      start: fadeOut.start || "top center",
      end: fadeOut.end || "bottom center",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => { outP = self.progress; apply(); },
    });
  }

  useGSAP(
    () => {

      const videoEl = videoRef.current;
      const videoEl2 = videoRef2.current;
      const videoEl3 = videoRef3.current;
      const videoEl4 = videoRef4.current;
      const videoEl5 = videoRef5.current;
      const videoSquareEl1 = squareVideo1Ref.current;

      // Listener para refrescar ScrollTrigger cuando se cierre el overlay horizontal
      const handleRefreshScrollTrigger = () => {
        console.log('Refrescando ScrollTriggers después de cerrar scroll horizontal');
        // Refresh más agresivo con múltiples pasos
        setTimeout(() => {
          // 1. Matar todos los ScrollTriggers existentes
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());

          // 2. Refresh completo
          ScrollTrigger.refresh();

          // 3. Recrear todas las animaciones
          setTimeout(() => {
            setupAnimation();
            console.log('ScrollTriggers reestablecidos');
          }, 100);
        }, 100);
      };

      // Listener para deshabilitar ScrollTriggers cuando se abre el overlay horizontal
      const handleDisableScrollTriggers = () => {
        console.log('Deshabilitando ScrollTriggers para evitar conflictos con scroll horizontal');
        // Deshabilitar todos los ScrollTriggers temporalmente con un pequeño delay
        setTimeout(() => {
          const triggers = ScrollTrigger.getAll();
          console.log(`Deshabilitando ${triggers.length} ScrollTriggers`);
          triggers.forEach(trigger => {
            trigger.disable();
          });
        }, 50);
      };

      window.addEventListener('refreshScrollTrigger', handleRefreshScrollTrigger);
      window.addEventListener('disableScrollTriggers', handleDisableScrollTriggers);

      const setupAnimation = () => {

        // hero animations
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=4000",
            scrub: 1,
          },
        });

        // Verificar si el hero está temporalmente oculto por el overlay
        const heroKey = document.getElementById('hero-key');
        const isOverlayHidden = heroKey?.getAttribute('data-overlay-hidden') === 'true';

        // Solo aplicar animaciones si no está oculto por el overlay
        if (!isOverlayHidden) {
          heroTimeline
            .to("#hero-key", {
              scale: 1,
            }, 0)
            .to("#hero-key-logo", {
              opacity: 0,
              scale: 0.5,
            }, "<")
            .to(
              "#hero-key-logo-mask",
              {
                maskSize: "200px",
                ease: "power4.out",
                duration: 1,
              },
              "<"
            )
            .to("#hero-key-background", {
              display: "none",
            }, ">-0.2")
            .to("#hero-key-logo-mask", {
              opacity: 0,
            }, ">-0.5");
        }

        heroTimeline

          // intro
          .fromTo(
            "#hero-intro-entrance",
            {
              maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)",
            },
            {
              maskImage: "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)",
            },
            '>-0.45'
          )
          .fromTo(
            "#hero-intro-exit",
            {
              maskImage: "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)",
            },
            {
              maskImage: "radial-gradient(circle at 50% -150%, transparent 50%, black 50%)",
            },
            ">",
          )
          .to("#hero-intro", {
            opacity: 0,
          }, "<")

          // description
          .fromTo(
            "#hero-description-entrance",
            {
              maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)",
            },
            {
              maskImage: "radial-gradient(circle at 50% -150%, black 50%, transparent 50%)",
            },
            ">-0.25"
          )
          .to("#hero-description", {
            opacity: 0,
          }, ">0.25");

        // videos
        if (!videoEl || !videoEl2 || !videoEl3 || !videoEl4 || !videoEl5 || !videoSquareEl1) return;

        videoEl.pause();
        videoEl.currentTime = 0;
        videoEl2.pause();
        videoEl2.currentTime = 0;
        videoEl3.pause();
        videoEl3.currentTime = 0;
        videoEl4.pause();
        videoEl4.currentTime = 0;
        videoEl5.pause();
        videoEl5.currentTime = 0;
        videoSquareEl1.pause();
        videoSquareEl1.currentTime = 0;

        handleScrollVideo({
          video: videoEl,
          target: "#video-scroll-1",
          scrub: { trigger: "#text-images-1", start: "-150% bottom", end: "bottom top" },
          fadeIn: { trigger: "#hero-description", start: "65% top", end: "80% top" },
          fadeOut: { trigger: "#text-images-1", start: "20% center", end: "45% center" },
        });

        handleScrollVideo({
          video: videoEl2,
          target: "#video-scroll-2",
          scrub: { trigger: "#text-images-2", start: "-120% bottom", end: "bottom top" },
          fadeIn: { trigger: "#text-images-1", start: "65% top", end: "80% top" },
          fadeOut: { trigger: "#text-images-2", start: "20% center", end: "45% center" },
        });

        handleScrollVideo({
          video: videoEl3,
          target: "#video-scroll-3",
          scrub: { trigger: "#text-images-3", start: "-120% bottom", end: "bottom top" },
          fadeIn: { trigger: "#text-images-2", start: "65% top", end: "80% top" },
          fadeOut: { trigger: "#text-images-3", start: "20% center", end: "45% center" },
        });

        handleScrollVideo({
          video: videoEl4,
          target: "#video-scroll-4",
          scrub: { trigger: "#text-images-4", start: "-120% bottom", end: "bottom top" },
          fadeIn: { trigger: "#text-images-3", start: "65% top", end: "80% top" },
          fadeOut: { trigger: "#text-images-4", start: "20% center", end: "45% center" },
        });

        handleScrollVideo({
          video: videoEl5,
          target: "#video-scroll-5",
          scrub: { trigger: "#services", start: "-120% bottom", end: "bottom top" },
          fadeIn: { trigger: "#text-images-4", start: "65% top", end: "80% top" },
          fadeOut: { trigger: "#services", start: "90% bottom", end: "90% top" },
        });

        handleScrollVideo({
          video: videoSquareEl1,
          target: "#text-images-5-video",
          scrub: { trigger: "#text-images-5-video", start: "top top", end: "top -100%", pin: true },
          fadeIn: { trigger: "#text-images-5-in", start: "-120% top", end: "130% top" },
          fadeOut: { trigger: "#text-images-5-out", start: "120% top", end: "130% top" },
        });


        gsap.timeline({
          scrollTrigger: {
            trigger: "#text-images-1",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }).to("#text-images-1-right", {
          y: -300
        }, 0)

        gsap.timeline({
          scrollTrigger: {
            trigger: "#text-images-2",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }).to("#text-images-2-right", {
          y: -300
        }, 0)

        gsap.timeline({
          scrollTrigger: {
            trigger: "#text-images-3",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }).to("#text-images-3-left", {
          y: -300
        }, 0)

        gsap.timeline({
          scrollTrigger: {
            trigger: "#text-images-4",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }).to("#text-images-4-right", {
          y: -300
        }, 0)

        gsap.timeline({
          scrollTrigger: {
            trigger: "#banner-1",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }).to("#banner-1-image", {
          y: -300
        }, 0)

        gsap.timeline({
          scrollTrigger: {
            trigger: "#text-images-5",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }).to("#text-images-5-right", {
          y: 600
        }, 0)


        gsap.timeline({
          scrollTrigger: {
            trigger: "#team",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          }
        })
          .to("#team-image", {
            y: "80%",
            // ease: "power1.inOut",
          }, 0)
          .to("#team-description", {
            y: -200,
            ease: "power1.inOut",
          }, 0.2);

        gsap.timeline({
          scrollTrigger: {
            trigger: "#team-description",
            start: "bottom center-=200",
            end: "+=2000",
            scrub: 1,
          }
        })
          .to("#customers", {
            opacity: 1,
          }, 0)
          .to("#customers", {
            opacity: 0,
          }, ">2")
          .to("#lastLogo", {
            opacity: 1,
          }, ">-0.3")
          .to("#lastLogoImage", {
            scale: 1,
            ease: "power1.inOut",
          }, "<")
          .to("#lastLogo", {
            backgroundColor: "#1d1b22",
          }, ">")
          .to("#lastLogo", {
            y: -100,
          }, ">0.5")
          .to("#footer", {
            y: 0,
          }, "<")
          ;

        ScrollTrigger.refresh();
      };

      setupAnimation();

      // Cleanup del event listener
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

          <ScrollVideo
            ref={videoRef}
            id="video-scroll-1"
            src="/videos/output_scroll_1.mp4"
            poster={Image1_1.src}
            sources={[
              { src: "/videos/1.mp4", type: "video/mp4", media: "(max-width: 1023px)" },
              { src: "/videos/output_scroll_1.mp4", type: "video/mp4" },
            ]}
          />

          <ScrollVideo
            ref={videoRef2}
            id="video-scroll-2"
            src="/videos/output_scroll_2.mp4"
            poster={Image2_1.src}
            sources={[
              { src: "/videos/output_scroll_2_test.mp4", type: "video/mp4", media: "(max-width: 1023px)" },
              { src: "/videos/output_scroll_2.mp4", type: "video/mp4" },
            ]}
          />

          <ScrollVideo
            ref={videoRef3}
            id="video-scroll-3"
            src="/videos/output_scroll_3.mp4"
            poster={Image3_1.src}
            sources={[
              { src: "/videos/3.mp4", type: "video/mp4", media: "(max-width: 1023px)" },
              { src: "/videos/output_scroll_3.mp4", type: "video/mp4" },
            ]}
          />

          <ScrollVideo
            ref={videoRef4}
            id="video-scroll-4"
            src="/videos/output_scroll_4.mp4"
            poster={Image4_1.src}
            sources={[
              { src: "/videos/4.mp4", type: "video/mp4", media: "(max-width: 1023px)" },
              { src: "/videos/output_scroll_4.mp4", type: "video/mp4" },
            ]}
          />

          <ScrollVideo
            ref={videoRef5}
            id="video-scroll-5"
            src="/videos/output_scroll_5.mp4"
            poster={Image5_1.src}
            sources={[
              { src: "/videos/5.mp4", type: "video/mp4", media: "(max-width: 1023px)" },
              { src: "/videos/output_scroll_5.mp4", type: "video/mp4" },
            ]}
          />

          <Customers />

          <LastLogo />

          <Footer />

        </div>

        <div id="normalScrolling" className="relative z-[2000] pt-[7000px] pb-[3200px]">

          <TextImages
            id="text-images-1"
            title={
              <>
                <p className="text-5xl max-w-md mr-0 ml-auto bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
                  <strong>Somos una empresa 100% mexicana</strong> que combina <strong>precisión, pasión y visión estratégica.</strong>
                </p>
              </>
            }
            subtitle={
              <>
                <p className="mt-12 text-5xl max-w-md mr-0 ml-auto bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
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
                  <p className="text-5xl max-w-md mr-0 ml-auto bg-gradient-to-r font-black from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
                    <span className="text-2xl tracking-normal leading-10 block font-medium">Con Rizes las fronteras no son más que una palabra...</span>
                    ¡Conoce el verdadero significado de romper las fronteras!
                  </p>
                </>
              }
              subtitle={
                <>
                  <p className="mt-12 text-3xl max-w-md mr-0 ml-auto text-white">
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
                  <p className="text-3xl max-w-md text-white">
                    Contamos con la capacidad, el equipo y la visión para ejecutar eventos en cualquier rincón del mundo, sin comprometer lo que nos define:
                  </p>
                </>
              }
              subtitle={
                <>
                  <p className="mt-12 text-5xl max-w-md text-white font-black">
                    excelencia, detalle y una calidad que se siente en cada momento.
                  </p>
                </>
              }
              description={
                <>
                  <p className="mt-12 text-3xl max-w-md text-white font-black">
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
                  <p className="text-5xl w-full max-w-screen-lg mx-auto font-black bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
                    La tecnología está de nuestro lado para que tus ideas le den la vuelta al mundo en <span className="font-normal text-3xl">segundos con el impacto que estás buscando.</span>
                  </p>
                </>
              }
              subtitle={
                <>
                  <p className="mt-12 text-3xl max-w-md mr-12 ml-auto text-white font-bold">
                    El significado de “conexión” cambiará cuando notes el impacto que puedes generar con nuestros eventos digitales e híbridos.
                  </p>
                </>
              }
              description={
                <>
                  <p className="mt-12 text-3xl max-w-md text-white font-bold">
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
              ref={squareVideo1Ref}
              title={
                <>
                  <p className="text-6xl w-full max-w-md mt-[100px] font-black bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
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
                  <p className="mt-[100px] relative z-20 text-4xl max-w-md ml-auto mr-12 text-white">
                    ¡Deja que <span className="font-bold">los creativos hagan lo que saben para ti!</span>
                  </p>
                </>
              }
              text1={
                <>
                  <p className="mt-[100px] text-4xl max-w-md text-white">
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
              video="/videos/square_video_1_output.mp4"
              poster={Image5_2.src}
              sources={[
                { src: "/videos/square_video_1.mp4", type: "video/mp4", media: "(max-width: 1023px)" },
                { src: "/videos/square_video_1_output.mp4", type: "video/mp4" },
              ]}
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
