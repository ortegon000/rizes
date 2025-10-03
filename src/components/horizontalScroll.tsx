"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { lockScrollLenis, unlockScrollLenis } from "@utils/lenisLock";
import ServiceBG from '@images/services/bg.webp';
import Service1Image from '@images/services/1.jpg';

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
      // Interpolación suave hacia la posición objetivo
      currentX += (targetX - currentX) * 0.15; // Factor de suavizado (0.1 = muy suave, 0.3 = más rápido)

      // Aplicar la transformación
      gsap.set(slider, { x: currentX });

      // Continuar animando si no hemos llegado al objetivo
      if (Math.abs(targetX - currentX) > 0.5) {
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
          className="relative bg-gradient-to-br from-[#020024] to-red-800"
          // style={{ height: `${services.length * 175}vh` }}
        >
          <div className="sticky top-0 h-screen overflow-hidden w-full">
            <div className="flex h-screen items-center">
              <div ref={sliderRef} className="flex will-change-transform">



                <div 
                  className="group relative flex-shrink-0 overflow-hidden"
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


                  <div id="service-1" className={`absolute inset-0 z-10 flex gap-8 items-center justify-center ${isVisible ? 'translate-x-0' : 'translate-x-full'} transition-all duration-500`}>
                    <Image src={Service1Image} alt="" width={500} className="w-full max-w-[500px] aspect-[5/3] object-cover border-8 border-white hover:-rotate-1 hover:scale-110 transition all " />
                    <div className=" text-white px-4">
                      <h3 className="text-4xl font-black">Nuestros <br /> servicios</h3>

                      <p className="mt-16 ml-12 text-2xl max-w-sm">Nuestro principal objetivo, integrar todos y cada uno de los servicios que nuestros clientes requieren dentro de la organización de  eventos, estrategis y presupuestos. <br />
                        Te acompañamos con asesoría integral para:
                      </p>
                    </div>
                  </div>


                </div>



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollView;
