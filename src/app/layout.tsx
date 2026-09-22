import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Ambient } from "@/components/layout/Ambient";
import { Grain, GridBackdrop } from "@/components/layout/Atmosphere";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { TwinDock } from "@/components/twin/TwinDock";
import { TwinProvider } from "@/components/twin/TwinProvider";
import { TwinShell } from "@/components/twin/TwinShell";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.summary,
  authors: [{ name: site.name }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink font-sans text-paper">
        <a
          href="#content"
          className="absolute left-4 top-4 z-[80] -translate-y-24 bg-signal px-3 py-2 text-sm text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Grain />
        <GridBackdrop />
        <Ambient />
        <TwinProvider>
          <TwinShell>
            <Nav />
            <main id="content" className="flex-1">
              {children}
            </main>
            <Footer />
          </TwinShell>
          <TwinDock />
        </TwinProvider>
      </body>
    </html>
  );
}
