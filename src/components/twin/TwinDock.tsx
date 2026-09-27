"use client";

import { useEffect, useRef, useState } from "react";
import { Frame } from "@/components/ui";
import { useTwin } from "@/components/twin/TwinProvider";
import { rectsOverlap, translateYOffset, type Box } from "@/lib/overlap";
import {
  extractOpenRouterDelta,
  splitTwinParagraphs,
  twinAskTemplates,
  twinGreeting,
  type TwinMessage,
} from "@/lib/twin";
import { cn } from "@/lib/utils";

function restingBox(element: Element): Box {
  const rect = element.getBoundingClientRect();
  const shift = translateYOffset(getComputedStyle(element).transform);
  return {
    top: rect.top - shift,
    bottom: rect.bottom - shift,
    left: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height,
  };
}

export function TwinDock() {
  const { open, setOpen, toggle } = useTwin();
  const [messages, setMessages] = useState<TwinMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    const update = () => {
      const stats = document.querySelector("[data-hero-stats]");
      const launcher = launcherRef.current;
      if (!stats || !launcher) {
        setCovered(false);
        return;
      }

      if (!resizeObserver && typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(stats);
      }

      const next =
        window.innerWidth < 1024 &&
        rectsOverlap(launcher.getBoundingClientRect(), restingBox(stats));
      setCovered((current) => (current === next ? current : next));
    };

    update();
    const main = document.getElementById("content");
    const mutations = new MutationObserver(update);
    if (main) {
      mutations.observe(main, { childList: true });
    }
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("animationend", update);
    return () => {
      resizeObserver?.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("animationend", update);
    };
  }, []);

  useEffect(() => {
    const node = listRef.current;
    if (node && messages.length > 0) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  function loadTemplate(ask: string) {
    if (busy) {
      return;
    }

    setDraft(ask);
    setError("");
    requestAnimationFrame(() => {
      const node = inputRef.current;
      if (!node) {
        return;
      }
      node.focus();
      node.setSelectionRange(ask.length, ask.length);
    });
  }

  async function send(content: string) {
    const next = content.trim();
    if (!next || busy) {
      return;
    }

    const history: TwinMessage[] = [...messages, { role: "user", content: next }];
    setMessages(history);
    setDraft("");
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "The twin is unavailable.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let reply = "";

      setMessages([...history, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const delta = extractOpenRouterDelta(line);
          if (!delta) {
            continue;
          }
          reply += delta;
          setMessages([...history, { role: "assistant", content: reply }]);
        }
      }

      const tail = extractOpenRouterDelta(buffer);
      if (tail) {
        reply += tail;
      }

      if (!reply.trim()) {
        throw new Error("The twin returned an empty answer.");
      }

      setMessages([...history, { role: "assistant", content: reply }]);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "The twin is unavailable.";
      setError(message);
      setMessages(history);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {open ? (
        <section
          id="digital-twin"
          aria-label="Digital twin"
          className="pointer-events-auto absolute bottom-20 right-4 flex h-[min(calc(100svh-6.5rem),640px)] w-[min(calc(100vw-2rem),400px)] min-h-0 flex-col overflow-hidden border border-paper/15 bg-ink/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md lg:inset-y-0 lg:right-0 lg:bottom-auto lg:h-full lg:w-[420px] lg:border-y-0 lg:border-r-0 lg:shadow-none"
        >
          <Frame
            padded={false}
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
              <header className="flex shrink-0 items-start justify-between gap-4 border-b border-paper/10 px-5 py-4">
                <div>
                  <p className="eyebrow text-signal">Digital twin</p>
                  <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-[-0.04em]">
                    Ask Uziel
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-steel">
                    Career, systems, and how the work was built.
                  </p>
                </div>
                <button
                  type="button"
                  className="border border-paper/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70 hover:border-signal hover:text-signal"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </header>

              <div
                ref={listRef}
                data-twin-thread
                className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 pb-8"
              >
                {messages.length === 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed text-steel">
                      {twinGreeting}
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <article
                      key={`${message.role}-${index}`}
                      className={cn(
                        "max-w-[92%] text-sm leading-relaxed",
                        message.role === "user"
                          ? "ml-auto border border-signal/30 bg-signal/10 px-3 py-2 text-paper"
                          : "border border-paper/10 bg-elevated/60 px-3 py-2 text-paper/90",
                      )}
                    >
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                        {message.role === "user" ? "You" : "Twin"}
                      </p>
                      {message.content ? (
                        <div className="space-y-3">
                          {splitTwinParagraphs(message.content).map(
                            (paragraph, paragraphIndex) => (
                              <p
                                key={`${message.role}-${index}-${paragraphIndex}`}
                                className="whitespace-pre-wrap"
                              >
                                {paragraph}
                              </p>
                            ),
                          )}
                        </div>
                      ) : (
                        <p>{busy ? "…" : ""}</p>
                      )}
                    </article>
                  ))
                )}
                {error ? (
                  <p className="text-xs text-signal" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>

              <form
                data-twin-composer
                className="z-10 shrink-0 border-t border-paper/10 bg-ink p-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void send(draft);
                }}
              >
                <div className="mb-3">
                  <p className="eyebrow text-signal">Ask templates</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {twinAskTemplates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        title={template.ask}
                        disabled={busy}
                        className="border border-paper/10 px-2 py-1 text-left hover:border-signal/50 disabled:opacity-40"
                        onClick={() => loadTemplate(template.ask)}
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
                          {template.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <label className="sr-only" htmlFor="twin-input">
                  Message the digital twin
                </label>
                <textarea
                  id="twin-input"
                  ref={inputRef}
                  rows={2}
                  value={draft}
                  disabled={busy}
                  placeholder="Ask about the career, stack, or a case file."
                  className="w-full resize-none border border-paper/15 bg-ink px-3 py-2 text-sm text-paper outline-none placeholder:text-steel focus:border-signal"
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void send(draft);
                    }
                  }}
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
                    Enter to send
                  </p>
                  <button
                    type="submit"
                    disabled={busy || draft.trim().length === 0}
                    className="bg-signal px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink disabled:opacity-40"
                  >
                    {busy ? "Thinking" : "Send"}
                  </button>
                </div>
              </form>
            </Frame>
        </section>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls="digital-twin"
        aria-hidden={covered && !open}
        tabIndex={covered && !open ? -1 : 0}
        onClick={toggle}
        className={cn(
          "pointer-events-auto absolute bottom-4 right-4 z-20 flex items-center gap-3 border border-signal/50 bg-ink px-4 py-3 text-paper shadow-[0_0_24px_rgba(214,255,62,0.16)] hover:border-signal hover:text-signal lg:bottom-6 lg:right-6",
          open && "lg:right-[440px]",
          covered && !open && "max-lg:invisible max-lg:pointer-events-none",
        )}
      >
        <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_rgba(214,255,62,0.9)]" />
        <span className="font-display text-sm font-bold uppercase tracking-[0.16em]">
          {open ? "Close twin" : "Digital twin"}
        </span>
      </button>
    </div>
  );
}
