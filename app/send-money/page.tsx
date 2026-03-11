import Link from "next/link";
import { countryConfig } from "@/lib/providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send Money to Barbados — Compare Best Rates | CaribCompare",
  description:
    "Compare money transfer services for sending money to Barbados from UK, USA, and Canada. Find the lowest fees and best exchange rates.",
  openGraph: {
    title: "Send Money to Barbados — Compare Best Rates",
    description:
      "Compare money transfer services for sending money to Barbados from UK, USA, and Canada.",
    url: "https://caribcompare.com/send-money",
  },
};

const countries = [
  {
    key: "uk" as const,
    description: "Send GBP to Barbados with the best rates for UK residents.",
    popular: ["Wise", "Remitly", "WorldRemit"],
  },
  {
    key: "us" as const,
    description: "Compare USD to BBD transfers from the United States.",
    popular: ["Wise", "Remitly", "MoneyGram"],
  },
  {
    key: "canada" as const,
    description: "Find the cheapest way to send CAD to Barbados.",
    popular: ["Wise", "Remitly", "Xe"],
  },
];

export default function SendMoneyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Send Money to Barbados
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Compare fees, exchange rates, and delivery speeds across the top money
            transfer services. Choose your country to get started.
          </p>
        </div>
      </section>

      {/* Country selection */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-navy text-center mb-8">
          Where are you sending from?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {countries.map((country) => {
            const config = countryConfig[country.key];
            return (
              <Link
                key={country.key}
                href={`/send-money/${country.key}`}
                className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-gold p-8 text-center transition-all hover:shadow-lg"
              >
                <span className="text-6xl block mb-4">{config.flag}</span>
                <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  {config.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{country.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {country.popular.map((provider) => (
                    <span
                      key={provider}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {provider}
                    </span>
                  ))}
                </div>
                <div className="mt-6 text-gold font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Compare rates →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why compare */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">
            Why Compare Before You Send?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-3xl">💸</div>
              <div>
                <h3 className="font-bold text-navy mb-1">Save on Every Transfer</h3>
                <p className="text-sm text-gray-600">
                  Exchange rate margins can cost you 2-5% of your transfer. On £1,000, that's
                  £20-50 lost. We help you find the best deal every time.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🔍</div>
              <div>
                <h3 className="font-bold text-navy mb-1">See the Real Cost</h3>
                <p className="text-sm text-gray-600">
                  Many services hide fees in poor exchange rates. We show you the total cost
                  including all margins and fees.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">⏱️</div>
              <div>
                <h3 className="font-bold text-navy mb-1">Choose Your Speed</h3>
                <p className="text-sm text-gray-600">
                  Need it there today? We'll show you instant options. Prefer to save money?
                  We'll find the best value for slower transfers.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🇧🇧</div>
              <div>
                <h3 className="font-bold text-navy mb-1">Caribbean-Focused</h3>
                <p className="text-sm text-gray-600">
                  We specialise in transfers to Barbados and the Caribbean. Our comparisons
                  focus on what actually works for this corridor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-navy mb-6">Quick Facts: BBD Exchange Rate</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-navy">2:1</p>
              <p className="text-sm text-gray-600">BBD is pegged to USD</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-navy">~2.5</p>
              <p className="text-sm text-gray-600">Approx GBP to BBD rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-navy">~1.45</p>
              <p className="text-sm text-gray-600">Approx CAD to BBD rate</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Rates are approximate and change daily. Always check current rates before sending.
          </p>
        </div>
      </section>
    </>
  );
}
