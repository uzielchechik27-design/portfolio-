import { skillGroups } from "@/lib/site";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/sections/Reveal";

export function Skills() {
  return (
    <section id="systems" className="scroll-mt-24 py-24 md:py-32">
      <div className="site-shell">
        <SectionHeading
          index="04"
          kicker="Stack"
          title="Systems"
          description="A compact technical index — languages, frameworks, and the systems work behind the products."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 80}>
              <div className="border border-paper/10 bg-elevated/30 p-6 md:p-8">
                <p className="eyebrow mb-6 text-signal">{group.title}</p>
                <ul className="grid grid-cols-1">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-t border-paper/10 py-3 font-display text-lg font-semibold uppercase leading-tight tracking-[-0.03em] text-paper"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
