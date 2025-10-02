// utils/lenisLock.ts
let savedY = 0;
let locked = false;

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
  if (!lenis) return;
  savedY = lenis.scroll;
  lenis.stop();
  addGuards();
  locked = true;
};

export const unlockScrollLenis = () => {
  if (!locked) return;
  const lenis = window.lenis;
  if (!lenis) return;
  removeGuards();
  lenis.scrollTo(savedY, { immediate: true, force: true });
  lenis.start();
  locked = false;
};
