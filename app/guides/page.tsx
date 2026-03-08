import Link from "next/link";
import { guides } from "@/lib/guides";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caribbean Finance Guides | CaribCompare",
  description:
    "Free guides on sending money, investing, and buying crypto from the Caribbean. Written for Barbados residents.",
  openGraph: {
    title: "Caribbean Finance Guides | CaribCompare",
    description:
      "Free guides on sending money, investing, and buying crypto from the Caribbean.",
    url: "https://caribcompare.com/guides",
  },
};

export default function GuidesPage() {
  return (
    <>
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Caribbean Finance <span className="text-gold">Guides</span>
          </h1>
          <p className="mt-3 text-gray-300">
            Practical guides to help you save money, invest smarter, and
            navigate crypto.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
            >
              <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                {guide.category}
              </span>
              <h2 className="text-base font-bold text-navy mt-2 group-hover:text-gold transition-colors leading-snug">
                {guide.title}
              </h2>
              <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                <span>{guide.readTime}</span>
                <span>&middot;</span>
                <span>{guide.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
