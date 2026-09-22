# Aperture — Next.js + GSAP

Aperture template's frame and type system, with the motion from your reference video rebuilt in GSAP.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live
- `src/lib/content.ts` – all copy, images and hero card positions
- `src/components/` – Frame, RopeCursor, Hero, Statement, Lens, Plates, Journal, Contact
- `src/styles/` – one stylesheet per section; tokens are in `src/app/globals.css`
- `src/app/api/inquire/route.ts` – contact form endpoint (placeholder: logs only, wire to your email provider)
- `public/images/` – swap in your own photos

## Motion map (video -> code)
| In the video | Component |
|---|---|
| Headline flips open, cards pop in | `Hero.tsx` intro timeline |
| Cards drift + react to mouse | `Hero.tsx` (drift, quickTo parallax) |
| Coral string trailing the cursor | `RopeCursor.tsx` (canvas, sits under the frame) |
| Black curtain, letter-by-letter text | `Statement.tsx` (SplitText) |
| "Art ✦ In The Lens", image grows to fill | `Lens.tsx` (pinned ScrollTrigger + clip-path) |

Reduced-motion is respected everywhere; the rope/badge only run on fine-pointer devices.
Fonts are self-hosted via @fontsource (no Google Fonts request).
Template credit: Tooplate 2170 Aperture (link kept in the footer).
# shilpa-portfolio
