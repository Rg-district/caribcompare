// Full Caribbean destinations database

export type Destination = {
  code: string;           // Airport/destination code
  name: string;
  country: string;
  flag: string;
  currencyCode: string;
  currencyName: string;
  peggedToUSD: boolean;
  region: "anglophone" | "french" | "dutch" | "spanish" | "other";
  popularFrom: string[];  // Origin countries with direct/popular routes
  description?: string;
};

export const destinations: Destination[] = [
  // ═══════════════════════════════════════════════════════════════════
  // ANGLOPHONE CARIBBEAN
  // ═══════════════════════════════════════════════════════════════════
  {
    code: "BGI",
    name: "Barbados",
    country: "Barbados",
    flag: "🇧🇧",
    currencyCode: "BBD",
    currencyName: "Barbadian Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us", "canada"],
    description: "Little England of the Caribbean. Major hub for UK diaspora.",
  },
  {
    code: "KIN",
    name: "Jamaica",
    country: "Jamaica",
    flag: "🇯🇲",
    currencyCode: "JMD",
    currencyName: "Jamaican Dollar",
    peggedToUSD: false,
    region: "anglophone",
    popularFrom: ["uk", "us", "canada"],
    description: "Largest English-speaking Caribbean nation. Major tourism destination.",
  },
  {
    code: "POS",
    name: "Trinidad & Tobago",
    country: "Trinidad and Tobago",
    flag: "🇹🇹",
    currencyCode: "TTD",
    currencyName: "Trinidad & Tobago Dollar",
    peggedToUSD: false,
    region: "anglophone",
    popularFrom: ["uk", "us", "canada"],
    description: "Oil-rich twin islands. Home of Carnival and calypso.",
  },
  {
    code: "GEO",
    name: "Guyana",
    country: "Guyana",
    flag: "🇬🇾",
    currencyCode: "GYD",
    currencyName: "Guyanese Dollar",
    peggedToUSD: false,
    region: "anglophone",
    popularFrom: ["uk", "us", "canada"],
    description: "South American Caribbean. Growing economy with new oil discoveries.",
  },
  {
    code: "ANU",
    name: "Antigua",
    country: "Antigua and Barbuda",
    flag: "🇦🇬",
    currencyCode: "XCD",
    currencyName: "East Caribbean Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us", "canada"],
    description: "365 beaches. Popular for sailing and luxury tourism.",
  },
  {
    code: "UVF",
    name: "St Lucia",
    country: "Saint Lucia",
    flag: "🇱🇨",
    currencyCode: "XCD",
    currencyName: "East Caribbean Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us", "canada"],
    description: "The Pitons. Popular honeymoon and wedding destination.",
  },
  {
    code: "GND",
    name: "Grenada",
    country: "Grenada",
    flag: "🇬🇩",
    currencyCode: "XCD",
    currencyName: "East Caribbean Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us", "canada"],
    description: "Spice Island. Known for nutmeg and pristine beaches.",
  },
  {
    code: "DOM",
    name: "Dominica",
    country: "Dominica",
    flag: "🇩🇲",
    currencyCode: "XCD",
    currencyName: "East Caribbean Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us"],
    description: "Nature Island. Rainforests, waterfalls, eco-tourism.",
  },
  {
    code: "SVD",
    name: "St Vincent",
    country: "St Vincent and the Grenadines",
    flag: "🇻🇨",
    currencyCode: "XCD",
    currencyName: "East Caribbean Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us"],
    description: "Grenadines islands. Sailing paradise.",
  },
  {
    code: "SKB",
    name: "St Kitts",
    country: "St Kitts and Nevis",
    flag: "🇰🇳",
    currencyCode: "XCD",
    currencyName: "East Caribbean Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us"],
    description: "Sugar heritage. Citizenship by investment programme.",
  },
  {
    code: "NAS",
    name: "Bahamas",
    country: "The Bahamas",
    flag: "🇧🇸",
    currencyCode: "BSD",
    currencyName: "Bahamian Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["us", "uk", "canada"],
    description: "700 islands. Nassau, Paradise Island, Exumas.",
  },
  {
    code: "BZE",
    name: "Belize",
    country: "Belize",
    flag: "🇧🇿",
    currencyCode: "BZD",
    currencyName: "Belize Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["us"],
    description: "Central American Caribbean. Mayan ruins, barrier reef.",
  },
  {
    code: "BDA",
    name: "Bermuda",
    country: "Bermuda",
    flag: "🇧🇲",
    currencyCode: "BMD",
    currencyName: "Bermudian Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us"],
    description: "North Atlantic. British territory, pink sand beaches.",
  },
  {
    code: "EIS",
    name: "British Virgin Islands",
    country: "British Virgin Islands",
    flag: "🇻🇬",
    currencyCode: "USD",
    currencyName: "US Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us"],
    description: "Sailing capital. Tortola, Virgin Gorda.",
  },
  {
    code: "GCM",
    name: "Cayman Islands",
    country: "Cayman Islands",
    flag: "🇰🇾",
    currencyCode: "KYD",
    currencyName: "Cayman Islands Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["uk", "us"],
    description: "Financial centre. Seven Mile Beach, diving.",
  },
  {
    code: "PLS",
    name: "Turks & Caicos",
    country: "Turks and Caicos Islands",
    flag: "🇹🇨",
    currencyCode: "USD",
    currencyName: "US Dollar",
    peggedToUSD: true,
    region: "anglophone",
    popularFrom: ["us", "uk", "canada"],
    description: "Grace Bay Beach. Luxury resorts.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // FRENCH CARIBBEAN
  // ═══════════════════════════════════════════════════════════════════
  {
    code: "FDF",
    name: "Martinique",
    country: "Martinique",
    flag: "🇲🇶",
    currencyCode: "EUR",
    currencyName: "Euro",
    peggedToUSD: false,
    region: "french",
    popularFrom: ["france", "us", "canada"],
    description: "French overseas region. Rum, beaches, Mount Pelée.",
  },
  {
    code: "PTP",
    name: "Guadeloupe",
    country: "Guadeloupe",
    flag: "🇬🇵",
    currencyCode: "EUR",
    currencyName: "Euro",
    peggedToUSD: false,
    region: "french",
    popularFrom: ["france", "us", "canada"],
    description: "Butterfly-shaped islands. French Caribbean culture.",
  },
  {
    code: "SFG",
    name: "Saint Martin",
    country: "Saint Martin (French)",
    flag: "🇲🇫",
    currencyCode: "EUR",
    currencyName: "Euro",
    peggedToUSD: false,
    region: "french",
    popularFrom: ["france", "us", "netherlands"],
    description: "French side of shared island. Cuisine, beaches.",
  },
  {
    code: "SBH",
    name: "St Barthélemy",
    country: "Saint Barthélemy",
    flag: "🇧🇱",
    currencyCode: "EUR",
    currencyName: "Euro",
    peggedToUSD: false,
    region: "french",
    popularFrom: ["france", "us"],
    description: "Luxury island. Celebrity destination, high-end resorts.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // DUTCH CARIBBEAN
  // ═══════════════════════════════════════════════════════════════════
  {
    code: "AUA",
    name: "Aruba",
    country: "Aruba",
    flag: "🇦🇼",
    currencyCode: "AWG",
    currencyName: "Aruban Florin",
    peggedToUSD: true,
    region: "dutch",
    popularFrom: ["netherlands", "us", "canada"],
    description: "One Happy Island. Desert climate, pristine beaches.",
  },
  {
    code: "CUR",
    name: "Curaçao",
    country: "Curaçao",
    flag: "🇨🇼",
    currencyCode: "ANG",
    currencyName: "Netherlands Antillean Guilder",
    peggedToUSD: true,
    region: "dutch",
    popularFrom: ["netherlands", "us"],
    description: "Willemstad's colourful architecture. Diving, culture.",
  },
  {
    code: "SXM",
    name: "Sint Maarten",
    country: "Sint Maarten (Dutch)",
    flag: "🇸🇽",
    currencyCode: "ANG",
    currencyName: "Netherlands Antillean Guilder",
    peggedToUSD: true,
    region: "dutch",
    popularFrom: ["netherlands", "us", "france"],
    description: "Dutch side of shared island. Maho Beach plane landings.",
  },
  {
    code: "BON",
    name: "Bonaire",
    country: "Bonaire",
    flag: "🇧🇶",
    currencyCode: "USD",
    currencyName: "US Dollar",
    peggedToUSD: true,
    region: "dutch",
    popularFrom: ["netherlands", "us"],
    description: "Divers' paradise. Special municipality of Netherlands.",
  },
  {
    code: "SAB",
    name: "Saba",
    country: "Saba",
    flag: "🇧🇶",
    currencyCode: "USD",
    currencyName: "US Dollar",
    peggedToUSD: true,
    region: "dutch",
    popularFrom: ["netherlands"],
    description: "Unspoiled nature. Hiking, diving. Smallest island.",
  },
  {
    code: "EUX",
    name: "Sint Eustatius",
    country: "Sint Eustatius",
    flag: "🇧🇶",
    currencyCode: "USD",
    currencyName: "US Dollar",
    peggedToUSD: true,
    region: "dutch",
    popularFrom: ["netherlands"],
    description: "Statia. Historic trading post, diving.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPANISH CARIBBEAN
  // ═══════════════════════════════════════════════════════════════════
  {
    code: "SDQ",
    name: "Dominican Republic",
    country: "Dominican Republic",
    flag: "🇩🇴",
    currencyCode: "DOP",
    currencyName: "Dominican Peso",
    peggedToUSD: false,
    region: "spanish",
    popularFrom: ["us", "canada", "uk"],
    description: "Punta Cana, Santo Domingo. Largest Caribbean tourism.",
  },
  {
    code: "SJU",
    name: "Puerto Rico",
    country: "Puerto Rico",
    flag: "🇵🇷",
    currencyCode: "USD",
    currencyName: "US Dollar",
    peggedToUSD: true,
    region: "spanish",
    popularFrom: ["us"],
    description: "US territory. Old San Juan, El Yunque rainforest.",
  },
  {
    code: "HAV",
    name: "Cuba",
    country: "Cuba",
    flag: "🇨🇺",
    currencyCode: "CUP",
    currencyName: "Cuban Peso",
    peggedToUSD: false,
    region: "spanish",
    popularFrom: ["canada", "uk"],
    description: "Havana, classic cars. Restricted for US travellers.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // OTHER
  // ═══════════════════════════════════════════════════════════════════
  {
    code: "PAP",
    name: "Haiti",
    country: "Haiti",
    flag: "🇭🇹",
    currencyCode: "HTG",
    currencyName: "Haitian Gourde",
    peggedToUSD: false,
    region: "other",
    popularFrom: ["us", "canada", "france"],
    description: "French Creole heritage. Citadelle Laferrière.",
  },
  {
    code: "STT",
    name: "US Virgin Islands",
    country: "US Virgin Islands",
    flag: "🇻🇮",
    currencyCode: "USD",
    currencyName: "US Dollar",
    peggedToUSD: true,
    region: "other",
    popularFrom: ["us"],
    description: "St Thomas, St Croix, St John. US territory.",
  },
];

export function getDestination(code: string): Destination | undefined {
  return destinations.find(d => d.code === code);
}

export function getDestinationsByRegion(region: Destination["region"]): Destination[] {
  return destinations.filter(d => d.region === region);
}

export function getPopularDestinations(): Destination[] {
  // Return most popular ones for homepage display
  const popular = ["BGI", "KIN", "POS", "GEO", "ANU", "UVF", "AUA", "FDF"];
  return destinations.filter(d => popular.includes(d.code));
}

export function getDestinationsFrom(origin: string): Destination[] {
  return destinations.filter(d => d.popularFrom.includes(origin));
}

export function getAllDestinations(): Destination[] {
  return destinations;
}

export function getDestinationCount(): number {
  return destinations.length;
}
