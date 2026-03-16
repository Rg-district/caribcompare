// Provider data for each market
export type Provider = {
  name: string;
  logo: string;
  rating: number;
  transferSpeed: string;
  fees: string;
  exchangeRateMargin: string;
  deliveryMethods: string[];
  pros: string[];
  cons: string[];
  url: string;
  featured?: boolean;
};

export type Country = "uk" | "us" | "canada" | "france" | "netherlands";

export const countryConfig = {
  uk: {
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    flag: "🇬🇧",
  },
  us: {
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    flag: "🇺🇸",
  },
  canada: {
    name: "Canada",
    currency: "CAD",
    currencySymbol: "CA$",
    flag: "🇨🇦",
  },
  france: {
    name: "France",
    currency: "EUR",
    currencySymbol: "€",
    flag: "🇫🇷",
  },
  netherlands: {
    name: "Netherlands",
    currency: "EUR",
    currencySymbol: "€",
    flag: "🇳🇱",
  },
};

export const providers: Record<"uk" | "us" | "canada", Provider[]> = {
  uk: [
    {
      name: "Wise",
      logo: "/logos/wise.svg",
      rating: 4.8,
      transferSpeed: "1-2 business days",
      fees: "From £0.41",
      exchangeRateMargin: "0.35-0.55%",
      deliveryMethods: ["Bank transfer"],
      pros: [
        "Real mid-market exchange rate",
        "Transparent fees shown upfront",
        "Excellent mobile app",
        "Regulated by FCA",
      ],
      cons: [
        "Bank transfer only (no cash pickup)",
        "No instant transfers to Barbados",
      ],
      url: "https://wise.com",
      featured: true,
    },
    {
      name: "Remitly",
      logo: "/logos/remitly.svg",
      rating: 4.6,
      transferSpeed: "Minutes to 3 days",
      fees: "From £0.99",
      exchangeRateMargin: "0.5-1.5%",
      deliveryMethods: ["Bank transfer", "Cash pickup", "Mobile money"],
      pros: [
        "Fast transfers available",
        "Multiple delivery options",
        "First transfer often fee-free",
        "24/7 customer support",
      ],
      cons: [
        "Exchange rate margin higher than Wise",
        "Rates vary by delivery speed",
      ],
      url: "https://remitly.com",
      featured: true,
    },
    {
      name: "WorldRemit",
      logo: "/logos/worldremit.svg",
      rating: 4.4,
      transferSpeed: "Minutes to 3 days",
      fees: "From £0.99",
      exchangeRateMargin: "1-2%",
      deliveryMethods: ["Bank transfer", "Cash pickup", "Mobile money"],
      pros: [
        "Wide delivery network in Caribbean",
        "Mobile top-up option",
        "Easy to use app",
      ],
      cons: [
        "Higher exchange rate margins",
        "Fees can add up for small transfers",
      ],
      url: "https://worldremit.com",
    },
    {
      name: "Western Union",
      logo: "/logos/western-union.svg",
      rating: 4.0,
      transferSpeed: "Minutes to same day",
      fees: "From £4.90",
      exchangeRateMargin: "2-4%",
      deliveryMethods: ["Bank transfer", "Cash pickup", "In-person"],
      pros: [
        "Largest agent network worldwide",
        "Cash pickup within minutes",
        "Physical locations available",
      ],
      cons: [
        "Higher fees than online-only services",
        "Poor exchange rates",
        "Fees not always transparent",
      ],
      url: "https://westernunion.com",
    },
    {
      name: "MoneyGram",
      logo: "/logos/moneygram.svg",
      rating: 4.0,
      transferSpeed: "Minutes to same day",
      fees: "From £3.99",
      exchangeRateMargin: "2-3.5%",
      deliveryMethods: ["Bank transfer", "Cash pickup"],
      pros: [
        "Fast cash pickup available",
        "Good agent network in Barbados",
        "Loyalty rewards programme",
      ],
      cons: [
        "Exchange rates not competitive",
        "Fees higher for cash pickup",
      ],
      url: "https://moneygram.com",
    },
  ],
  us: [
    {
      name: "Wise",
      logo: "/logos/wise.svg",
      rating: 4.8,
      transferSpeed: "1-2 business days",
      fees: "From $0.50",
      exchangeRateMargin: "0.35-0.55%",
      deliveryMethods: ["Bank transfer"],
      pros: [
        "Real mid-market exchange rate",
        "Transparent pricing",
        "Best value for bank transfers",
        "Licensed in all 50 states",
      ],
      cons: [
        "No cash pickup option",
        "Not the fastest option",
      ],
      url: "https://wise.com",
      featured: true,
    },
    {
      name: "Remitly",
      logo: "/logos/remitly.svg",
      rating: 4.6,
      transferSpeed: "Minutes to 3 days",
      fees: "From $0",
      exchangeRateMargin: "0.5-1.5%",
      deliveryMethods: ["Bank transfer", "Cash pickup"],
      pros: [
        "Often free for first transfer",
        "Express transfers available",
        "Great mobile app",
        "Strong customer support",
      ],
      cons: [
        "Rates vary significantly by speed",
        "Best rates require slower delivery",
      ],
      url: "https://remitly.com",
      featured: true,
    },
    {
      name: "MoneyGram",
      logo: "/logos/moneygram.svg",
      rating: 4.2,
      transferSpeed: "Minutes to same day",
      fees: "From $0",
      exchangeRateMargin: "1.5-3%",
      deliveryMethods: ["Bank transfer", "Cash pickup", "Walmart pickup"],
      pros: [
        "Send from Walmart stores",
        "Fast cash pickup",
        "Zero fee promotions common",
        "Good Caribbean coverage",
      ],
      cons: [
        "Exchange rate includes hidden margin",
        "In-store fees can be high",
      ],
      url: "https://moneygram.com",
    },
    {
      name: "Xoom (PayPal)",
      logo: "/logos/xoom.svg",
      rating: 4.3,
      transferSpeed: "Minutes to 3 days",
      fees: "From $0",
      exchangeRateMargin: "1-2.5%",
      deliveryMethods: ["Bank transfer", "Cash pickup"],
      pros: [
        "Backed by PayPal",
        "Integrates with PayPal balance",
        "Fast cash pickup",
        "Reload & repeat feature",
      ],
      cons: [
        "Exchange rates not best in class",
        "Customer service via PayPal only",
      ],
      url: "https://xoom.com",
    },
    {
      name: "Western Union",
      logo: "/logos/western-union.svg",
      rating: 4.0,
      transferSpeed: "Minutes to same day",
      fees: "From $5",
      exchangeRateMargin: "2-4%",
      deliveryMethods: ["Bank transfer", "Cash pickup", "In-person"],
      pros: [
        "Largest global network",
        "Cash available in minutes",
        "Send from stores nationwide",
      ],
      cons: [
        "One of the most expensive options",
        "Poor exchange rates",
        "Complex fee structure",
      ],
      url: "https://westernunion.com",
    },
  ],
  canada: [
    {
      name: "Wise",
      logo: "/logos/wise.svg",
      rating: 4.8,
      transferSpeed: "1-2 business days",
      fees: "From CA$1.00",
      exchangeRateMargin: "0.35-0.55%",
      deliveryMethods: ["Bank transfer"],
      pros: [
        "Best exchange rates in Canada",
        "Transparent, low fees",
        "Regulated by FINTRAC",
        "Excellent for recurring transfers",
      ],
      cons: [
        "No cash pickup option",
        "Slower than instant services",
      ],
      url: "https://wise.com",
      featured: true,
    },
    {
      name: "Remitly",
      logo: "/logos/remitly.svg",
      rating: 4.5,
      transferSpeed: "Minutes to 3 days",
      fees: "From CA$0",
      exchangeRateMargin: "0.5-1.5%",
      deliveryMethods: ["Bank transfer", "Cash pickup"],
      pros: [
        "Express delivery available",
        "First transfer often free",
        "Good mobile experience",
      ],
      cons: [
        "Best rates require economy speed",
        "Not as established in Canada",
      ],
      url: "https://remitly.com",
      featured: true,
    },
    {
      name: "Xe",
      logo: "/logos/xe.svg",
      rating: 4.4,
      transferSpeed: "1-4 business days",
      fees: "No transfer fees",
      exchangeRateMargin: "0.5-1%",
      deliveryMethods: ["Bank transfer"],
      pros: [
        "No transfer fees",
        "Trusted currency brand",
        "Rate alerts feature",
        "Good for large transfers",
      ],
      cons: [
        "Margin built into exchange rate",
        "Slower than competitors",
        "Bank transfer only",
      ],
      url: "https://xe.com",
    },
    {
      name: "Western Union",
      logo: "/logos/western-union.svg",
      rating: 4.0,
      transferSpeed: "Minutes to same day",
      fees: "From CA$5",
      exchangeRateMargin: "2-4%",
      deliveryMethods: ["Bank transfer", "Cash pickup", "In-person"],
      pros: [
        "Cash available in minutes",
        "Large agent network in Barbados",
        "Send from Canada Post locations",
      ],
      cons: [
        "Expensive overall",
        "Poor value for bank transfers",
        "Exchange rates are weak",
      ],
      url: "https://westernunion.com",
    },
    {
      name: "WorldRemit",
      logo: "/logos/worldremit.svg",
      rating: 4.3,
      transferSpeed: "Minutes to 3 days",
      fees: "From CA$1.99",
      exchangeRateMargin: "1-2%",
      deliveryMethods: ["Bank transfer", "Cash pickup", "Mobile money"],
      pros: [
        "Multiple delivery options",
        "Mobile airtime top-up",
        "Good Caribbean coverage",
      ],
      cons: [
        "Not the cheapest option",
        "Margins vary by destination",
      ],
      url: "https://worldremit.com",
    },
  ],
};

// France providers
const franceProviders: Provider[] = [
  {
    name: "Wise",
    logo: "/logos/wise.svg",
    rating: 4.8,
    transferSpeed: "1-2 business days",
    fees: "From €0.50",
    exchangeRateMargin: "0.35-0.55%",
    deliveryMethods: ["Bank transfer"],
    pros: [
      "Real mid-market exchange rate",
      "Transparent pricing",
      "Excellent for EUR to Caribbean",
      "Multi-currency account available",
    ],
    cons: [
      "No cash pickup option",
      "French Caribbean uses EUR (no exchange needed)",
    ],
    url: "https://wise.com",
    featured: true,
  },
  {
    name: "Remitly",
    logo: "/logos/remitly.svg",
    rating: 4.5,
    transferSpeed: "Minutes to 3 days",
    fees: "From €0.99",
    exchangeRateMargin: "0.5-1.5%",
    deliveryMethods: ["Bank transfer", "Cash pickup"],
    pros: [
      "Good coverage for Jamaica, Guyana, Trinidad",
      "Fast transfers available",
      "Promotions for new users",
    ],
    cons: [
      "Limited Dutch Caribbean coverage",
      "Rates vary by destination",
    ],
    url: "https://remitly.com",
    featured: true,
  },
  {
    name: "Western Union",
    logo: "/logos/western-union.svg",
    rating: 4.0,
    transferSpeed: "Minutes to same day",
    fees: "From €4.90",
    exchangeRateMargin: "2-4%",
    deliveryMethods: ["Bank transfer", "Cash pickup", "In-person"],
    pros: [
      "Cash pickup across all Caribbean",
      "La Banque Postale partnership",
      "Physical agents in France",
    ],
    cons: [
      "Expensive fees",
      "Poor exchange rates",
    ],
    url: "https://westernunion.com",
  },
  {
    name: "N26",
    logo: "/logos/n26.svg",
    rating: 4.3,
    transferSpeed: "1-3 business days",
    fees: "Varies by plan",
    exchangeRateMargin: "0.5-1.7%",
    deliveryMethods: ["Bank transfer"],
    pros: [
      "Integrated with Wise for transfers",
      "Great mobile app",
      "Free for N26 Metal users",
    ],
    cons: [
      "Requires N26 account",
      "Limited direct Caribbean support",
    ],
    url: "https://n26.com",
  },
];

// Netherlands providers
const netherlandsProviders: Provider[] = [
  {
    name: "Wise",
    logo: "/logos/wise.svg",
    rating: 4.8,
    transferSpeed: "1-2 business days",
    fees: "From €0.50",
    exchangeRateMargin: "0.35-0.55%",
    deliveryMethods: ["Bank transfer"],
    pros: [
      "Best rates for EUR → AWG/ANG",
      "iDEAL integration",
      "Transparent, low cost",
      "Multi-currency account",
    ],
    cons: [
      "No cash pickup",
      "Bank transfer only",
    ],
    url: "https://wise.com",
    featured: true,
  },
  {
    name: "Bunq",
    logo: "/logos/bunq.svg",
    rating: 4.4,
    transferSpeed: "1-3 business days",
    fees: "Free on Premium",
    exchangeRateMargin: "0.5-1%",
    deliveryMethods: ["Bank transfer"],
    pros: [
      "Popular Dutch neobank",
      "Free international transfers on Premium",
      "Uses Wise for good rates",
      "Sustainable banking option",
    ],
    cons: [
      "Requires Bunq account",
      "Standard plan has fees",
    ],
    url: "https://bunq.com",
    featured: true,
  },
  {
    name: "Western Union",
    logo: "/logos/western-union.svg",
    rating: 4.0,
    transferSpeed: "Minutes to same day",
    fees: "From €5",
    exchangeRateMargin: "2-4%",
    deliveryMethods: ["Bank transfer", "Cash pickup"],
    pros: [
      "Cash pickup in Aruba, Curaçao, Sint Maarten",
      "Agents throughout Dutch Caribbean",
      "Fast for emergencies",
    ],
    cons: [
      "Expensive",
      "Poor exchange rates",
    ],
    url: "https://westernunion.com",
  },
  {
    name: "ING International",
    logo: "/logos/ing.svg",
    rating: 4.1,
    transferSpeed: "2-4 business days",
    fees: "From €7.50",
    exchangeRateMargin: "1-2%",
    deliveryMethods: ["Bank transfer"],
    pros: [
      "Trusted Dutch bank",
      "Good for large transfers",
      "Negotiable rates for big amounts",
    ],
    cons: [
      "Requires ING account",
      "Not the cheapest",
      "Slower than specialist services",
    ],
    url: "https://ing.nl",
  },
];

export function getProviders(country: Country): Provider[] {
  if (country === "france") return franceProviders;
  if (country === "netherlands") return netherlandsProviders;
  return providers[country] || providers.uk;
}

export function getFeaturedProviders(country: Country): Provider[] {
  const providerList = getProviders(country);
  return providerList.filter((p) => p.featured);
}
