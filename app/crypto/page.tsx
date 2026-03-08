import ProviderCard from "@/components/ProviderCard";
import EmailSignup from "@/components/EmailSignup";

const exchanges = [
  {
    name: "Binance",
    fees: "0.1%",
    rating: 5,
    badge: "Lowest Fees",
    affiliateUrl: "#binance",
  },
  {
    name: "Coinbase",
    fees: "0.5–1.5%",
    rating: 4,
    badge: "Best for Beginners",
    affiliateUrl: "#coinbase",
  },
  {
    name: "Kraken",
    fees: "0.16% / 0.26%",
    rating: 4,
    affiliateUrl: "#kraken",
  },
  {
    name: "eToro Crypto",
    fees: "1% spread",
    rating: 4,
    affiliateUrl: "#etoro",
  },
];

const steps = [
  {
    step: 1,
    title: "Choose an exchange",
    description:
      "Compare the exchanges above and pick one that suits your needs. Binance has the lowest fees, while Coinbase is the easiest for beginners.",
  },
  {
    step: 2,
    title: "Create and verify your account",
    description:
      "Sign up with your email, then complete identity verification (KYC). You'll need a government-issued ID and proof of address.",
  },
  {
    step: 3,
    title: "Deposit funds",
    description:
      "Fund your account via bank transfer, debit card, or other supported methods. Bank transfers are usually cheapest.",
  },
  {
    step: 4,
    title: "Buy Bitcoin (or any crypto)",
    description:
      "Search for BTC (or your preferred cryptocurrency), enter the amount, review the fees, and confirm your purchase.",
  },
];

export default function CryptoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Buy Crypto in Barbados —{" "}
            <span className="text-gold">Every Option Compared</span>
          </h1>
          <p className="mt-3 text-gray-300">
            Find the best crypto exchange for Caribbean residents.
          </p>
        </div>
      </section>

      {/* Exchange Cards */}
      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid md:grid-cols-2 gap-6">
          {exchanges.map((e) => (
            <ProviderCard
              key={e.name}
              name={e.name}
              badge={e.badge}
              rating={e.rating}
              ctaLabel={`Start with ${e.name}`}
              affiliateUrl={e.affiliateUrl}
              details={[{ label: "Trading Fees", value: e.fees }]}
            />
          ))}
        </div>
      </section>

      {/* How-to Steps */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-navy mb-6">
          How to Buy Bitcoin from Barbados in 4 Steps
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-gold text-navy w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {s.step}
                </span>
                <h3 className="font-semibold text-navy">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-12">
        <EmailSignup />
      </section>
    </>
  );
}
