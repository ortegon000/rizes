import { HeroKeyLogo } from "@svg/heroKeyLogo";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function Intro() {

    const TextContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const textContainer = TextContainerRef.current;

        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            paused: true,
            ease: "power2.Out",
        });

        tl.to(
            "#hero-key-text-container",
            {
                duration: 2,
                ease: "power1.in",
                maskImage:
                    "radial-gradient(circle at 50% 0vh, black 30%, transparent 100%)",
            },
            0,
        )
            .to("#hero-intro-logo", {
                duration: 1,
                opacity: 1,
            }, "<-1")
            .fromTo(
                ".exit",
                {
                    maskImage:
                        "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)",
                    maskPosition: "center center",
                },
                {
                    maskImage:
                        "radial-gradient(circle at 50% -100%, transparent 0%, black 0%)",
                    maskPosition: "center center",
                },
            );


        ScrollTrigger.create({
            trigger: textContainer,
            start: "top top",
            end: "bottom top",
            animation: tl,
            scrub: 1,
            markers: true,
        });

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <div className="exit"></div>
            <div
                ref={TextContainerRef}
                id="hero-key-text-container"
                className="fixed inset-0 w-full h-full flex items-center justify-center"
            >
                <div>
                    <HeroKeyLogo id="hero-intro-logo" className="absolute w-[200px] mx-auto inset-0 top-[122px] text-white opacity-0" />
                    <p
                        id="hero-key-text"
                        className="text-7xl font-bold m-auto h-auto bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent text-center"
                    >
                        BIENVENIDOS A LA <br /> EXPERIENCIA RIZES
                    </p>
                </div>
            </div>
        </>
    )
}