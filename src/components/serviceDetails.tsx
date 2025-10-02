"use client";
import React, { useState } from "react";
import Image from "next/image";
import HorizontalScrollView from "@components/horizontalScroll";
import ServicesDetailsImage from "@images/services-details.jpg";

export default function ServiceDetails() {
    const [showHorizontalScroll, setShowHorizontalScroll] = useState(false);

    const handleOpen = () => {
        setShowHorizontalScroll(true);
    };

    const handleClose = () => {
        setShowHorizontalScroll(false);
    };

    return (
        <>
            <section
                id="services-details"
                className="relative min-h-dvh w-full py-20"
            >
                <p className="text-6xl text-center font-black m-auto bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent tracking-wide leading-14">
                    Nuestros Servicios
                </p>

                <div className="relative mt-20 max-w-screen-xl aspect-video m-auto border-16 border-white transition-all duration-500 shadow shadow-purple-500/50 hover:shadow-2xl hover:scale-105 hover:rotate-1 group">
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

                        <span className="absolute py-2 px-6 rounded-full bottom-12 left-1/2 -translate-x-1/2 bg-white text-black text-lg tracking-wider group-hover:bg-blue-200 transition-colors duration-500">
                            Conócelos
                        </span>
                    </button>
                </div>
            </section>

            {showHorizontalScroll && (
                <HorizontalScrollView onClose={handleClose} />
            )}
        </>
    );
}