import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import { coupleNames, wedding } from "@/data/wedding";
import "./globals.css";

const title = `${coupleNames} — ${wedding.ceremony.name} Invitation`;
const description = `You are invited to the ${wedding.ceremony.name} of ${coupleNames}, ${wedding.date.day} ${wedding.date.month} ${wedding.date.year}, ${wedding.venue.name}, ${wedding.venue.city}.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F7F1EA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={fontVariables}
      // The head script below stamps data-sealed before React hydrates. That
      // divergence is the point of the script, not a bug to be reported.
      suppressHydrationWarning
    >
      <head>
        {/*
         * Resolves the seal before React hydrates, so a returning guest never
         * sees the envelope flash and a first-time guest never sees a blank
         * page waiting for JavaScript. Also stops the browser restoring a
         * scroll position into a document that is still sealed.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';var o=sessionStorage.getItem('invitationOpened')==='true';document.documentElement.dataset.sealed=o?'false':'true';}catch(e){document.documentElement.dataset.sealed='true';}})();`,
          }}
        />
      </head>
      <body>
        <div className="paper-ground" aria-hidden="true" />
        <div className="paper-emboss" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
