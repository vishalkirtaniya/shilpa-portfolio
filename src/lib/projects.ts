/**
 * Project page data. Images are served from /public, so copy your files to:
 *   public/projects/iro-iro/hero/1.png … 5.png      (the scrolling strip)
 *   public/projects/iro-iro/lookbook/1.png … 10.png (the lookbook pages)
 */
const hero = (n: number) => `/images/projects/iro-iro/hero/${n}.png`;
const page = (n: number) => `/images/projects/iro-iro/lookbook/${n}.png`;

export const iroIro = {
  title: "IRO IRO",
  scroller: [1, 2, 3, 4, 5].map((n) => ({
    src: hero(n),
    alt: `IRO IRO Pyaar collection ${n}`,
  })),
  lookbook: Array.from({ length: 10 }, (_, i) => ({
    src: page(i + 1),
    alt: `Lookbook page ${i + 1}`,
  })),
};