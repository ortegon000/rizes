// hooks/useGlobalTimeline.ts
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Crea la animación del Hero y la añade a un timeline.
 */
function createHeroAnimation(
    tl: gsap.core.Timeline,
    selector: (query: string) => any,
) {
    tl.to(
        selector("#hero-key"),
        {
            scale: 1,
            duration: 1,
        },
        0,
    )
        .to(
            selector("#hero-key-logo"),
            {
                opacity: 0,
                scale: 0.5,
                duration: 1,
            },
            "<",
        )
        .to(
            selector("#hero-key-logo-mask"),
            {
                maskSize: "200px",
                duration: 1,
            },
            "<",
        )
        .to(
            selector("#hero-key"),
            {
                opacity: 0,
                duration: 0.3,
            },
            ">-0.2",
        )
        .to(
            selector("#hero-key-logo-mask"),
            {
                opacity: 0,
                duration: 0.5,
            },
            ">",
        );
}

/**
 * Crea una animación de Intro genérica y la añade a un timeline.
 */
function createIntroAnimation(
    tl: gsap.core.Timeline,
    selector: (query: string) => any,
    id: string,
) {
    tl.fromTo(
        selector(`#${id}-entrance`),
        {
            maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)",
        },
        {
            duration: 1.5,
            maskImage: "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)",
        },
        ">-0.65", // Se superpone 0.5s con la animación anterior
    )
        .to(
            selector(`#${id}-logo`),
            {
                duration: 1,
                opacity: 1,
            },
            "<-1",
        )
        .fromTo(
            selector(`#${id}-exit`),
            {
                maskImage: "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)",
            },
            {
                duration: 1.5,
                maskImage: "radial-gradient(circle at 50% -100%, transparent 50%, black 50%)",
            },
            "<3",
        )
        .to(
            selector(`#${id}`),
            {
                duration: 0.5,
                opacity: 0,
            },
            ">",
        );
}

// --- Main Hook ---
export function useGlobalTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context((self) => {

            const masterTL = gsap.timeline({
                paused: true,
                ease: "power2.inOut",
            });


            createHeroAnimation(masterTL, self.selector as (query: string) => any);
            createIntroAnimation(masterTL, self.selector as (query: string) => any, "hero-text-intro");
            createIntroAnimation(masterTL, self.selector as (query: string) => any, "hero-text-description");

            // next animation

            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top", // Ajusta la duración del scroll si es necesario
                animation: masterTL,
                scrub: 1,
                markers: true,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return containerRef;
}