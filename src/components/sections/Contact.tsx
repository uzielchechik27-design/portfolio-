import { TwinLaunch } from "@/components/twin/TwinLaunch";
import { ButtonLink } from "@/components/ui";
import { emailHref, profileLinks, site } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="bg-paper text-ink">
        <div className="site-shell py-20 md:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/50">
            05 / Contact
          </p>
          <h2 className="display-title mt-5 max-w-4xl font-display font-extrabold uppercase leading-[0.88] tracking-[-0.06em]">
            Let&apos;s build the next system.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70">
            {site.seeking} Java, Python, React, and GenAI — with reliability as
            the non-negotiable.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink href={emailHref()} variant="invert">
              {site.email}
            </ButtonLink>
            <TwinLaunch variant="ghostOnPaper">Ask the twin</TwinLaunch>
            {profileLinks().map((link) => (
              <ButtonLink
                key={link.label}
                href={link.href}
                variant="ghostOnPaper"
                external
              >
                {link.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
