// Caribbean destination countries and their currencies

export type Destination = {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencyCode: string;
  peggedToUSD: boolean;
  pegRate?: number; // How many local currency = 1 USD
  region: "caribbean" | "eastern-caribbean";
  popular: boolean;
};

export const destinations: Destination[] = [
  // Major destinations (own currencies)
  {
    code: "barbados",
    name: "Barbados",
    flag: "🇧🇧",
    currency: "Barbados Dollar",
    currencyCode: "BBD",
    peggedToUSD: true,
    pegRate: 2.0,
    region: "caribbean",
    popular: true,
  },
  {
    code: "jamaica",
    name: "Jamaica",
    flag: "🇯🇲",
    currency: "Jamaican Dollar",
    currencyCode: "JMD",
    peggedToUSD: false,
    region: "caribbean",
    popular: true,
  },
  {
    code: "trinidad",
    name: "Trinidad & Tobago",
    flag: "🇹🇹",
    currency: "Trinidad & Tobago Dollar",
    currencyCode: "TTD",
    peggedToUSD: false,
    region: "caribbean",
    popular: true,
  },
  {
    code: "bahamas",
    name: "Bahamas",
    flag: "🇧🇸",
    currency: "Bahamian Dollar",
    currencyCode: "BSD",
    peggedToUSD: true,
    pegRate: 1.0,
    region: "caribbean",
    popular: true,
  },
  {
    code: "bermuda",
    name: "Bermuda",
    flag: "🇧🇲",
    currency: "Bermudian Dollar",
    currencyCode: "BMD",
    peggedToUSD: true,
    pegRate: 1.0,
    region: "caribbean",
    popular: false,
  },
  {
    code: "belize",
    name: "Belize",
    flag: "🇧🇿",
    currency: "Belize Dollar",
    currencyCode: "BZD",
    peggedToUSD: true,
    pegRate: 2.0,
    region: "caribbean",
    popular: false,
  },
  {
    code: "guyana",
    name: "Guyana",
    flag: "🇬🇾",
    currency: "Guyanese Dollar",
    currencyCode: "GYD",
    peggedToUSD: false,
    region: "caribbean",
    popular: false,
  },

  // Eastern Caribbean Dollar (XCD) countries
  {
    code: "saint-lucia",
    name: "Saint Lucia",
    flag: "🇱🇨",
    currency: "Eastern Caribbean Dollar",
    currencyCode: "XCD",
    peggedToUSD: true,
    pegRate: 2.7,
    region: "eastern-caribbean",
    popular: true,
  },
  {
    code: "grenada",
    name: "Grenada",
    flag: "🇬🇩",
    currency: "Eastern Caribbean Dollar",
    currencyCode: "XCD",
    peggedToUSD: true,
    pegRate: 2.7,
    region: "eastern-caribbean",
    popular: true,
  },
  {
    code: "antigua",
    name: "Antigua & Barbuda",
    flag: "🇦🇬",
    currency: "Eastern Caribbean Dollar",
    currencyCode: "XCD",
    peggedToUSD: true,
    pegRate: 2.7,
    region: "eastern-caribbean",
    popular: true,
  },
  {
    code: "dominica",
    name: "Dominica",
    flag: "🇩🇲",
    currency: "Eastern Caribbean Dollar",
    currencyCode: "XCD",
    peggedToUSD: true,
    pegRate: 2.7,
    region: "eastern-caribbean",
    popular: false,
  },
  {
    code: "st-kitts",
    name: "Saint Kitts & Nevis",
    flag: "🇰🇳",
    currency: "Eastern Caribbean Dollar",
    currencyCode: "XCD",
    peggedToUSD: true,
    pegRate: 2.7,
    region: "eastern-caribbean",
    popular: false,
  },
  {
    code: "st-vincent",
    name: "Saint Vincent & the Grenadines",
    flag: "🇻🇨",
    currency: "Eastern Caribbean Dollar",
    currencyCode: "XCD",
    peggedToUSD: true,
    pegRate: 2.7,
    region: "eastern-caribbean",
    popular: false,
  },
  {
    code: "anguilla",
    name: "Anguilla",
    flag: "🇦🇮",
    currency: "Eastern Caribbean Dollar",
    currencyCode: "XCD",
    peggedToUSD: true,
    pegRate: 2.7,
    region: "eastern-caribbean",
    popular: false,
  },
  {
    code: "montserrat",
    name: "Montserrat",
    flag: "🇲🇸",
    currency: "Eastern Caribbean Dollar",
    currencyCode: "XCD",
    peggedToUSD: true,
    pegRate: 2.7,
    region: "eastern-caribbean",
    popular: false,
  },
];

export function getDestination(code: string): Destination | undefined {
  return destinations.find((d) => d.code === code);
}

export function getPopularDestinations(): Destination[] {
  return destinations.filter((d) => d.popular);
}

export function getDestinationsByRegion(region: string): Destination[] {
  return destinations.filter((d) => d.region === region);
}

export function getPeggedDestinations(): Destination[] {
  return destinations.filter((d) => d.peggedToUSD);
}

export function getXCDCountries(): Destination[] {
  return destinations.filter((d) => d.currencyCode === "XCD");
}
