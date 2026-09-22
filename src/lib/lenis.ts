import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Thickness of the frame's top gutter in px (read from the --frame CSS var). */
export function frameOffset(): number {
  if (typeof window === "undefined") return 0;
  return (
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--frame"),
    ) || 0
  );
}

/** Scroll to a #hash target, landing just below the frame gutter. */
export function scrollToHash(hash: string) {
  const isTop = hash === "#lookbook" || hash === "#top";
  const el = isTop ? null : document.querySelector<HTMLElement>(hash);
  if (!isTop && !el) return;

  const lenis = getLenis();
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);

  if (lenis) {
    if (isTop) lenis.scrollTo(0, { duration: 1.6, easing: ease });
    else lenis.scrollTo(el!, { offset: -frameOffset(), duration: 1.6, easing: ease });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = isTop ? 0 : el!.getBoundingClientRect().top + window.scrollY - frameOffset();
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
