import { getSiteUrl } from "@/lib/runtime-config";
import { qrGuides } from "@/lib/qr-guides";
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
    ...qrGuides.map((guide) => `/guides/${guide.slug}`),
  ];

  return pages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
