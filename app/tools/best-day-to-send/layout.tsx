import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remittance Day Calculator — Best Day to Send Money | CaribCompare",
  description:
    "Find the best day to send money to the Caribbean. Our free tool analyzes historical exchange rates to help you get more value from your transfers.",
  openGraph: {
    title: "Remittance Day Calculator — Best Day to Send Money",
    description:
      "Find the best day to send money to the Caribbean. Wednesday is optimal, weekends are worst. Check your corridor now.",
    url: "https://caribcompare.com/tools/best-day-to-send",
    type: "website",
    images: [
      {
        url: "/og-remittance-calculator.png",
        width: 1200,
        height: 630,
        alt: "Remittance Day Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Day to Send Money to the Caribbean",
    description:
      "Wednesday is optimal, weekends are worst. Find the best day for your transfer corridor.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
