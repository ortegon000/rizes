import { Logo } from "@assets/svg/Logo";

type IntroProps = {
    zIndex?: number;
}

export default function Intro({ zIndex = 20 }: IntroProps) {

    return (
        <div>
            <div className="h-screen w-full"></div>

            <section
                id="hero-intro"
                className="fixed inset-0 w-full h-screen"
                style={{ zIndex }}
            >
                <div id={`hero-intro-entrance`} className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>

                <div className="flex justify-center items-center w-full h-full">
                    <div className="translate-y-[-20px]">
                        <Logo className="w-[200px] h-auto object-contain text-white mx-auto" />
                        <p className="text-7xl font-bold text-center bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Bienvenido a la <br /> Experiencia Rizes</p>
                        <p className="text-white text-3xl text-center">Vibra, sueña, explota.</p>
                    </div>
                </div>

                <div id={`hero-intro-exit`} className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>
            </section>
        </div>
    )
}