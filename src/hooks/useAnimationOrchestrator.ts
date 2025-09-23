// src/hooks/useAnimationOrchestrator.ts
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useAnimationStore } from '../store/animationStore';

gsap.registerPlugin(ScrollTrigger);

export function useAnimationOrchestrator() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { clearAnimations } = useAnimationStore.getState();

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx = gsap.context(() => {
            const registeredAnimations = useAnimationStore.getState().animations;

            if (registeredAnimations.length > 0) {
                // Crear el master timeline
                const masterTimeline = gsap.timeline();
                let cumulativeHeight = 0;

                registeredAnimations.forEach((registration, index) => {
                    const { animation, config } = registration; // Removemos 'target' si no lo usamos

                    // Calcular la duración en viewport heights
                    const endValue = config?.end || "+=200%";
                    const heightMultiplier = parseFloat(endValue.replace(/[+=]|%/g, '')) / 100;

                    // Offset de inicio
                    const startOffset = config?.startOffset || "0%";
                    const offsetValue = parseFloat(startOffset.replace(/[+-]|%/g, '')) / 100;
                    const isNegativeOffset = startOffset.includes('-');

                    // Calcular posición en el master timeline
                    let timelinePosition;
                    if (index === 0) {
                        timelinePosition = 0;
                    } else {
                        if (isNegativeOffset) {
                            timelinePosition = cumulativeHeight - offsetValue;
                        } else {
                            timelinePosition = cumulativeHeight + offsetValue;
                        }
                    }

                    // Añadir la animación al master timeline
                    masterTimeline.add(animation, timelinePosition);

                    // Actualizar altura acumulativa
                    cumulativeHeight += heightMultiplier;
                });

                // Crear UN SOLO ScrollTrigger para todo el master timeline
                // Este ScrollTrigger va a "pin" todo el container y controlar el scrubbing
                ScrollTrigger.create({
                    trigger: container,
                    animation: masterTimeline,
                    pin: true,
                    start: "top top",
                    end: `+=${cumulativeHeight * 100}%`,
                    scrub: 1,
                    markers: true,
                    pinSpacing: false,
                });
            }

            // Resto de lógica para data-attributes...
            const pinTarget = container.querySelector<HTMLElement>('[data-pin-target]');
            if (pinTarget) {
                const pinTrigger = pinTarget.parentElement;
                if (pinTrigger) {
                    ScrollTrigger.create({
                        trigger: pinTrigger,
                        pin: pinTarget,
                        start: "top top",
                        end: "bottom bottom",
                        markers: { startColor: "blue", endColor: "blue" },
                    });
                }
            }

            const scrollTargets = gsap.utils.toArray<HTMLElement>('[data-scroll-target]');
            scrollTargets.forEach(target => {
                gsap.fromTo(target,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        scrollTrigger: {
                            trigger: target,
                            start: "top 75%",
                            end: "bottom 60%",
                            scrub: true,
                            markers: { startColor: "purple", endColor: "purple" },
                        }
                    }
                );
            });

        }, container);

        return () => {
            ctx.revert();
            clearAnimations();
        };
    }, [clearAnimations]);

    return containerRef;
}