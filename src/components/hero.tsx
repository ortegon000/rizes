// components/Hero.tsx
import Image from "next/image";
import { Logo } from "@assets/svg/Logo";
import HeroKeyBackground from "@images/hero-key-background.webp";

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { useAnimationStore } from '@store/animationStore';

type HeroProps = {
    zIndex?: number;
};

export default function Hero({ zIndex = 20 }: HeroProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const registerAnimation = useAnimationStore((state) => state.registerAnimation);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const selector = gsap.utils.selector(section);

        const tl = gsap.timeline();
        tl.to(selector("#hero-key"), { scale: 1, duration: 1 }, 0)
            .to(selector("#hero-key-logo"), { opacity: 0, scale: 0.5, duration: 1 }, "<")
            .to(selector("#hero-key-logo-mask"), { maskSize: "200px", duration: 1 }, "<")
            .to(selector("#hero-key"), { opacity: 0, duration: 0.3 }, ">-0.2")
            .to(selector("#hero-key-logo-mask"), { opacity: 0, duration: 0.5 }, ">");

        registerAnimation({
            target: section,
            animation: tl,
            config: { end: "+=200%" }
        });
    }, [registerAnimation]);

    return (

        <section
            ref={sectionRef}
            className="absolute inset-0 h-screen w-full"
            style={{ zIndex }}
        >
            <div
                id="hero-key-logo-mask"
                className="absolute top-0 left-0 w-full h-full bg-white"
            >
                <picture
                    id="hero-key"
                    className="relative h-full w-full block scale-125 overflow-hidden"
                >
                    <Logo
                        id="hero-key-logo"
                        className="absolute inset-0 m-auto w-80 h-auto text-white z-10"
                    />
                    <Image
                        alt=""
                        id="hero-key-background"
                        src={HeroKeyBackground.src}
                        fill // 'fill' es mejor para imágenes de fondo en Next.js
                        className="object-cover"
                        priority // Carga esta imagen primero ya que es LCP
                    />
                </picture>
            </div>
        </section>
    );
}