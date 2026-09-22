import { about, site } from "@/lib/site";
import { Frame, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/sections/Reveal";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-32">
      <div className="site-shell">
        <SectionHeading
          index="01"
          kicker={about.kicker}
          title={about.title}
          description="A dual operating system: command under pressure, and software that does not blink."
        />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <Reveal>
            <Frame className="border border-paper/10 bg-elevated/50">
              <p className="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-paper md:text-4xl">
                {about.lead}
              </p>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-steel">
                {about.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Frame>
          </Reveal>

          <div className="grid gap-4">
            <Reveal delay={80}>
              <Frame className="h-full border border-paper/10 bg-ink">
                <p className="eyebrow text-signal">Now</p>
                <p className="mt-4 font-display text-2xl font-bold uppercase leading-tight tracking-[-0.04em]">
                  B.Sc. Computer Science
                </p>
                <p className="mt-3 text-sm leading-relaxed text-steel">
                  Open University of Israel · 2022–2027
                </p>
              </Frame>
            </Reveal>
            <Reveal delay={140}>
              <Frame className="h-full border border-paper/10 bg-ink">
                <p className="eyebrow text-signal">Languages</p>
                <ul className="mt-5 space-y-3">
                  {site.languages.map((language) => (
                    <li
                      key={language.name}
                      className="flex items-center justify-between border-b border-paper/10 pb-3 text-sm"
                    >
                      <span className="text-paper">{language.name}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                        {language.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </Frame>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
