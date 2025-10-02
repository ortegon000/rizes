import { useState } from "react";
import { Logo } from "@assets/svg/Logo";

interface HeaderProps {
    onMenuChange?: (isOpen: boolean) => void;
}

export default function Header({ onMenuChange }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => {
            const newState = !prev;
            onMenuChange?.(newState); // Notificar al padre
            return newState;
        });
    };

    return (
        <>
            {/* Header fijo - solo la barra superior */}
            <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none">
                <header className="flex justify-between w-full px-20 py-16">
                    <Logo className="size-20 text-white hover:text-yellow-100 transition-colors duration-500 pointer-events-auto" />

                    <button
                        onClick={toggleMenu}
                        className={`flex flex-col gap-2 items-center justify-center group size-18 cursor-pointer p-4 rounded-full transition-colors pointer-events-auto ${menuOpen ? "bg-blue-500/30" : ""
                            }`}
                    >
                        <span
                            className={`block w-full h-2 bg-white group-hover:bg-red-300 transition-all transform origin-center ${menuOpen ? "rotate-45 translate-y-full scale-75" : ""
                                }`}
                        ></span>
                        <span
                            className={`block w-full h-2 bg-white group-hover:bg-red-300 transition-all transform origin-center ${menuOpen ? "-rotate-45 -translate-y-full scale-75" : ""
                                }`}
                        ></span>
                    </button>
                </header>
            </div>

            {/* Overlay con logo */}
            <div
                onClick={() => {
                    setMenuOpen(false);
                    onMenuChange?.(false);
                }}
                className={`fixed inset-0 w-full h-full bg-black/20 backdrop-blur-3xl grid grid-cols-2 z-[999998] transition-opacity duration-500 ${menuOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex items-center justify-center">
                    <Logo className="size-80 text-white" />
                </div>
            </div>

            {/* Menú lateral */}
            <ul
                className={`fixed h-full w-1/2 top-0 right-0 z-[999998] transform transition-all duration-500 flex flex-col gap-8 bg-[#111] p-16 pr-20 pt-[200px] text-white ${menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <li className="text-5xl font-semibold uppercase">
                    <a href="#" className="hover:text-red-300 transition-colors">Home</a>
                </li>
                <li className="text-5xl font-semibold uppercase">
                    <a href="#" className="hover:text-red-300 transition-colors">¿Quiénes Somos?</a>
                </li>
                <li className="text-5xl font-semibold uppercase">
                    <a href="#" className="hover:text-red-300 transition-colors">¿Qué hacemos?</a>
                </li>
                <li className="text-5xl font-semibold uppercase">
                    <a href="#" className="hover:text-red-300 transition-colors">Clientes</a>
                </li>
                <li className="text-5xl font-semibold uppercase">
                    <a href="#" className="hover:text-red-300 transition-colors">Contacto</a>
                </li>
            </ul>
        </>
    );
}