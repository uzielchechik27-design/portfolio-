import Link from "next/link";
import type { Project } from "@/lib/site";
import { Frame } from "@/components/ui";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <Frame className="overflow-hidden border border-paper/10 bg-elevated/40 transition-colors duration-300 group-hover:border-signal/50 group-hover:bg-elevated">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 -top-3 font-display text-7xl font-extrabold leading-none text-paper/6 md:text-8xl"
        >
          {project.index}
        </span>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-mono text-[11px] text-signal">
                {project.index}
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-steel">
                {project.subtitle}
              </span>
            </div>
            <h3 className="font-display text-3xl font-extrabold uppercase tracking-[-0.05em] text-paper md:text-5xl">
              {project.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel md:text-base">
              {project.summary}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="border border-paper/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/70"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-signal">
            Open case
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Frame>
    </Link>
  );
}
