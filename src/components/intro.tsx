import { Logo } from "@assets/svg/Logo";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);


export default function Intro() {

    const TextContainerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const textContainer = TextContainerRef.current;

        const tl = gsap.timeline({
            paused: true,
            ease: "power2.inOut",
        });

        tl.fromTo(
            ".entrance",
            {
                maskImage:
                    "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)",
            },
            {
                duration: 1.5,
                maskImage:
                    "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)",
            },
            2.4
        )
            .to("#hero-text-intro-logo", {
                duration: 1,
                opacity: 1,
            }, "<-1")
            .fromTo(
                ".exit",
                {
                    maskImage:
                        "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)",
                },
                {
                    duration: 1.5,
                    maskImage:
                        "radial-gradient(circle at 50% -100%, transparent 50%, black 50%)",
                },
                '<3'
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
            <section id="hero-text-intro" className="fixed inset-0 w-full h-100dvh">
                <div className="entrance w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>

                <div
                    ref={TextContainerRef}
                    id="hero-text-container"
                    className="flex w-full h-full items-center justify-center"
                >
                    <div className="">
                        <Logo id="hero-text-intro-logo" className="absolute w-[200px] mx-auto inset-0 top-[12.9%] text-white opacity-0" />
                        <p
                            id="hero-text"
                            className="text-7xl font-bold m-auto h-auto bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent text-center"
                        >
                            BIENVENIDOS A LA <br /> EXPERIENCIA RIZES
                        </p>
                    </div>
                </div>

                <div className="exit w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>
            </section>
        </>
    )
}