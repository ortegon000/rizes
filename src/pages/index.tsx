'use client';

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

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



  function setupVideoSectionV3({
    video,
    target,
    scrub,             // { trigger, start?, end?, pin? }
    fadeIn,            // { trigger, start?, end? }
    fadeOut,           // { trigger, start?, end? }
  }: {
    video: HTMLVideoElement;
    target: string | Element;
    scrub: { trigger: string | Element; start?: string; end?: string; pin?: boolean };
    fadeIn: { trigger: string | Element; start?: string; end?: string };
    fadeOut: { trigger: string | Element; start?: string; end?: string };
  }) {
    const el = typeof target === "string" ? document.querySelector(target)! : target;

    // capa estable para evitar parpadeos con filter/opacidad
    gsap.set(el, { opacity: 0, filter: "blur(20px)", willChange: "opacity,filter", transform: "translateZ(0)" });
    video.pause(); video.currentTime = 0;

    // estado compartido
    let inP = 0;   // progreso de entrada 0→1
    let outP = 0;  // progreso de salida 0→1

    // apply visual sin conflictos
    const apply = () => {
      const alpha = Math.max(0, Math.min(1, inP * (1 - outP)));
      gsap.set(el, { opacity: alpha, filter: `blur(${20 * (1 - alpha)}px)` });
    };

    // SCRUB de video
    const initScrub = () => {
      ScrollTrigger.create({
        trigger: scrub.trigger,
        start: scrub.start || "top bottom",
        end: scrub.end || "bottom top",
        scrub: true,
        pin: !!scrub.pin,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (video.duration) video.currentTime = self.progress * video.duration;
        },
        onLeaveBack: () => { video.currentTime = 0; }, // no toques opacidad aquí
      });
    };
    if (video.readyState >= 1) initScrub();
    else video.addEventListener("loadedmetadata", initScrub, { once: true });

    // FADE IN (solo actualiza inP)
    ScrollTrigger.create({
      trigger: fadeIn.trigger,
      start: fadeIn.start || "top center",
      end: fadeIn.end || "bottom center",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => { inP = self.progress; apply(); },
    });

    // FADE OUT (solo actualiza outP)
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

      const setupAnimation = () => {

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


        // video 1
        setupVideoSectionV3({
          video: videoEl,
          target: "#video-scroll-1",
          scrub: { trigger: "#text-images-1", start: "-120% bottom", end: "bottom top" },
          fadeIn: { trigger: "#hero-description", start: "65% top", end: "80% top" },
          fadeOut: { trigger: "#text-images-1", start: "20% center", end: "45% center" },
        });

        // more videos

        ScrollTrigger.refresh(); // tras montar todos los videos





















        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=5000",
            scrub: 1,
            markers: {
              startColor: "green",
              endColor: "red",
              fontSize: "25px",
              indent: 30,
            },
          },
        });

        // hero
        tl.to("#hero-key", {
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
          .to("#hero-key", {
            opacity: 0,
          }, ">-0.2")
          .to("#hero-key-logo-mask", {
            opacity: 0,
          }, ">-0.5")

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

        /*

        // video scroll 1
        .to(
          "#video-scroll-1",
          {
            opacity: 1,
          },
          "<-0.35"
        )
        .to(
          "#video-scroll-1",
          {
            filter: "blur(0px)",
            ease: "power1.inOut",
          },
          ">-0.25"
        )
        .to(
          videoScrubber,
          {
            frame: videoEl.duration,
            ease: "none",
            duration: 1,
            onUpdate: () => {
              if (videoEl.duration) {
                videoEl.currentTime = videoScrubber.frame;
              }
            },
          },
          ">-0.25"
        )
        .to(
          "#video-scroll-1",
          {
            filter: "blur(20px)",
            opacity: 0,
            ease: "power4.out",
          },
          ">0.5"
        )

        // text images 1
        // .to("#text-images-1", {
        //   y: "-160dvh",
      
        // }, ">-0.25")
        .to("#text-images-1-right", {
          y: -300,
          duration: 1.5,
        }, "<-0.5")

        // video scroll 2
        .to(
          "#video-scroll-2",
          {
            opacity: 1,
          },
          ">"
        )
        .to(
          "#video-scroll-2",
          {
            filter: "blur(0px)",
            ease: "power1.inOut",
          },
          "<0.15"
        )
        .to(
          videoScrubber2,
          {
            frame: videoEl2.duration,
            ease: "none",
            onUpdate: () => {
              if (videoEl2.duration) {
                videoEl2.currentTime = videoScrubber2.frame;
              }
            },
          },
          ">-0.25"
        )
        .to(
          "#video-scroll-2",
          {
            filter: "blur(20px)",
            opacity: 0,
            ease: "power4.out",
          },
          ">0.75"
        )

        // // text images 2
        // .to("#text-images-2", {
        //   y: "-160dvh",
        //   duration: 1.25,
        // }, ">-0.25")
        .to("#text-images-2-right", {
          y: -300,
          duration: 1.25,
        }, "<0.1")



        // video scroll 3
        .to(
          "#video-scroll-3",
          {
            opacity: 1,
          },
          ">-0.25"
        )
        .to(
          "#video-scroll-3",
          {
            filter: "blur(0px)",
            ease: "power2.inOut",
          },
          ">-0.25"
        )
        .to(
          videoScrubber3,
          {
            frame: videoEl3.duration,
            ease: "none",
            onUpdate: () => {
              if (videoEl3.duration) {
                videoEl3.currentTime = videoScrubber3.frame;
              }
            },
          },
          ">0.5"
        )

        // // text images 3
        // .to("#text-images-3", {
        //   y: "-220dvh",
        //   duration: 1.25,
        // }, ">-0.25")
        .to("#text-images-3-left", {
          y: -300,
          duration: 1.25,
        }, "<0.1")

        // video scroll 3 out
        .to(
          "#video-scroll-3",
          {
            filter: "blur(20px)",
            opacity: 0,
            ease: "power2.inOut",
          },
          ">1"
        )

        // video scroll 4
        .to(
          "#video-scroll-4",
          {
            opacity: 1,
          },
          ">0.75"
        )
        .to(
          "#video-scroll-4",
          {
            filter: "blur(0px)",
            ease: "power2.inOut",
          },
          ">-0.5"
        )
        .to(
          videoScrubber4,
          {
            frame: videoEl4.duration,
            ease: "none",
            onUpdate: () => {
              if (videoEl4.duration) {
                videoEl4.currentTime = videoScrubber4.frame;
              }
            },
          },
          ">-0.5"
        )

        // // text images 4
        // .to("#text-images-4", {
        //   y: "-170dvh",
        //   duration: 1.25,
        // }, ">-0.25")
        .to("#text-images-4-right", {
          y: -300,
          duration: 1.25,
        }, "<0.1")

        // video scroll 4 out
        .to(
          "#video-scroll-4",
          {
            filter: "blur(20px)",
            opacity: 0,
            ease: "power2.inOut",
          },
          "<0.5"
        )

        // video scroll 5
        .to(
          "#video-scroll-5",
          {
            opacity: 1,
          },
          ">0.25"
        )
        .to(
          "#video-scroll-5",
          {
            filter: "blur(0px)",
            ease: "power2.inOut",
          },
          ">-0.5"
        )
        .to(
          videoScrubber5,
          {
            frame: videoEl5.duration,
            ease: "none",
            onUpdate: () => {
              if (videoEl5.duration) {
                videoEl5.currentTime = videoScrubber5.frame;
              }
            },
          },
          ">-0.5"
        )

        // // services
        // .to("#services", {
        //   y: "-160dvh",
        //   duration: 1.25,
        // }, ">-0.25")

        // video scroll 5 out
        .to(
          "#video-scroll-5",
          {
            filter: "blur(20px)",
            opacity: 0,
            ease: "power2.inOut",
          },
          "<0.5"
        )

        // banner 1
        // .to("#banner-1", {
        //   y: "-120dvh",
        //   duration: 1.3,
        // }, "<")
        // .to("#banner-1", {
        //   opacity: 0,
        //   duration: 0,
        // }, ">")

        // // text images 5

        // .to('text-images-5', {
        //   y: "-200dvh",
        // }, "+=5")


        // .to("#text-images-5", {
        //   y: "-350dvh",
        //   duration: 1.25,
        // }, ">-0.5")
        .to("#text-images-5-right", {
          y: 500,
          duration: 1.25,
        }, "<0.1")


        // text images 5 video
        .to(
          videoScrubberSquare1,
          {
            frame: videoSquareEl1.duration,
            ease: "none",
            onUpdate: () => {
              if (videoSquareEl1.duration) {
                videoSquareEl1.currentTime = videoScrubberSquare1.frame;
              }
            },
          },
          "<"
        ) */
        ;

        ScrollTrigger.refresh();
      };

      ;





      // .to(
      //   "#video-scroll-1",
      //   {
      //     opacity: 1,
      //   },
      //   "<-0.35"
      // )
      //   .to(
      //     "#video-scroll-1",
      //     {
      //       filter: "blur(0px)",
      //       ease: "power1.inOut",
      //     },
      //     ">-0.25"
      //   )
      //   .to(
      //     videoScrubber,
      //     {
      //       frame: videoEl.duration,
      //       ease: "none",
      //       duration: 1,
      //       onUpdate: () => {
      //         if (videoEl.duration) {
      //           videoEl.currentTime = videoScrubber.frame;
      //         }
      //       },
      //     },
      //     ">-0.25"
      //   )
      //   .to(
      //     "#video-scroll-1",
      //     {
      //       filter: "blur(20px)",
      //       opacity: 0,
      //       ease: "power4.out",
      //     },
      //     ">0.5"
      //   )











      // if (
      //   videoEl.readyState > 0
      //   && videoEl2.readyState > 0
      //   && videoEl3.readyState > 0
      //   && videoEl4.readyState > 0
      //   && videoEl5.readyState > 0
      //   && videoSquareEl1.readyState > 0
      // ) {
      setupAnimation();
      // } else {
      //   videoEl.addEventListener("loadedmetadata", setupAnimation);
      //   videoEl2.addEventListener("loadedmetadata", setupAnimation);
      //   videoEl3.addEventListener("loadedmetadata", setupAnimation);
      //   videoEl4.addEventListener("loadedmetadata", setupAnimation);
      //   videoEl5.addEventListener("loadedmetadata", setupAnimation);
      //   videoSquareEl1.addEventListener("loadedmetadata", setupAnimation);
      // }

      // return () => {
      //   videoEl.removeEventListener("loadedmetadata", setupAnimation);
      //   videoEl2.removeEventListener("loadedmetadata", setupAnimation);
      //   videoEl3.removeEventListener("loadedmetadata", setupAnimation);
      //   videoEl4.removeEventListener("loadedmetadata", setupAnimation);
      //   videoEl5.removeEventListener("loadedmetadata", setupAnimation);
      //   videoSquareEl1.removeEventListener("loadedmetadata", setupAnimation);
      // }
    },
    { scope: container }
  );

  return (

    <div className="relative w-full" ref={container}>

      <div className="fixed w-full">
        <Hero zIndex={1000} />

        <Intro zIndex={990} />

        <Description zIndex={980} />

        <ScrollVideo
          ref={videoRef}
          id="video-scroll-1"
          src="/videos/test.mp4"
        />

        <ScrollVideo
          ref={videoRef2}
          id="video-scroll-2"
          src="/videos/output_scroll_2_test.mp4"
        />

        <ScrollVideo
          ref={videoRef3}
          id="video-scroll-3"
          src="/videos/output_scroll_3.mp4"
        />

        <ScrollVideo
          ref={videoRef4}
          id="video-scroll-4"
          src="/videos/output_scroll_4.mp4"
        />

        <ScrollVideo
          ref={videoRef5}
          id="video-scroll-5"
          src="/videos/output_scroll_5.mp4"
        />
      </div>

      <div id="normalScrolling" className="relative z-[2000] py-[7000px]">

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

        <div className="mt-[100dvh]">
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

        <div className="mt-[100dvh]">
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

        <div className="mt-[100dvh]">
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

        <div className="mt-[100dvh]">
          <Banner1 id="banner-1" image={Banner1Image} text="Sentirás tranquilidad gracias al profesionalismo de nuestro equipo en todo momento." />
        </div>

        <div className="mt-[100dvh]">
          <TextImages4
            id="text-images-5"
            ref={squareVideo1Ref}
            title={
              <>
                <p className="text-5xl w-full max-w-md mt-8 font-black bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent tracking-wide leading-14">
                  Lograrás ser el evento que marque tendencia.
                </p>
              </>
            }
            subtitle={
              <>
                <p className="mt-12 text-3xl max-w-md text-white">
                  Garantiza a tus invitados el mejor momento del año gracias a la <span className="font-bold text-4xl">personalización</span> de sus eventos.
                </p>
              </>
            }
            description={
              <>
                <p className="mt-32 text-3xl max-w-md ml-auto mr-12 text-white">
                  ¡Deja que <span className="font-bold">los creativos hagan lo que saben para ti!</span>
                </p>
              </>
            }
            text1={
              <>
                <p className="mt-12 text-2xl max-w-md text-white">
                  Fusionamos innovación, tecnología y visión creativa para dar vida a convenciones, conferencias y viajes corporativos que inspiran.
                </p>
              </>
            }
            text2={
              <>
                <p className="mt-12 text-2xl max-w-md text-white">
                  Creamos momentos que hablan el idioma de tu marca y se quedan en la memoria de quienes los viven.
                </p>
              </>
            }
            image1={Image5_1}
            image2={Image5_2}
            image3={Image5_3}
            image4={Image5_4}
            video="/videos/square_video_1_output.mp4"
          />
        </div>

      </div>
    </div>
  );
}
