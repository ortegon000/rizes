export default function Footer() {
    return (
        <>
            <section id="footer" className="fixed bottom-0 h-full w-full text-xl md:text-3xl font-black flex justify-center items-center text-white p-8 md:p-0 z-[820] opacity-0">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 max-w-screen-lg w-full mx-auto pt-[20dvh]">

                    <div className="flex flex-col items-center text-center">
                        Teléfono
                        <span className="text-base md:text-xl font-normal mt-2">55 2331 8566 / 55 4810 4881</span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        Dirección
                        <span className="text-base md:text-xl font-normal mt-2">
                            Blvd. Adolfo Ruiz Cortines 4302, Oficina 206, Col. Jardines del Pedregal de San Ángel, Coyoacán, 04500 Ciudad de México, CDMX
                        </span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        Email
                        <span className="text-base md:text-xl font-normal mt-2">contacto@rizes.com.mx</span>
                    </div>

                </div>
            </section>
        </>
    )
}