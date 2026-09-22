import { journey } from "@/lib/site";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/sections/Reveal";

export function Journey() {
  return (
    <section id="journey" className="scroll-mt-24 py-24 md:py-32">
      <div className="site-shell">
        <SectionHeading
          index="02"
          kicker="Career"
          title="Journey"
          description="From tactical command to safety-critical energy operations to computer science — ownership is the constant."
        />

        <ol className="relative border-l border-paper/10 md:ml-2">
          {journey.map((entry, index) => (
            <li key={entry.id} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
              <span
                aria-hidden
                className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_16px_rgba(214,255,62,0.65)]"
              />
              <Reveal delay={index * 70}>
                <article className="grid gap-4 md:grid-cols-[180px_1fr] md:gap-10">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                      {entry.period}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-steel">
                      {entry.category}
                    </p>
                  </div>
                  <div className="border border-paper/10 bg-elevated/40 p-6 transition-colors hover:border-signal/40">
                    <p className="eyebrow">{entry.organization}</p>
                    <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-[-0.04em] text-paper md:text-3xl">
                      {entry.role}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel md:text-base">
                      {entry.summary}
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
