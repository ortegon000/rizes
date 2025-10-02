import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import HorizontalScrollView from "@components/horizontalScroll";
import ServicesDetailsImage from "@images/services-details.jpg";

// Constantes de timing para mejor mantenimiento
const SCROLL_TRIGGER_REFRESH_DELAY = 600; // OVERLAY_CLOSE_ANIMATION_DURATION + margen
const HERO_RESTORE_DELAY = 1000; // Después de refresh completo

export default function ServiceDetails() {
    const [showHorizontalScroll, setShowHorizontalScroll] = useState(false);

    // Refs para limpiar timeouts
    const refreshTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const restoreTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Helper function para obtener elementos del hero
    const getHeroElements = () => {
        return {
            heroKeyContainer: document.getElementById('hero-key-container'),
            heroIntro: document.getElementById('hero-intro'),
            heroDesc: document.getElementById('hero-description')
        };
    };

    // Helper function para ocultar elementos del hero
    const hideHeroElements = (elements: ReturnType<typeof getHeroElements>) => {
        const { heroKeyContainer, heroIntro, heroDesc } = elements;
        if (heroKeyContainer && heroIntro && heroDesc) {
            heroKeyContainer.setAttribute('data-overlay-hidden', 'true');
            heroKeyContainer.style.opacity = '0';
            heroKeyContainer.style.visibility = 'hidden';
            heroIntro.style.opacity = '0';
            heroIntro.style.visibility = 'hidden';
            heroDesc.style.opacity = '0';
            heroDesc.style.visibility = 'hidden';
        }
    };

    // Helper function para restaurar elementos del hero
    const restoreHeroElements = (elements: ReturnType<typeof getHeroElements>) => {
        const { heroKeyContainer, heroIntro, heroDesc } = elements;
        if (heroKeyContainer && heroIntro && heroDesc) {
            heroKeyContainer.removeAttribute('data-overlay-hidden');
            heroKeyContainer.style.opacity = '';
            heroKeyContainer.style.visibility = '';
        }
    };

    const handleOpen = () => {
        setShowHorizontalScroll(true);

        // Ocultar hero-key temporalmente al abrir el overlay
        const heroElements = getHeroElements();
        hideHeroElements(heroElements);
    };

    const handleClose = () => {
        setShowHorizontalScroll(false);

        // Limpiar timeouts previos si existen
        if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
        if (restoreTimeoutRef.current) clearTimeout(restoreTimeoutRef.current);

        // RETRASAR la reactivación hasta que termine la animación de salida del overlay
        refreshTimeoutRef.current = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('refreshScrollTrigger'));
        }, SCROLL_TRIGGER_REFRESH_DELAY);

        // Restaurar el control normal del hero-key después del cierre
        const heroElements = getHeroElements();
        restoreTimeoutRef.current = setTimeout(() => {
            restoreHeroElements(heroElements);
        }, HERO_RESTORE_DELAY);
    };

    // Cleanup al desmontar el componente
    React.useEffect(() => {
        return () => {
            if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
            if (restoreTimeoutRef.current) clearTimeout(restoreTimeoutRef.current);
        };
    }, []);

    return (
        <>
            <section
                id="services-details"
                className="relative min-h-dvh w-full py-20"
            >
                <p className="text-6xl text-center font-black m-auto bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent tracking-wide leading-14">
                    Nuestros Servicios
                </p>

                <div className={`relative mt-20 max-w-screen-lg aspect-video m-auto border-16 border-white transition-all duration-500 shadow shadow-purple-500/50 hover:shadow-2xl hover:scale-105 hover:rotate-1 group ${showHorizontalScroll ? '-translate-x-1/2 -rotate-1' : ''}`}>
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

            {showHorizontalScroll && typeof window !== 'undefined' && createPortal(
                <HorizontalScrollView onClose={handleClose} />,
                document.body
            )}
        </>
    );
}