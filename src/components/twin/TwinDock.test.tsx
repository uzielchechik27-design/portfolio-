import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TwinDock } from "@/components/twin/TwinDock";
import { TwinProvider } from "@/components/twin/TwinProvider";
import { twinAskTemplates, twinGreeting } from "@/lib/twin";

function sseStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`,
        ),
      );
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

describe("TwinDock", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens the twin and streams a career answer", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(sseStream("I led teams in Maglan."), {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(
      <TwinProvider>
        <TwinDock />
      </TwinProvider>,
    );

    await user.click(screen.getByRole("button", { name: /digital twin/i }));
    expect(screen.getByRole("region", { name: /digital twin/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ask uziel/i }).closest("header"),
    ).toHaveClass("shrink-0");
    expect(document.querySelector("[data-twin-thread]")).toHaveClass(
      "min-h-0",
      "flex-1",
      "overflow-y-auto",
    );
    expect(document.querySelector("[data-twin-composer]")).toHaveClass(
      "shrink-0",
      "z-10",
      "bg-ink",
    );
    expect(screen.getByLabelText(/message the digital twin/i)).toBeVisible();
    expect(screen.getByLabelText(/message the digital twin/i)).toHaveFocus();
    expect(screen.getByRole("button", { name: /send/i })).toBeVisible();
    expect(screen.getByText(twinGreeting)).toBeInTheDocument();
    expect(screen.getByText(/ask templates/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: twinAskTemplates[0]?.label }),
    ).toHaveAttribute("title", twinAskTemplates[0]?.ask);

    await user.click(
      screen.getByRole("button", { name: twinAskTemplates[0]?.label }),
    );
    expect(screen.getByLabelText(/message the digital twin/i)).toHaveValue(
      twinAskTemplates[0]?.ask ?? "",
    );

    await user.clear(screen.getByLabelText(/message the digital twin/i));
    await user.type(
      screen.getByLabelText(/message the digital twin/i),
      "Tell me about Maglan.",
    );
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(await screen.findByText("Tell me about Maglan.")).toBeInTheDocument();
    expect(
      await screen.findByText("I led teams in Maglan."),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/twin",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("renders multi-topic replies as spaced paragraphs", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          sseStream("Maglan taught ownership.\n\nChevron taught checks."),
          {
            status: 200,
            headers: { "Content-Type": "text/event-stream" },
          },
        ),
      ),
    );

    render(
      <TwinProvider>
        <TwinDock />
      </TwinProvider>,
    );

    await user.click(screen.getByRole("button", { name: /digital twin/i }));
    await user.type(
      screen.getByLabelText(/message the digital twin/i),
      "How do those jobs show up?",
    );
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(
      await screen.findByText("Maglan taught ownership."),
    ).toBeInTheDocument();
    expect(screen.getByText("Chevron taught checks.")).toBeInTheDocument();
    expect(screen.getByText("Maglan taught ownership.").tagName).toBe("P");
    expect(
      screen.getByText("Maglan taught ownership.").parentElement,
    ).toHaveClass("space-y-3");
  });
});
