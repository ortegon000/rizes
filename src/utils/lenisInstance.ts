import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenisInstance = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenisInstance = () => instance;
