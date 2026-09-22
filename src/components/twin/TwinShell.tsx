"use client";

import { useTwin } from "@/components/twin/TwinProvider";
import { cn } from "@/lib/utils";

export function TwinShell({ children }: { children: React.ReactNode }) {
  const { open } = useTwin();

  return (
    <div
      data-twin-open={open ? "true" : "false"}
      className={cn(
        "relative z-10 flex min-h-full flex-col transition-[padding] duration-300 ease-out",
        open && "lg:pr-[420px]",
      )}
    >
      {children}
    </div>
  );
}
