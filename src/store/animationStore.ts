// store/animationStore.ts
import { create } from 'zustand';
import type { gsap } from 'gsap'; // ¡Perfecto! Solo importa los tipos.

// Define la "forma" de los datos que guardaremos.
export type AnimationRegistration = {
    target: HTMLElement;
    animation: gsap.core.Timeline;
    config?: {
        start?: string;
        end?: string;
        startOffset?: string;
    };
};

// Define el estado y las acciones.
type AnimationState = {
    animations: AnimationRegistration[];
    registerAnimation: (registration: AnimationRegistration) => void;
    clearAnimations: () => void;
};

export const useAnimationStore = create<AnimationState>((set) => ({
    // El estado inicial: un array vacío.
    animations: [],
    // La acción para añadir una animación de forma inmutable.
    registerAnimation: (registration) =>
        set((state) => ({
            animations: [...state.animations, registration],
        })),
    // La acción para limpiar el array.
    clearAnimations: () => set({ animations: [] }),
}));