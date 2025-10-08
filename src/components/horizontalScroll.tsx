"use client";
import { useRef, useEffect, useState, FC, ReactNode } from "react";
import gsap from "gsap";
import ServiceBG from '@images/services/bg.webp';
import Service1Image from '@images/services/1.jpg';

import Service2Image from '@images/services/2.webp';
import Service3Image from '@images/services/3.webp';
import Service4Image from '@images/services/4.webp';
import Service5Image from '@images/services/5.webp';
import Service6Image from '@images/services/6.webp';
import Service7Image from '@images/services/7.webp';

import Image, { StaticImageData } from "next/image";

interface HorizontalScrollViewProps {
  onClose: () => void;
}

const HorizontalScrollView: FC<HorizontalScrollViewProps> = ({
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  
  // Estado para el modal de imagen en pantalla completa
  const [fullscreenImage, setFullscreenImage] = useState<{
    src: StaticImageData;
    rect: DOMRect;
    title: string;
    description: ReactNode;
  } | null>(null);

  // Estado para controlar la animación de cierre
  const [isClosing, setIsClosing] = useState(false);

  // Función para abrir imagen en pantalla completa
  const handleImageClick = (
    event: React.MouseEvent<HTMLImageElement>,
    imageSrc: StaticImageData,
    title: string,
    description: ReactNode,
  ) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    setFullscreenImage({ src: imageSrc, rect, title, description });
    setIsClosing(false);
  };

  // Función para cerrar la imagen en pantalla completa
  const closeFullscreenImage = () => {
    setIsClosing(true);
    // Esperar a que termine la animación antes de limpiar el estado
    setTimeout(() => {
      setFullscreenImage(null);
      setIsClosing(false);
    }, 400); // Duración de la animación
  };

  // Manejar scroll horizontal con interpolación suave
  useEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;
    const progressBar = progressBarRef.current;
    
    if (!container || !slider || !progressBar) {
      return;
    }

    // Permitir scroll solo dentro del contenedor y evitar el scroll chaining al body
    let touchStartY = 0;
    let touchStartX = 0;

    const isAtTop = () => container.scrollTop <= 0;
    const isAtBottom = () => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      return container.scrollTop >= maxScrollTop - 1;
    };

    const handleWheel = (event: WheelEvent) => {
      event.stopPropagation();

      // ✅ Detectar scroll horizontal (deltaX) además de vertical (deltaY)
      const hasHorizontalScroll = Math.abs(event.deltaX) > Math.abs(event.deltaY);

      if (hasHorizontalScroll) {
        // ✅ Convertir scroll horizontal a scroll vertical
        // deltaX positivo = scroll derecha → scroll down
        // deltaX negativo = scroll izquierda → scroll up
        event.preventDefault();
        container.scrollTop += event.deltaX;
        return;
      }

      // Manejo normal de scroll vertical
      const scrollingUp = event.deltaY < 0;
      const scrollingDown = event.deltaY > 0;

      if ((scrollingUp && isAtTop()) || (scrollingDown && isAtBottom())) {
        event.preventDefault();
        return;
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchStartX = event.touches[0]?.clientX ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.stopPropagation();

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const currentX = event.touches[0]?.clientX ?? touchStartX;
      const deltaY = touchStartY - currentY;
      const deltaX = touchStartX - currentX;

      // ✅ Detectar si es un swipe horizontal
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontalSwipe) {
        // ✅ Convertir swipe horizontal a scroll vertical
        // Swipe izquierda (deltaX positivo) = scroll down
        // Swipe derecha (deltaX negativo) = scroll up
        event.preventDefault();
        const scrollAmount = deltaX * 2; // Multiplicador para sensibilidad
        container.scrollTop += scrollAmount;

        // Actualizar posición de inicio para scroll continuo
        touchStartX = currentX;
        touchStartY = currentY;
        return;
      }

      // Manejo normal de scroll vertical
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

      // Limpiar event listeners
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('scroll', updateProgressAndScroll);
    };
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  // Manejar animaciones de entrada y salida
  useEffect(() => {
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
      className={`fixed inset-0 transition-opacity duration-500 ease-out z-[5000] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >

      {/* Modal de imagen en pantalla completa */}
      {fullscreenImage && (
        <div
          className={`fixed inset-0 z-[6000] flex items-center justify-center bg-black/95 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'animate-fadeIn'
            }`}
          onClick={closeFullscreenImage}
        >
          {/* Botón de cerrar */}
          <button
            onClick={closeFullscreenImage}
            className="absolute top-8 right-8 w-14 h-14 rounded-full bg-red-700 cursor-pointer backdrop-blur-md hover:bg-red-900 flex items-center justify-center transition-all duration-300 group"
            aria-label="Cerrar imagen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Imagen en pantalla completa */}
          <div
            className={`relative w-[90vw] h-[90vh] transition-all duration-400 ${isClosing ? 'animate-zoomOut' : 'animate-zoomIn'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullscreenImage.src}
              alt=""
              fill
              className="object-contain cursor-zoom-out"
              priority
              onClick={closeFullscreenImage}
            />

            {/* Overlay de texto */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                {fullscreenImage.title}
              </h2>
              <div className="md:text-xl lg:text-2xl text-white/90 max-w-4xl drop-shadow-xl">
                {fullscreenImage.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón de cerrar */}
      <button 
        onClick={handleClose}
        className={`fixed top-8 left-8 bg-orange-800 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-orange-900 transition-all duration-300 text-lg flex gap-2 items-center cursor-pointer ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        style={{ zIndex: 1010 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>

        Atrás

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


      {/* Contenedor de servicios */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-scroll overscroll-y-contain overflow-x-hidden"
        style={{ 
          height: '100vh', 
          width: 'auto',
          minWidth: '100vw',
          position: 'relative',
          overscrollBehavior: 'contain',
        }}
      >
        <div 
          className="relative bg-[#baa6f4]"
          style={{
            height: `${3 * 150}vh`,
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), url(${ServiceBG.src})`,
            backgroundSize: '100dvw 100dvh',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >

          <div className="sticky top-0 h-screen w-auto flex items-center">
            <div ref={sliderRef} className="relative flex will-change-transform">

              {/* Services loop */}

              <div className="service-1 relative w-[1000px] sm:w-[1200px] md:w-[1600px] h-dvh">

                <div className={`absolute inset-0 z-10 flex gap-4 md:gap-8 items-center justify-center p-4 md:p-8 transition-all delay-75 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
                  <Image src={Service1Image} alt="" width={500} className="w-auto max-w-[300px] md:max-w-[500px] aspect-[5/3] object-cover border-8 border-white hover:-rotate-1 hover:scale-110 transition-all" />

                  <div className="text-white px-4 whitespace-normal">
                    <h3 className="text-3xl md:text-6xl font-black whitespace-nowrap">Nuestros <br /> servicios</h3>

                    <p className="mt-6 md:mt-16 md:ml-12 font-semibold text-base md:text-3xl max-w-sm">Nuestro principal objetivo, integrar todos y cada uno de los servicios que nuestros clientes requieren dentro de la organización de  eventos, estrategias y presupuestos. <br />
                      Te acompañamos con asesoría integral para:
                    </p>
                  </div>
                </div>
              </div>

              <div className="service-2 relative w-[1000px] sm:w-[1200px] md:w-[1600px] h-dvh">

                <div className="absolute inset-0 z-20 flex gap-4 md:gap-8 items-center justify-center px-4 md:px-8">
                  <div className="gallery-container relative w-full h-[350px] max-w-[300px] lg:max-w-lg border border-transparent hover:border-8 hover:border-white transition-all duration-500">
                    <Image
                      src={Service2Image}
                      alt=""
                      fill
                      className="gallery-image object-cover cursor-zoom-in"
                      onClick={(e) => handleImageClick(
                        e,
                        Service2Image,
                        "Los Mejores Eventos",
                        <>
                          <p>Te acompañamos con asesoría 360° para realizar cualquier tipo de reunión como;</p>
                          <ul className="list-disc list-inside mt-2">
                            <li>Lanzamientos</li>
                            <li>Convenciones</li>
                            <li>Juntas de trabajo</li>
                            <li>Viajes de incentivo</li>
                            <li>Y mucho más</li>
                          </ul>
                          <p className="mt-2">Trabajando de la mano para el logro de los objetivos.</p>
                        </>
                      )}
                    />
                    <span className="block absolute inset-0 bg-black/50 pointer-events-none"></span>
                    <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-lg md:text-3xl font-black text-white px-4 pointer-events-none">Eventos</p>
                    </div>

                  <div className="gallery-container relative w-full h-[600px] max-w-[300px] lg:max-w-lg border border-transparent hover:border-8 hover:border-white transition-all duration-500">
                    <Image
                      src={Service3Image}
                      alt=""
                      fill
                      className="gallery-image object-cover cursor-zoom-in"
                      onClick={(e) => handleImageClick(
                        e,
                        Service3Image,
                        "Congresos y Convenciones",
                        <>
                          <p>Resolvemos de manera integral;</p>
                          <ul className="list-disc list-inside mt-2">
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
                        </>
                      )}
                    />
                    <span className="block absolute inset-0 bg-black/50 pointer-events-none"></span>
                    <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-lg md:text-3xl font-black text-white px-4 pointer-events-none">Congresos y convenciones</p>
                  </div>


                  <div className="gallery-container relative w-full h-[350px] max-w-[300px] lg:max-w-lg border border-transparent hover:border-8 hover:border-white transition-all duration-500">
                    <Image
                      src={Service4Image}
                      alt=""
                      fill
                      className="gallery-image object-cover cursor-zoom-in"
                      onClick={(e) => handleImageClick(
                        e,
                        Service4Image,
                        "Producción y Creatividad",
                        <>
                          <p>Desarrollamos conceptos con tendencia e ideas innovadoras con equipo de la mas alta tecnología para grandes escenarios.</p>
                        </>
                      )}
                    />
                    <span className="block absolute inset-0 bg-black/50 pointer-events-none"></span>
                    <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-lg md:text-3xl font-black text-white px-4 pointer-events-none">Experiencias personalizadas</p>
                  </div>
                </div>
              </div>

              <div className="service-4 relative w-[1000px] sm:w-[1200px] md:w-[1600px]">

                <div className="absolute inset-0 z-20 flex gap-4 md:gap-8 items-center justify-center px-4 md:px-8">
                  <div className="gallery-container relative w-full h-[350px] max-w-[300px] lg:max-w-lg border border-transparent hover:border-8 hover:border-white transition-all duration-500">
                    <Image
                      src={Service5Image}
                      alt=""
                      fill
                      className="gallery-image object-cover cursor-zoom-in"
                      onClick={(e) => handleImageClick(
                        e,
                        Service5Image,
                        "Eventos Virtuales e Híbridos",
                        "Nos reinventamos transformando los eventos presenciales en online, garantizando la misma experiencia vivencial con soluciones hechas a la medida, permitiéndonos abrir nuevas formas de comunicación."
                      )}
                    />
                    <span className="block absolute inset-0 bg-black/50 pointer-events-none"></span>
                    <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-lg md:text-3xl font-black text-white px-4 pointer-events-none">Eventos virtuales e híbridos</p>
                    </div>

                  <div className="gallery-container relative w-full h-[600px] max-w-[300px] lg:max-w-lg border border-transparent hover:border-8 hover:border-white transition-all duration-500">
                    <Image
                      src={Service6Image}
                      alt=""
                      fill
                      className="gallery-image object-cover cursor-zoom-in"
                      onClick={(e) => handleImageClick(
                        e,
                        Service6Image,
                        "Viajes de incentivos",
                        "Deja de preocuparte por la logística de tu viaje individual o grupal. Nosotros nos encargaremos de todo según tus necesidades y planes."
                      )}
                    />
                    <span className="block absolute inset-0 bg-black/50 pointer-events-none"></span>
                    <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-lg md:text-3xl font-black text-white px-4 pointer-events-none">Viajes de incentivos</p>
                    </div>


                  <div className="gallery-container relative w-full h-[350px] max-w-[300px] lg:max-w-lg border border-transparent hover:border-8 hover:border-white transition-all duration-500">
                    <Image
                      src={Service7Image}
                      alt=""
                      fill
                      className="gallery-image object-cover cursor-zoom-in"
                      onClick={(e) => handleImageClick(
                        e,
                        Service7Image,
                        "Y Muchas Experiencias Más",
                        <>
                          <li>Catering</li>
                          <li>PR</li>
                          <li>Speakers</li>
                          <li>Fiestas Temáticas</li>
                          <li>BTL</li>
                          <li>Shows</li>
                          <li>Actividades de integración</li>
                          <li>Telemarketing</li>
                          <li>Y más...</li>
                        </>
                      )}
                    />
                    <span className="block absolute inset-0 bg-black/50 pointer-events-none"></span>
                    <p className="absolute inset-0 flex items-center justify-center mx-auto max-w-sm text-center text-lg md:text-3xl font-black text-white px-4 pointer-events-none">Producción y creatividad</p>
                  </div>
                </div>
              </div>

              {/* End Services loop  */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollView;
