import { getGuideBySlug, qrGuides } from "@/lib/qr-guides";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return qrGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/55">QR Guide</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{guide.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-black/75 sm:text-base">{guide.intro}</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Step-by-step</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-black/75 sm:text-base">
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Best practices</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-black/75 sm:text-base">
          {guide.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="mt-3 space-y-3">
          {guide.faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl border border-black/10 bg-[#fbfcff] px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-black/85">{faq.question}</summary>
              <p className="mt-2 text-sm leading-6 text-black/70">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
        <h2 className="text-lg font-semibold">Related guides</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {qrGuides
            .filter((entry) => entry.slug !== guide.slug)
            .slice(0, 4)
            .map((entry) => (
              <Link
                key={entry.slug}
                href={`/guides/${entry.slug}`}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/5"
              >
                {entry.title}
              </Link>
            ))}
        </div>
      </section>
    </article>
  );
}
