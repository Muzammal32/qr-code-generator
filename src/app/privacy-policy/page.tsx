import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the QR Code Generator website.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-black/75 sm:text-base">
        <p>
          This website is designed with a privacy-first approach. QR generation and most transformations are
          processed directly in your browser.
        </p>
        <p>
          We may collect basic anonymized analytics to understand site performance and tool usage trends. This
          helps us improve reliability and user experience.
        </p>
        <p>
          Advertising providers, including Google AdSense, may use cookies to serve personalized or
          non-personalized ads based on applicable regulations in your region.
        </p>
        <p>
          By using this website, you agree to this policy. We may update this policy over time to reflect product
          or legal changes.
        </p>
      </div>
    </section>
  );
}
