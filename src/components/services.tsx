type ServicesProps = {
    zIndex?: number;
};

export default function Services({ zIndex = 20 }: ServicesProps) {
    return (
        <>
            <div className="h-dvh"></div>
            <section id="services" className="absolute inset-0 h-dvh w-full translate-y-[220dvh] flex flex-col items-center justify-cente" style={{ zIndex }}>
                <ul className="text-4xl md:text-5xl lg:text-6xl text-center text-white font-black leading-10 md:leading-12 lg:leading-14 space-y-6 md:space-y-8 lg:space-y-10 [&>li]:bg-gradient-to-r [&>li]:from-red-500 [&>li]:to-blue-500 [&>li]:bg-clip-text [&>li]:text-transparent">
                    <li>Lanzamientos ATL</li>
                    <li>Convenciones</li>
                    <li>Turismo</li>
                    <li>Logística</li>
                    <li>Transporte</li>
                    <li>Creatividad</li>
                    <li>Eventos</li>
                    <li>Streaming</li>
                    <li>Catering</li>
                    <li>BTL</li>
                    <li>Shows</li>
                    <li>PR Alimentos</li>
                </ul>
            </section>
        </>
    );
}