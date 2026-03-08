import { notFound } from "next/navigation";
import Link from "next/link";
import { guides } from "@/lib/guides";
import EmailSignup from "@/components/EmailSignup";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | CaribCompare`,
    description: guide.body.slice(0, 160),
    openGraph: {
      title: guide.title,
      description: guide.body.slice(0, 160),
      url: `https://caribcompare.com/guides/${guide.slug}`,
      type: "article",
    },
  };
}

const ctaMap: Record<string, { label: string; href: string }> = {
  "Send Money": { label: "Compare Send Money Rates", href: "/send-money" },
  Investing: { label: "Compare Investment Platforms", href: "/invest" },
  Crypto: { label: "Compare Crypto Exchanges", href: "/crypto" },
};

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const cta = ctaMap[guide.category];

  return (
    <>
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-semibold text-gold uppercase tracking-wider">
            {guide.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold mt-2 leading-tight">
            {guide.title}
          </h1>
          <div className="flex items-center gap-3 mt-4 text-sm text-gray-300">
            <span>{guide.date}</span>
            <span>&middot;</span>
            <span>{guide.readTime}</span>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          {guide.body.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {cta && (
          <div className="mt-8 bg-navy rounded-xl p-8 text-center">
            <p className="text-white font-semibold text-lg mb-4">
              Ready to take action?
            </p>
            <Link
              href={cta.href}
              className="inline-block bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
            >
              {cta.label}
            </Link>
          </div>
        )}

        <div className="mt-8">
          <EmailSignup />
        </div>
      </article>
    </>
  );
}
