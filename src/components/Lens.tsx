"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { frameOffset, getLenis, isNavigating } from "@/lib/lenis";
import { lens } from "@/lib/content";

/**
 * Lens — a stack of full-screen photos. The section pins to the frame; each
 * photo wipes up over the one before it. Scroll even a little and the next
 * photo glides into place on its own (the page scroll itself is animated to the
 * next step), then it waits for the next nudge. After the last photo, normal
 * scrolling carries on.
 *
 * Step 0 is the empty paper space; step N is the last photo.
 */
export default function Lens() {
  const root = useRef<HTMLElement>(null);

  useMotion(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const slides = q(".lens__image") as HTMLElement[];
    const year = q(".lens__year")[0];
    const n = slides.length;

    // start state: every photo hidden below, ready to wipe up
    slides.forEach((slide, i) => {
      gsap.set(slide, { clipPath: i === 0 ? "inset(100% 3% 0% 3%)" : "inset(100% 0% 0% 0%)" });
      gsap.set(slide.querySelector("img"), { scale: 1.25 });
    });
    gsap.set(year, { autoAlpha: 0 });

    // The "snap" only makes sense with a mouse/trackpad. On touch we leave the
    // scroll alone and the photos simply follow your finger.
    const canSnap = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const STEP = () => el.offsetHeight; // one photo = one section-height of scrolling
    const NUDGE = 0.012; // how far (as a fraction of a step, ~10px) counts as "scrolled"

    let settled = 0; // the step we're resting on
    let busy = false; // true while the page is gliding to the next step

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: el,
        start: () => `top ${frameOffset()}px`,
        end: () => `+=${STEP() * n}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        onRefresh: (self) => {
          settled = Math.round(self.progress * n);
        },
        onEnter: () => {
          settled = 0; // arrived from above
        },
        onEnterBack: () => {
          settled = n; // arrived from below
        },
        onUpdate: (self) => {
          const lenis = getLenis();
          if (!canSnap || !lenis || busy) return;

          const pos = self.progress * n;
          const offset = pos - settled; // in steps

          // A nav link is scrolling us through, or the page jumped (End key,
          // scrollbar drag, anchor): don't fight it — just note where we are.
          if (isNavigating() || Math.abs(offset) > 1.5) {
            settled = Math.round(pos);
            return;
          }
          if (Math.abs(offset) < NUDGE) return;

          const target = settled + (offset > 0 ? 1 : -1);
          // past the first/last photo: let normal scrolling take over
          if (target < 0 || target > n) return;

          busy = true;
          settled = target;
          lenis.scrollTo(self.start + target * STEP(), {
            duration: 1,
            easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart: quick start, soft landing
            lock: true, // ignore wheel input until it lands
            onComplete: () => {
              gsap.delayedCall(0.15, () => (busy = false)); // let trackpad momentum die down
            },
          });
        },
      },
    });

    // one segment per photo: it wipes up while its picture settles from 1.25x
    slides.forEach((slide, i) => {
      tl.to(slide, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, i);
      tl.to(slide.querySelector("img"), { scale: 1, duration: 1 }, i);
    });
    tl.to(year, { autoAlpha: 1, duration: 0.25 }, 0.75);
  }, root);

  return (
    <section className="lens theme-paper" id="about" ref={root} data-frame="paper" aria-label="Lens">
      {/* empty space — the first photo wipes up over it */}
      <div className="lens__space" aria-hidden="true" />

      {lens.images.map((image, i) => (
        <div className="lens__image" key={image.src + i}>
          <Image src={image.src} alt={image.alt} fill sizes="100vw" />
        </div>
      ))}

      <span className="lens__year" aria-hidden="true">
        {lens.year}
      </span>
    </section>
  );
}
