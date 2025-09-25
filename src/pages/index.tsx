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

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {

  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {

      const videoEl = videoRef.current;
      const videoEl2 = videoRef2.current;
      if (!videoEl || !videoEl2) return;

      const eventListeners: {
        el: HTMLElement;
        enter: () => void;
        leave: () => void;
      }[] = [];


      const setupAnimation = () => {
        videoEl.pause();
        videoEl.currentTime = 0;
        videoEl2.pause();
        videoEl2.currentTime = 0;
        const videoScrubber = { frame: 0 };
        const videoScrubber2 = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=15000",
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
          // video scroll 2 out
          .to(
            "#video-scroll-2",
            {
              filter: "blur(20px)",
              opacity: 0,
              ease: "power2.inOut",
            },
            "<0.25"
          )
          ;

        const images = gsap.utils.toArray(".text-image");

        images.forEach((image) => {
          const el = image as HTMLElement;

          const handleMouseEnter = () => {
            gsap.to(el, {
              borderWidth: "4px",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          };

          const handleMouseLeave = () => {
            gsap.to(el, {
              borderWidth: "1px",
              duration: 0.3,
              ease: "power2.inOut",
              overwrite: "auto",
            });
          };

          // el.addEventListener("mouseenter", handleMouseEnter);
          // el.addEventListener("mouseleave", handleMouseLeave);

          // Guardamos una referencia para la limpieza
          eventListeners.push({
            el,
            enter: handleMouseEnter,
            leave: handleMouseLeave,
          });
        });

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
      <TextImages zIndex={1010} />
      <ScrollVideo
        ref={videoRef2}
        id="video-scroll-2"
        src="/videos/output_scroll_2_new.mp4"
        zIndex={1020}
      />
    </div>
  );
}