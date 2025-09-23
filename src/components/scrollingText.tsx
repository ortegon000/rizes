import { ReactNode } from "react";

// Este componente solo sirve como un contenedor de altura completa
// para que cada bloque de texto ocupe espacio y genere scroll.
export default function ScrollingText({ children }: { children: ReactNode }) {
    return (
        <div data-scroll-target className="h-screen w-full flex justify-center items-center">
            <div className="w-1/2 text-center text-4xl text-white font-bold bg-black/50 p-8 rounded-lg">
                {children}
            </div>
        </div>
    );
}