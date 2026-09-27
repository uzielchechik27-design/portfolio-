import { afterEach, describe, expect, it, vi } from "vitest";
import { TWIN_RATE_LIMIT } from "@/lib/rate-limit";
import { DEFAULT_SITE_URL } from "@/lib/site-url";
import { MAX_TWIN_OUTPUT_TOKENS, OPENROUTER_URL } from "@/lib/twin";

const originalFetch = globalThis.fetch;
const originalKey = process.env.OPENROUTER_API_KEY;
const originalModel = process.env.OPENROUTER_MODEL;
const originalSite = process.env.NEXT_PUBLIC_SITE_URL;

async function loadPost() {
  const route = await import("./route");
  return route.POST;
}

function question(ip = "203.0.113.10") {
  return new Request("http://localhost/api/twin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "What is CalorieAI?" }],
    }),
  });
}

function answerStream() {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            provider: "DeepInfra",
            choices: [
              {
                delta: {
                  reasoning: "private chain of thought",
                  content: "CalorieAI is a vision project.",
                },
              },
            ],
          })}\n\n`,
        ),
      );
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

describe("POST /api/twin", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) {
      delete process.env.OPENROUTER_API_KEY;
    } else {
      process.env.OPENROUTER_API_KEY = originalKey;
    }
    if (originalModel === undefined) {
      delete process.env.OPENROUTER_MODEL;
    } else {
      process.env.OPENROUTER_MODEL = originalModel;
    }
    if (originalSite === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSite;
    }
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
    const response = await POST(question());

    expect(response.status).toBe(503);
  });

  it("proxies a grounded chat request and streams only the answer", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "openai/gpt-oss-120b";
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(answerStream(), {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    const POST = await loadPost();
    const response = await POST(question());
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/event-stream");
    expect(body).toContain("CalorieAI is a vision project.");
    expect(body).not.toContain("private chain of thought");
    expect(body).not.toContain("DeepInfra");
    expect(body).not.toContain("reasoning");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(OPENROUTER_URL);
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer test-key");
    expect(headers["HTTP-Referer"]).toBe(DEFAULT_SITE_URL);

    const payload = JSON.parse(String(init.body)) as {
      model: string;
      stream: boolean;
      max_tokens: number;
      messages: Array<{ role: string; content: string }>;
    };
    expect(payload.model).toBe("openai/gpt-oss-120b");
    expect(payload.stream).toBe(true);
    expect(payload.max_tokens).toBe(MAX_TWIN_OUTPUT_TOKENS);
    expect(payload.messages[0]?.role).toBe("system");
    expect(payload.messages[0]?.content).toContain("CalorieAI");
    expect(payload.messages.at(-1)).toEqual({
      role: "user",
      content: "What is CalorieAI?",
    });
  });

  it("sends the configured site URL as the OpenRouter referer", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000/portfolio";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(answerStream(), { status: 200 }),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    const POST = await loadPost();
    await POST(question("203.0.113.20"));

    const headers = (fetchMock.mock.calls[0] as [string, RequestInit])[1]
      .headers as Record<string, string>;
    expect(headers["HTTP-Referer"]).toBe("http://localhost:3000");
  });

  it("rate limits repeated questions from the same IP", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Response(answerStream(), {
          status: 200,
        }),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    const POST = await loadPost();
    for (let index = 0; index < TWIN_RATE_LIMIT; index += 1) {
      const response = await POST(question("198.51.100.8"));
      expect(response.status).toBe(200);
      await response.text();
    }

    const blocked = await POST(question("198.51.100.8"));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    await expect(blocked.json()).resolves.toEqual({
      error: "Too many questions. Try again shortly.",
    });
    expect(fetchMock).toHaveBeenCalledTimes(TWIN_RATE_LIMIT);

    const other = await POST(question("198.51.100.9"));
    expect(other.status).toBe(200);
  });

  it("returns a gateway error when OpenRouter cannot be reached", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network")) as typeof fetch;

    const POST = await loadPost();
    const response = await POST(question("198.51.100.14"));

    expect(response.status).toBe(502);
  });
});
