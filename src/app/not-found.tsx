import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-end pb-24 pt-32">
      <div className="site-shell">
        <p className="eyebrow text-signal">404</p>
        <h1 className="display-title mt-4 font-display font-extrabold uppercase leading-[0.86] tracking-[-0.06em]">
          Off the map.
        </h1>
        <p className="mt-6 max-w-md text-steel">
          This route does not exist. Return to the dossier or the public
          portfolio.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/work" variant="ghost">
            Portfolio
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
