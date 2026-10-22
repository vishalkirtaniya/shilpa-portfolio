"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Star from "./Star";

/**
 * The hand-drawn "string" that trails the pointer in the reference video.
 *
 * - A chain of points, each easing toward the one before it, drawn as one
 *   smooth curve on a canvas. A sine wobble that grows with pointer speed
 *   gives it the loose, looping look.
 * - Colour follows the surface underneath: coral on paper, white on ink.
 *   Sections opt in with data-trail="light" | "dark"; elsewhere it fades out.
 * - Elements with data-cursor="badge" swap the pointer for a rotating star.
 * - Fine-pointer devices only; skipped for reduced motion.
 */

const POINTS = 26;
const CORAL = "236,104,68";

type Theme = "light" | "dark" | null;
const FRAME_TO_TRAIL: Record<string, Theme> = { paper: "light", ink: "dark", blue: "dark" };

/** Trail colour for whatever the pointer is over, or undefined if it's over
 *  no section at all (e.g. the frame's nav) — in which case we keep the last one. */
function trailFor(target: Element | null): Theme | undefined {
  const explicit = target?.closest("[data-trail]")?.getAttribute("data-trail");
  if (explicit === "light" || explicit === "dark") return explicit;
  const frame = target?.closest<HTMLElement>("[data-frame]")?.dataset.frame;
  return frame ? FRAME_TO_TRAIL[frame] : undefined;
}

export default function RopeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const badge = badgeRef.current;
    const star = starRef.current;
    if (!fine || reduce || !canvas || !badge || !star) return;

    const root = document.documentElement;
    root.classList.add("rope-on");

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    let w = 0;
    let h = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: POINTS }, () => ({ x: -200, y: -200 }));
    const mouse = { x: -200, y: -200 };
    let theme: Theme = null;
    let started = false;
    let alpha = 0;
    let speed = 0;
    let badgeOn = false;

    // badge follows the pointer with a little lag
    gsap.set(badge, { xPercent: -50, yPercent: -50, scale: 0 });
    const badgeX = gsap.quickTo(badge, "x", { duration: 0.28, ease: "power3.out" });
    const badgeY = gsap.quickTo(badge, "y", { duration: 0.28, ease: "power3.out" });
    const spin = gsap.to(star, { rotation: 360, duration: 8, ease: "none", repeat: -1 });

    const setBadge = (on: boolean) => {
      if (on === badgeOn) return;
      badgeOn = on;
      gsap.to(badge, {
        scale: on ? 1 : 0,
        duration: on ? 0.6 : 0.3,
        ease: on ? "expo.out" : "power2.in",
        overwrite: "auto",
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!started) {
        pts.forEach((p) => {
          p.x = e.clientX;
          p.y = e.clientY;
        });
        started = true;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      badgeX(e.clientX);
      badgeY(e.clientY);

      const target = e.target as Element | null;
      const next = trailFor(target);
      if (next !== undefined) theme = next;
      setBadge(!!target?.closest('[data-cursor="badge"]'));
    };
    const onLeave = () => {
      theme = null;
      setBadge(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const draw = (time: number) => {
      // leader chases the pointer; every other point chases the one before it
      const lead = pts[0];
      const px = lead.x;
      const py = lead.y;
      lead.x += (mouse.x - lead.x) * 0.4;
      lead.y += (mouse.y - lead.y) * 0.4;
      speed += (Math.hypot(lead.x - px, lead.y - py) - speed) * 0.12;

      for (let i = 1; i < POINTS; i++) {
        const ease = Math.max(0.16, 0.36 - i * 0.008);
        pts[i].x += (pts[i - 1].x - pts[i].x) * ease;
        pts[i].y += (pts[i - 1].y - pts[i].y) * ease;
      }

      alpha += ((theme ? 1 : 0) - alpha) * 0.12;
      ctx.clearRect(0, 0, w, h);
      if (alpha < 0.01) return;

      // wobble perpendicular to the rope, growing toward the tail
      const amp = Math.min(speed * 0.9, 18);
      const d = pts.map((p, i) => {
        const a = pts[Math.max(0, i - 1)];
        const b = pts[Math.min(POINTS - 1, i + 1)];
        let nx = -(b.y - a.y);
        let ny = b.x - a.x;
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        const wave = Math.sin(time * 5 - i * 0.55) * amp * (i / POINTS);
        return { x: p.x + nx * wave, y: p.y + ny * wave };
      });

      ctx.beginPath();
      ctx.moveTo(d[0].x, d[0].y);
      for (let i = 1; i < POINTS - 1; i++) {
        const mx = (d[i].x + d[i + 1].x) / 2;
        const my = (d[i].y + d[i + 1].y) / 2;
        ctx.quadraticCurveTo(d[i].x, d[i].y, mx, my);
      }
      ctx.lineTo(d[POINTS - 1].x, d[POINTS - 1].y);
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle =
        theme === "dark" ? `rgba(255,255,255,${alpha * 0.9})` : `rgba(${CORAL},${alpha})`;
      ctx.stroke();
    };
    gsap.ticker.add(draw);

    return () => {
      gsap.ticker.remove(draw);
      spin.kill();
      gsap.killTweensOf(badge);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      root.classList.remove("rope-on");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="rope-canvas" aria-hidden="true" />
      <div ref={badgeRef} className="cursor-badge" aria-hidden="true">
        <span ref={starRef} style={{ display: "grid" }}>
          <Star />
        </span>
      </div>
    </>
  );
}
