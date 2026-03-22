import ProviderCard from "@/components/ProviderCard";
import EmailSignup from "@/components/EmailSignup";

const platforms = [
  {
    name: "eToro",
    min: "$50",
    assets: "Stocks, ETFs, Crypto",
    commission: "0% commission",
    rating: 5,
    badge: "Most Popular",
    affiliateUrl: "#etoro",
  },
  {
    name: "Trading 212",
    min: "£1",
    assets: "Stocks, ETFs",
    commission: "0% commission",
    rating: 5,
    affiliateUrl: "#t212",
  },
  {
    name: "Interactive Brokers",
    min: "$0",
    assets: "Stocks, ETFs, Options, Forex",
    commission: "From $1/trade",
    rating: 4,
    affiliateUrl: "#ibkr",
  },
  {
    name: "Revolut",
    min: "£0",
    assets: "Stocks, Crypto, Gold",
    commission: "1 free trade/month",
    rating: 4,
    affiliateUrl: "#revolut",
  },
  {
    name: "BSE (Barbados Stock Exchange)",
    min: "Varies",
    assets: "~25 Caribbean companies only",
    commission: "1-2%",
    rating: 3,
    affiliateUrl: "",
  },
];

export default function InvestPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Invest from Barbados —{" "}
            <span className="text-gold">Global Markets Now Accessible</span>
          </h1>
          <p className="mt-3 text-gray-300">
            Compare investment platforms available to Caribbean residents.
          </p>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid md:grid-cols-2 gap-6">
          {platforms.map((p) => (
            <ProviderCard
              key={p.name}
              name={p.name}
              badge={p.badge}
              rating={p.rating}
              ctaLabel={p.affiliateUrl ? `Start with ${p.name}` : "Learn More"}
              affiliateUrl={p.affiliateUrl || "#"}
              details={[
                { label: "Minimum", value: p.min },
                { label: "Assets", value: p.assets },
                { label: "Commission", value: p.commission },
              ]}
            />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-12">
        <EmailSignup />
      </section>
    </>
  );
}
