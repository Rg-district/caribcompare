import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send Money to Barbados — Compare Wise, Remitly & More | CaribCompare",
  description:
    "Compare the cheapest ways to send money from the UK to Barbados. Live rates from Wise, Remitly, Revolut, Western Union, and MoneyGram.",
  openGraph: {
    title: "Send Money to Barbados — Compare Wise, Remitly & More | CaribCompare",
    description:
      "Compare the cheapest ways to send money from the UK to Barbados.",
    url: "https://caribcompare.com/send-money",
  },
};

export default function SendMoneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
