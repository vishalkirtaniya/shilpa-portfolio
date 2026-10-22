"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { frameOffset } from "@/lib/lenis";
import { lens } from "@/lib/content";
import Star from "./Star";

/**
 * "Art ✦ In The Lens". The section pins to the top of the frame, and as you
 * scroll the photo — a strip at the bottom — opens up until it fills the frame.
 */
export default function Lens() {
  const root = useRef<HTMLElement>(null);

  useMotion(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const image = q(".lens__image")[0];
    const photo = q(".lens__image img")[0];
    const year = q(".lens__year")[0];
    const star = q(".lens__star")[0];
    const underline = q(".lens__underline path")[0];
    const enter = { trigger: el, start: "top 75%", once: true };

    /* Headline: letters rise out of a mask, the star pops, the line draws */
    const splits = (q(".lens__word") as HTMLElement[]).map((word, i) =>
      SplitText.create(word, {
        type: "lines,chars",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.035,
            delay: i * 0.35,
            scrollTrigger: enter,
          }),
      }),
    );
    gsap.from(star, { scale: 0, duration: 1.2, ease: "back.out(1.6)", delay: 0.3, scrollTrigger: enter });
    gsap.from(underline, { strokeDashoffset: 1, duration: 1.4, ease: "power2.inOut", delay: 0.9, scrollTrigger: enter });
    gsap.from(q(".lens__cols p"), {
      autoAlpha: 0,
      y: 14,
      duration: 1,
      ease: "expo.out",
      stagger: 0.12,
      delay: 0.8,
      scrollTrigger: enter,
    });

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
      .to(star, { rotation: 270, duration: 1 }, 0)
      .to(year, { autoAlpha: 1, duration: 0.25 }, 0.75)
      .to({}, { duration: 0.3 }); // short hold on the full-bleed image

    return () => splits.forEach((s) => s.revert());
  }, root);

  return (
    <section className="lens theme-ink" id="about" ref={root} data-frame="ink" aria-label="Art in the lens">
      <div className="lens__text">
        <h2 className="lens__title">
          <span className="lens__word">{lens.words[0]}</span>
          <Star className="lens__star" />
          <span className="lens__word">{lens.words[1]}</span>
        </h2>
        <svg className="lens__underline" viewBox="0 0 600 24" aria-hidden="true" focusable="false">
          <path
            pathLength={1}
            d="M4 18 C 34 4, 66 4, 58 15 C 52 24, 30 14, 92 12 C 200 8, 380 18, 596 7"
          />
        </svg>
        <div className="lens__cols">
          {lens.columns.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </div>

      <div className="lens__image">
        <Image src={lens.image} alt={lens.imageAlt} fill sizes="100vw" />
        <span className="lens__year" aria-hidden="true">
          {lens.year}
        </span>
      </div>
    </section>
  );
}
