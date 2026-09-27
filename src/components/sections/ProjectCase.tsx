import type { Project } from "@/lib/site";
import { Frame } from "@/components/ui";
import Link from "next/link";

type ProjectCaseProps = {
  project: Project;
};

export function ProjectCase({ project }: ProjectCaseProps) {
  return (
    <article className="pt-28 md:pt-36">
      <div className="site-shell pb-20">
        <p className="eyebrow mb-8">
          <Link href="/work" className="text-signal hover:text-paper">
            ← Portfolio
          </Link>
        </p>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
          {project.index} / {project.subtitle}
        </p>
        <h1 className="display-title mt-4 max-w-4xl font-display font-extrabold uppercase leading-[0.88] tracking-[-0.06em]">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          {project.summary}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li
              key={item}
              className="border border-paper/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80"
            >
              {item}
            </li>
          ))}
        </ul>

        <Frame className="mt-14 border border-paper/10 bg-elevated/40">
          <p className="eyebrow text-signal">Build notes</p>
          <ol className="mt-6 space-y-5">
            {project.notes.map((note, index) => (
              <li key={note} className="flex gap-4 text-sm leading-relaxed text-steel md:text-base">
                <span className="font-mono text-[11px] text-signal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </Frame>
      </div>
    </article>
  );
}
