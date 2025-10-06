/**
 * Custom hook para manejar eventos de ScrollTrigger
 * Gestiona refresh y disable de scroll triggers via eventos personalizados
 */

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

/**
 * Hook que escucha eventos personalizados para controlar ScrollTrigger
 * 
 * Eventos soportados:
 * - 'refreshScrollTrigger': Reinicia todos los ScrollTriggers
 * - 'disableScrollTriggers': Deshabilita todos los ScrollTriggers
 */
export function useScrollTriggerEvents(setupAnimation: () => void | Promise<void>): void {
  useEffect(() => {
    /**
     * Handler para refrescar todos los ScrollTriggers
     * Útil cuando cambia el layout o contenido de la página
     */
    const handleRefreshScrollTrigger = () => {
      setTimeout(() => {
        // Limpiar triggers existentes
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        
        // Refrescar
        ScrollTrigger.refresh();
        
        // Re-inicializar animaciones
        setTimeout(() => {
          setupAnimation();
        }, 100);
      }, 100);
    };

    /**
     * Handler para deshabilitar todos los ScrollTriggers
     * Útil cuando se abre un modal o menu que requiere bloquear scroll
     */
    const handleDisableScrollTriggers = () => {
      setTimeout(() => {
        const triggers = ScrollTrigger.getAll();
        triggers.forEach((trigger) => trigger.disable());
      }, 50);
    };

    // Registrar event listeners
    window.addEventListener("refreshScrollTrigger", handleRefreshScrollTrigger);
    window.addEventListener("disableScrollTriggers", handleDisableScrollTriggers);

    // Cleanup
    return () => {
      window.removeEventListener("refreshScrollTrigger", handleRefreshScrollTrigger);
      window.removeEventListener("disableScrollTriggers", handleDisableScrollTriggers);
    };
  }, [setupAnimation]);
}

/**
 * Funciones helper para disparar los eventos personalizados
 */
export const scrollTriggerEvents = {
  /**
   * Dispara un evento para refrescar todos los ScrollTriggers
   */
  refresh: () => {
    window.dispatchEvent(new Event("refreshScrollTrigger"));
  },

  /**
   * Dispara un evento para deshabilitar todos los ScrollTriggers
   */
  disable: () => {
    window.dispatchEvent(new Event("disableScrollTriggers"));
  },
};
