# Uziel Chechik

Personal portfolio for Uziel Chechik, a junior software engineer in Israel. The site presents his background, selected projects, and a Digital Twin chat that answers questions from the public career file on this site.

Live site: [https://portfolio-one-wine-99.vercel.app](https://portfolio-one-wine-99.vercel.app)

## Features

- Home page with profile, career journey, selected projects, skills, and contact
- Project case pages under `/work`
- Digital Twin chat that speaks in the first person from the facts in `src/lib/site.ts`
- Open Graph and Twitter preview image, `robots.txt`, and a sitemap

### Digital Twin limits

The chat is `POST /api/twin`. The server holds the OpenRouter key and does not expose it to the browser.

- Existing message checks stay in place: at most 20 messages, each at most 2,000 characters, and the transcript must end with a visitor message
- Output is capped at 1,024 tokens
- The browser receives only the final answer text. Reasoning text and provider metadata are removed before the stream is forwarded
- Each IP address can send 8 questions per 10 minutes. The limit is stored in memory on the server instance, so on Vercel it is best-effort and is not shared across every running instance
- The OpenRouter `HTTP-Referer` is `NEXT_PUBLIC_SITE_URL`, or the live site URL when that variable is unset

Set a spending cap on the OpenRouter key as well. The in-memory limit reduces casual abuse; it does not replace a provider budget.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Vitest. Deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Environment variables

Copy these into `.env.local` for local development, and set the same keys in the Vercel project. Do not commit secret values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | For the Digital Twin | Server-only OpenRouter API key. If it is missing, the chat returns “offline” and the rest of the site still works. |
| `OPENROUTER_MODEL` | No | OpenRouter model id. Defaults to `openai/gpt-oss-120b`. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for metadata, the sitemap, and the OpenRouter referer. Defaults to `https://portfolio-one-wine-99.vercel.app`. Use `http://localhost:3000` locally if you want local links in previews. |

## Contact links

GitHub: [https://github.com/uzielchechik27-design](https://github.com/uzielchechik27-design)

LinkedIn is intentionally blank until the public profile URL is added to `linkedInUrl` in `src/lib/site.ts`.
