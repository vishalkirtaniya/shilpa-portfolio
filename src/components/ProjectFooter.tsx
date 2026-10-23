"use client";

import Link from "next/link";
import { brand, social } from "@/lib/content";

export default function ProjectFooter() {
  return (
    <footer className="project-footer theme-ink" data-trail="dark">
      <div className="project-footer__top">
        <p className="project-footer__kicker">Next</p>
        <h2 className="project-footer__title">
          Let&apos;s make something <em>together.</em>
        </h2>
        <div className="project-footer__actions">
          <Link href="/#contact" className="project-footer__cta">
            <span>Start a project</span>
          </Link>
          <Link href="/" className="project-footer__home">
            ← Back to portfolio
          </Link>
        </div>
      </div>

      <div className="project-footer__bottom">
        <span className="project-footer__credit">{brand.credit}</span>
        <ul className="project-footer__social">
          {social.map((s) => (
            <li key={s}>
              <a href="#">{s}</a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="project-footer__top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}