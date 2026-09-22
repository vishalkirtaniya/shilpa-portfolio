"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { getLenis } from "@/lib/lenis";
import { journal } from "@/lib/content";

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

export default function Journal() {
  const root = useRef<HTMLElement>(null);
  const articles = useRef<(HTMLElement | null)[]>([]);
  const shown = useRef<number | null>(0);

  const [active, setActive] = useState<number | null>(0);
  const [sheetOpen, setSheetOpen] = useState(false); // mobile full-screen sheet

  // Section reveal
  useMotion(() => {
    gsap.fromTo(
      root.current!.querySelector(".lookbook__journal-inner"),
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.2,
        ease: "expo.out",
        // A leftover transform would become the containing block for the
        // position:fixed mobile sheet inside, so clear it once the reveal ends.
        clearProps: "transform",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      },
    );
  }, root);

  // Article switch: current one slides out, the next slides in
  useEffect(() => {
    const prev = shown.current;
    if (prev === active) return;
    shown.current = active;

    const from = prev !== null ? articles.current[prev] : null;
    const to = active !== null ? articles.current[active] : null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

    // clean up anything left half-faded by a fast double click
    articles.current.forEach((a) => a && a !== from && a !== to && gsap.set(a, { autoAlpha: 0 }));

    const tl = gsap.timeline();
    if (from) tl.to(from, { autoAlpha: 0, x: -10, duration: 0.3 * reduce, ease: "power2.in" });
    if (to) tl.fromTo(to, { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.55 * reduce, ease: "expo.out" });
    return () => {
      tl.kill();
    };
  }, [active]);

  // Lock page scroll + Esc-to-close while the mobile sheet is open
  useEffect(() => {
    if (!sheetOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    if (!lenis) document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const open = (i: number) => {
    setActive(i);
    setSheetOpen(isMobile());
  };
  const close = () => {
    setActive(null);
    setSheetOpen(false);
  };

  return (
    <section className="lookbook__journal" id="journal" data-frame="ink" ref={root}>
      <div className="lookbook__journal-inner">
        <h2 className="lookbook__journal-heading">Journal</h2>
        <div className="lookbook__journal-spread">
          <ul className="lookbook__journal-list">
            {journal.map((entry, i) => (
              <li key={entry.title} className={`lookbook__journal-entry${active === i ? " is-active" : ""}`}>
                <button
                  type="button"
                  className="lookbook__journal-entry-btn"
                  aria-expanded={active === i}
                  aria-controls={`journal-article-${i}`}
                  onClick={() => open(i)}
                >
                  <span className="lookbook__journal-entry-header">
                    <span className="lookbook__journal-date">{entry.date}</span>
                    <span className="lookbook__journal-title">{entry.title}</span>
                    <span className="lookbook__journal-tag">{entry.tag}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div
            className={`lookbook__journal-panel${active !== null ? " has-content" : ""}${sheetOpen ? " is-open" : ""}`}
            data-lenis-prevent
          >
            <button className="lookbook__journal-close" aria-label="Close article" onClick={close} />

            <div className="lookbook__journal-panel-empty">
              <span>Select an entry to read</span>
            </div>

            {journal.map((entry, i) => (
              <article
                key={entry.title}
                id={`journal-article-${i}`}
                className="lookbook__journal-content"
                ref={(el) => {
                  articles.current[i] = el;
                }}
                // first article is visible on load; GSAP takes over after the first switch
                style={i === 0 ? { opacity: 1, visibility: "visible" } : undefined}
              >
                <div className="lookbook__journal-content-tag">{entry.meta}</div>
                <h3 className="lookbook__journal-content-title">{entry.title}</h3>
                <div className="lookbook__journal-content-body">
                  {entry.body.map((p, k) => (
                    <p key={k}>{p}</p>
                  ))}
                </div>
                <div className="lookbook__journal-content-footer">
                  <a href="#" className="lookbook__journal-read-more">
                    {entry.cta}
                  </a>
                  <span className="lookbook__journal-read-time">{entry.fullDate}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
