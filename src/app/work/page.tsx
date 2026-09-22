import type { Metadata } from "next";
import { Frame } from "@/components/ui";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Selected systems by ${site.name}. Live products and source links will attach as the public archive opens.`,
};

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-paper/10 pt-28 md:pt-36">
        <div className="site-shell pb-12">
          <p className="eyebrow text-signal">Archive / Future</p>
          <h1 className="display-title mt-5 max-w-4xl font-display font-extrabold uppercase leading-[0.88] tracking-[-0.06em]">
            Portfolio
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-steel">
            Three shipped systems live here as case files. This page is the
            public portfolio — live demos, repositories, and later work will
            slot in without changing the structure.
          </p>
        </div>
      </section>
      <Work compact showHeading={false} />
      <section className="pb-24">
        <div className="site-shell">
          <Frame className="border border-dashed border-paper/20">
            <p className="eyebrow text-signal">Reserved</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-[-0.04em]">
              Next case study
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-steel">
              A placeholder for upcoming product work. When a new system ships,
              it gets an index number, a stack, and a link.
            </p>
          </Frame>
        </div>
      </section>
      <Contact />
    </>
  );
}
