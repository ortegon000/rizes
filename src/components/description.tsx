// import { useRef, useLayoutEffect } from 'react';
// import { gsap } from 'gsap';
// import { useAnimationStore } from '@store/animationStore';

type DescriptionProps = {
    zIndex?: number;
}

export default function Description({ zIndex = 20 }: DescriptionProps) {

    // const sectionRef = useRef<HTMLElement>(null);
    // const registerAnimation = useAnimationStore((state) => state.registerAnimation);

    // useLayoutEffect(() => {
    //     const section = sectionRef.current;
    //     if (!section) return;

    //     const selector = gsap.utils.selector(section);

    //     const tl = gsap.timeline();

    //     tl.fromTo(
    //         selector(`#hero-description-entrance`),
    //         { maskImage: "radial-gradient(circle at 50% 10%, black 50%, transparent 100%)" },
    //         { maskImage: "radial-gradient(circle at 50% -150%, black 50%, transparent 50%)", duration: 0.5 }, 0
    //     )
    //     tl.to(section, { backgroundColor: "transparent" }, ">")
    //     tl.to(section, { opacity: 0 }, ">0.1");

    //     registerAnimation({
    //         target: section,
    //         animation: tl,
    //         config: {
    //             overlap: 100,
    //             priority: 3,
    //             end: "+=200%"
    //         }
    //     });
    // }, [registerAnimation]);

    return (
        <section
            // ref={sectionRef}
            id="hero-description"
            className="absolute inset-0 w-full h-screen"
            style={{ zIndex }}
        >
            <div id={`hero-description-entrance`} className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>

            <div className="flex justify-center items-center w-full h-full">
                <div className="translate-y-[-20px]">
                    <p className="text-6xl font-bold text-center bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                        Cumplimos 30 años <br /> creando  emociones <br /> que dejan huella.
                    </p>
                </div>
            </div>

        </section>
    )
}
