import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function createHeroAnimation(
    tl: gsap.core.Timeline,
    selector: (query: string) => Element[],
) {
    tl.to(selector("#hero-key"), { scale: 1, duration: 1 }, 0)
        .to(selector("#hero-key-logo"), { opacity: 0, scale: 0.5, duration: 1 }, "<")
        .to(selector("#hero-key-logo-mask"), { maskSize: "200px", duration: 1 }, "<")
        .to(selector("#hero-key"), { opacity: 0, duration: 0.3 }, ">-0.2")
        .to(selector("#hero-key-logo-mask"), { opacity: 0, duration: 0.5 }, ">");
}

function createIntroAnimation(
    tl: gsap.core.Timeline,
    selector: (query: string) => Element[],
) {
    tl.fromTo(
        selector(`#hero-intro-entrance`),
        { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
        { duration: 1.5, maskImage: "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)" },
        "<-0.3",
    )
        .to(selector(`#hero-intro-logo`), { duration: 1, opacity: 1 }, "<-1")
        .fromTo(
            selector(`#hero-intro-exit`),
            { maskImage: "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)" },
            { duration: 1.5, maskImage: "radial-gradient(circle at 50% -150%, transparent 50%, black 50%)" },
            "<2",
        )
        .to(selector(`#hero-intro`), { duration: 0.5, opacity: 0 }, ">");
}

function createDescriptionAnimation(
    tl: gsap.core.Timeline,
    selector: (query: string) => Element[],
) {
    tl.fromTo(
        selector(`#hero-description-entrance`),
        { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
        { duration: 1.5, maskImage: "radial-gradient(circle at 50% -150%, black 50%, transparent 50%)" },
        "<-0.3",
    )
        .to(
            selector(`#hero-description-exit`),
            {
                duration: 1.5,
            },
            "<2",
        )
        .to(selector(`#hero-description`), { duration: 0.5, opacity: 0 }, ">");
}

async function createVideoScrubAnimation(tl: gsap.core.Timeline, container: Element) {

    const videoEl = container.querySelector<HTMLVideoElement>("#video-1 video");
    if (!videoEl) {
        console.error("Elemento de video #video-1 no encontrado.");
        return;
    }


    await new Promise<void>((resolve) => {
        if (videoEl.readyState >= 2) {
            resolve();
        } else {
            videoEl.onloadedmetadata = () => resolve();
        }
    });


    const videoScrubber = { frame: 0 };

    // Da a la animación del video una "duración" dentro del timeline maestro.
    // Esto significa que tardará el equivalente a 2 segundos del timeline en completarse.
    tl.to('#video-1', {
        opacity: 1,
        duration: 2,
        filter: "blur(0px)",
    },
        ">-2"
    )
        .to(
            videoScrubber,
            {
                frame: videoEl.duration,
                duration: 4,
                ease: "none",
                onUpdate: () => {
                    videoEl.currentTime = videoScrubber.frame;
                },
            },
            ">-1", // Superponer con la animación anterior para una transición suave
        );
}


// --- Main Hook ---
export function useGlobalTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    useLayoutEffect(() => {
        // Evita la doble inicialización en React 18 Strict Mode
        if (initialized.current) return;
        initialized.current = true;

        let ctx: gsap.Context;

        const initTimeline = async () => {
            const container = containerRef.current;
            if (!container) return;

            ctx = gsap.context(() => {
                const masterTL = gsap.timeline({ paused: true, ease: "power2.inOut" });
                const selector = gsap.utils.selector(container);

                // animations
                createHeroAnimation(masterTL, selector);
                // createIntroAnimation(masterTL, selector);
                // createDescriptionAnimation(masterTL, selector);
                // awaitcreateVideoScrubAnimation(masterTL, container);

                ScrollTrigger.create({
                    trigger: container,
                    start: "top top",
                    end: "bottom bottom",
                    animation: masterTL,
                    scrub: 1,
                    markers: true,
                });
            }, container);
        };

        initTimeline();

        return () => ctx && ctx.revert();
        // return () => {
        //     ctx && ctx.revert();
        //     initialized.current = false;
        // };
    }, []);

    return containerRef;
}