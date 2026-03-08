"use client";

import { useState, useEffect, useCallback } from "react";
import StarRating from "@/components/StarRating";
import EmailSignup from "@/components/EmailSignup";

interface Provider {
  name: string;
  feeGBP: number;
  margin: number;
  speed: string;
  rating: number;
  badge?: string;
  affiliateUrl: string;
}

const providers: Provider[] = [
  { name: "Wise", feeGBP: 2.4, margin: 0.004, speed: "1–2 days", rating: 5, badge: "Best Rate", affiliateUrl: "#wise" },
  { name: "Remitly", feeGBP: 1.99, margin: 0.025, speed: "Minutes", rating: 4, affiliateUrl: "#remitly" },
  { name: "Revolut", feeGBP: 0, margin: 0.005, speed: "Instant", rating: 4, affiliateUrl: "#revolut" },
  { name: "Western Union", feeGBP: 4.9, margin: 0.045, speed: "Minutes", rating: 3, affiliateUrl: "#wu" },
  { name: "MoneyGram", feeGBP: 4.5, margin: 0.05, speed: "Minutes", rating: 3, affiliateUrl: "#mg" },
];

const faqs = [
  {
    q: "What is the cheapest way to send money to Barbados?",
    a: "Based on current rates, Wise typically offers the best overall value with low fees and near mid-market exchange rates. Use our comparison tool above to check live rates.",
  },
  {
    q: "How long does a transfer to Barbados take?",
    a: "Transfer times vary by provider. Revolut offers instant transfers, while Wise typically takes 1–2 business days. Western Union and Remitly can deliver within minutes to cash pickup locations.",
  },
  {
    q: "Do I need a bank account in Barbados to receive money?",
    a: "Not always. Some providers like Western Union and MoneyGram offer cash pickup options. However, bank transfers are generally cheaper and more convenient.",
  },
  {
    q: "What exchange rate will I get?",
    a: "Each provider sets their own exchange rate, typically with a margin above the mid-market rate. Our comparison tool shows you the effective rate after all fees and margins are applied.",
  },
];

export default function SendMoneyPage() {
  const [amount, setAmount] = useState("300");
  const [rate, setRate] = useState<number | null>(null);

  const fetchRate = useCallback(async () => {
    try {
      const res = await fetch("/api/rates");
      const data = await res.json();
      setRate(data.rate);
    } catch {
      setRate(null);
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const gbp = parseFloat(amount) || 0;

  const results = providers
    .map((p) => {
      const afterFee = gbp - p.feeGBP;
      const bbd = rate && afterFee > 0 ? afterFee * rate * (1 - p.margin) : 0;
      return { ...p, bbd };
    })
    .sort((a, b) => b.bbd - a.bbd);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Send Money to Barbados —{" "}
            <span className="text-gold">Compare All Providers</span>
          </h1>
          <p className="mt-3 text-gray-300">
            Find the cheapest way to send GBP to BBD. Rates update in real time.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to send
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              &pound;
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          {rate && (
            <p className="text-xs text-gray-400 mt-2">
              Mid-market rate: 1 GBP = {rate.toFixed(4)} BBD
            </p>
          )}
        </div>

        {/* Comparison Table */}
        <div className="space-y-4">
          {results.map((p, i) => (
            <div
              key={p.name}
              className={`bg-white rounded-xl shadow-sm border p-6 ${
                i === 0 ? "border-gold ring-2 ring-gold/20" : "border-gray-100"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                    {p.badge && (
                      <span className="bg-gold/10 text-gold text-xs font-semibold px-3 py-1 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <StarRating rating={p.rating} />
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="text-gray-500 block">Fee</span>
                    <span className="font-medium">
                      {p.feeGBP === 0 ? "Free" : `£${p.feeGBP.toFixed(2)}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Margin</span>
                    <span className="font-medium">
                      {(p.margin * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Speed</span>
                    <span className="font-medium">{p.speed}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Recipient gets</span>
                    <span className="text-xl font-bold text-navy">
                      ${p.bbd.toFixed(2)} BBD
                    </span>
                  </div>
                </div>

                <a
                  href={p.affiliateUrl}
                  onClick={() => console.log(`CTA clicked: ${p.name}`)}
                  className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded-lg text-sm transition-colors text-center whitespace-nowrap"
                >
                  Send with {p.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-navy mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="font-semibold text-navy">{faq.q}</h3>
              <p className="text-sm text-gray-600 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />

      <section className="max-w-6xl mx-auto px-4 mt-12">
        <EmailSignup />
      </section>
    </>
  );
}
