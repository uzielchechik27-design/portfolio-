import { capabilities } from "@/lib/site";

export function Marquee() {
  const row = [...capabilities, ...capabilities];

  return (
    <div className="relative border-y border-paper/10 bg-elevated/40 py-4">
      <div className="marquee-mask">
        <div className="marquee-track">
          {row.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-6 px-6 font-display text-sm font-semibold uppercase tracking-[0.28em] text-paper/55"
            >
              {item}
              <span className="text-signal">/</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
