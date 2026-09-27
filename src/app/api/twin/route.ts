import { clientAddress, takeRateLimit } from "@/lib/rate-limit";
import { resolveSiteUrl } from "@/lib/site-url";
import {
  OPENROUTER_URL,
  buildOpenRouterPayload,
  resolveTwinModel,
  sanitizeTwinMessages,
  toAnswerOnlyStream,
} from "@/lib/twin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "Digital twin is offline." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = sanitizeTwinMessages(
    body && typeof body === "object" && "messages" in body
      ? (body as { messages: unknown }).messages
      : null,
  );

  if (!messages) {
    return Response.json({ error: "Ask a career question." }, { status: 400 });
  }

  const limit = takeRateLimit(clientAddress(request));
  if (!limit.allowed) {
    return Response.json(
      { error: "Too many questions. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const payload = buildOpenRouterPayload(
    messages,
    resolveTwinModel(process.env.OPENROUTER_MODEL),
  );

  let upstream: Response;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
        "X-Title": "Uziel Chechik Digital Twin",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return Response.json(
      { error: "The twin could not reach the model." },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    return Response.json(
      { error: "The twin could not reach the model." },
      { status: 502 },
    );
  }

  return new Response(toAnswerOnlyStream(upstream.body), {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
