"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * useGSAP + gsap.matchMedia, so every animation is skipped for visitors who
 * ask for reduced motion. The callback may return a cleanup function.
 * Everything created inside is reverted automatically on unmount.
 */
export function useMotion(
  callback: () => void | (() => void),
  scope: RefObject<HTMLElement | null>,
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => callback());
      return () => mm.revert();
    },
    { scope },
  );
}
