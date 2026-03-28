import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the QR Code Generator team for support, feedback, and collaboration.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-black/75 sm:text-base">
        For support, bug reports, business inquiries, or feature suggestions, email us at:
      </p>
      <p className="mt-2 text-base font-semibold">support.webservice@gmail.com</p>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-black/75 sm:text-base">
        We review all messages and prioritize improvements based on user demand and product quality.
      </p>
    </section>
  );
}
