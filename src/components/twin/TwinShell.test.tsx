import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TwinDock } from "@/components/twin/TwinDock";
import { TwinShell } from "@/components/twin/TwinShell";
import { renderWithTwin } from "@/test/render";

describe("TwinShell", () => {
  it("marks the page as shifted when the twin opens", async () => {
    const user = userEvent.setup();

    renderWithTwin(
      <>
        <TwinShell>
          <p>Portfolio</p>
        </TwinShell>
        <TwinDock />
      </>,
    );

    expect(screen.getByText("Portfolio").parentElement).toHaveAttribute(
      "data-twin-open",
      "false",
    );

    await user.click(screen.getByRole("button", { name: /digital twin/i }));

    expect(screen.getByText("Portfolio").parentElement).toHaveAttribute(
      "data-twin-open",
      "true",
    );
    expect(screen.getByRole("region", { name: /digital twin/i })).toBeInTheDocument();
  });
});
