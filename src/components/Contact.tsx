"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/useMotion";
import { contact } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useMotion(() => {
    gsap.from(root.current!.querySelectorAll(".lookbook__close-heading, .lookbook__close-text, .contact-form"), {
      y: 24,
      autoAlpha: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.12,
      scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
    });
  }, root);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section className="lookbook__close" id="contact" data-frame="ink" ref={root}>
      <h2 className="lookbook__close-heading">{contact.heading}</h2>
      <p className="lookbook__close-text">{contact.text}</p>

      <form className="contact-form" onSubmit={onSubmit}>
        <div className="contact-form__group">
          <label className="contact-form__label" htmlFor="cf-name">Name</label>
          <input className="contact-form__input" type="text" id="cf-name" name="name" placeholder="Your full name" autoComplete="name" required />
        </div>
        <div className="contact-form__group">
          <label className="contact-form__label" htmlFor="cf-email">Email</label>
          <input className="contact-form__input" type="email" id="cf-email" name="email" placeholder="your@email.com" autoComplete="email" required />
        </div>
        <div className="contact-form__group">
          <label className="contact-form__label" htmlFor="cf-message">Note</label>
          <textarea className="contact-form__textarea" id="cf-message" name="message" placeholder="Tell us about your project..." rows={4} required />
        </div>
        <button type="submit" className="contact-form__submit" disabled={status === "sending"}>
          <span>{status === "sending" ? "Sending" : "Send Inquiry"}</span>
        </button>
        <p className="contact-form__status" role="status" aria-live="polite">
          {status === "sent" && "Inquiry sent — we reply within twenty-four hours."}
          {status === "error" && error}
        </p>
      </form>
    </section>
  );
}
