import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroKeyLogo } from "@svg/heroKeyLogo";
import HeroKeyBackground from "@images/hero-key-background.webp";

export default function Home() {
  const logoMaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logoMask = logoMaskRef.current;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      paused: true,
      ease: "power2.Out",
    });

    tl
      .to(
        "#hero-key",
        {
          scale: 1,
        },
        0,
      )
      .to(
        "#hero-key-logo",
        {
          opacity: 0,
          scale: 0.5,
        },
        "<",
      )
      .to(
        "#hero-key-logo-mask",
        {
          ease: "power1.inOut",
          maskSize: "clamp(150px, 25vw, 700px)",
        },
        "<",
      )
      .to(
        "#hero-key",
        {
          opacity: 0,
          duration: 0.3,
        },
        ">-0.2",
      )
      .to(
        "#hero-key-logo-mask",
        {
          opacity: 0,
        },
        ">",
      );

    ScrollTrigger.create({
      trigger: logoMask,
      start: "top top",
      end: "bottom top",
      animation: tl,
      scrub: 1,
      markers: true,
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);


  return (
    <>
      <section ref={logoMaskRef} id="hero-key-logo-mask" className="fixed z-10 top-0 w-full h-screen bg-white">

        <picture
          id="hero-key"
          className="h-screen scale-125 w-full block overflow-hidden fixed"
        >
          <HeroKeyLogo id="hero-key-logo" className="absolute inset-0 m-auto w-80 h-auto object-cover text-white" />

          <Image
            alt=""
            id="hero-key-background"
            src={HeroKeyBackground.src}
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
        </picture>

      </section>
    </>
  );
}
