// import { useRef, useLayoutEffect } from 'react';
// import { gsap } from 'gsap';
// import { useAnimationStore } from '@store/animationStore';

import { forwardRef } from 'react';

type ScrollVideoProps = {
    src: string;
    id: string;
    zIndex?: number;
};

const ScrollVideo = forwardRef<HTMLVideoElement, ScrollVideoProps>(({ src, id, zIndex = 10 }, ref) => {

    // const sectionRef = useRef<HTMLElement>(null);
    // const videoRef = useRef<HTMLVideoElement>(null); // Ref específico para el video
    // const registerAnimation = useAnimationStore((state) => state.registerAnimation);

    // useLayoutEffect(() => {
    //     const section = sectionRef.current;
    //     const videoEl = videoRef.current; // Obtenemos el video desde su ref

    //     if (!section || !videoEl) return;

    //     // Pausamos el video para que GSAP lo controle
    //     videoEl.pause();
    //     videoEl.currentTime = 0;

    //     // Creamos la animación. No necesitamos 'await' aquí.
    //     const tl = gsap.timeline();
    //     const videoScrubber = { frame: 0 };

    //     // 1. Animación de entrada de la sección (fade in y unblur)
    //     tl.to(section, {
    //         opacity: 1,
    //         filter: "blur(0px)",
    //         duration: 1,
    //     }, 0);

    //     // 2. Animación de scrubbing del video
    //     tl.to(
    //         videoScrubber,
    //         {
    //             // ¡LA MAGIA! Usamos una función para obtener la duración
    //             // JUSTO cuando la animación empieza. Para entonces, ya habrá cargado.
    //             frame: () => videoEl.duration,
    //             ease: "none",
    //             onUpdate: () => {
    //                 // Sincronizamos el video con nuestro objeto proxy
    //                 if (videoEl.duration > 0) {
    //                     videoEl.currentTime = videoScrubber.frame;
    //                 }
    //             },
    //         },
    //         "+=0.1" // Empezar el scrubbing un poco después del fade-in
    //     );

    //     // 3. Registramos la animación completa en el orquestador
    //     registerAnimation({
    //         target: section,
    //         animation: tl,
    //         config: {
    //             overlap: 100, // Sin superposición
    //             priority: 4, // Última animación
    //             end: "+=400%"
    //         } // Damos más espacio de scroll para el video
    //     });

    // }, [registerAnimation]);

    return (
        // La estructura JSX ahora es correcta para el pinning
        <section
            // ref={sectionRef}
            id={id}
            className="absolute inset-0 h-screen w-full blur-xl" // Clases para el estado inicial
            style={{ zIndex }}
        >
            <video
                // ref={videoRef} // Asignamos el ref al video
                ref={ref}
                src={src}
                className="w-full h-full object-cover"
                preload="auto"
                playsInline
                muted
                loop
            />
        </section>
    );
});

ScrollVideo.displayName = 'ScrollVideo';

export default ScrollVideo;