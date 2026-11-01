export const frameThemes = {
  paper: {
    bg: "#ffffff",
    fg: "#0d0d0d",
    fgDim: "rgba(13, 13, 13, 0.6)",
    fgGhost: "rgba(13, 13, 13, 0.16)",
  },
  ink: {
    bg: "#0d0d0d",
    fg: "#ffffff",
    fgDim: "rgba(255, 255, 255, 0.5)",
    fgGhost: "rgba(255, 255, 255, 0.14)",
  },
  blue: {
    bg: "#0057ff",
    fg: "#ffffff",
    fgDim: "rgba(255, 255, 255, 0.65)",
    fgGhost: "rgba(255, 255, 255, 0.25)",
  },
} as const;

export type FrameTheme = keyof typeof frameThemes;