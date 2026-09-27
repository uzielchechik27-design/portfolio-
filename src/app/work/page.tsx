import type { Metadata } from "next";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Selected projects by ${site.name}: CalorieAI, Automatic Exam Solver, and Cosmetics Clinic OS.`,
};

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-paper/10 pt-28 md:pt-36">
        <div className="site-shell pb-12">
          <p className="eyebrow text-signal">Selected work</p>
          <h1 className="display-title mt-5 max-w-4xl font-display font-extrabold uppercase leading-[0.88] tracking-[-0.06em]">
            Portfolio
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-steel">
            Case files for CalorieAI, Automatic Exam Solver, and Cosmetics
            Clinic OS.
          </p>
        </div>
      </section>
      <Work showHeading={false} />
      <Contact />
    </>
  );
}
