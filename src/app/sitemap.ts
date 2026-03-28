import { getSiteUrl } from "@/lib/runtime-config";
import type { MetadataRoute } from "next";

const siteUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/guides",
    "/guides/qr-code-for-whatsapp-link",
    "/guides/qr-code-for-wifi-password",
    "/guides/qr-code-for-restaurant-menu",
    "/guides/why-qr-code-is-not-scanning",
    "/guides/qr-code-with-logo-best-practices",
  ];

  return pages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
