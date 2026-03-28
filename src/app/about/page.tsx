import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about this free QR Code Generator and our privacy-first tool mission.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight">About QR Code Generator</h1>
      <div className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-black/75 sm:text-base">
        <p>
          QR Code Generator is a free browser-based utility that helps people create practical QR codes for
          websites, WiFi access, contact cards, and plain text. The product is designed for speed, clarity, and
          usability on desktop and mobile.
        </p>
        <p>
          We built this tool to remove friction from common daily workflows. Users can customize colors,
          margins, logo overlays, and error correction levels, then export high-quality PNG and SVG files in one
          click.
        </p>
        <p>
          Input processing is handled in the browser whenever possible. That means your generated QR content and
          uploaded images are not sent to external servers for core tool operations.
        </p>
        <p>
          The project is supported by non-intrusive advertising and continues to evolve with practical features
          requested by real users worldwide.
        </p>
      </div>
    </section>
  );
}
