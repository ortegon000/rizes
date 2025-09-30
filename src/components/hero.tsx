import Image from "next/image";
import { Logo } from "@assets/svg/Logo";
import HeroKeyBackground from "@images/hero-key-background.webp";

type HeroProps = {
    zIndex?: number;
};

export default function Hero({ zIndex = 20 }: HeroProps) {

    return (

        <>
            <section
                id="hero-key-container"
                className="fixed inset-0 h-dvh w-full"
                style={{ zIndex }}
            >
                <div
                    id="hero-key-logo-mask"
                    className="w-full h-full bg-white overflow-hidden"
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
                            fill
                            className="object-cover"
                            priority
                        />
                    </picture>
                </div>
            </section>
        </>
    );
}