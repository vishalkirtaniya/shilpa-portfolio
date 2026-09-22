"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { counter } from "@/lib/counter";
import { diptych, plates, quote, type Plate as PlateData } from "@/lib/content";

function Plate({ plate }: { plate: PlateData }) {
  return (
    <section
      className={`lookbook__plate${plate.side === "right" ? " lookbook__plate--right" : ""}`}
      data-plate={plate.n}
    >
      <Image className="lookbook__plate-image" src={plate.src} alt={plate.alt} fill sizes="100vw" />
      <div className="lookbook__plate-meta">
        <div className="lookbook__plate-number">{plate.n}</div>
        <h2 className="lookbook__plate-title">{plate.title}</h2>
        <p className="lookbook__plate-caption">{plate.caption}</p>
      </div>
    </section>
  );
}

/** Plates 01–06 — the original Aperture lookbook, animated with GSAP. */
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

    (q(".lookbook__plate") as HTMLElement[]).forEach((plate) => {
      gsap
        .timeline({ scrollTrigger: once(plate), defaults: { ease: "expo.out" } })
        .fromTo(plate.querySelector("img"), { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.4 }, 0)
        .fromTo(
          plate.querySelector(".lookbook__plate-meta"),
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          0.4,
        );
    });

    const dip = q(".lookbook__diptych")[0];
    gsap.fromTo(
      dip.querySelectorAll("img"),
      { scale: 0.94, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 1.4, ease: "expo.out", stagger: 0.15, scrollTrigger: once(dip) },
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
      <Plate plate={plates.p1} />
      <Plate plate={plates.p2} />

      <section className="lookbook__interstitial">
        <div className="lookbook__interstitial-inner">
          <blockquote>&ldquo;{quote.text}&rdquo;</blockquote>
          <cite>{quote.cite}</cite>
        </div>
      </section>

      <Plate plate={plates.p3} />

      <section className="lookbook__diptych" data-plate={diptych.n}>
        {diptych.panels.map((p) => (
          <div className="lookbook__diptych-panel" key={p.label}>
            <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 50vw" />
            <span className="lookbook__diptych-label">{p.label}</span>
          </div>
        ))}
      </section>

      <Plate plate={plates.p5} />
      <Plate plate={plates.p6} />
    </div>
  );
}
