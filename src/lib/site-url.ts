export const DEFAULT_SITE_URL = "https://portfolio-one-wine-99.vercel.app";

export function resolveSiteUrl(raw?: string | null): string {
  const value = raw?.trim();
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_SITE_URL;
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
