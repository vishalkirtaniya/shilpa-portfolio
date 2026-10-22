"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { counter } from "@/lib/counter";
import { scrollToHash } from "@/lib/lenis";
import { brand, nav, social } from "@/lib/content";
import { frameThemes, type FrameTheme } from "@/lib/frameTheme";

const mobileNav = [
  { href: "#lookbook", label: "Work", icon: "grid" },
  { href: "#about", label: "Lens", icon: "lens" },
  { href: "#experience", label: "Exp.", icon: "case" },
  { href: "#journal", label: "Journal", icon: "info" },
  { href: "#contact", label: "Reach", icon: "mail" },
];

/** The persistent border: hairline, corner marks, wordmark, counter, nav, footer. */
export default function Frame() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("#lookbook");
  const plate = useSyncExternalStore(counter.subscribe, counter.get, counter.getServer);

  // Load-in: each part of the frame fades up in sequence (same order as the template)
  useMotion(() => {
    gsap.to(root.current!.querySelectorAll("[data-intro]"), {
      autoAlpha: 1,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.09,
    });
  }, root);

  // Live frame color: every section marks itself with data-frame="paper" | "ink" | "blue".
  // On every scroll frame we find whichever one's top edge has crossed the
  // frame's inner line and crossfade the frame's CSS variables to match —
  // this also works correctly for the pinned Lens section, since its pin
  // starts at that same line (see Lens.tsx).
  useGSAP(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-frame]"));
    if (!sections.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current: FrameTheme | null = null;

    const apply = (theme: FrameTheme, instant = false) => {
      if (theme === current) return;
      current = theme;
      const t = frameThemes[theme];
      const vars = {
        "--frame-bg": t.bg,
        "--frame-fg": t.fg,
        "--frame-fg-dim": t.fgDim,
        "--frame-fg-ghost": t.fgGhost,
      };
      if (instant || reduce) gsap.set(document.documentElement, vars);
      else gsap.to(document.documentElement, { ...vars, duration: 0.7, ease: "power2.inOut", overwrite: "auto" });
    };

    const check = (instant = false) => {
      const line = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--frame")) || 0;
      let active = sections[0];
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= line) active = section;
          else break;
        }
        apply((active.dataset.frame as FrameTheme) || "paper", instant);
    };

    check(true);
    const onScroll = () => check();
    const onRefresh = () => check(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    ScrollTrigger.addEventListener("refresh", onRefresh);
    return () => {
      window.removeEventListener("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActive(href);
    scrollToHash(href);
    history.replaceState(null, "", href === "#lookbook" ? " " : href);
  };

  return (
    <div ref={root}>
      <div className="frame" aria-hidden="true">
        <div className="frame__border" data-intro />
        <div className="frame__corner frame__corner--tr" data-intro />
        <div className="frame__corner frame__corner--bl" data-intro />
        <div className="frame__corner frame__corner--br" data-intro />
      </div>

      <header className="frame__logo" data-intro>
        <a href="#lookbook" onClick={go("#lookbook")} aria-label={`${brand.name} home`}>
          {brand.monogram}
        </a>
      </header>

      <nav className="frame__nav-top" aria-label="Main navigation" data-intro>
        <ul className="frame__nav">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={go(item.href)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <aside className="frame__sidebar-left" data-intro>
        <div className="frame__counter" aria-label={`Plate ${plate} of 06`}>
          <span className="current">{plate}</span> / 06 — Collection
        </div>
      </aside>

      <aside className="frame__sidebar-right" data-intro>
        <div className="frame__wordmark" aria-hidden="true">
          {brand.name}
        </div>
      </aside>

      <footer className="frame__bottom" data-intro>
        <span className="frame__credit">
          {brand.credit} &middot;{" "}
          <a href="https://www.tooplate.com" rel="nofollow noreferrer" target="_blank">
            Tooplate
          </a>
        </span>
        <ul className="frame__social">
          {social.map((s) => (
            <li key={s}>
              <a href="#">{s}</a>
            </li>
          ))}
        </ul>
      </footer>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {mobileNav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={active === item.href ? "active" : undefined}
            aria-current={active === item.href ? "true" : undefined}
            onClick={go(item.href)}
          >
            <span className={`mobile-nav__icon mobile-nav__icon--${item.icon}`} />
            <span className="mobile-nav__label">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}