// utils/lenisLock.ts
let savedY = 0;
let locked = false;
let previousBodyOverflow = "";
let previousBodyPosition = "";
let previousBodyTop = "";

const prevent = (e: Event) => e.preventDefault();
const keys = new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," "]);
let keyHandler: ((e: KeyboardEvent) => void) | null = null;

const addGuards = () => {
  document.addEventListener("wheel", prevent, { passive: false });
  document.addEventListener("touchmove", prevent, { passive: false });
  keyHandler = (e: KeyboardEvent) => { if (keys.has(e.key)) e.preventDefault(); };
  document.addEventListener("keydown", keyHandler, { passive: false });
  document.documentElement.style.overscrollBehavior = "contain";
  document.documentElement.style.touchAction = "none";
};

const removeGuards = () => {
  document.removeEventListener("wheel", prevent);
  document.removeEventListener("touchmove", prevent);
  if (keyHandler) document.removeEventListener("keydown", keyHandler);
  keyHandler = null;
  document.documentElement.style.overscrollBehavior = "";
  document.documentElement.style.touchAction = "";
};

export const lockScrollLenis = () => {
  if (locked) return;
  const lenis = window.lenis;
  if (!lenis) {
    savedY = window.scrollY;
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPosition = document.body.style.position;
    previousBodyTop = document.body.style.top;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedY}px`;
    addGuards();
    locked = true;
    return;
  }
  savedY = lenis.scroll;
  lenis.stop();
  addGuards();
  locked = true;
};

export const unlockScrollLenis = () => {
  if (!locked) return;
  const lenis = window.lenis;
  if (!lenis) {
    removeGuards();
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.position = previousBodyPosition;
    document.body.style.top = previousBodyTop;
    window.scrollTo(0, savedY);
    locked = false;
    return;
  }
  removeGuards();
  lenis.scrollTo(savedY, { immediate: true, force: true });
  lenis.start();
  locked = false;
};
