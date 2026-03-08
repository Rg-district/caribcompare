import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Crypto in Barbados — Compare Exchanges | CaribCompare",
  description:
    "Compare crypto exchanges available in Barbados. Binance, Coinbase, Kraken, and eToro fees, features, and step-by-step buying guide.",
  openGraph: {
    title: "Buy Crypto in Barbados — Compare Exchanges | CaribCompare",
    description:
      "Compare crypto exchanges available in Barbados.",
    url: "https://caribcompare.com/crypto",
  },
};

export default function CryptoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
