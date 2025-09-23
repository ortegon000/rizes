// hooks/useAnimationOrchestrator.ts
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useAnimationStore } from '../store/animationStore'; // Importamos el store

gsap.registerPlugin(ScrollTrigger);

export function useAnimationOrchestrator() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { clearAnimations } = useAnimationStore.getState();

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // El contexto de GSAP es crucial para limpiar todas las animaciones y ScrollTriggers
        const ctx = gsap.context(() => {

            // --- 1. LÓGICA PARA COMPONENTES AUTOREGISTRADOS (Hero, Intro, etc.) ---
            const registeredAnimations = useAnimationStore.getState().animations;
            if (registeredAnimations.length > 0) {
                registeredAnimations.forEach(({ target, animation, config }) => {
                    ScrollTrigger.create({
                        trigger: target,
                        animation: animation,
                        pin: true, // Estos componentes se fijan a sí mismos
                        start: "top top",
                        end: config?.end || "+=200%",
                        scrub: 1,
                        markers: true, // Marcadores verdes para estos
                        pinSpacing: false,
                    });
                });
            }

            // --- 2. LÓGICA PARA EL FONDO FIJO DE SCROLLYTELLING ---
            const pinTarget = container.querySelector<HTMLElement>('[data-pin-target]');
            if (pinTarget) {
                const pinTrigger = pinTarget.parentElement;
                if (pinTrigger) {
                    ScrollTrigger.create({
                        trigger: pinTrigger,
                        pin: pinTarget, // Fija solo el elemento de fondo
                        start: "top top",
                        end: "bottom bottom",
                        markers: { startColor: "blue", endColor: "blue" }, // Marcadores azules para este
                    });
                }
            }

            // --- 3. LÓGICA PARA EL TEXTO QUE SE ANIMA SOBRE EL FONDO ---
            const scrollTargets = gsap.utils.toArray<HTMLElement>('[data-scroll-target]');
            scrollTargets.forEach(target => {
                gsap.fromTo(target,
                    { opacity: 0, y: 50 }, // Empieza invisible y un poco abajo
                    {
                        opacity: 1,
                        y: 0, // Termina visible y en su posición original
                        scrollTrigger: {
                            trigger: target,
                            start: "top 75%", // Empieza a aparecer cuando el 75% del texto es visible
                            end: "bottom 60%", // Se desvanece completamente cuando el 60% ya ha pasado
                            scrub: true,
                            markers: { startColor: "purple", endColor: "purple" }, // Marcadores morados
                        }
                    }
                );
            });

        }, container);

        return () => {
            ctx.revert();
            clearAnimations(); // Limpiamos todo al desmontar
        };
    }, [clearAnimations]);

    return containerRef;
}