import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the QR Code Generator website.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
      <div className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-black/75 sm:text-base">
        <p>
          This website and its tools are provided on an "as is" basis without warranties of any kind.
        </p>
        <p>
          You are responsible for verifying all generated outputs before using them in production, business,
          compliance, or safety-critical workflows.
        </p>
        <p>
          You agree not to misuse the service for illegal activity, abuse, or attempts to disrupt service
          availability.
        </p>
        <p>
          Continued use of this website indicates acceptance of these terms. Terms may be updated as the product
          evolves.
        </p>
      </div>
    </section>
  );
}
