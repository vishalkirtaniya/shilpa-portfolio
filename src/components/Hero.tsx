"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { hero, heroCards } from "@/lib/content";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useMotion(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const cards = q(".hero__card") as HTMLElement[];
    const shapes = q(".hero__card-shape");
    const lines = q(".hero__line-inner");
    const content = q(".hero__content");
    const depths = cards.map((c) => Number(c.dataset.depth) || 0.5);

    /* ---- 1. Intro: headline flips open, cards pop in at random ---- */
    const order = gsap.utils.shuffle(cards.map((_, i) => i));
    const cardDelay = (i: number) => 0.35 + order[i] * 0.07;

    const intro = gsap.timeline({ delay: 0.5, defaults: { ease: "expo.out" } });
    intro
      .fromTo(
        lines,
        { rotationX: 180, y: 40, filter: "blur(10px)", transformPerspective: 900 },
        { rotationX: 0, y: 0, filter: "blur(0px)", autoAlpha: 1, duration: 1.8, stagger: 0.18 },
        0,
      )
      .to(cards, { autoAlpha: 1, duration: 1, delay: cardDelay }, 0)
      .fromTo(shapes, { scale: 0.6, y: 30 }, { scale: 1, y: 0, duration: 1.4, delay: cardDelay }, 0)
      .fromTo(
        q(".hero__subtitle, .hero__scroll-cue"),
        { y: 10 },
        { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.15 },
        1.1,
      );

    /* ---- 2. Idle: gentle drift, paused while the hero is off-screen ---- */
    const drifts = cards.map((c) =>
      gsap.to(c.querySelector(".hero__card-float"), {
        x: gsap.utils.random(-10, 10),
        y: gsap.utils.random(-14, 14),
        duration: gsap.utils.random(3.5, 6.5),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: gsap.utils.random(0, 2),
      }),
    );
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => drifts.forEach((t) => (self.isActive ? t.resume() : t.pause())),
    });

    /* ---- 3. Pointer parallax: nearer cards travel further ---- */
    const layers = cards.map((c) => c.querySelector(".hero__card-mouse") as HTMLElement);
    const xTo = layers.map((l) => gsap.quickTo(l, "x", { duration: 1, ease: "power3.out" }));
    const yTo = layers.map((l) => gsap.quickTo(l, "y", { duration: 1, ease: "power3.out" }));
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      depths.forEach((d, i) => {
        xTo[i](-nx * 80 * d);
        yTo[i](-ny * 80 * d);
      });
    };
    const onLeave = () =>
      depths.forEach((_, i) => {
        xTo[i](0);
        yTo[i](0);
      });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    /* ---- 4. Scroll: cards peel away faster than the headline ---- */
    const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: true };
    cards.forEach((c, i) =>
      gsap.to(c, { y: -180 * depths[i], ease: "none", scrollTrigger: scrub }),
    );
    gsap.to(content, { y: -70, opacity: 0.15, ease: "none", scrollTrigger: scrub });

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, root);

  return (
    <section className="hero theme-paper" data-frame="paper" data-trail="light" ref={root}>
      <div className="hero__cards" aria-hidden="true">
        {heroCards.map((c, i) => (
          <div
            key={i}
            className={`hero__card${c.desktopOnly ? " hero__card--desktop" : ""}`}
            data-depth={c.depth}
            data-intro
            style={{ left: `${c.x}%`, top: `${c.y}%`, "--w": c.w, "--r": c.r } as CSSProperties}
          >
            <div className="hero__card-mouse">
              <div className="hero__card-float">
                <div className="hero__card-shape">
                  <span className="hero__card-img">
                    <Image
                      src={c.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 30vw, 140px"
                      style={{ objectPosition: c.pos }}
                      priority={i < 4}
                    />
                  </span>
                  {c.label && <span className="hero__card-label">{c.label}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero__content" data-cursor="badge">
        <h1 className="hero__title">
          <span className="hero__line">
            <span className="hero__line-inner" data-intro>
              {hero.lines[0]}
            </span>
          </span>{" "}
          <span className="hero__line hero__line--em">
            <em className="hero__line-inner" data-intro>
              {hero.lines[1]}
            </em>
          </span>
        </h1>
        <p className="hero__subtitle" data-intro>
          {hero.subtitle}
        </p>
      </div>

      <div className="hero__scroll-cue" data-intro aria-hidden="true">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
