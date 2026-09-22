import {
  about,
  capabilities,
  journey,
  projects,
  site,
  skillGroups,
} from "@/lib/site";

export const DEFAULT_OPENROUTER_MODEL = "openai/gpt-oss-120b";
export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
export const MAX_TWIN_MESSAGES = 20;
export const MAX_TWIN_MESSAGE_CHARS = 2000;

export type TwinRole = "user" | "assistant";

export type TwinMessage = {
  role: TwinRole;
  content: string;
};

export type TwinAskTemplate = {
  id: string;
  label: string;
  hint: string;
  ask: string;
};

export const twinAskTemplates: TwinAskTemplate[] = [
  {
    id: "career",
    label: "Career",
    hint: "Maglan → Chevron → CS",
    ask: "Walk me through your path from Maglan to Chevron to computer science, and how that shapes how you work as an engineer.",
  },
  {
    id: "work",
    label: "Work",
    hint: "Three shipped systems",
    ask: "What did you ship in CalorieAI, Automatic Exam Solver, and Clinic OS — and what was your role in each?",
  },
  {
    id: "stack",
    label: "Stack",
    hint: "Java, Python, React, GenAI",
    ask: "What is your technical stack, and how have you used Java, Python, React, and GenAI in real systems?",
  },
  {
    id: "ops",
    label: "Operating style",
    hint: "Command and safety-critical work",
    ask: "How do Maglan command and Chevron safety-critical work show up in how you design and ship software?",
  },
  {
    id: "role",
    label: "Role",
    hint: "Junior SWE evaluation",
    ask: "What are you looking for in a Junior Software Engineer role, and how should a hiring manager evaluate you?",
  },
];

export const twinPrompts = twinAskTemplates.map((template) => template.ask);

export const twinGreeting =
  "Hey! I'm Uziel's Digital Twin. Think of me as a direct window into my engineering philosophy, recent full-stack systems, and work style. Ask me anything—or click one of the quick prompts below.";

export function buildTwinSystemPrompt(): string {
  const skills = skillGroups
    .map((group) => `${group.title}: ${group.items.join(", ")}`)
    .join("\n");
  const career = journey
    .map(
      (entry) =>
        `${entry.period} — ${entry.organization} — ${entry.role} (${entry.category}). ${entry.summary}`,
    )
    .join("\n");
  const work = projects
    .map(
      (project) =>
        `${project.index} ${project.title} (${project.subtitle}). Stack: ${project.stack.join(", ")}. ${project.summary} Notes: ${project.notes.join(" ")}`,
    )
    .join("\n");

  return [
    `You are the interactive digital twin of ${site.name}, an ambitious ${site.role} in ${site.location} who specializes in full-stack architectures, reliable systems, and AI-native workflows.`,
    "Always speak in first person as Uziel: I, my work, my approach. Never refer to Uziel in the third person.",
    "Sound like an authentic, sharp engineer — grounded and pragmatic, not a sales brochure. Care about system reliability, edge cases, clean design, and no quiet failures.",
    "Be conversational and direct. Keep answers to 2-4 punchy paragraphs. Use bullet points only when breaking down a technical stack or trade-offs.",
    "If the visitor sends a short casual greeting such as hey, hello, or hi, reply with a brief friendly two-sentence greeting that asks what they would like to explore. Do not dump the career background, bio, or project list.",
    "Separate multi-topic answers into distinct paragraphs with a blank line between them so each topic is readable.",
    "When asked about a project, do not just list buzzwords. Name the challenge, why that architecture, and what you learned.",
    "If asked about a domain or tool that is not in the dossier, acknowledge it candidly and explain how a core computer science foundation lets you adapt quickly.",
    "If the visitor sounds like an interviewer or recruiter, invite them to the selected-work case files and to reach out at " +
      site.email +
      ". Do not invent GitHub URLs, live demos, or repo links. If they ask for source, say public repositories attach as the portfolio archive opens.",
    "You may answer in Hebrew if the visitor writes in Hebrew. Otherwise use English.",
    "Use only the facts below. Do not invent employers, titles, dates, projects, education, or metrics. If something is not in the dossier, say you do not have that detail and offer a related fact you do have.",
    "You may discuss how command, safety-critical operations, and CS study transfer into software engineering. Do not overclaim seniority. You are seeking a full-time Junior Software Engineer role.",
    "",
    `Identity: ${site.name}. Role: ${site.role}. Location: ${site.location}.`,
    `Headline: ${site.headline}`,
    `Summary: ${site.summary}`,
    `Availability: ${site.availability}. ${site.seeking}`,
    `Email: ${site.email}. Phone: ${site.phone}.`,
    `Languages: ${site.languages.map((item) => `${item.name} (${item.level})`).join(", ")}.`,
    `About lead: ${about.lead}`,
    ...about.body,
    "",
    "Career journey:",
    career,
    "",
    "Selected systems:",
    work,
    "",
    "Capabilities index:",
    capabilities.join(", "),
    skills,
  ].join("\n");
}

export function splitTwinParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export function sanitizeTwinMessages(input: unknown): TwinMessage[] | null {
  if (!Array.isArray(input)) {
    return null;
  }

  if (input.length === 0 || input.length > MAX_TWIN_MESSAGES) {
    return null;
  }

  const messages: TwinMessage[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const record = item as { role?: unknown; content?: unknown };
    if (record.role !== "user" && record.role !== "assistant") {
      return null;
    }

    if (typeof record.content !== "string") {
      return null;
    }

    const content = record.content.trim();
    if (!content || content.length > MAX_TWIN_MESSAGE_CHARS) {
      return null;
    }

    messages.push({ role: record.role, content });
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return null;
  }

  return messages;
}

export function resolveTwinModel(envModel?: string): string {
  const model = envModel?.trim();
  return model && model.length > 0 ? model : DEFAULT_OPENROUTER_MODEL;
}

export function buildOpenRouterPayload(
  messages: TwinMessage[],
  model: string,
): {
  model: string;
  stream: true;
  messages: Array<{ role: "system" | TwinRole; content: string }>;
} {
  return {
    model,
    stream: true,
    messages: [
      { role: "system", content: buildTwinSystemPrompt() },
      ...messages,
    ],
  };
}

export function extractOpenRouterDelta(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) {
    return null;
  }

  const data = trimmed.slice(5).trim();
  if (!data || data === "[DONE]") {
    return null;
  }

  try {
    const parsed = JSON.parse(data) as {
      choices?: Array<{ delta?: { content?: string } }>;
    };
    const content = parsed.choices?.[0]?.delta?.content;
    return typeof content === "string" && content.length > 0 ? content : null;
  } catch {
    return null;
  }
}
