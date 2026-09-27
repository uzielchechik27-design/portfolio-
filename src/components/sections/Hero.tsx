import { TwinLaunch } from "@/components/twin/TwinLaunch";
import { ButtonLink } from "@/components/ui";
import { emailHref, site, stats } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end pb-28 pt-20 md:pt-32">
      <div className="site-shell">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 md:mb-8">
          <p className="eyebrow text-signal">{site.role}</p>
          <p className="eyebrow">
            {site.location} · Junior SWE track
          </p>
        </div>

        <h1
          aria-label={site.name}
          className="hero-name font-display font-extrabold uppercase leading-[0.8] tracking-[-0.06em] text-paper"
        >
          <span className="block rise" style={{ animationDelay: "80ms" }}>
            Uziel
          </span>
          <span
            className="block rise text-paper/90"
            style={{ animationDelay: "180ms" }}
          >
            {" "}
            Chechik
          </span>
        </h1>

        <div className="mt-4 grid gap-5 border-t border-paper/10 pt-4 md:mt-8 md:gap-8 md:pt-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div className="rise" style={{ animationDelay: "280ms" }}>
            <p className="max-w-xl text-lg leading-relaxed text-paper/80 md:text-xl">
              {site.headline}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel md:text-base">
              {site.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-8">
              <ButtonLink href="/work">Selected work</ButtonLink>
              <TwinLaunch />
              <ButtonLink href={emailHref()} variant="ghost">
                {site.email}
              </ButtonLink>
            </div>
          </div>

          <div
            data-hero-stats
            className="rise grid grid-cols-[repeat(2,minmax(min-content,1fr))] gap-px border border-paper/10 bg-paper/10 lg:mr-[11rem]"
            style={{ animationDelay: "360ms" }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-fit bg-ink px-3 py-3 sm:px-4 sm:py-5">
                <p className="whitespace-nowrap font-display text-[clamp(1.15rem,3.4vw,1.85rem)] font-bold leading-none tracking-tight text-signal">
                  {stat.value}
                </p>
                <p className="mt-2 text-[11px] uppercase leading-snug tracking-[0.12em] text-steel">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
