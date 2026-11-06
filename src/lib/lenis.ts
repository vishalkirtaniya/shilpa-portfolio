import type Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** True while a nav link is driving the scroll — the Lens photo-snap stays out of its way. */
let navigating = false;
export const isNavigating = () => navigating;

/** Thickness of the frame's top gutter in px (read from the --frame CSS var). */
export function frameOffset(): number {
  if (typeof window === "undefined") return 0;
  return (
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--frame"),
    ) || 0
  );
}

/**
 * If the target is a pinned section (the Lens), return the scroll position
 * where its pin begins. Measuring the element itself is wrong once we're
 * below it: after the pin ends the element sits at the *end* of its pin
 * spacer, so a plain scroll-to-element would land on the last photo.
 */
function pinStart(el: HTMLElement): number | null {
  const st = ScrollTrigger.getAll().find((t) => t.trigger === el && t.pin);
  return st ? st.start : null;
}

/** Scroll to a #hash target, landing just below the frame gutter. */
export function scrollToHash(hash: string) {
  const isTop = hash === "#lookbook" || hash === "#top";
  const el = isTop ? null : document.querySelector<HTMLElement>(hash);
  if (!isTop && !el) return;

  const lenis = getLenis();
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);
  if (lenis) {
    navigating = true;
    const done = () => {
      navigating = false;
    };
    const opts = { duration: 1.6, easing: ease, onComplete: done };
    const pinned = isTop ? null : pinStart(el!);
    if (isTop) lenis.scrollTo(0, opts);
    else if (pinned !== null) lenis.scrollTo(pinned, opts); // pin start already includes the frame offset
    else lenis.scrollTo(el!, { ...opts, offset: -frameOffset() });
    window.setTimeout(done, 2200); // safety net if the scroll is interrupted
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pinned = isTop ? null : pinStart(el!);
  const top = isTop ? 0 : pinned ?? el!.getBoundingClientRect().top + window.scrollY - frameOffset();
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
