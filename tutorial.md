# A beginner’s walkthrough of this portfolio site

This tutorial explains the professional website we built for **Uziel Chechik**, in language a complete beginner can follow.

You do not need to already know React, Next.js, or TypeScript. Each new word is defined the first time it appears. The goal is not “copy these files.” The goal is to understand **what the site is**, **which tools it uses**, **how a click becomes a page or a chat reply**, and **how the important files actually work**.

By the end you should be able to:

- start the site on your computer
- point to the file that holds career facts
- explain why the Digital Twin chat talks in first person
- see why the chat box stays visible at the bottom of the sidebar
- run the health-check script and know what each step proves

---

## 1. What we built, in plain English

This project is a **local professional website**: a dark, high-contrast portfolio you open in a browser at `http://localhost:3000`.

It has three jobs.

1. **Tell the story.** A landing page covers who Uziel is, the career path (Maglan → Chevron → Computer Science), three shipped systems, the technical stack, and how to get in touch.
2. **Hold space for a future portfolio.** A `/work` page lists case files today. Live demos and public repositories can be attached later without redesigning the site.
3. **Answer career questions.** A **Digital Twin** is a chat panel that speaks as Uziel. It only knows facts from this project’s own content file. It does not invent GitHub links, job titles, or metrics.

The visual idea is *enterprise meets edgy*: black background, bone-colored text, acid-lime accents, big display type, thin grid lines, and a grain overlay. It should feel like a serious engineer’s site, not a default template.

---

## 2. Technology summary

Think of the stack as layers. Each layer solves one kind of problem.

| Layer | Tool | What it is, in one sentence |
| --- | --- | --- |
| Language | **TypeScript** | JavaScript with types, so the computer can catch “this should be a string” mistakes before the site runs. |
| UI library | **React 19** | A way to build the screen from reusable pieces called **components**. |
| Framework | **Next.js 16** (App Router) | A React toolkit that handles pages, URLs, fonts, and server-side API routes. |
| Styling | **Tailwind CSS v4** | You style elements by writing small class names such as `flex`, `pb-8`, or `text-signal`. |
| Tests | **Vitest** + **Testing Library** | Automated checks that click buttons and assert “this text appeared.” |
| AI chat | **OpenRouter** | A server-side API we call so a language model can answer questions. The secret key never goes to the browser. |
| Verification | **Node script** (`scripts/health-check.mjs`) | One command that typechecks, tests, builds, and pings the twin API. |

### Words you will see often

- **Component** — a function that returns HTML-like markup (JSX). `Hero` is a component. `TwinDock` is a component.
- **Page** — a special file Next.js turns into a URL. `src/app/page.tsx` is `/`. `src/app/work/page.tsx` is `/work`.
- **Layout** — the chrome around every page: fonts, nav, footer, twin panel.
- **Client component** — a React component that can use clicks, state, and the browser. It starts with `"use client"`.
- **Server component / route** — code that runs on the computer serving the site, not in the visitor’s browser. The twin API is a server route.
- **State** — values React remembers between renders, such as “is the twin open?” or “what did the user type?”
- **Props** — inputs you pass into a component, like a project object into `ProjectCase`.
- **API route** — a URL that returns data instead of a full page. Ours is `POST /api/twin`.
- **Streaming** — the model’s answer arrives in small chunks, so the twin can type live instead of waiting for the whole paragraph.
- **Environment variable** — a secret or setting kept in `.env`, not in the source code. `OPENROUTER_API_KEY` is one.

### Why this combination

A static HTML file could show About and Journey. We needed more:

- **typed content** so career facts live in one place
- **routes** for `/work` and `/work/calorie-ai`
- **a secret-keeping server** so the OpenRouter key is never shipped to the browser
- **tests** so layout and chat rules do not silently break

Next.js gives us pages *and* a tiny backend in the same project.

---

## 3. How to run it on your machine

From the project folder:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm test              # run the automated tests
npx tsc --noEmit      # typecheck without building
npm run build         # production build
npm run check         # typecheck + tests + build + ping the twin
```

For the Digital Twin and for `npm run check`’s last step you need a `.env` file in the project root (that file is git-ignored):

```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-oss-120b
```

The health-check ping expects the **dev server to already be running** on port 3000.

---

## 4. High-level walkthrough

### 4.1 Opening the homepage

1. The browser asks Next.js for `/`.
2. Next.js wraps the homepage in `src/app/layout.tsx`: fonts, skip-link, grain, nav, footer, and the twin shell.
3. `src/app/page.tsx` stacks sections: Hero, Marquee, About, Journey, Work, Skills, Contact.
4. Those sections **do not invent copy**. They read from `src/lib/site.ts`.

```
Browser  →  layout.tsx (shell)
                └── page.tsx (home)
                      ├── Hero
                      ├── About
                      ├── Journey
                      ├── Work
                      └── …
                └── TwinDock (chat overlay)
```

### 4.2 Opening a case file

`/work` is a real page. `/work/calorie-ai` is a **dynamic route**: the `[slug]` folder means “whatever name comes after `/work/`.”

Next.js looks up that slug in the `projects` list. If it exists, `ProjectCase` renders it. If not, `not-found.tsx` shows a 404.

### 4.3 Asking the Digital Twin

This is the most important flow in the project.

1. The visitor clicks **Digital twin**.
2. `TwinProvider` flips `open` to `true`.
3. `TwinDock` shows a sidebar: header, message list, templates, textarea, Send.
4. The visitor types (or clicks a template) and hits Send.
5. The **browser** POSTs JSON to `/api/twin`. It never sees the OpenRouter key.
6. The **server** checks the key, sanitizes the messages, attaches a long system prompt built from `site.ts`, and streams OpenRouter’s answer back.
7. `TwinDock` reads the stream line by line and grows the last assistant bubble.

```
You type “hey”
    → TwinDock send()
    → POST /api/twin  { messages: [{ role: "user", content: "hey" }] }
    → route.ts sanitizes + builds system prompt
    → OpenRouter streams tokens
    → TwinDock appends text into the Twin bubble
```

That is why a short greeting can reply with two friendly sentences instead of the full bio: the **system prompt** tells the model how to pace itself.

### 4.4 Why the input used to disappear

The sidebar is a tall column: header + messages + form. If the message list is allowed to grow to its full content height, it shoves the textarea **below the visible panel**. `overflow-hidden` then clips it, so Send looks “missing.”

The fix is a classic flexbox pattern:

- header: `shrink-0` (never compress, stay at the top)
- messages: `flex-1 min-h-0 overflow-y-auto` (take leftover space and scroll)
- form: `shrink-0` (never compress, stay at the bottom)

`min-h-0` is the unintuitive part. In a flex column, children default to `min-height: auto`, which means “at least as tall as my content.” Without `min-h-0`, the list refuses to shrink, and the composer falls off the screen.

---

## 5. Map of the repository

You can ignore `node_modules` (downloaded packages) and `.next` (build cache).

```
src/
  app/
    layout.tsx              # site chrome + fonts + TwinProvider
    page.tsx                # homepage sections
    globals.css             # colors, fonts, grain, grid
    not-found.tsx           # 404
    work/page.tsx           # portfolio index
    work/[slug]/page.tsx    # one case file
    api/twin/route.ts       # POST /api/twin
  components/
    ui.tsx                  # Frame, buttons, headings
    layout/                 # Nav, Footer, atmosphere
    sections/               # Hero, About, Journey, Work, …
    twin/                   # TwinProvider, TwinDock, TwinShell
  lib/
    site.ts                 # all career/content facts
    twin.ts                 # prompt, templates, sanitization
    utils.ts                # cn() class helper
  test/                     # test setup and render helper
scripts/
  health-check.mjs          # npm run check
docs/
  Uziel Chechik.md          # source resume
```

Tests live next to the code they cover, for example `TwinDock.test.tsx` beside `TwinDock.tsx`.

---

## 6. Detailed code review

### 6.1 One content file is the source of truth

Beginners often paste the same bio into five components. That creates drift: the hero says one thing, About says another.

We put identity, nav, journey, projects, and skills in `src/lib/site.ts`:

```ts
export const site = {
  name: "Uziel Chechik",
  role: "Software Engineer",
  location: "Israel",
  headline: "Reliable systems. AI-native workflows. No quiet failures.",
  email: "Uzielchechik27@gmail.com",
  phone: "+972-54-817-3779",
  seeking: "Seeking a full-time Junior Software Engineer position.",
} as const;
```

`as const` tells TypeScript: these strings are literal values, not just “some string.” If a component expects `site.email` and you rename the field, the typechecker complains.

Projects are data, not pages copied by hand:

```ts
{
  slug: "calorie-ai",
  index: "01",
  title: "CalorieAI",
  subtitle: "AI-native nutrition platform",
  stack: ["React", "Python", "FastAPI", "Google Gemini"],
  summary:
    "A complete FastAPI and React product that turns raw food photos into structured nutritional data through a real-time vision pipeline.",
}
```

The Digital Twin’s system prompt **reads this same file**. The chat cannot honestly claim a fourth employer, because that employer is not in `site.ts`.

### 6.2 Next.js App Router: layout, then page

`src/app/layout.tsx` is the outer frame of every URL.

```tsx
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink font-sans text-paper">
        <TwinProvider>
          <TwinShell>
            <Nav />
            <main id="content" className="flex-1">
              {children}
            </main>
            <Footer />
          </TwinShell>
          <TwinDock />
        </TwinProvider>
      </body>
    </html>
  );
}
```

Things to notice:

- **Fonts** come from `next/font/google`. Next.js downloads them at build time so the site does not flash a fallback font, then jump.
- **`children`** is whichever page you are on. Home injects the section stack. `/work` injects the portfolio.
- **`TwinProvider`** wraps both the page and `TwinDock`, so the nav “Twin” button and the floating “Digital twin” button share one open/closed switch.
- A **skip link** jumps keyboard users to `#content`. It sits off-screen until focused.

The homepage itself is almost a table of contents:

```tsx
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Journey />
      <Work />
      <Skills />
      <Contact />
    </>
  );
}
```

The empty `<>...</>` is a **React fragment**. It groups elements without adding an extra `<div>` that would break the layout.

### 6.3 Dynamic routes for case files

`src/app/work/[slug]/page.tsx` turns each project slug into a URL.

```tsx
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectCase project={project} />
      <Contact />
    </>
  );
}
```

`generateStaticParams` says: “at build time, make `/work/calorie-ai`, `/work/exam-solver`, and `/work/clinic-os`.” Unknown slugs call `notFound()`.

In current Next.js, `params` is a **Promise**. That is why the page is `async` and we `await params`.

### 6.4 Design tokens instead of magic colors

`src/app/globals.css` names the palette:

```css
:root {
  --ink: #050506;
  --elevated: #0d0d10;
  --paper: #f1ece3;
  --steel: #c6c1b8;
  --signal: #d6ff3e;
}
```

Tailwind then exposes them as classes: `bg-ink`, `text-paper`, `text-steel`, `text-signal`. If you want the lime to be slightly cooler, you change **one variable**, not fifty components.

`cn()` in `src/lib/utils.ts` is a tiny helper that joins class names and drops falsey ones:

```ts
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
```

That lets Twin bubbles pick a style based on role:

```tsx
className={cn(
  "max-w-[92%] text-sm leading-relaxed",
  message.role === "user"
    ? "ml-auto border border-signal/30 bg-signal/10 px-3 py-2 text-paper"
    : "border border-paper/10 bg-elevated/60 px-3 py-2 text-paper/90",
)}
```

Your messages sit on the right. Twin messages sit on the left. Same component, different classes.

### 6.5 Shared open state: TwinProvider

The twin can be opened from the nav, the hero, the contact block, or the floating button. If each button had its own `useState(false)`, they would disagree.

`TwinProvider` is a **React context**: a radio station that any child can tune into.

```tsx
"use client";

const TwinContext = createContext<TwinContextValue | null>(null);

export function TwinProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((current) => !current),
    }),
    [open],
  );

  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>;
}

export function useTwin(): TwinContextValue {
  const context = useContext(TwinContext);
  if (!context) {
    throw new Error("useTwin requires TwinProvider");
  }
  return context;
}
```

`"use client"` is required because `useState` is a browser hook.

`useTwin()` throws if you forget the provider. That is a **fail-fast** design: the bug shows up immediately in development instead of as a silent “button does nothing.”

`TwinShell` listens to the same context and adds right padding on large screens so the page does not sit under the 420px rail:

```tsx
open && "lg:pr-[420px]"
```

`lg:` means “only from the large breakpoint (1024px) up.” Below that, the twin is a floating card, not a full-height rail.

### 6.6 TwinDock: chat UI and the flex lesson

`TwinDock` is a **client component**. It owns:

- the transcript (`messages`)
- the draft textarea (`draft`)
- whether a request is in flight (`busy`)
- an error string
- refs to the scroll list and the textarea

When the panel opens, it focuses the textarea. Escape closes it. Enter sends (Shift+Enter would still be a newline, but we intercept Enter).

The layout that keeps Send on screen:

```tsx
<section className="… flex … min-h-0 flex-col overflow-hidden …">
  <header className="flex shrink-0 …">Ask Uziel</header>

  <div
    ref={listRef}
    data-twin-thread
    className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 pb-8"
  >
    {/* greeting or bubbles */}
  </div>

  <form
    data-twin-composer
    className="z-10 shrink-0 border-t border-paper/10 bg-ink p-4"
  >
    {/* templates, textarea, Send */}
  </form>
</section>
```

Ask templates are compact chips. Clicking one **fills** the textarea; it does not auto-send. That lets you edit the question first.

On desktop, the floating “Close twin” control shifts left (`lg:right-[440px]`) so it does not sit on top of Send.

### 6.7 Sending a message and reading a stream

The browser side of chat looks like this (simplified from `TwinDock`):

```tsx
async function send(content: string) {
  const next = content.trim();
  if (!next || busy) {
    return;
  }

  const history: TwinMessage[] = [...messages, { role: "user", content: next }];
  setMessages(history);
  setDraft("");
  setBusy(true);

  const response = await fetch("/api/twin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history }),
  });

  const reader = response.body.getReader();
  // decode SSE lines, append deltas onto the last assistant message
}
```

**SSE** means Server-Sent Events: lines that look like `data: {"choices":[{"delta":{"content":"Hey"}}]}`.

`extractOpenRouterDelta` pulls the next word out of one line. Empty lines and `data: [DONE]` are ignored.

Assistant text is split on blank lines so multi-topic answers become separate `<p>` tags with `space-y-3` between them:

```ts
export function splitTwinParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
```

That is a **presentation** helper. The model is also instructed to put a blank line between topics. UI and prompt work together.

### 6.8 The API route: keep secrets on the server

`src/app/api/twin/route.ts` is not a page. Exporting `POST` tells Next.js: “when someone POSTs `/api/twin`, run this function.”

```ts
export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "Digital twin is offline." }, { status: 503 });
  }

  const body = await request.json();
  const messages = sanitizeTwinMessages(
    body && typeof body === "object" && "messages" in body
      ? (body as { messages: unknown }).messages
      : null,
  );

  if (!messages) {
    return Response.json({ error: "Ask a career question." }, { status: 400 });
  }

  const upstream = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return new Response(upstream.body, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

Status codes, in beginner terms:

| Code | Meaning here |
| --- | --- |
| **200** | Key is present, payload is valid, OpenRouter started streaming. |
| **400** | Body was not JSON, or `messages` failed sanitization (this was the old health-check bug). |
| **502** | OpenRouter refused or returned an empty body. |
| **503** | No `OPENROUTER_API_KEY` on the server. |

The route **never** sends the key to the browser. View Source and DevTools cannot steal it. That is the whole reason this is a server route and not a `fetch` from `TwinDock` straight to OpenRouter.

### 6.9 Sanitization: do not trust the client

Anyone can POST to `/api/twin` with curl. We do not trust that the body is a polite chat.

`sanitizeTwinMessages` requires:

- an array
- 1 to 20 messages
- each `role` is `"user"` or `"assistant"`
- each `content` is a non-empty string up to 2000 characters
- the **last** message is from the user (you cannot ask the model to continue as if the visitor had spoken)

Invalid input becomes `null`, and the route answers 400.

The health-check originally sent `{}`. There is no `messages` field, so sanitization failed. The correct ping body is the same shape the UI sends:

```js
export const TWIN_PING_BODY = {
  messages: [{ role: "user", content: "hey" }],
};
```

That is a legal transcript: one user turn, non-empty content. The live route then returns **200** (and starts a real model stream).

### 6.10 The system prompt: personality is code

The twin is not “ChatGPT with a name.” `buildTwinSystemPrompt()` writes instructions plus the dossier.

Important rules baked in:

- speak in **first person** as Uziel
- 2–4 punchy paragraphs
- a short “hey” / “hello” / “hi” gets a **two-sentence** greeting, not the full bio
- blank lines between topics
- never invent GitHub URLs or live demos
- use only facts from `site.ts`
- Hebrew if the visitor writes Hebrew
- junior SWE — do not overclaim seniority

That is why product copy and chat answers stay aligned. Change a project note in `site.ts`, and both the Work page and the twin see it.

### 6.11 Hero: accessibility and overflow

The giant name is split across two visual lines, so we set an explicit accessible name:

```tsx
<h1 aria-label={site.name} className="hero-name …">
  <span className="block rise">Uziel</span>
  <span className="block rise text-paper/90"> Chechik</span>
</h1>
```

Screen readers hear “Uziel Chechik,” not a smashed-together word.

The stats grid uses `minmax(min-content, 1fr)` and `whitespace-nowrap` so labels like “Chevron offshore security” do not clip on medium widths. `lg:mr-[11rem]` leaves room for the twin rail.

### 6.12 Health check: one command, four proofs

`package.json` adds:

```json
"check": "node scripts/health-check.mjs"
```

The script runs, in order:

1. `npx tsc --noEmit` — types are honest
2. `npm test -- --run` — unit tests pass
3. `npm run build` — Next.js can produce a production build
4. `POST http://localhost:3000/api/twin` with the valid `{ messages: [...] }` body — the live route returns 200

Helpers are exported so Vitest can mock `spawn` and `fetch`. The script only auto-runs when you execute the file directly (`node scripts/health-check.mjs`), not when tests import it.

---

## 7. How testing fits in (still for beginners)

A **unit test** is a tiny program that pretends to be a user.

Example, in spirit: open the twin, type a question, click Send, and expect the assistant text to appear. `TwinDock.test.tsx` fakes `fetch` so tests do not call the real paid API.

Other tests check:

- empty `messages` → 400 from the route
- missing API key → 503
- a valid POST → OpenRouter is called with the system prompt and `openai/gpt-oss-120b`
- multi-topic replies render as separate paragraphs
- the health-check payload is `{ messages: [{ role: "user", content: "hey" }] }`
- `npm run check` is wired in `package.json`

You run them with `npm test`. If you change sanitization and forget the “last message must be user” rule, a test should fail before a recruiter does.

---

## 8. A picture of the Digital Twin request

```json
{
  "messages": [
    { "role": "user", "content": "hey" }
  ]
}
```

That single object is the contract:

- **key:** `messages` (plural), not `message` or `prompt`
- **item shape:** `{ role, content }`
- **roles allowed:** `user` | `assistant`
- **last role:** `user`

The server then wraps those turns with a `system` message and `stream: true` before calling OpenRouter. You never send the system prompt from the browser. If you did, a visitor could replace it and make the twin say anything.

---

## 9. Five ways this code could be improved

These come from a self-review of the current tree, not from a wish list of new features.

### 1. Give the health check a free heartbeat

The ping now sends a valid chat payload, so it returns 200. That also **starts a real OpenRouter completion**. Every `npm run check` can spend tokens and depend on a live model.

A better design is a dedicated `GET /api/twin` (or `/api/health`) that only checks “the route is mounted and the key is present,” and keeps the paid POST for real questions. The check script would stay fast, cheap, and CI-friendly.

### 2. Protect the twin route

Anyone who can reach your machine (or a future public deploy) can POST in a loop and burn the key. The route has no rate limit, no timeout, and no abort if the visitor closes the panel.

Add a per-IP rate limit, a server timeout around the upstream `fetch`, and an `AbortController` in `TwinDock` so closing the sidebar cancels an in-flight stream.

### 3. Lift chat state out of `TwinDock`

`open` lives in `TwinProvider`, but `messages` live inside `TwinDock`. If that component remounts (some navigations, Fast Refresh, or a future split), the transcript vanishes.

Move `messages` / `send` into the provider (or a small `useTwinChat` hook). Then `/` and `/work` share one conversation, and you can add “clear chat” in one place.

### 4. Split the dock and improve accessibility

`TwinDock.tsx` is doing layout, streaming, keyboard handling, and rendering. That makes it hard to test one concern at a time.

Split **header**, **thread**, and **composer** into presentational components. Then add:

- a **focus trap** while the panel is open (Tab should cycle Close → textarea → Send, not the page behind it)
- `aria-live="polite"` on the thread so screen readers hear new Twin text
- `prefers-reduced-motion` so the hero “rise” animation can be still

### 5. Stop using array indexes as React keys, and persist less in the client

Bubbles are keyed `${message.role}-${index}`. If we later insert or drop a message, React can reuse the wrong DOM node and flicker text.

Give each turn a stable `id` (for example `crypto.randomUUID()` when the user sends). While you are there, consider persisting the last transcript in `sessionStorage` so a refresh does not wipe a recruiter’s question — but still sanitize it the same way on the next POST. Never persist the API key; it must stay server-only.

---

## 10. What to tinker with next

If you want to learn by changing one thing at a time:

1. Edit `site.headline` in `src/lib/site.ts` and refresh. Watch Hero and the twin’s knowledge stay in sync.
2. Add a fourth project to `projects` and visit `/work/your-slug`.
3. Temporarily break the health-check body back to `{}` and run the ping — you should see 400 again.
4. Resize the browser below 1024px width. The twin should become a card above **Close twin**, not a full-height rail.

You now have the map: **content in `site.ts`**, **pages in `src/app`**, **chat UI in `TwinDock`**, **secrets and sanitization in `/api/twin`**, **proof in `npm run check`.**
