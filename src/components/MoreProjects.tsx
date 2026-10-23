// "use client";

// import { useRef, type CSSProperties } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { gsap } from "@/lib/gsap";
// import { useMotion } from "@/lib/useMotion";
// import { projects } from "@/lib/projects";

// // How far each row is pushed in from the left; cycles for any number of rows.
// const OFFSETS = ["0%", "62%", "32%"];
// const pad = (n: number) => String(n).padStart(2, "0");

// /** "More projects" — every project except the one you're on, as staggered rows. */
// export default function MoreProjects({ currentSlug }: { currentSlug: string }) {
//   const root = useRef<HTMLElement>(null);
//   const others = projects.filter((p) => p.slug !== currentSlug);

//   useMotion(() => {
//     const q = gsap.utils.selector(root.current!);
//     gsap.from(q(".more__heading"), {
//       autoAlpha: 0,
//       y: 14,
//       duration: 1,
//       ease: "expo.out",
//       scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
//     });
//     (q(".more__link") as HTMLElement[]).forEach((row, i) => {
//       gsap.from(row, {
//         autoAlpha: 0,
//         y: 28,
//         duration: 1,
//         ease: "expo.out",
//         delay: i * 0.08,
//         scrollTrigger: { trigger: row, start: "top 92%", once: true },
//       });
//     });
//   }, root);

//   if (!others.length) return null;

//   return (
//     <section className="more" ref={root} aria-labelledby="more-projects-title">
//       <h2 className="more__heading" id="more-projects-title">
//         More projects
//       </h2>

//       <ul className="more__list">
//         {others.map((p, i) => {
//           const content = (
//             <>
//               <span className="more__info">
//                 <span className="more__title">
//                   {p.title}
//                   <sup>({p.year})</sup>
//                 </span>
//                 <span className="more__small">({pad(i + 1)})</span>
//               </span>
//               <span className="more__thumb">
//                 <Image src={p.cover} alt="" fill sizes="200px" className="more__img" />
//               </span>
//               <span className="more__small more__count">{p.href ? `(${p.count})` : "(soon)"}</span>
//             </>
//           );
//           const style = { "--offset": OFFSETS[i % OFFSETS.length] } as CSSProperties;

//           return (
//             <li className="more__row" style={style} key={p.slug}>
//               {p.href ? (
//                 // projects open in their own tab
//                 <Link href={p.href} target="_blank" rel="noopener" className="more__link">
//                   {content}
//                 </Link>
//               ) : (
//                 <div className="more__link more__link--soon" aria-disabled="true">
//                   {content}
//                 </div>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </section>
//   );
// }