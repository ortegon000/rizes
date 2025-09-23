// hooks/useAnimationOrchestrator.ts
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useAnimationStore } from '../store/animationStore';

gsap.registerPlugin(ScrollTrigger);

// El hook ya no necesita el argumento 'expectedAnimations'.
export function useAnimationOrchestrator() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { clearAnimations } = useAnimationStore.getState();

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Este hook se ejecuta DESPUÉS de que los hijos se hayan registrado.
        const registeredAnimations = useAnimationStore.getState().animations;

        if (registeredAnimations.length === 0) return;

        const ctx = gsap.context(() => {
            registeredAnimations.forEach(({ target, animation, config }) => {
                ScrollTrigger.create({
                    trigger: target,
                    animation: animation,
                    pin: true,
                    start: "top top",
                    end: config?.end || "+=200%",
                    scrub: 1,
                    markers: true,
                    pinSpacing: false,
                });
            });
        }, container);

        return () => {
            ctx.revert();
            clearAnimations();
        };
    }, [clearAnimations]);

    return containerRef;
}