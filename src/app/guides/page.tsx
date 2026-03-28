import { qrGuides } from "@/lib/qr-guides";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QR Code Guides",
  description:
    "Practical QR code guides for WhatsApp links, WiFi access, menu cards, scan troubleshooting, and logo-safe design.",
  alternates: {
    canonical: "/guides",
  },
};

export default function GuidesPage() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight">QR Code Guides</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-black/75 sm:text-base">
        Learn practical QR workflows for business, events, and everyday usage. These guides are written for
        beginners and include scan-safe recommendations.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {qrGuides.map((guide) => (
          <article key={guide.slug} className="rounded-2xl border border-black/10 bg-[#fbfcff] p-4">
            <h2 className="text-lg font-semibold tracking-tight">{guide.title}</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">{guide.description}</p>
            <Link
              href={`/guides/${guide.slug}`}
              className="mt-4 inline-flex rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium hover:bg-black/5"
            >
              Read guide
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
