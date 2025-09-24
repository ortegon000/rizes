'use client';

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Hero from "@components/hero";
import Intro from "@components/intro";
import Description from "@components/description";
import ScrollVideo from "@components/scrollVideo";

import Image from "next/image";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {

  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {

      const videoEl = videoRef.current;
      if (!videoEl) return;


      const setupAnimation = () => {
        videoEl.pause();
        videoEl.currentTime = 0;
        const videoScrubber = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=10000",
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
            ">"
          )

          // text images 1
          .to("#text-images-1", {
            y: "-150dvh",
            duration: 1.25,
          }, ">-0.35")
          .to("#text-images-1-right", {
            y: -300,
            duration: 1.25,
          }, "<0.1")

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
        src="/videos/output_scroll.mp4"
        zIndex={970}
      />

      <section id="text-images-1" className="absolute inset-0 h-dvh w-full translate-y-[110dvh] grid grid-cols-2 gap-8" style={{ zIndex: 980 }}>
        <div className="">
          <p className="text-6xl max-w-md mr-0 ml-auto text-shadow-md">
            <strong>Somos una empresa 100% mexicana</strong> que combina <strong>precisión, pasión y visión estratégica.</strong>
          </p>
          <p className="mt-12 text-6xl max-w-md mr-0 ml-auto text-shadow-md">
            Ejecución impecable, <strong>control presupuestal inteligente</strong> y atención a cada detalle.
          </p>
          <Image
            alt=""
            src="/images/text-image-1/1.webp"
            width={500}
            height={500}
            className="mt-12 max-w-md mr-0 ml-auto h-[400px] object-cover"
          />
        </div>

        <div className="" id="text-images-1-right">
          <Image
            alt=""
            src="/images/text-image-1/2.webp"
            width={500}
            height={500}
            className="w-full ml-0 mt-[200px] mr-auto h-[600px] object-cover"
          />

          <Image
            alt=""
            src="/images/text-image-1/3.webp"
            width={500}
            height={500}
            className="mt-8 max-w-md h-[400px] object-cover"
          />
        </div>

      </section>
    </div>
  );
}