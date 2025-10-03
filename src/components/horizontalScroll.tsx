"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { lockScrollLenis, unlockScrollLenis } from "@utils/lenisLock";
import ServiceBG from '@images/services/bg.webp';
import Service1Image from '@images/services/1.jpg';

import Service2Image from '@images/services/2.webp';
import Service3Image from '@images/services/3.webp';
import Service4Image from '@images/services/4.webp';
import Service5Image from '@images/services/5.webp';
import Service6Image from '@images/services/6.webp';
import Service7Image from '@images/services/7.webp';

import Image from "next/image";

interface HorizontalScrollViewProps {
  onClose: () => void;
}

const HorizontalScrollView: React.FC<HorizontalScrollViewProps> = ({
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  
  // Manejar scroll horizontal con interpolación suave
  useEffect(() => {
    lockScrollLenis();
    
    const container = containerRef.current;
    const slider = sliderRef.current;
    const progressBar = progressBarRef.current;
    
    if (!container || !slider || !progressBar) {
      return;
    }

    // Permitir scroll solo dentro del contenedor y evitar el scroll chaining al body
    let touchStartY = 0;

    const isAtTop = () => container.scrollTop <= 0;
    const isAtBottom = () => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      return container.scrollTop >= maxScrollTop - 1;
    };

    const handleWheel = (event: WheelEvent) => {
      event.stopPropagation();

      const scrollingUp = event.deltaY < 0;
      const scrollingDown = event.deltaY > 0;

      if ((scrollingUp && isAtTop()) || (scrollingDown && isAtBottom())) {
        event.preventDefault();
        return;
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.stopPropagation();

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - currentY;

      const scrollingUp = deltaY < 0;
      const scrollingDown = deltaY > 0;

      if ((scrollingUp && isAtTop()) || (scrollingDown && isAtBottom())) {
        event.preventDefault();
        return;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Calcular el ancho total del slider
    const totalWidth = slider.scrollWidth;
    const maxTranslate = -(totalWidth - window.innerWidth);

    // Variables para scroll suave
    let currentX = 0;
    let targetX = 0;
    let animationId: number | null = null;

    // Función para actualizar la barra de progreso Y el scroll horizontal CON SUAVIZADO
    const updateProgressAndScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

      // Actualizar barra de progreso
      progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;

      // Calcular posición objetivo
      targetX = progress * maxTranslate;

      // Solo iniciar animación si no está ya corriendo
      if (!animationId) {
        smoothScrollAnimation();
      }
    };

    // Función de animación suave
    const smoothScrollAnimation = () => {
      // Interpolación ultra suave hacia la posición objetivo
      currentX += (targetX - currentX) * 0.06; // Factor de suavizado aún más reducido

      // Aplicar la transformación
      gsap.set(slider, { x: currentX });

      // Continuar animando si no hemos llegado al objetivo
      if (Math.abs(targetX - currentX) > 0.1) { // Umbral aún más fino
        animationId = requestAnimationFrame(smoothScrollAnimation);
      } else {
        // Detener animación cuando llegamos al objetivo
        gsap.set(slider, { x: targetX });
        animationId = null;
      }
    };

    // Listener para el scroll manual
    container.addEventListener('scroll', updateProgressAndScroll);

    // Resetear scroll al inicio
    container.scrollTop = 0;
    updateProgressAndScroll();
    
    // Cleanup
    return () => {
      // Cancelar animación pendiente
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      // Pequeño delay para evitar conflictos durante la transición de salida
      setTimeout(() => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('scroll', updateProgressAndScroll);
        // Ya no tenemos ScrollTrigger, solo limpiamos Lenis
        unlockScrollLenis();
      }, 50);
    };
  }, []);

  const [isVisible, setIsVisible] = React.useState(false);

  // Manejar animaciones de entrada y salida
  React.useEffect(() => {
    // Entrada inmediata sin delay
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    // Tiempo más corto y directo para el cierre
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      style={{ 
        zIndex: 5000,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >

      {/* Botón de cerrar */}
      <button 
        onClick={handleClose}
        className={`fixed top-8 left-8 bg-orange-800 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-900 transition-opacity duration-300 text-2xl flex gap-4 items-center cursor-pointer ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        style={{ zIndex: 1010 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>

        Atras

      </button>


      {/* Barra de progreso horizontal */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-80 h-2 bg-white/20 rounded-full backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        style={{ zIndex: 1010 }}
      >
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-red-500 to-blue-500 rounded-full transition-all duration-300"
          style={{ width: '0%' }}
        ></div>
      </div>


      
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-scroll overflow-x-hidden overscroll-y-contain"
        style={{ 
          height: '100vh', 
          width: '100vw',
          position: 'relative',
          overscrollBehavior: 'contain',
        }}
      >
        <div 
          className="relative bg-[#baa6f4]"
          style={{ height: `${5 * 150}vh` }}
        >
          <div className="sticky top-0 h-screen overflow-hidden w-full">
            <div className="flex h-screen items-center">
              <div ref={sliderRef} className="relative flex will-change-transform horizontal-scroll-slider" style={{ transform: 'translateZ(0)' }}>

                {/* Seervices loop */}
                <div className="group relative flex-shrink-0"
                  style={{
                    width: '100dvw',
                    height: '100dvh',
                    minWidth: '100dvw',
                    backgroundImage: `url(${ServiceBG.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-110 bg-black/40"
                  ></div>

                  <div className={`absolute inset-0 z-10 flex gap-8 items-center justify-center horizontal-scroll-content transition-all delay-75 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
                    <Image src={Service1Image} alt="" width={500} className="w-full max-w-[500px] aspect-[5/3] object-cover border-8 border-white hover:-rotate-1 hover:scale-110 transition all " />
                    <div className=" text-white px-4">
                      <h3 className="text-6xl font-black">Nuestros <br /> servicios</h3>

                      <p className="mt-16 ml-12 font-semibold text-3xl max-w-sm">Nuestro principal objetivo, integrar todos y cada uno de los servicios que nuestros clientes requieren dentro de la organización de  eventos, estrategis y presupuestos. <br />
                        Te acompañamos con asesoría integral para:
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative flex-shrink-0"
                  style={{
                    width: '100dvw',
                    height: '100dvh',
                    minWidth: '100dvw',
                    // backgroundImage: `url(${ServiceBG.src})`,
                    // backgroundSize: "cover",
                    // backgroundPosition: "center",
                  }}
                >

                  <Image id="service-2-bg" fill src={ServiceBG.src} alt="" className="w-full h-full absolute inset-0 object-cover" />

                  <div className="absolute inset-0 z-20 flex gap-8 items-center justify-center horizontal-scroll-content -translate-x-[300px]">
                    <div className="relative w-full max-w-lg aspect-[4/3]">
                      <Image src={Service2Image} alt="" width={800} className="w-full h-full object-cover border-8 border-white " />
                      <span className="block absolute inset-0 bg-black/50"></span>
                      <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-3xl font-black text-white">Eventos</p>
                    </div>

                    <div className="relative w-full max-w-lg aspect-[4/6]">
                      <Image src={Service3Image} alt="" width={800} className="w-full h-full object-cover border-8 border-white " />
                      <span className="block absolute inset-0 bg-black/50"></span>
                      <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-3xl font-black text-white">Viajes de incentivos</p>
                    </div>


                    <div className="relative w-full max-w-lg aspect-[4/3]">
                      <Image src={Service4Image} alt="" width={800} className="w-full h-full object-cover border-8 border-white " />
                      <span className="block absolute inset-0 bg-black/50"></span>
                      <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-3xl font-black text-white">Experiencias personalizadas</p>
                    </div>
                  </div>


                </div>

                <div className="group relative flex-shrink-0"
                  style={{
                    width: '100dvw',
                    height: '100dvh',
                    minWidth: '100dvw',
                    backgroundColor: '#baa6f4',
                  }}
                >
                  <div className={`absolute inset-0 z-20 flex gap-20 items-center justify-center`}>

                    <div className="text-xl w-full max-w-sm">
                      <p>Los Mejores Eventos <br /> Te acompañamos con asesoría 360° para realizar cualquier tipo de reunión como;</p>
                      <ul className="list-disc list-inside mt-6 space-y-2">
                        <li>Lanzamientos</li>
                        <li>Convenciones</li>
                        <li>Juntas de trabajo</li>
                        <li>Viajes de incentivo</li>
                        <li>Y mucho más</li>
                      </ul>
                      <p className="mt-6">Trabajando de la mano para el logro de los objetivos.</p>
                    </div>

                    <div className="text-xl w-full max-w-sm">
                      <h4 className="font-bold">Congresos y Convenciones</h4>

                      <p>Resolvemos de manera integral;</p>

                      <ul className="list-disc list-inside mt-6 space-y-2">
                        <li>Sede</li>
                        <li>Hoteles</li>
                        <li>Centro de convenciones</li>
                        <li>Área comercial</li>
                        <li>Registro</li>
                        <li>Producción</li>
                        <li>Vuelos</li>
                        <li>Transportación</li>
                        <li>Entrenamiento</li>
                      </ul>
                    </div>

                    <div className="text-xl w-full max-w-sm">
                      <h4 className="font-bold">Producción y Creatividad</h4>

                      <p>Desarrollamos conceptos con tendencia e ideas innovadoras con equipo de la mas alta tecnología para grandes escenarios.</p>
                    </div>

                  </div>
                </div>

                <div className="group relative flex-shrink-0"
                  style={{
                    width: '100dvw',
                    height: '100dvh',
                    minWidth: '100dvw',
                    // backgroundImage: `url(${ServiceBG.src})`,
                    // backgroundSize: "cover",
                    // backgroundPosition: "center",
                  }}
                >
                  <Image id="service-4-bg" fill src={ServiceBG.src} alt="" className="w-full h-full absolute inset-0 object-cover" />

                  <div className="absolute inset-0 z-20 flex gap-12 items-center justify-center horizontal-scroll-content">
                    <div className="relative w-full max-w-lg aspect-[4/3]">
                      <Image src={Service5Image} alt="" width={800} className="w-full h-full object-cover border-8 border-white " />
                      <span className="block absolute inset-0 bg-black/50"></span>
                      <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-3xl font-black text-white">Eventos virtuales e híbridos</p>
                    </div>

                    <div className="relative w-full max-w-lg aspect-[4/6]">
                      <Image src={Service6Image} alt="" width={800} className="w-full h-full object-cover border-8 border-white " />
                      <span className="block absolute inset-0 bg-black/50"></span>
                      <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-3xl font-black text-white">Congresos y convenciones</p>
                    </div>

                    <div className="relative w-full max-w-lg aspect-[4/3]">
                      <Image src={Service7Image} alt="" width={800} className="w-full h-full object-cover border-8 border-white " />
                      <span className="block absolute inset-0 bg-black/50"></span>
                      <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-3xl font-black text-white">Producicón y creatividad</p>
                    </div>
                  </div>


                </div>

                <div className="group relative flex-shrink-0"
                  style={{
                    width: '100dvw',
                    height: '100dvh',
                    minWidth: '100dvw',
                    backgroundColor: '#baa6f4',
                  }}
                >
                  <div className={`absolute inset-0 z-20 flex gap-20 items-center justify-center`}>

                    <div className="text-xl w-full max-w-sm">
                      <h4 className="font-bold">Eventos Virtuales e Híbridos</h4>

                      <p>Nos reinventamos transformando los eventos presenciales en online, garantizando la misma experiencia vivencial con soluciones hechas a la medida, permitiéndonos abrir nuevas formas de comunicación.</p>
                    </div>

                    <div className="text-xl w-full max-w-sm">
                      <h4 className="font-bold">Viajes de incentivos</h4>

                      <p>Deja de preocuparte por la logística de tu viaje individual o grupal. Nosotros nos encargaremos de todo según tus necesidades y planes.</p>
                    </div>

                    <div className="text-xl w-full max-w-sm">
                      <h4 className="font-bold">Y Muchas Experiencias Más</h4>

                      <ul className="list-disc list-inside mt-6 space-y-2">
                        <li>Catering</li>
                        <li>PR</li>
                        <li>Speakers</li>
                        <li>Fiestas Temáticas</li>
                        <li>BTL</li>
                        <li>Shows</li>
                        <li>Actividades de integración</li>
                        <li>Telemarketing</li>
                        <li>Y más...</li>
                      </ul>
                    </div>

                  </div>
                </div>
                {/* End Services loop */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollView;
