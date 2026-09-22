import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Nav } from "@/components/layout/Nav";
import { renderWithTwin } from "@/test/render";

describe("Nav", () => {
  it("renders identity and section links", () => {
    renderWithTwin(<Nav />);

    expect(screen.getByRole("link", { name: /uziel chechik/i })).toHaveAttribute(
      "href",
      "/",
    );

    for (const [label, href] of [
      ["About", "/#about"],
      ["Journey", "/#journey"],
      ["Work", "/work"],
      ["Contact", "/#contact"],
    ] as const) {
      const links = screen.getAllByRole("link", { name: label });
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link).toHaveAttribute("href", href);
      }
    }
  });

  it("opens the mobile menu", async () => {
    const user = userEvent.setup();
    renderWithTwin(<Nav />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Mobile")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Twin" }).length).toBeGreaterThan(
      0,
    );
  });
});
