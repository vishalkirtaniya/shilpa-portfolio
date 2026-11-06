"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { counter } from "@/lib/counter";
import { triptych, quote } from "@/lib/content";

/** One quote, then one viewport holding three images. */
export default function Plates() {
  const root = useRef<HTMLDivElement>(null);

  // Frame counter: a plain effect (not gated by reduced motion) so it always works.
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-plate]", root.current);
      items.forEach((item, i) => {
        const n = item.dataset.plate!;
        ScrollTrigger.create({
          trigger: item,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => self.isActive && counter.set(n),
          onLeaveBack: () => i === 0 && counter.set("00"),
        });
      });
    },
    { scope: root },
  );

  // Reveals
  useMotion(() => {
    const q = gsap.utils.selector(root.current!);
    const once = (trigger: Element) => ({ trigger, start: "top 80%", once: true });

    const tri = q(".lookbook__triptych")[0];
    gsap.fromTo(
      tri.querySelectorAll("img"),
      { scale: 0.94, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 1.4, ease: "expo.out", stagger: 0.15, scrollTrigger: once(tri) },
    );

    const qi = q(".lookbook__interstitial-inner")[0];
    gsap.fromTo(
      qi,
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out", scrollTrigger: once(qi) },
    );
  }, root);

  return (
    <div className="plates" data-frame="ink" ref={root}>
      <section className="lookbook__interstitial">
        <div className="lookbook__interstitial-inner">
          <blockquote>&ldquo;{quote.text}&rdquo;</blockquote>
          <cite>{quote.cite}</cite>
        </div>
      </section>

      <section className="lookbook__triptych" data-plate={triptych.n}>
        {triptych.panels.map((p) => (
          <div className="lookbook__triptych-panel" key={p.label}>
            <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 33vw" />
            <span className="lookbook__triptych-label">{p.label}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
