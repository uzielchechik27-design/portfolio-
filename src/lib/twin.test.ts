import { describe, expect, it } from "vitest";
import {
  DEFAULT_OPENROUTER_MODEL,
  MAX_TWIN_MESSAGES,
  buildOpenRouterPayload,
  buildTwinSystemPrompt,
  extractOpenRouterDelta,
  resolveTwinModel,
  sanitizeTwinMessages,
  splitTwinParagraphs,
  twinAskTemplates,
  twinGreeting,
  twinPrompts,
} from "@/lib/twin";

describe("digital twin dossier", () => {
  it("exposes labeled ask templates for the career dossier", () => {
    expect(twinAskTemplates.map((template) => template.id)).toEqual([
      "career",
      "work",
      "stack",
      "ops",
      "role",
    ]);
    expect(twinPrompts).toEqual(
      twinAskTemplates.map((template) => template.ask),
    );
    expect(
      twinAskTemplates.every(
        (template) => template.hint.length > 0 && template.ask.length > 20,
      ),
    ).toBe(true);
    expect(twinAskTemplates.some((template) => template.ask.includes("Maglan"))).toBe(
      true,
    );
    expect(
      twinAskTemplates.some((template) => template.ask.includes("CalorieAI")),
    ).toBe(true);
  });

  it("starts the twin with the first-person welcome greeting", () => {
    expect(twinGreeting.startsWith("Hey!")).toBe(true);
    expect(twinGreeting).toContain("Uziel's Digital Twin");
    expect(twinGreeting).toContain("quick prompts");
    expect(twinGreeting).not.toMatch(/\bUziel is\b/);
  });

  it("grounds the system prompt in the public career file", () => {
    const prompt = buildTwinSystemPrompt();

    expect(prompt).toContain("Uziel Chechik");
    expect(prompt).toContain("Maglan");
    expect(prompt).toContain("Chevron Israel");
    expect(prompt).toContain("Open University of Israel");
    expect(prompt).toContain("CalorieAI");
    expect(prompt).toContain("Automatic Exam Solver");
    expect(prompt).toContain("Cosmetics Clinic OS");
    expect(prompt).toContain("Uzielchechik27@gmail.com");
    expect(prompt).toContain("Do not invent");
  });

  it("locks the twin to a first-person engineer persona", () => {
    const prompt = buildTwinSystemPrompt();

    expect(prompt).toContain("Always speak in first person as Uziel");
    expect(prompt).toContain("Never refer to Uziel in the third person");
    expect(prompt).toContain("not a sales brochure");
    expect(prompt).toContain("2-4 punchy paragraphs");
    expect(prompt).toContain("why that architecture");
    expect(prompt).toContain("acknowledge it candidly");
    expect(prompt).toContain("Uzielchechik27@gmail.com");
    expect(prompt).toContain("Do not invent GitHub URLs");
    expect(prompt).toContain("short casual greeting");
    expect(prompt).toContain("two-sentence greeting");
    expect(prompt).toContain("blank line between them");
  });

  it("splits multi-topic twin answers into readable paragraphs", () => {
    expect(
      splitTwinParagraphs(
        "Maglan taught ownership.\n\nChevron taught checks before you ship.\n\n",
      ),
    ).toEqual([
      "Maglan taught ownership.",
      "Chevron taught checks before you ship.",
    ]);
    expect(splitTwinParagraphs("   ")).toEqual([]);
    expect(splitTwinParagraphs("One block.")).toEqual(["One block."]);
  });

  it("sanitizes a valid conversation that ends with the visitor", () => {
    expect(
      sanitizeTwinMessages([
        { role: "user", content: "What did you build?" },
        { role: "assistant", content: "CalorieAI and two other systems." },
        { role: "user", content: "Tell me about Maglan." },
      ]),
    ).toEqual([
      { role: "user", content: "What did you build?" },
      { role: "assistant", content: "CalorieAI and two other systems." },
      { role: "user", content: "Tell me about Maglan." },
    ]);
  });

  it("rejects empty, oversized, or malformed transcripts", () => {
    expect(sanitizeTwinMessages([])).toBeNull();
    expect(sanitizeTwinMessages([{ role: "assistant", content: "Hi" }])).toBeNull();
    expect(sanitizeTwinMessages([{ role: "system", content: "Nope" }])).toBeNull();
    expect(sanitizeTwinMessages([{ role: "user", content: "   " }])).toBeNull();
    expect(
      sanitizeTwinMessages(
        Array.from({ length: MAX_TWIN_MESSAGES + 1 }, () => ({
          role: "user",
          content: "Too many",
        })),
      ),
    ).toBeNull();
  });

  it("resolves the OpenRouter model and builds a streaming payload", () => {
    expect(DEFAULT_OPENROUTER_MODEL).toBe("openai/gpt-oss-120b");
    expect(resolveTwinModel(undefined)).toBe(DEFAULT_OPENROUTER_MODEL);
    expect(resolveTwinModel("  ")).toBe(DEFAULT_OPENROUTER_MODEL);
    expect(resolveTwinModel("openai/gpt-oss-120b")).toBe("openai/gpt-oss-120b");

    const payload = buildOpenRouterPayload(
      [{ role: "user", content: "Career path?" }],
      "openai/gpt-oss-120b",
    );

    expect(payload.stream).toBe(true);
    expect(payload.model).toBe("openai/gpt-oss-120b");
    expect(payload.messages[0]?.role).toBe("system");
    expect(payload.messages[1]).toEqual({
      role: "user",
      content: "Career path?",
    });
  });

  it("extracts streamed OpenRouter text deltas", () => {
    expect(extractOpenRouterDelta("data: [DONE]")).toBeNull();
    expect(
      extractOpenRouterDelta(
        `data: ${JSON.stringify({ choices: [{ delta: { content: "Maglan" } }] })}`,
      ),
    ).toBe("Maglan");
  });
});
