/**
 * Custom hook para manejar eventos de ScrollTrigger
 * Gestiona refresh y disable de scroll triggers via eventos personalizados
 */

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

/**
 * Hook que escucha eventos personalizados para controlar ScrollTrigger
 *
 * Eventos:
 * - 'refreshScrollTrigger': teardown + re-setup (vía callback del caller)
 * - 'disableScrollTriggers': deshabilita triggers activos
 */
export function useScrollTriggerEvents(
  onRefresh: () => void | Promise<void>
): void {
  useEffect(() => {
    const handleRefreshScrollTrigger = () => {
      window.setTimeout(() => {
        void onRefresh();
      }, 100);
    };

    const handleDisableScrollTriggers = () => {
      window.setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.disable());
      }, 50);
    };

    window.addEventListener("refreshScrollTrigger", handleRefreshScrollTrigger);
    window.addEventListener(
      "disableScrollTriggers",
      handleDisableScrollTriggers
    );

    return () => {
      window.removeEventListener(
        "refreshScrollTrigger",
        handleRefreshScrollTrigger
      );
      window.removeEventListener(
        "disableScrollTriggers",
        handleDisableScrollTriggers
      );
    };
  }, [onRefresh]);
}

export const scrollTriggerEvents = {
  refresh: () => {
    window.dispatchEvent(new Event("refreshScrollTrigger"));
  },
  disable: () => {
    window.dispatchEvent(new Event("disableScrollTriggers"));
  },
};
