import { describe, expect, it } from "vitest";
import { rectsOverlap, translateYOffset } from "@/lib/overlap";

const box = {
  top: 700,
  left: 180,
  right: 370,
  bottom: 750,
  width: 190,
  height: 50,
};

describe("translateYOffset", () => {
  it("reads the vertical shift from a CSS matrix", () => {
    expect(translateYOffset("none")).toBe(0);
    expect(translateYOffset("matrix(1, 0, 0, 1, 0, 28)")).toBe(28);
    expect(
      translateYOffset("matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 12, 0, 1)"),
    ).toBe(12);
  });
});

describe("rectsOverlap", () => {
  it("detects when the twin launcher covers the hero stats", () => {
    expect(
      rectsOverlap(box, {
        top: 640,
        left: 16,
        right: 374,
        bottom: 820,
        width: 358,
        height: 180,
      }),
    ).toBe(true);
  });

  it("ignores boxes that only meet at an edge or have no area", () => {
    expect(
      rectsOverlap(box, {
        top: 750,
        left: 180,
        right: 370,
        bottom: 800,
        width: 190,
        height: 50,
      }),
    ).toBe(false);
    expect(
      rectsOverlap(
        { ...box, width: 0, height: 0 },
        {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
        },
      ),
    ).toBe(false);
  });
});
