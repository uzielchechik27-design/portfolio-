"use client";

import { Button } from "@/components/ui";
import { useTwin } from "@/components/twin/TwinProvider";

type TwinLaunchProps = {
  variant?: "solid" | "ghost" | "invert" | "ghostOnPaper";
  children?: React.ReactNode;
};

export function TwinLaunch({
  variant = "ghost",
  children = "Ask the twin",
}: TwinLaunchProps) {
  const { setOpen } = useTwin();

  return (
    <Button variant={variant} onClick={() => setOpen(true)}>
      {children}
    </Button>
  );
}
