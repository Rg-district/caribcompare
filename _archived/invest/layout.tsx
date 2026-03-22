import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invest from Barbados — Compare Global Platforms | CaribCompare",
  description:
    "Compare investment platforms accessible from Barbados. eToro, Trading 212, Interactive Brokers, Revolut and the Barbados Stock Exchange.",
  openGraph: {
    title: "Invest from Barbados — Compare Global Platforms | CaribCompare",
    description:
      "Compare investment platforms accessible from Barbados.",
    url: "https://caribcompare.com/invest",
  },
};

export default function InvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
