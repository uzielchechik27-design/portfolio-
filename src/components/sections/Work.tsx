import Link from "next/link";
import { projects } from "@/lib/site";
import { Frame, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/sections/Reveal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { cn } from "@/lib/utils";

type WorkProps = {
  heading?: string;
  compact?: boolean;
  showHeading?: boolean;
};

export function Work({
  heading = "Selected work",
  compact = false,
  showHeading = true,
}: WorkProps) {
  return (
    <section
      id="work"
      className={cn(
        "scroll-mt-24",
        showHeading ? "py-24 md:py-32" : "pb-16 pt-2 md:pb-24",
      )}
    >
      <div className="site-shell">
        {showHeading ? (
          <SectionHeading
            index="03"
            kicker="Portfolio"
            title={heading}
            description="Case files for systems already shipped. Live demos and repositories will attach here as the public archive opens."
          />
        ) : null}

        <div className="grid gap-5">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        {!compact ? (
          <Reveal delay={120}>
            <Frame className="mt-8 border border-dashed border-paper/20 bg-transparent">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="eyebrow text-signal">Future archive</p>
                  <p className="mt-3 max-w-xl font-display text-2xl font-bold uppercase tracking-[-0.04em]">
                    Additional case studies, live products, and source links land here.
                  </p>
                </div>
                <Link
                  href="/work"
                  className="nav-link text-[11px] uppercase tracking-[0.2em] text-paper/80 hover:text-signal"
                >
                  Open full portfolio
                </Link>
              </div>
            </Frame>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
