"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { frameOffset } from "@/lib/lenis";
import { lens } from "@/lib/content";

/**
 * Lens. The section pins to the top of the frame (an empty paper-coloured
 * space), and as you scroll the photo opens up from the bottom until it fills
 * the frame.
 */
export default function Lens() {
  const root = useRef<HTMLElement>(null);

  useMotion(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const image = q(".lens__image")[0];
    const photo = q(".lens__image img")[0];
    const year = q(".lens__year")[0];

    /* Pinned, scrubbed: the photo opens to fill the frame */
    gsap.set(image, { clipPath: "inset(100% 3% 0% 3%)" });
    gsap.set(photo, { scale: 1.25 });
    gsap.set(year, { autoAlpha: 0 });

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: () => `top ${frameOffset()}px`,
          end: "+=130%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .to(image, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }, 0)
      .to(photo, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
      .to(year, { autoAlpha: 1, duration: 0.25 }, 0.75)
      .to({}, { duration: 0.3 }); // short hold on the full-bleed image
  }, root);

  return (
    <section className="lens theme-paper" id="about" ref={root} data-frame="paper" aria-label="Lens">
      {/* empty space — the photo is revealed over it as you scroll */}
      <div className="lens__space" aria-hidden="true" />

      <div className="lens__image">
        <Image src={lens.image} alt={lens.imageAlt} fill sizes="100vw" />
        <span className="lens__year" aria-hidden="true">
          {lens.year}
        </span>
      </div>
    </section>
  );
}