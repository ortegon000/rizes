"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { lockScrollLenis, unlockScrollLenis } from "@utils/lenisLock";

gsap.registerPlugin(ScrollTrigger);

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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Usar GSAP ScrollTrigger para manejar el scroll horizontal
  useEffect(() => {
    lockScrollLenis();
    
    const container = containerRef.current;
    const slider = sliderRef.current;
    const wrapper = wrapperRef.current;
    
    if (!container || !slider || !wrapper) {
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

    // Crear la animación con GSAP
    const tween = gsap.to(slider, {
      x: maxTranslate,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${window.innerHeight * services.length * 1.75}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scroller: container,
      },
    });

    // Resetear scroll al inicio
    container.scrollTop = 0;
    
    // Cleanup
    return () => {
      container.removeEventListener('wheel', allowScroll);
      container.removeEventListener('touchmove', allowScroll);
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      unlockScrollLenis();
    };
  }, []);

  const [isVisible, setIsVisible] = React.useState(false);

  // Manejar animaciones de entrada y salida
  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 bg-neutral-900 transition-opacity duration-500"
      style={{ 
        zIndex: 2147483647,
        opacity: isVisible ? 1 : 0,
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
        className="fixed top-8 right-8 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 text-2xl"
        style={{ zIndex: 99999999 }}
      >
        ✕
      </button>
      
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
          className="relative bg-neutral-900"
          style={{ height: `${services.length * 175}vh` }}
        >
          <div ref={wrapperRef} className="sticky top-0 h-screen overflow-hidden w-full">
            <div className="flex h-screen items-center">
              <div ref={sliderRef} className="flex will-change-transform">
              {services.map((service, index) => (
                <div 
                  className="group relative flex-shrink-0 overflow-hidden bg-neutral-200" 
                  key={index}
                  style={{ width: '100vw', height: '100vh', minWidth: '100vw' }}
                >
                  <div
                    style={{
                      // backgroundImage: `url(${service.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-110"
                  ></div>
                  <div className="absolute inset-0 z-10 grid place-content-center bg-black/30">
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
