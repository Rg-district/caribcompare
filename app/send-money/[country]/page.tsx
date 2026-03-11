import { notFound } from "next/navigation";
import Link from "next/link";
import { getProviders, countryConfig, type Country } from "@/lib/providers";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ country: string }>;
};

const validCountries = ["uk", "us", "canada"] as const;

export async function generateStaticParams() {
  return validCountries.map((country) => ({ country }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!validCountries.includes(country as Country)) {
    return { title: "Not Found" };
  }
  const config = countryConfig[country as Country];
  return {
    title: `Send Money to Barbados from ${config.name} — Best Rates Compared | CaribCompare`,
    description: `Compare the best money transfer services for sending ${config.currency} to Barbados. Find the lowest fees and best exchange rates from ${config.name}.`,
    openGraph: {
      title: `Send Money to Barbados from ${config.name} — Best Rates Compared`,
      description: `Compare the best money transfer services for sending ${config.currency} to Barbados.`,
      url: `https://caribcompare.com/send-money/${country}`,
    },
  };
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-sm ${
            i < fullStars
              ? "text-gold"
              : i === fullStars && hasHalf
              ? "text-gold/50"
              : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  
  if (!validCountries.includes(country as Country)) {
    notFound();
  }

  const countryKey = country as Country;
  const config = countryConfig[countryKey];
  const providers = getProviders(countryKey);
  const otherCountries = validCountries.filter((c) => c !== countryKey);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/send-money" className="hover:text-white">
              Send Money
            </Link>
            <span>/</span>
            <span className="text-white">{config.name}</span>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{config.flag}</span>
            <h1 className="text-2xl md:text-4xl font-bold">
              Send Money to Barbados from {config.name}
            </h1>
          </div>
          
          <p className="text-gray-300 text-lg max-w-2xl">
            Compare the best ways to send {config.currency} to Barbados. We've analysed fees,
            exchange rates, and delivery speeds to help you find the cheapest option.
          </p>

          {/* Country switcher */}
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm text-gray-400">Sending from:</span>
            <div className="flex gap-2">
              {validCountries.map((c) => (
                <Link
                  key={c}
                  href={`/send-money/${c}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    c === countryKey
                      ? "bg-gold text-navy"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {countryConfig[c].flag} {countryConfig[c].currency}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Providers comparison */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-navy mb-6">
          Top {providers.length} Money Transfer Services — {config.currency} to BBD
        </h2>

        <div className="space-y-4">
          {providers.map((provider, index) => (
            <div
              key={provider.name}
              className={`bg-white rounded-xl border ${
                provider.featured ? "border-gold shadow-md" : "border-gray-100"
              } p-6 relative`}
            >
              {provider.featured && (
                <span className="absolute -top-3 left-4 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">
                  Recommended
                </span>
              )}

              <div className="grid md:grid-cols-[1fr_2fr_1fr] gap-6 items-center">
                {/* Provider info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold text-navy">
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-lg">{provider.name}</h3>
                    <StarRating rating={provider.rating} />
                  </div>
                </div>

                {/* Key details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Fees</p>
                    <p className="font-semibold text-navy">{provider.fees}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Rate Margin</p>
                    <p className="font-semibold text-navy">{provider.exchangeRateMargin}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Speed</p>
                    <p className="font-semibold text-navy">{provider.transferSpeed}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Delivery</p>
                    <p className="font-semibold text-navy">{provider.deliveryMethods[0]}</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex justify-end">
                  <a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${
                      provider.featured
                        ? "bg-gold hover:bg-gold-light text-navy"
                        : "bg-navy hover:bg-navy-light text-white"
                    }`}
                  >
                    Visit {provider.name} →
                  </a>
                </div>
              </div>

              {/* Expandable pros/cons */}
              <details className="mt-4 group">
                <summary className="cursor-pointer text-sm text-gold font-medium list-none flex items-center gap-1">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  View pros & cons
                </summary>
                <div className="mt-4 grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase mb-2">Pros</p>
                    <ul className="space-y-1">
                      {provider.pros.map((pro) => (
                        <li key={pro} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-600 uppercase mb-2">Cons</p>
                    <ul className="space-y-1">
                      {provider.cons.map((con) => (
                        <li key={con} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-red-500">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </section>

      {/* Info section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy mb-6">
            How to Choose the Best {config.currency} to BBD Transfer Service
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="text-2xl mb-3">💰</div>
              <h3 className="font-bold text-navy mb-2">Compare Total Cost</h3>
              <p className="text-sm text-gray-600">
                Don't just look at fees. The exchange rate margin often costs more than the
                transfer fee. Check the total amount your recipient will receive.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-bold text-navy mb-2">Consider Speed</h3>
              <p className="text-sm text-gray-600">
                Need money there fast? Cash pickup services like Western Union arrive in
                minutes. Bank transfers with Wise take 1-2 days but cost less.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="text-2xl mb-3">🏦</div>
              <h3 className="font-bold text-navy mb-2">Check Delivery Options</h3>
              <p className="text-sm text-gray-600">
                Does your recipient have a bank account? If not, look for services with cash
                pickup locations in Barbados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other countries */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-lg font-bold text-navy mb-4">Sending from another country?</h2>
        <div className="flex gap-3">
          {otherCountries.map((c) => (
            <Link
              key={c}
              href={`/send-money/${c}`}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-gold hover:shadow-sm transition-all"
            >
              <span className="text-xl">{countryConfig[c].flag}</span>
              <span className="font-medium text-navy">
                Send from {countryConfig[c].name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
