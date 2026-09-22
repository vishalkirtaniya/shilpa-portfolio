"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { statement } from "@/lib/content";

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useMotion(() => {
    const el = root.current!;
    const title = el.querySelector<HTMLElement>(".statement__title")!;
    const trigger = { trigger: title, start: "top 78%", once: true };

    // Letter-by-letter rise, each line masked so letters emerge from a "slot".
    // autoSplit re-splits on resize / when the web font finishes loading.
    const split = SplitText.create(title, {
      type: "lines,chars",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 110,
          opacity: 0.15,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.02,
          scrollTrigger: trigger,
        }),
    });

    gsap.from(el.querySelectorAll(".statement__label, .statement__mark, .statement__col"), {
      autoAlpha: 0,
      y: 16,
      duration: 1,
      ease: "expo.out",
      stagger: 0.12,
      delay: 0.25,
      scrollTrigger: trigger,
    });

    // The tilted photo's corner rises from the bottom edge as you scroll
    const diamond = el.querySelector(".statement__diamond");
    gsap.set(diamond, { xPercent: -50, yPercent: 13 });
    gsap.to(diamond, {
      yPercent: -14,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 60%", end: "bottom bottom", scrub: true },
    });

    return () => split.revert();
  }, root);

  return (
    <section className="statement theme-ink" id="about" data-trail="dark" data-frame="ink" ref={root}>
      <div className="statement__grid">
        <span className="statement__mark" aria-hidden="true">
          &ldquo;
        </span>
        <div>
          <p className="statement__label">{statement.label}</p>
          <h2 className="statement__title">{statement.title}</h2>
          <div className="statement__cols">
            {statement.columns.map((text, i) => (
              <div className="statement__col" key={i}>
                <p>{text}</p>
                {i === statement.columns.length - 1 && (
                  <a className="statement__cta" href={statement.cta.href}>
                    {statement.cta.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="statement__diamond" aria-hidden="true">
        <div className="statement__diamond-inner">
          <Image src={statement.diamondImage} alt="" fill sizes="420px" />
        </div>
      </div>
    </section>
  );
}
