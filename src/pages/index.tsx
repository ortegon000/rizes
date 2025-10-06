'use client';

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Header from "@components/header";
import Hero from "@components/hero";
import Intro from "@components/intro";
import Description from "@components/description";
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

// Importar animaciones refactorizadas
import { setupAnimations, type CanvasRefs } from "@animations";
import { useScrollTriggerEvents } from "@hooks/useScrollTriggerEvents";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  // Canvas independientes para cada video (evita encimado)
  const canvasRefs: CanvasRefs = {
    canvas1: useRef<HTMLCanvasElement>(null),
    canvas2: useRef<HTMLCanvasElement>(null),
    canvas3: useRef<HTMLCanvasElement>(null),
    canvas4: useRef<HTMLCanvasElement>(null),
    canvas5: useRef<HTMLCanvasElement>(null),
    square: useRef<HTMLCanvasElement>(null),
  };

  // Función de setup de animaciones (wrapeada para el hook)
  const setupAllAnimations = () => {
    setupAnimations(canvasRefs);
  };

  // Hook para manejar eventos de ScrollTrigger
  useScrollTriggerEvents(setupAllAnimations);

  // Hook principal de GSAP
  useGSAP(
    () => {
      setupAllAnimations();
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

        {/* Hero Container - Fixed solo durante hero-scroll-space */}
        <div id="hero-container" className="fixed inset-0 w-full h-screen">
          <Hero zIndex={1000} />
          <Intro zIndex={990} />
          <Description zIndex={980} />
        </div>

        {/* ✅ Hero Scroll Spacer - Define la duración del hero timeline */}
        <div
          id="hero-scroll-space"
          className="h-[150vh] md:h-[300vh]"
          data-animation-purpose="hero-timeline"
          aria-hidden="true"
        />

        {/* ✅ Spacer para Canvas 1 */}
        <div
          id="canvas-1-spacer"
          className="h-[100vh] md:h-[200vh]"
          data-canvas-frames="120"
          data-scroll-speed="normal"
          aria-hidden="true"
        />

        {/* Video 1 */}
        <div className="pointer-events-none fixed inset-0 z-[970]" aria-hidden="true">
          <canvas ref={canvasRefs.canvas1} className="block w-full h-full" />
        </div>
        {/* Video 2 */}
        <div className="pointer-events-none fixed inset-0" aria-hidden="true">
          <canvas ref={canvasRefs.canvas2} className="block w-full h-full" />
        </div>
        {/* Video 3 */}
        <div className="pointer-events-none fixed inset-0" aria-hidden="true">
          <canvas ref={canvasRefs.canvas3} className="block w-full h-full" />
        </div>
        {/* Video 4 */}
        <div className="pointer-events-none fixed inset-0 z-[940]" aria-hidden="true">
          <canvas ref={canvasRefs.canvas4} className="block w-full h-full" />
        </div>
        {/* Video 5 */}
        <div className="pointer-events-none fixed inset-0 z-[930]" aria-hidden="true">
          <canvas ref={canvasRefs.canvas5} className="block w-full h-full" />
        </div>

        <div id="normalScrolling" className="relative z-[1000]">

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

          {/* ✅ Spacer para Canvas 2 */}
          <div
            id="canvas-2-spacer"
            className="h-[100vh] md:h-[200vh]"
            data-canvas-frames="120"
            data-scroll-speed="normal"
            aria-hidden="true"
          />

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

          {/* ✅ Spacer para Canvas 3 */}
          <div
            id="canvas-3-spacer"
            className="h-[100vh] md:h-[200vh]"
            data-canvas-frames="120"
            data-scroll-speed="normal"
            aria-hidden="true"
          />

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

          {/* ✅ Spacer para Canvas 4 */}
          <div
            id="canvas-4-spacer"
            className="h-[100vh] md:h-[200vh]"
            data-canvas-frames="120"
            data-scroll-speed="normal"
            aria-hidden="true"
          />

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

          {/* ✅ Spacer para Canvas 5 */}
          <div
            id="canvas-5-spacer"
            className="h-[100vh] md:h-[200vh]"
            data-canvas-frames="120"
            data-scroll-speed="normal"
            aria-hidden="true"
          />

          <Services />

          <div className="mt-[10dvh]">
            <Banner1 id="banner-1" image={Banner1Image} text="Sentirás tranquilidad gracias al profesionalismo de nuestro equipo en todo momento." />
          </div>

          <TextImages4
            id="text-images-5"
              canvasRef={canvasRefs.square}
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

          <div className="mt-[10dvh]">
            <ServiceDetails />
          </div>

          <div className="mt-[10dvh]">
            <Team />
          </div>

          {/* ✅ Final Scroll Spacer - Define la duración del timeline final (Customers → LastLogo → Footer) */}
          <div
            id="final-scroll-space"
            className="h-[200vh] md:h-[400vh]"
            data-animation-purpose="final-timeline"
            aria-hidden="true"
          />

        </div>

        {/* Secciones finales - Fixed independientes */}
        <Customers />
        <LastLogo />
        <Footer />

        <div id="keep-scrolling" className="fixed bottom-6 right-0 left-0 mx-auto text-center text-yellow-500 text-shadow-md tracking-wider text-sm text-shadow-black/40 z-[2000]">
          Sige Bajando
          <KeepScrolling className="w-12 h-12 mx-auto drop-shadow drop-shadow-black/40 animate-bounce-pulse text-yellow-500" />
        </div>
      </div>
    </>
  );
}
