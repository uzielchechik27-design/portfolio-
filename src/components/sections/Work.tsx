import { projects } from "@/lib/site";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/sections/Reveal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { cn } from "@/lib/utils";

type WorkProps = {
  heading?: string;
  showHeading?: boolean;
};

export function Work({
  heading = "Selected work",
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
            description="Case files for CalorieAI, Automatic Exam Solver, and Cosmetics Clinic OS."
          />
        ) : null}

        <div className="grid gap-5">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
