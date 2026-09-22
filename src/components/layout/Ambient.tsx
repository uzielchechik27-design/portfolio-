"use client";

import { useEffect, useState } from "react";

export function Ambient() {
  const [pos, setPos] = useState({ x: 50, y: 20 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setPos({ x, y });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
      style={{
        background: `radial-gradient(640px circle at ${pos.x}% ${pos.y}%, rgba(214, 255, 62, 0.07), transparent 55%)`,
      }}
    />
  );
}
