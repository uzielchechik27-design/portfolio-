import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_URL, resolveSiteUrl } from "@/lib/site-url";

describe("resolveSiteUrl", () => {
  it("defaults to the deployed portfolio URL", () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("  ")).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("not a url")).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("ftp://example.com")).toBe(DEFAULT_SITE_URL);
  });

  it("uses an http(s) origin from the environment", () => {
    expect(resolveSiteUrl("https://example.com/path")).toBe("https://example.com");
    expect(resolveSiteUrl("http://localhost:3000/")).toBe("http://localhost:3000");
  });
});
