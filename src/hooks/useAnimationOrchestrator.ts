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
            let registeredAnimations = useAnimationStore.getState().animations;

            // Ordenar animaciones por prioridad si está definida
            registeredAnimations = registeredAnimations.sort((a, b) => {
                const priorityA = a.config?.priority ?? 0;
                const priorityB = b.config?.priority ?? 0;
                return priorityA - priorityB;
            });

            // DEBUG: Verificar cuántas animaciones se registraron
            console.log('Registered animations:', registeredAnimations.length);
            registeredAnimations.forEach((reg, index) => {
                console.log(`Animation ${index}:`, {
                    target: reg.target.id || reg.target.tagName,
                    config: reg.config
                });
            });

            if (registeredAnimations.length > 0) {
                const masterTimeline = gsap.timeline();
                let cumulativeHeight = 0;
                let previousHeightMultiplier = 0;

                registeredAnimations.forEach((registration, index) => {
                    const { animation, config } = registration;

                    const endValue = config?.end || "+=200%";
                    const heightMultiplier = parseFloat(endValue.replace(/[+=]|%/g, '')) / 100;

                    let timelinePosition;

                    if (index === 0) {
                        timelinePosition = 0;
                    } else {
                        // Manejar superposición (overlap)
                        const overlap = config?.overlap || 0;
                        // El overlap se calcula sobre la duración de la animación ANTERIOR
                        const overlapOffset = previousHeightMultiplier * (overlap / 100);

                        // Manejar startOffset manual
                        const startOffset = config?.startOffset || "0%";
                        const offsetValue = parseFloat(startOffset.replace(/[+-]|%/g, '')) / 100;
                        const isNegativeOffset = startOffset.includes('-');

                        if (config?.overlap !== undefined) {
                            // Usar sistema de overlap
                            timelinePosition = cumulativeHeight - overlapOffset;
                        } else if (startOffset !== "0%") {
                            // Usar sistema de startOffset (compatibilidad hacia atrás)
                            if (isNegativeOffset) {
                                timelinePosition = cumulativeHeight - offsetValue;
                            } else {
                                timelinePosition = cumulativeHeight + offsetValue;
                            }
                        } else {
                            // Sin superposición
                            timelinePosition = cumulativeHeight;
                        }
                    }

                    console.log(`Adding animation ${index} at position:`, timelinePosition, `(overlap: ${config?.overlap || 0}%)`);
                    masterTimeline.add(animation, timelinePosition);

                    cumulativeHeight += heightMultiplier;
                    previousHeightMultiplier = heightMultiplier; // Guardar el valor actual para la siguiente iteración
                });

                console.log('Total height:', cumulativeHeight);

                ScrollTrigger.create({
                    trigger: container,
                    animation: masterTimeline,
                    pin: true,
                    start: "top top",
                    end: `+=${cumulativeHeight * 100}%`,
                    scrub: 1,
                    markers: true,
                    pinSpacing: false,
                    onUpdate: (self) => console.log("progress:", self.progress),
                });
            }
        }, container);

        return () => {
            ctx.revert();
            clearAnimations();
        };
    }, [clearAnimations]);

    return containerRef;
}