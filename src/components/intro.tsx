import { Logo } from "@assets/svg/Logo";
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { useAnimationStore } from '@store/animationStore';

type IntroProps = {
    zIndex?: number;
}

export default function Intro({ zIndex = 20 }: IntroProps) {

    const sectionRef = useRef<HTMLElement>(null);
    const registerAnimation = useAnimationStore((state) => state.registerAnimation);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const selector = gsap.utils.selector(section);

        const tl = gsap.timeline();
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
            .to(section, { duration: 0.5, opacity: 0 }, ">");

        registerAnimation({
            target: section,
            animation: tl,
            config: {
                start: "top top",
                end: "+=150%"
            }
        });
    }, [registerAnimation]);

    return (

        <section
            ref={sectionRef}
            id="hero-intro"
            className="relative inset-0 w-full h-screen"
            style={{ zIndex }}
        >
            <div id={`hero-intro-entrance`} className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>

            <div className="flex justify-center items-center w-full h-full">
                <div className="translate-y-[-20px]">
                    <Logo id="hero-intro-logo" className="w-[200px] h-auto object-contain text-white mx-auto" />
                    <p className="text-7xl font-bold text-center bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Bienvenido a la <br /> Experiencia Rizes</p>
                    <p className="text-white text-3xl text-center">Vibra, sueña, explota.</p>
                </div>
            </div>

            <div id={`hero-intro-exit`} className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>
        </section>
    )
}