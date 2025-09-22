import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

type IntroProps = {
    id: string;
    zIndex?: number;
    children: React.ReactNode;
}

export default function Intro({ id, zIndex = 20, children }: IntroProps) {

    return (
        <div>
            <div className="h-screen w-full"></div>

            <section
                id={id}
                className="fixed inset-0 w-full h-screen"
                style={{ zIndex }}
            >
                <div id={`${id}-entrance`} className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>

                {children}

                <div id={`${id}-exit`} className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>
            </section>
        </div>
    )
}