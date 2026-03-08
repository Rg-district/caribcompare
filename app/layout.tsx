import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CaribCompare — Compare Money, Investing & Crypto Rates for the Caribbean",
  description:
    "Compare remittance rates, investment platforms, and crypto exchanges for Caribbean residents. Find the best deals on Wise, Remitly, eToro, Binance and more.",
  openGraph: {
    title: "CaribCompare — Compare Money, Investing & Crypto Rates for the Caribbean",
    description:
      "Compare remittance rates, investment platforms, and crypto exchanges for Caribbean residents.",
    url: "https://caribcompare.com",
    siteName: "CaribCompare",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
