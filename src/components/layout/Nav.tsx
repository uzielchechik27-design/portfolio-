"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTwin } from "@/components/twin/TwinProvider";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { open: twinOpen, setOpen: setTwinOpen } = useTwin();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[right,colors] duration-300",
        twinOpen && "lg:right-[420px]",
        scrolled || open
          ? "border-b border-paper/10 bg-ink/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="site-shell flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center border border-signal/70 font-display text-[11px] font-bold tracking-wide text-signal">
            {site.shortName}
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.22em] text-paper/80 sm:block">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[11px] uppercase tracking-[0.2em] text-paper/70 transition-colors hover:text-signal"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className="nav-link text-[11px] uppercase tracking-[0.2em] text-paper/70 transition-colors hover:text-signal"
            onClick={() => setTwinOpen(true)}
          >
            Twin
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 border border-paper/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-steel xl:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_rgba(214,255,62,0.9)]" />
            {site.availability}
          </span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-paper/15 text-paper md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-3.5 w-4">
              <span
                className={cn(
                  "absolute left-0 h-px w-4 bg-paper transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0.5",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-px w-4 bg-paper transition-opacity duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-4 bg-paper transition-all duration-300",
                  open ? "top-1.5 -rotate-45" : "top-[11px]",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "border-t border-paper/10 bg-ink md:hidden",
          open ? "block min-h-[calc(100svh-4rem)]" : "hidden",
        )}
      >
        <nav
          className="site-shell flex flex-col gap-1 py-6"
          aria-label="Mobile"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 font-display text-3xl font-extrabold uppercase tracking-[-0.04em] text-paper"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className="py-3 text-left font-display text-3xl font-extrabold uppercase tracking-[-0.04em] text-paper"
            onClick={() => {
              setOpen(false);
              setTwinOpen(true);
            }}
          >
            Twin
          </button>
        </nav>
      </div>
    </header>
  );
}
