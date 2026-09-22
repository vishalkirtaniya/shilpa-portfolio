/**
 * All copy, images and layout data live here so you can restyle the site
 * without touching component code. Images are served from /public/images.
 */

const img = (name: string) => `/images/${name}.jpg`;

export const brand = {
  name: "Aperture",
  monogram: "A",
  credit: "© 2026 — Aperture Visual",
};

export const nav = [
  { href: "#lookbook", label: "Lookbook" },
  { href: "#about", label: "About" },
  { href: "#journal", label: "Journal" },
  { href: "#contact", label: "Contact" },
];

export const social = ["Instagram", "Behance", "Vimeo"];

/* ---------------------------------------------------------------- Hero */

export const hero = {
  lines: ["Silent", "Volumes"], // second line renders in italic
  subtitle: "Spring / Summer — 2026 Collection",
};

export type HeroCard = {
  src: string;
  /** left / top of the card, in % of the hero */
  x: number;
  y: number;
  /** width multiplier (base width is clamp(56px, 7vw, 128px)) */
  w: number;
  /** aspect ratio, width / height */
  r: number;
  /** 0–1 — how strongly the card reacts to mouse + scroll */
  depth: number;
  /** CSS object-position, to vary the crop when an image is reused */
  pos?: string;
  label?: string;
  /** hide on narrow screens to keep the hero uncluttered */
  desktopOnly?: boolean;
};

export const heroCards: HeroCard[] = [
  { src: img("architectural-interior"), x: 6, y: 13, w: 0.95, r: 0.78, depth: 0.6 },
  { src: img("aperture-camera"), x: 23, y: 5, w: 0.8, r: 1, depth: 0.9, pos: "62% 50%", desktopOnly: true },
  { src: img("minimalist-interior"), x: 42, y: 9, w: 1.05, r: 0.8, depth: 0.5 },
  { src: img("evening-interior"), x: 62, y: 6, w: 0.85, r: 0.8, depth: 0.85, desktopOnly: true },
  { src: img("panoramic-view"), x: 77, y: 14, w: 1.1, r: 0.78, depth: 0.7 },
  { src: img("natural-stone-surface"), x: 90, y: 6, w: 0.75, r: 0.7, depth: 0.4, desktopOnly: true },
  { src: img("textural-detail"), x: 2, y: 45, w: 0.8, r: 1, depth: 0.8, desktopOnly: true },
  { src: img("contemporary-residential"), x: 10, y: 67, w: 1, r: 0.8, depth: 0.55, label: "Warm Void" },
  { src: img("aperture-camera"), x: 27, y: 81, w: 0.75, r: 0.8, depth: 0.95, pos: "20% 40%", desktopOnly: true },
  { src: img("evening-interior"), x: 46, y: 84, w: 0.9, r: 1, depth: 0.45, pos: "80% 50%" },
  { src: img("architectural-interior"), x: 64, y: 78, w: 1, r: 0.75, depth: 0.75, pos: "72% 50%", label: "The Atrium" },
  { src: img("panoramic-view"), x: 82, y: 67, w: 0.95, r: 0.8, depth: 0.6, pos: "25% 50%", label: "Framed Horizon" },
  { src: img("minimalist-interior"), x: 91, y: 44, w: 0.8, r: 0.8, depth: 0.9, pos: "88% 50%", desktopOnly: true },
];

/* ----------------------------------------------------------- Statement */

export const statement = {
  label: "About",
  title: "A Space For New Generation Creatives",
  columns: [
    "Aperture is a quiet archive of interiors, materials and the light that moves through them — photographed with restraint, presented without noise.",
    "If you are a photographer or architect and would like to share your work, our inquiry page is open for commissions and collaborations.",
  ],
  cta: { label: "Inquire", href: "#contact" },
  diamondImage: img("architectural-interior"),
};

/* ---------------------------------------------------------------- Lens */

export const lens = {
  words: ["Art", "In The Lens"],
  columns: [
    "Every plate begins with a single decision: what to leave out. The frame is the argument, the silence around it is the evidence.",
    "Scroll on to step inside the frame — twelve interiors, shot across three countries and one long afternoon.",
  ],
  image: img("panoramic-view"),
  imageAlt: "Panoramic view through an architectural framework",
  year: "2026",
};

/* -------------------------------------------------------------- Plates */

export type Plate = {
  n: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
  side?: "right";
};

export const plates: Record<"p1" | "p2" | "p3" | "p5" | "p6", Plate> = {
  p1: {
    n: "01",
    title: "The Atrium",
    caption: "Where light becomes material — an exercise in controlled absence.",
    src: img("architectural-interior"),
    alt: "Architectural interior with natural light flooding through floor-to-ceiling windows",
  },
  p2: {
    n: "02",
    title: "Still Form",
    caption: "Every surface a decision. Every shadow, intentional.",
    src: img("minimalist-interior"),
    alt: "Minimalist interior space with sculptural furniture",
    side: "right",
  },
  p3: {
    n: "03",
    title: "Warm Void",
    caption: "Restraint as luxury. Space as the ultimate amenity.",
    src: img("contemporary-residential"),
    alt: "Contemporary residential space with warm tonal palette",
  },
  p5: {
    n: "05",
    title: "Framed Horizon",
    caption: "The window as aperture — a curated view of the infinite.",
    src: img("panoramic-view"),
    alt: "Panoramic view through architectural framework",
    side: "right",
  },
  p6: {
    n: "06",
    title: "Golden Hour",
    caption: "When daylight yields, the architecture reveals its second self.",
    src: img("evening-interior"),
    alt: "Evening interior with warm ambient lighting",
  },
};

export const quote = {
  text: "Architecture is the learned game, correct and magnificent, of forms assembled in the light.",
  cite: "Le Corbusier",
};

export const diptych = {
  n: "04",
  panels: [
    { src: img("textural-detail"), alt: "Textural detail of concrete and timber joinery", label: "Detail — 04a" },
    { src: img("natural-stone-surface"), alt: "Natural stone surface with dramatic side lighting", label: "Detail — 04b" },
  ],
};

/* ------------------------------------------------------------- Journal */

export type JournalEntry = {
  date: string;
  title: string;
  tag: string;
  meta: string;
  body: string[];
  cta: string;
  fullDate: string;
};

export const journal: JournalEntry[] = [
  {
    date: "Mar 2026",
    title: "On Silence in Spatial Design",
    tag: "Essay",
    meta: "Essay — 6 min read",
    body: [
      "There is a kind of silence that only architecture can produce. Not the absence of sound, but the presence of space — unburdened, undecorated, allowed to simply exist. We have spent the past season studying this quality in the interiors we photograph.",
      "The rooms that speak most clearly are the ones that say the least. A single chair against a plaster wall. Light moving across a floor over the course of an afternoon. These are not minimal gestures — they are maximal acts of restraint.",
    ],
    cta: "Read full essay",
    fullDate: "Mar 12, 2026",
  },
  {
    date: "Feb 2026",
    title: "The Negative as Narrative",
    tag: "Process",
    meta: "Process — 4 min read",
    body: [
      "In photography, what you exclude defines the image more than what you include. The crop, the shadow, the out-of-focus periphery — these are not absences but active compositional choices. The negative space tells the story.",
      "Our latest collection explores this principle across twelve interiors, each shot to emphasize what lies between the objects rather than the objects themselves.",
    ],
    cta: "Read full article",
    fullDate: "Feb 20, 2026",
  },
  {
    date: "Jan 2026",
    title: "Material Conversations",
    tag: "Photo",
    meta: "Photo essay — 8 min read",
    body: [
      "Concrete speaks to timber differently than it speaks to glass. Stone and linen share a warmth that steel and marble never will. Every material pairing is a dialogue — sometimes harmonious, sometimes deliberately tense.",
      "This photo essay documents the material palettes of six private residences, focusing on the moments where different textures meet, overlap, and quietly negotiate their coexistence.",
    ],
    cta: "View photo essay",
    fullDate: "Jan 08, 2026",
  },
  {
    date: "Dec 2025",
    title: "Volume III — Behind the Collection",
    tag: "Behind",
    meta: "Behind the scenes — 5 min read",
    body: [
      "Every collection begins long before the first photograph is taken. Volume III started as a series of walks through unfinished buildings — concrete shells awaiting their purpose, corridors flooded with raw afternoon light.",
      "The locations were scouted over four months across three countries. What united them was not style but atmosphere: each space possessed a quality of stillness that felt almost sacred.",
    ],
    cta: "Read full piece",
    fullDate: "Dec 15, 2025",
  },
];

/* ------------------------------------------------------------- Contact */

export const contact = {
  heading: "Inquire",
  text: "For commissions, collaborations, and private viewings — we respond within twenty-four hours.",
};
