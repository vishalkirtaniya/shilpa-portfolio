"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { experience, type ExperienceEntry } from "@/lib/content";

function Entry({ entry }: { entry: ExperienceEntry }) {
  return (
    <article className="experience__entry">
      <span className="experience__entry-period">{entry.period}</span>
      <h3 className="experience__entry-role">{entry.role}</h3>
      <p className="experience__entry-org">{entry.org}</p>
      <p className="experience__entry-note">{entry.note}</p>
    </article>
  );
}

/**
 * Two columns of work history scroll past a center card that sticks in
 * place — the card's grid cell stretches to match the taller side column
 * (default CSS grid behavior), which is what gives `position: sticky`
 * room to engage. No ScrollTrigger pin needed for this part.
 */
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useMotion(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const enter = { trigger: el, start: "top 75%", once: true };

    gsap.from(q(".experience__thread-line"), {
      scaleY: 0,
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: enter,
    });
    gsap.from(q(".experience__thread-dot"), {
      scale: 0,
      duration: 0.6,
      ease: "back.out(2)",
      delay: 0.8,
      scrollTrigger: enter,
    });
    gsap.from(q(".experience__eyebrow, .experience__title"), {
      y: 16,
      autoAlpha: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: enter,
    });
    gsap.from(q(".experience__intro-card"), {
      y: 20,
      autoAlpha: 0,
      duration: 1,
      ease: "expo.out",
      delay: 0.2,
      scrollTrigger: enter,
    });

    (q(".experience__entry") as HTMLElement[]).forEach((entryEl, i) => {
      gsap.from(entryEl, {
        y: 24,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: entryEl, start: "top 88%", once: true },
      });
    });
  }, root);

  return (
    <section className="experience theme-blue" id="experience" data-frame="blue" ref={root}>
      <div className="experience__intro">
        <div className="experience__thread" aria-hidden="true">
          <span className="experience__thread-line" />
          <span className="experience__thread-dot" />
        </div>
        <p className="experience__eyebrow">{experience.eyebrow}</p>
        <h2 className="experience__title">{experience.title}</h2>
      </div>

      <div className="experience__grid">
        <div className="experience__col">
          {experience.left.map((entry) => (
            <Entry entry={entry} key={entry.role + entry.org} />
          ))}
        </div>

        <div className="experience__col experience__col-center">
          <div className="experience__intro-card">
            <p className="experience__intro-kicker">{experience.intro.kicker}</p>
            <h3 className="experience__intro-title">{experience.intro.title}</h3>
            <p className="experience__intro-subtitle">{experience.intro.subtitle}</p>
            <a className="experience__cta" href={experience.intro.cta.href}>
              <span>{experience.intro.cta.label}</span>
            </a>
          </div>
        </div>

        <div className="experience__col">
          {experience.right.map((entry) => (
            <Entry entry={entry} key={entry.role + entry.org} />
          ))}
        </div>
      </div>

      <div className="experience__skills">
        <p className="experience__skills-label">Skills &amp; Tools</p>
        <ul className="experience__skills-list">
          {experience.skills.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}