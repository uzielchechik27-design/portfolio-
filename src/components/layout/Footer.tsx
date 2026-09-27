"use client";

import Link from "next/link";
import { useTwin } from "@/components/twin/TwinProvider";
import { emailHref, profileLinks, site } from "@/lib/site";

export function Footer() {
  const { setOpen } = useTwin();

  return (
    <footer className="border-t border-paper/10 bg-ink">
      <div className="site-shell flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
          © {new Date().getFullYear()} {site.name} · {site.role}
        </p>
        <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-paper/70">
          <button
            type="button"
            className="hover:text-signal"
            onClick={() => setOpen(true)}
          >
            Twin
          </button>
          <Link href="/work" className="hover:text-signal">
            Portfolio
          </Link>
          <a href={emailHref()} className="hover:text-signal">
            Email
          </a>
          {profileLinks().map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-signal"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
