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
            ease: "power2.Out",
        });

        // tl.to(
        //     ".entrance",
        //     {
        //         ease: "power1.in",
        //         maskImage:
        //             "radial-gradient(circle at 50% 0vh, black 30%, transparent 100%)",
        //     },
        //     0
        // )
        //     .to("#hero-text-intro-logo", {
        //         duration: 1,
        //         opacity: 1,
        //     }, "<-1")
        //     .fromTo(
        //         ".exit",
        //         {
        //             maskImage:
        //                 "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)",
        //             maskPosition: "center center",
        //         },
        //         {
        //             duration: 2,
        //             ease: "power1.in",
        //             maskImage:
        //                 "radial-gradient(circle at 50% -100%, transparent 0%, black 0%)",
        //             maskPosition: "center center",
        //         },
        //         '>1'
        //     );


        // ScrollTrigger.create({
        //     trigger: textContainer,
        //     start: "top top",
        //     end: "bottom top",
        //     animation: tl,
        //     scrub: 1,
        //     markers: true,
        // });

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <section>
                <div className="entrance"></div>

                <div
                    ref={TextContainerRef}
                    id="hero-text-container"
                    className="fixed inset-0 w-full h-full flex items-center justify-center"
                >
                    <div>
                        <Logo id="hero-text-intro-logo" className="absolute w-[200px] mx-auto inset-0 top-[12.9%] text-white opacity-0" />
                        <p
                            id="hero-text"
                            className="text-7xl font-bold m-auto h-auto bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent text-center"
                        >
                            BIENVENIDOS A LA <br /> EXPERIENCIA RIZES
                        </p>
                    </div>
                </div>

                <div className="exit"></div>
            </section>
        </>
    )
}