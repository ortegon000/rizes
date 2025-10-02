"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { lockScrollLenis, unlockScrollLenis } from "@utils/lenisLock";

const services = [
  {
    title: "Convenciones",
    description: "Eventos corporativos que conectan, inspiran y transforman equipos completos.",
    image: "/src/assets/images/text-image-1/1.jpg",
  },
  {
    title: "Conferencias",
    description: "Espacios de conocimiento diseñados para potenciar ideas y generar impacto.",
    image: "/src/assets/images/text-image-2/1.webp",
  },
  {
    title: "Viajes Corporativos",
    description: "Experiencias únicas que fortalecen lazos y celebran logros en cualquier destino.",
    image: "/src/assets/images/text-image-3/1.webp",
  },
  {
    title: "Eventos Híbridos",
    description: "Conexión perfecta entre lo presencial y digital para alcance sin límites.",
    image: "/src/assets/images/text-image-4/1.webp",
  },
  {
    title: "Producción Creativa",
    description: "Diseño y ejecución de conceptos únicos que definen tu marca.",
    image: "/src/assets/images/text-image-5/1.webp",
  },
  {
    title: "Logística Integral",
    description: "Coordinación impecable de cada detalle para una ejecución sin preocupaciones.",
    image: "/src/assets/images/text-image-1/2.webp",
  },
  {
    title: "Tecnología Audiovisual",
    description: "Soluciones técnicas de vanguardia para experiencias inmersivas inolvidables.",
    image: "/src/assets/images/text-image-2/2.webp",
  },
  {
    title: "Eventos Internacionales",
    description: "Experiencia global con presencia local en cualquier rincón del mundo.",
    image: "/src/assets/images/text-image-3/2.webp",
  },
  {
    title: "Activaciones de Marca",
    description: "Momentos memorables que conectan emocionalmente con tu audiencia.",
    image: "/src/assets/images/text-image-4/2.webp",
  },
  {
    title: "Consultoría Estratégica",
    description: "Asesoramiento experto para maximizar el ROI de cada evento corporativo.",
    image: "/src/assets/images/text-image-5/2.webp",
  },
];

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

    // Permitir que el scroll funcione en este contenedor específico
    const allowScroll = (e: Event) => {
      e.stopPropagation();
    };

    container.addEventListener('wheel', allowScroll);
    container.addEventListener('touchmove', allowScroll);

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
        container.removeEventListener('wheel', allowScroll);
        container.removeEventListener('touchmove', allowScroll);
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
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
        className="w-full h-full overflow-y-scroll overflow-x-hidden"
        style={{ 
          height: '100vh', 
          width: '100vw',
          position: 'relative',
        }}
      >
        <div 
          className="relative bg-gradient-to-br from-[#020024] to-red-800"
          style={{ height: `${services.length * 175}vh` }}
        >
          <div className="sticky top-0 h-screen overflow-hidden w-full">
            <div className="flex h-screen items-center">
              <div ref={sliderRef} className="flex will-change-transform">
              {services.map((service, index) => (
                <div 
                  className="group relative flex-shrink-0 overflow-hidden"
                  key={index}
                  style={{
                    width: '100vw',
                    height: '100vh',
                    minWidth: '100vw'
                  }}
                >
                  <div
                    style={{
                      // backgroundImage: `url(${service.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-110"
                  ></div>
                  <div className="absolute inset-0 z-10 grid place-content-center">
                    <div className="text-center px-4">
                      <h2 className="text-white p-8 text-6xl md:text-8xl font-black uppercase">
                        {service.title}
                      </h2>
                      <p className="text-white/80 p-4 text-xl md:text-2xl mt-4 max-w-2xl mx-auto">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollView;
