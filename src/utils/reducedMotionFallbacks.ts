/**
 * Static layout when prefers-reduced-motion is on:
 * skip scroll timelines but keep content readable.
 */

export function applyReducedMotionFallbacks(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.add("reduce-motion");
}

export function clearReducedMotionFallbacks(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("reduce-motion");
}
