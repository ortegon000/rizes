export default function Footer() {
    return (
        <>
            <section id="footer" className="fixed bottom-0 translate-y-[400px] h-[400px] w-full text-3xl font-black flex justify-center items-center bg-[#1d1b22] text-white" >
                <div className="grid grid-cols-3 gap-20 max-w-screen-lg w-full mx-auto">

                    <div className="flex flex-col items-center">
                        Teléfono
                        <span className="text-xl font-normal mt-2">55 2331 8566 / 55 4810 4881</span>
                    </div>

                    <div className="flex flex-col items-center">
                        Dirección
                        <span className="text-xl font-normal mt-2 text-center">
                            Blvd. Adolfo Ruiz Cortines 4302, Oficina 206, Col. Jardines del Pedregal de San Ángel, Coyoacán, 04500 Ciudad de México, CDMX
                        </span>
                    </div>

                    <div className="flex flex-col items-center">
                        Email
                        <span className="text-xl font-normal mt-2">contacto@rizes.com.mx</span>
                    </div>

                </div>
            </section>
        </>
    )
}