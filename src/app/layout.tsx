import type { Metadata } from "next";

// Self-hosted fonts (no network request to Google at build or run time)
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";

import "lenis/dist/lenis.css";
import "./globals.css";
import "../styles/frame.css";
import "../styles/hero.css";
import "../styles/statement.css";
import "../styles/lens.css";
import "../styles/plates.css";
import "../styles/journal.css";
import "../styles/contact.css";
import "../styles/cursor.css";

export const metadata: Metadata = {
  title: "Aperture — Visual Lookbook",
  description: "A frame-centric visual lookbook. Spring / Summer 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets CSS hide intro elements *only* when JavaScript is running */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
