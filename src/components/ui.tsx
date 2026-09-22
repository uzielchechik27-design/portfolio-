import { cn } from "@/lib/utils";

type FrameProps = {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
};

export function Frame({ children, className, padded = true }: FrameProps) {
  return (
    <div className={cn("relative", padded && "p-6 md:p-8", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-signal"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-signal"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-signal"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-signal"
      />
      {children}
    </div>
  );
}

type SectionHeadingProps = {
  index: string;
  kicker: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  index,
  kicker,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow mb-4 flex items-center gap-3 text-signal">
          <span className="font-mono text-[11px] text-signal/80">{index}</span>
          <span className="h-px w-8 bg-signal/50" />
          {kicker}
        </p>
        <h2 className="max-w-[12ch] font-display text-4xl font-extrabold uppercase leading-[0.92] tracking-[-0.05em] text-paper md:text-6xl">
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-steel md:text-right">
          {description}
        </p>
      ) : null}
    </header>
  );
}

type ButtonVariant = "solid" | "ghost" | "invert" | "ghostOnPaper";

export function buttonClassName(
  variant: ButtonVariant = "solid",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300",
    variant === "solid" && "bg-signal text-ink hover:bg-paper hover:text-ink",
    variant === "ghost" &&
      "border border-paper/15 text-paper hover:border-signal hover:text-signal",
    variant === "invert" && "bg-ink text-paper hover:text-signal",
    variant === "ghostOnPaper" && "border border-ink/20 text-ink hover:border-ink",
    className,
  );
}

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className,
  external,
}: ButtonLinkProps) {
  const extra = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a href={href} className={buttonClassName(variant, className)} {...extra}>
      {children}
    </a>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "solid",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, className)}
      {...props}
    />
  );
}
