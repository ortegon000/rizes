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

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {

  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRef4 = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {

      const videoEl = videoRef.current;
      const videoEl2 = videoRef2.current;
      const videoEl3 = videoRef3.current;
      const videoEl4 = videoRef4.current;
      if (!videoEl || !videoEl2 || !videoEl3 || !videoEl4) return;


      const setupAnimation = () => {
        videoEl.pause();
        videoEl.currentTime = 0;
        videoEl2.pause();
        videoEl2.currentTime = 0;
        videoEl3.pause();
        videoEl3.currentTime = 0;
        videoEl4.pause();
        videoEl4.currentTime = 0;

        const videoScrubber = { frame: 0 };
        const videoScrubber2 = { frame: 0 };
        const videoScrubber3 = { frame: 0 };
        const videoScrubber4 = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=20000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            markers: {
              startColor: "green",
              endColor: "red",
              fontSize: "25px",
              indent: 30,
            },
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
            ">-0.25"
          )
          .to("#hero-description", { opacity: 0 }, ">")

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
              ease: "power2.inOut",
            },
            ">-0.25"
          )
          .to(
            videoScrubber,
            {
              frame: videoEl.duration,
              ease: "none",
              onUpdate: () => {
                if (videoEl.duration) {
                  videoEl.currentTime = videoScrubber.frame;
                }
              },
            },
            ">-0.25"
          )

          // text images 1
          .to("#text-images-1", {
            y: "-150dvh",
            duration: 1.25,
          }, ">-0.25")
          .to("#text-images-1-right", {
            y: -300,
            duration: 1.25,
          }, "<0.1")

          // video scroll 1 out
          .to(
            "#video-scroll-1",
            {
              filter: "blur(20px)",
              opacity: 0,
              ease: "power2.inOut",
            },
            "<"
          )

          // video scroll 2
          .to(
            "#video-scroll-2",
            {
              opacity: 1,
            },
            ">-0.15"
          )
          .to(
            "#video-scroll-2",
            {
              filter: "blur(0px)",
              ease: "power2.inOut",
            },
            ">-0.25"
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
          // text images 2
          .to("#text-images-2", {
            y: "-150dvh",
            duration: 1.25,
          }, ">-0.25")
          .to("#text-images-2-right", {
            y: -300,
            duration: 1.25,
          }, "<0.1")
          // video scroll 2 out
          .to(
            "#video-scroll-2",
            {
              filter: "blur(20px)",
              opacity: 0,
              ease: "power2.inOut",
            },
            "<"
          )
          // video scroll 3
          .to(
            "#video-scroll-3",
            {
              opacity: 1,
            },
            ">-0.15"
          )
          .to(
            "#video-scroll-3",
            {
              filter: "blur(0px)",
              ease: "power2.inOut",
            },
            ">-0.5"
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
            ">-0.5"
          )

          // text images 3
          .to("#text-images-3", {
            y: "-200dvh",
            duration: 1.25,
          }, ">-0.25")
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
            "<0.5"
          )


          // video scroll 4
          .to(
            "#video-scroll-4",
            {
              opacity: 1,
            },
            ">-0.15"
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

          // text images 4
          .to("#text-images-4", {
            y: "-150dvh",
            duration: 1.25,
          }, ">-0.25")
          .to("#text-images-4-right", {
            y: -300,
            duration: 1.25,
          }, "<0.1")

          // video scroll 3 out
          .to(
            "#video-scroll-4",
            {
              filter: "blur(20px)",
              opacity: 0,
              ease: "power2.inOut",
            },
            "<0.5"
          )
          ;

        ScrollTrigger.refresh();
      };

      if (videoEl.readyState > 0) {
        setupAnimation();
      } else {
        console.log("Esperando a que el video cargue metadatos...");
        videoEl.addEventListener("loadedmetadata", setupAnimation);
      }

      return () => {
        videoEl.removeEventListener("loadedmetadata", setupAnimation);
      }
    },
    { scope: container }
  );

  return (

    <div className="relative h-screen w-full" ref={container}>
      <Hero zIndex={1000} />

      <Intro zIndex={990} />

      <Description zIndex={980} />

      <ScrollVideo
        ref={videoRef}
        id="video-scroll-1"
        src="/videos/output_scroll_1.mp4"
        zIndex={970}
      />

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
        zIndex={1010}
      />

      <ScrollVideo
        ref={videoRef2}
        id="video-scroll-2"
        src="/videos/output_scroll_2_test.mp4"
        zIndex={1020}
      />

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
        zIndex={1030}
      />

      <ScrollVideo
        ref={videoRef3}
        id="video-scroll-3"
        src="/videos/output_scroll_3.mp4"
        zIndex={1040}
      />

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
        zIndex={1050}
      />

      <ScrollVideo
        ref={videoRef4}
        id="video-scroll-4"
        src="/videos/output_scroll_4.mp4"
        zIndex={1060}
      />

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
        zIndex={1070}
      />
    </div>
  );
}
