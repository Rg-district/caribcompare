import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tools — Money Transfer Calculators | CaribCompare",
  description:
    "Free tools to help you save money on Caribbean transfers. Remittance day calculator, rate alerts, and more.",
};

const tools = [
  {
    slug: "best-day-to-send",
    title: "Remittance Day Calculator",
    description:
      "Find the best day to send money. Our analysis reveals when you'll get the most value.",
    icon: "📅",
    tag: "Popular",
  },
];

export default function ToolsPage() {
  return (
    <>
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Free Tools</h1>
          <p className="text-gray-300 text-lg">
            Calculators and tools to help you save money on transfers
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="bg-white rounded-xl border border-gray-100 p-8 hover:shadow-lg hover:border-gold transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{tool.icon}</span>
                {tool.tag && (
                  <span className="bg-gold/20 text-gold text-xs font-semibold px-2 py-1 rounded">
                    {tool.tag}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-navy group-hover:text-gold transition-colors mb-2">
                {tool.title}
              </h2>
              <p className="text-gray-600 text-sm">{tool.description}</p>
              <span className="inline-block mt-4 text-gold font-semibold text-sm">
                Try it free →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
