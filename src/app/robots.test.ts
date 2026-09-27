import { afterEach, describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { DEFAULT_SITE_URL } from "@/lib/site-url";

describe("crawl metadata", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = original;
    }
  });

  it("publishes robots.txt and a sitemap for the public pages", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${DEFAULT_SITE_URL}/sitemap.xml`,
      host: DEFAULT_SITE_URL,
    });

    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual([
      DEFAULT_SITE_URL,
      `${DEFAULT_SITE_URL}/work`,
      `${DEFAULT_SITE_URL}/work/calorie-ai`,
      `${DEFAULT_SITE_URL}/work/exam-solver`,
      `${DEFAULT_SITE_URL}/work/clinic-os`,
    ]);
  });

  it("uses NEXT_PUBLIC_SITE_URL when it is set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://uziel.example/";
    expect(robots().sitemap).toBe("https://uziel.example/sitemap.xml");
    expect(sitemap()[0]?.url).toBe("https://uziel.example");
  });
});
