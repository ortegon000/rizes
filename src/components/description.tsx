type DescriptionProps = {
    zIndex?: number;
}

export default function Description({ zIndex = 20 }: DescriptionProps) {

    return (
        <section
            id="hero-description"
            className="absolute inset-0 w-full h-dvh"
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
