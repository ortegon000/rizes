type IntroProps = {
    zIndex?: number;
}

export default function Intro({ zIndex = 20 }: IntroProps) {

    return (

        <>
            <div className="h-dvh"></div>
            <section
                id="hero-intro"
                className="absolute inset-0 w-full h-dvh bg-[#1d1b22]"
                style={{ zIndex }}
            >
                <div id="hero-intro-entrance" className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>

                <div className="flex justify-center items-center w-full h-full">
                    <div className="">
                        <p className="text-7xl font-bold text-center mt-12 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Bienvenido a la <br /> Experiencia Rizes</p>
                        <p className="text-white text-3xl text-center mt-4">Vibra, sueña, explota.</p>
                    </div>
                </div>

                <div id="hero-intro-exit" className="w-full h-full bg-[#1d1b22] absolute z-50 top-0 left-0"></div>
            </section>
        </>

    )
}