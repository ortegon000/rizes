import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import HorizontalScrollView from "@components/horizontalScroll";
import ServicesDetailsImage from "@images/services-details.jpg";
import { lockScrollLenis, unlockScrollLenis } from "@utils/lenisLock";

export default function ServiceDetails() {
    const [showHorizontalScroll, setShowHorizontalScroll] = useState(false);

    const handleOpen = () => {
        setShowHorizontalScroll(true);
        lockScrollLenis();
    };

    const handleClose = () => {
        setShowHorizontalScroll(false);
        unlockScrollLenis();
    };

    return (
        <>
            <section
                id="services-details"
                className="relative min-h-dvh w-full py-16 md:py-20 px-4"
            >
                <p className="text-4xl md:text-5xl lg:text-6xl text-center font-black m-auto bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent tracking-wide leading-tight md:leading-14">
                    Nuestros Servicios
                </p>

                <div className={`relative mt-12 md:mt-20 max-w-screen-lg aspect-video m-auto border-8 md:border-16 border-white transition-all duration-500 shadow shadow-purple-500/50 hover:shadow-2xl hover:scale-105 hover:rotate-1 group ${showHorizontalScroll ? '-translate-x-1/2 -rotate-1' : ''}`}>
                    <button
                        onClick={handleOpen}
                        className="cursor-pointer w-full h-full block relative"
                    >
                        <Image
                            alt=""
                            src={ServicesDetailsImage}
                            fill
                            className="w-full h-full object-cover"
                        />

                        <span className="absolute py-2 px-6 rounded-full bottom-8 left-1/2 -translate-x-1/2 bg-white text-black text-base md:text-lg tracking-wider group-hover:bg-blue-200 transition-colors duration-500">
                            Conócelos
                        </span>
                    </button>
                </div>
            </section>

            {showHorizontalScroll && typeof window !== 'undefined' && createPortal(
                <HorizontalScrollView onClose={handleClose} />,
                document.body
            )}
        </>
    );
}