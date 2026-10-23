"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brand } from "@/lib/content";

/**
 * Header for project pages (which open in their own tab, so it always offers
 * a way home). It slides away on scroll-down and returns on scroll-up so it
 * never covers the work.
 */
export default function ProjectHeader({ title, year }: { title: string; year: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return; // ignore jitter
      setHidden(y > 120 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`project-header${hidden ? " is-hidden" : ""}`}>
      <Link href="/" className="project-header__brand" aria-label={`${brand.name} home`}>
        <span className="project-header__mark">{brand.monogram}</span>
        <span className="project-header__name">{brand.name}</span>
      </Link>

      <p className="project-header__meta">
        <span className="project-header__label">Project</span>
        {title}
        <sup>({year})</sup>
      </p>

      <nav className="project-header__nav" aria-label="Site">
        <Link href="/#lookbook">Work</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
    </header>
  );
}