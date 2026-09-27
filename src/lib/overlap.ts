export type Box = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export function translateYOffset(transform: string): number {
  if (!transform || transform === "none") {
    return 0;
  }

  const body = transform.match(/matrix3d\(([^)]+)\)|matrix\(([^)]+)\)/);
  if (!body) {
    return 0;
  }

  const parts = (body[1] ?? body[2] ?? "")
    .split(",")
    .map((part) => Number(part.trim()));
  const value = body[1] ? parts[13] : parts[5];
  return Number.isFinite(value) ? value : 0;
}

export function rectsOverlap(a: Box, b: Box): boolean {
  if (a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0) {
    return false;
  }

  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}
