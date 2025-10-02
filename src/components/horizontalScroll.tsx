"use client";
import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const targetRef = useRef<HTMLDivElement | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
  });
  
  // Bloquear el scroll de Lenis cuando el componente se monta
  useEffect(() => {
    lockScrollLenis();
    
    // Asegurar que el contenedor pueda hacer scroll
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    
    // Restaurar el scroll de Lenis cuando se desmonta
    return () => {
      unlockScrollLenis();
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(services.length - 1) * 100}%`]);

  return (
    <motion.div 
      className="fixed inset-0 z-[9999999] bg-neutral-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Botón de cerrar */}
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 z-[9999999] bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 text-2xl"
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
          ref={targetRef} 
          className="relative bg-neutral-900"
          style={{ height: `${services.length * 100}vh` }}
        >
          <div className="sticky top-0 flex h-screen items-center overflow-hidden w-full">
            <motion.div style={{ x }} className="flex">
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
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HorizontalScrollView;
