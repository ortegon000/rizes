import { Logo } from "@assets/svg/Logo";
// import { useRef, useLayoutEffect } from 'react';
// import { gsap } from 'gsap';
// import { useAnimationStore } from '@store/animationStore';

type IntroProps = {
    zIndex?: number;
}

export default function Intro({ zIndex = 20 }: IntroProps) {

    // const sectionRef = useRef<HTMLElement>(null);
    // const registerAnimation = useAnimationStore((state) => state.registerAnimation);

    // useLayoutEffect(() => {
    //     const section = sectionRef.current;
    //     if (!section) return;

    //     const selector = gsap.utils.selector(section);

    //     const tl = gsap.timeline();

    //     tl.fromTo(
    //         selector(`#hero-intro-entrance`),
    //         { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
    //         { maskImage: "radial-gradient(circle at 50% -100%, black 50%, transparent 50%)" },
    //         0
    //     )
    //         .to(selector(`#hero-intro-logo`), { opacity: 1 }, "<")
    //         .to(selector(`#hero-intro-exit`), { duration: 2 }, "<")
    //         .fromTo(
    //             selector(`#hero-intro-exit`),
    //             { maskImage: "radial-gradient(circle at 50% 50%, transparent 50%, black 100%)" },
    //             { maskImage: "radial-gradient(circle at 50% -150%, transparent 50%, black 50%)" },
    //             "<0.5",
    //         )
    //         .to(section, { opacity: 0, duration: 0.1 }, "<0.5");

    //     registerAnimation({
    //         target: section,
    //         animation: tl,
    //         config: {
    //             end: "+=200%",
    //             overlap: 70,
    //             priority: 2
    //         }
    //     });
    // }, [registerAnimation]);

    return (

        <section
            // ref={sectionRef}
            id="hero-intro"
            className="absolute inset-0 w-full h-screen bg-[#1d1b22]"
            style={{ zIndex }}
        >
            <div id="hero-intro-entrance" className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>

            <div className="flex justify-center items-center w-full h-full">
                <div className="">
                    <p className="text-7xl font-bold text-center mt-12 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Bienvenido a la <br /> Experiencia Rizes</p>
                    <p className="text-white text-3xl text-center">Vibra, sueña, explota.</p>
                </div>
            </div>

            <div id="hero-intro-exit" className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>
        </section>
    )
}