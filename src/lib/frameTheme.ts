export const frameThemes = {
  paper: {
    bg: "#f8f1ec",
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
} as const;

export type FrameTheme = keyof typeof frameThemes;