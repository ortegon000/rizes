import Image from "next/image";
import { Logo } from "@assets/svg/Logo";
import HeroKeyBackground from "@images/hero-key-background.webp";

type HeroProps = {
    zIndex?: number;
}

export default function Hero({ zIndex = 20 }: HeroProps) {

    return (
        <>
            <div className="h-screen w-full"></div>

            <section
                id="hero-key-logo-mask"
                className="fixed top-0 w-full h-screen bg-white" style={{ zIndex }}
            >
                <picture
                    id="hero-key"
                    className="h-screen scale-125 w-full block overflow-hidden fixed"
                >
                    <Logo
                        id="hero-key-logo"
                        className="absolute inset-0 m-auto w-80 h-auto object-cover text-white"
                    />
                    <Image
                        alt=""
                        id="hero-key-background"
                        src={HeroKeyBackground.src}
                        width={1920}
                        height={1080}
                        className="w-full h-full object-cover"
                    />
                </picture>
            </section>
        </>
    )
}