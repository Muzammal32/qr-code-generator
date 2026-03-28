function normalizeOrigin(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "http://localhost:3000";

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withScheme.replace(/\/$/, "");
}

export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  return normalizeOrigin(configured ?? "http://localhost:3000");
}

export function getAdsensePublisherId(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID ??
    process.env.GOOGLE_ADSENSE_PUBLISHER_ID ??
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT ??
    process.env.GOOGLE_ADSENSE_ACCOUNT;

  if (!raw) return null;

  if (raw.startsWith("pub-")) return raw;
  if (raw.startsWith("ca-pub-")) return raw.replace("ca-pub-", "pub-");
  return null;
}

export function getAdsenseAccount(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT ?? process.env.GOOGLE_ADSENSE_ACCOUNT;
  if (raw?.startsWith("ca-pub-")) return raw;
  if (raw?.startsWith("pub-")) return `ca-${raw}`;

  const publisherId = getAdsensePublisherId();
  return publisherId ? `ca-${publisherId}` : null;
}
