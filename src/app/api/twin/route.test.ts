import { afterEach, describe, expect, it, vi } from "vitest";
import { OPENROUTER_URL } from "@/lib/twin";

const originalFetch = globalThis.fetch;
const originalKey = process.env.OPENROUTER_API_KEY;
const originalModel = process.env.OPENROUTER_MODEL;

async function loadPost() {
  const route = await import("./route");
  return route.POST;
}

describe("POST /api/twin", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.OPENROUTER_API_KEY = originalKey;
    process.env.OPENROUTER_MODEL = originalModel;
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("rejects a transcript that is not a visitor question", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    const POST = await loadPost();
    const response = await POST(
      new Request("http://localhost/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Ask a career question.",
    });
  });

  it("returns offline when the server key is missing", async () => {
    delete process.env.OPENROUTER_API_KEY;
    const POST = await loadPost();
    const response = await POST(
      new Request("http://localhost/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "What is CalorieAI?" }],
        }),
      }),
    );

    expect(response.status).toBe(503);
  });

  it("proxies a grounded chat request to OpenRouter", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "openai/gpt-oss-120b";

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("data: ok\n\n"));
        controller.close();
      },
    });

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(stream, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    const POST = await loadPost();
    const response = await POST(
      new Request("http://localhost/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "What is CalorieAI?" }],
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/event-stream");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(OPENROUTER_URL);
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer test-key",
    );

    const payload = JSON.parse(String(init.body)) as {
      model: string;
      stream: boolean;
      messages: Array<{ role: string; content: string }>;
    };
    expect(payload.model).toBe("openai/gpt-oss-120b");
    expect(payload.stream).toBe(true);
    expect(payload.messages[0]?.role).toBe("system");
    expect(payload.messages[0]?.content).toContain("CalorieAI");
    expect(payload.messages.at(-1)).toEqual({
      role: "user",
      content: "What is CalorieAI?",
    });
  });
});
