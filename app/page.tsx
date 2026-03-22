import Link from "next/link";
import RateWidget from "@/components/RateWidget";
import FlightWidget from "@/components/FlightWidget";
import EmailSignup from "@/components/EmailSignup";
import { countryConfig } from "@/lib/providers";
import { getPopularDestinations } from "@/lib/destinations";

const categories = [
  {
    title: "Send Money",
    description: "Compare fees, exchange rates, and speed across top remittance providers.",
    href: "/send-money",
    icon: "💸",
  },
  {
    title: "Flights",
    description: "Find the cheapest flights to the Caribbean from UK, USA, Canada, France & Netherlands.",
    href: "/flights",
    icon: "✈️",
  },
  {
    title: "Invest",
    description: "Access global stock markets and ETFs from the Caribbean.",
    href: "/invest",
    icon: "📈",
  },
  {
    title: "Crypto",
    description: "Buy Bitcoin and crypto with the lowest fees available.",
    href: "/crypto",
    icon: "🪙",
  },
];

const guides = [
  {
    slug: "caribbean-currencies-pegged-to-usd",
    title: "Caribbean Currencies Pegged to the US Dollar — Complete Guide",
    category: "Send Money",
    readTime: "6 min read",
  },
  {
    slug: "send-money-to-barbados-from-uk",
    title: "How to Send Money to Barbados from the UK in 2026 — Complete Guide",
    category: "Send Money",
    readTime: "8 min read",
  },
  {
    slug: "best-crypto-exchanges-barbados",
    title: "Best Crypto Exchanges for Barbados Residents in 2026",
    category: "Crypto",
    readTime: "7 min read",
  },
];

const countries = [
  { key: "uk" as const, providers: 5 },
  { key: "us" as const, providers: 5 },
  { key: "canada" as const, providers: 5 },
  { key: "france" as const, providers: 4 },
  { key: "netherlands" as const, providers: 4 },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                The smarter way to manage money and find flights —{" "}
                <span className="text-gold">built for the Caribbean</span>
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Compare remittance rates and flight prices. Trusted by the
                diaspora in the UK, US, and Canada.
              </p>

              {/* Country quick links */}
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">Send money from:</p>
                <div className="flex flex-wrap gap-3">
                  {countries.map((country) => {
                    const config = countryConfig[country.key];
                    return (
                      <Link
                        key={country.key}
                        href={`/send-money/${country.key}`}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-lg transition-colors"
                      >
                        <span className="text-xl">{config.flag}</span>
                        <span className="font-medium">{config.name}</span>
                        <span className="text-xs text-gray-400">
                          {country.providers} providers
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/send-money"
                  className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  Compare Rates
                </Link>
                <Link
                  href="/guides"
                  className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  Read Guides
                </Link>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <RateWidget />
              </div>
              <div className="flex justify-center">
                <FlightWidget />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <h2 className="text-lg font-bold text-navy mt-3 group-hover:text-gold transition-colors">
                {cat.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-6 px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-navy">15+</p>
              <p className="text-sm text-gray-600">Providers compared</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">14</p>
              <p className="text-sm text-gray-600">Caribbean destinations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">🇬🇧 🇺🇸 🇨🇦 🇫🇷 🇳🇱</p>
              <p className="text-sm text-gray-600">UK, US, Canada, France, NL</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">Free</p>
              <p className="text-sm text-gray-600">Always free to use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Country sections */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-navy mb-6">Compare by Country</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {countries.map((country) => {
            const config = countryConfig[country.key];
            return (
              <Link
                key={country.key}
                href={`/send-money/${country.key}`}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-gold transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{config.flag}</span>
                  <div>
                    <h3 className="font-bold text-navy group-hover:text-gold transition-colors">
                      {config.name}
                    </h3>
                    <p className="text-sm text-gray-500">{config.currency} → BBD</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Compare {country.providers} providers for the best rates sending{" "}
                  {config.currency} to Barbados.
                </p>
                <span className="text-gold font-semibold text-sm">
                  Compare rates →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Caribbean Destinations */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-navy mb-2">Send to Any Caribbean Island</h2>
        <p className="text-gray-600 mb-6">Compare rates for transfers to these popular destinations</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {getPopularDestinations().map((dest) => (
            <div
              key={dest.code}
              className="bg-white rounded-lg border border-gray-100 p-4 text-center hover:shadow-sm hover:border-gold transition-all"
            >
              <span className="text-3xl block mb-2">{dest.flag}</span>
              <p className="text-sm font-medium text-navy">{dest.name}</p>
              <p className="text-xs text-gray-500">{dest.currencyCode}</p>
              {dest.peggedToUSD && (
                <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                  USD peg
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/guides/caribbean-currencies-pegged-to-usd" className="text-sm text-gold font-medium">
            Learn about Caribbean currency pegs →
          </Link>
        </div>
      </section>

      {/* Email Signup */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <EmailSignup />
      </section>

      {/* Latest Guides */}
      <section className="max-w-6xl mx-auto px-4 mt-12 pb-8">
        <h2 className="text-2xl font-bold text-navy mb-6">Latest Guides</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
            >
              <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                {guide.category}
              </span>
              <h3 className="text-base font-bold text-navy mt-2 group-hover:text-gold transition-colors leading-snug">
                {guide.title}
              </h3>
              <p className="text-xs text-gray-400 mt-3">{guide.readTime}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
