"use client";

import { useState } from "react";
import Link from "next/link";

// Route data with typical prices and airlines
const routes = {
  uk: {
    flag: "🇬🇧",
    name: "United Kingdom",
    cities: ["London", "Manchester", "Birmingham"],
    destinations: [
      { code: "BGI", name: "Barbados", flag: "🇧🇧", airlines: ["British Airways", "Virgin Atlantic", "TUI"], typicalLow: 450, typicalHigh: 900, direct: true },
      { code: "KIN", name: "Jamaica", flag: "🇯🇲", airlines: ["British Airways", "Virgin Atlantic", "TUI"], typicalLow: 480, typicalHigh: 950, direct: true },
      { code: "POS", name: "Trinidad", flag: "🇹🇹", airlines: ["British Airways", "Caribbean Airlines"], typicalLow: 520, typicalHigh: 1000, direct: true },
      { code: "GEO", name: "Guyana", flag: "🇬🇾", airlines: ["British Airways", "Caribbean Airlines"], typicalLow: 550, typicalHigh: 1100, direct: false },
      { code: "ANU", name: "Antigua", flag: "🇦🇬", airlines: ["British Airways", "Virgin Atlantic"], typicalLow: 480, typicalHigh: 900, direct: true },
      { code: "UVF", name: "St Lucia", flag: "🇱🇨", airlines: ["British Airways", "Virgin Atlantic", "TUI"], typicalLow: 500, typicalHigh: 950, direct: true },
    ],
  },
  us: {
    flag: "🇺🇸",
    name: "United States",
    cities: ["Miami", "New York (JFK)", "Atlanta", "Fort Lauderdale"],
    destinations: [
      { code: "BGI", name: "Barbados", flag: "🇧🇧", airlines: ["JetBlue", "American", "Caribbean Airlines"], typicalLow: 280, typicalHigh: 600, direct: true },
      { code: "KIN", name: "Jamaica", flag: "🇯🇲", airlines: ["JetBlue", "American", "Spirit", "Southwest"], typicalLow: 200, typicalHigh: 450, direct: true },
      { code: "POS", name: "Trinidad", flag: "🇹🇹", airlines: ["Caribbean Airlines", "JetBlue"], typicalLow: 320, typicalHigh: 650, direct: true },
      { code: "SXM", name: "Sint Maarten", flag: "🇸🇽", airlines: ["JetBlue", "American", "United"], typicalLow: 250, typicalHigh: 500, direct: true },
      { code: "AUA", name: "Aruba", flag: "🇦🇼", airlines: ["JetBlue", "American", "Spirit"], typicalLow: 220, typicalHigh: 480, direct: true },
      { code: "CUR", name: "Curaçao", flag: "🇨🇼", airlines: ["American", "JetBlue"], typicalLow: 280, typicalHigh: 550, direct: true },
    ],
  },
  canada: {
    flag: "🇨🇦",
    name: "Canada",
    cities: ["Toronto", "Montreal"],
    destinations: [
      { code: "BGI", name: "Barbados", flag: "🇧🇧", airlines: ["WestJet", "Air Canada", "Sunwing"], typicalLow: 550, typicalHigh: 1100, direct: true },
      { code: "KIN", name: "Jamaica", flag: "🇯🇲", airlines: ["WestJet", "Air Canada", "Sunwing", "Flair"], typicalLow: 400, typicalHigh: 850, direct: true },
      { code: "POS", name: "Trinidad", flag: "🇹🇹", airlines: ["Caribbean Airlines", "Air Canada"], typicalLow: 600, typicalHigh: 1200, direct: true },
      { code: "ANU", name: "Antigua", flag: "🇦🇬", airlines: ["Air Canada", "WestJet"], typicalLow: 580, typicalHigh: 1100, direct: true },
    ],
  },
  france: {
    flag: "🇫🇷",
    name: "France",
    cities: ["Paris (CDG)", "Paris (ORY)", "Lyon"],
    destinations: [
      { code: "FDF", name: "Martinique", flag: "🇲🇶", airlines: ["Air France", "Corsair", "Air Caraïbes"], typicalLow: 350, typicalHigh: 700, direct: true },
      { code: "PTP", name: "Guadeloupe", flag: "🇬🇵", airlines: ["Air France", "Corsair", "Air Caraïbes"], typicalLow: 350, typicalHigh: 700, direct: true },
      { code: "SXM", name: "Saint Martin", flag: "🇲🇫", airlines: ["Air France", "Air Caraïbes"], typicalLow: 400, typicalHigh: 800, direct: true },
      { code: "SBH", name: "St Barthélemy", flag: "🇧🇱", airlines: ["Air France (via SXM)", "Air Caraïbes"], typicalLow: 500, typicalHigh: 950, direct: false },
    ],
  },
  netherlands: {
    flag: "🇳🇱",
    name: "Netherlands",
    cities: ["Amsterdam (AMS)"],
    destinations: [
      { code: "AUA", name: "Aruba", flag: "🇦🇼", airlines: ["KLM", "TUI Netherlands"], typicalLow: 500, typicalHigh: 950, direct: true },
      { code: "CUR", name: "Curaçao", flag: "🇨🇼", airlines: ["KLM", "TUI Netherlands"], typicalLow: 500, typicalHigh: 950, direct: true },
      { code: "SXM", name: "Sint Maarten", flag: "🇸🇽", airlines: ["KLM", "TUI Netherlands"], typicalLow: 520, typicalHigh: 980, direct: true },
      { code: "BON", name: "Bonaire", flag: "🇧🇶", airlines: ["KLM", "TUI Netherlands"], typicalLow: 550, typicalHigh: 1000, direct: true },
    ],
  },
};

// Origin and destination mappings for search
const originOptions = [
  { code: "LHR", name: "London", country: "UK" },
  { code: "MAN", name: "Manchester", country: "UK" },
  { code: "JFK", name: "New York", country: "USA" },
  { code: "MIA", name: "Miami", country: "USA" },
  { code: "YYZ", name: "Toronto", country: "Canada" },
  { code: "CDG", name: "Paris", country: "France" },
  { code: "AMS", name: "Amsterdam", country: "Netherlands" },
];

const destinationOptions = [
  { code: "BGI", name: "Barbados", flag: "🇧🇧" },
  { code: "KIN", name: "Jamaica", flag: "🇯🇲" },
  { code: "POS", name: "Trinidad", flag: "🇹🇹" },
  { code: "ANU", name: "Antigua", flag: "🇦🇬" },
  { code: "UVF", name: "St Lucia", flag: "🇱🇨" },
  { code: "GND", name: "Grenada", flag: "🇬🇩" },
  { code: "NAS", name: "Bahamas", flag: "🇧🇸" },
  { code: "SXM", name: "Sint Maarten", flag: "🇸🇽" },
  { code: "AUA", name: "Aruba", flag: "🇦🇼" },
  { code: "CUR", name: "Curaçao", flag: "🇨🇼" },
  { code: "GCM", name: "Cayman Islands", flag: "🇰🇾" },
  { code: "PLS", name: "Turks & Caicos", flag: "🇹🇨" },
  { code: "SDQ", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "SJU", name: "Puerto Rico", flag: "🇵🇷" },
  { code: "FDF", name: "Martinique", flag: "🇲🇶" },
  { code: "PTP", name: "Guadeloupe", flag: "🇬🇵" },
];

interface FlightResult {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo?: string;
  price: {
    amount: string;
    currency: string;
  };
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  segments: Array<{
    departure: string;
    arrival: string;
    duration: string;
    airline: string;
  }>;
  isReturnFlight: boolean;
}

function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount);
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  return `${symbol}${num.toLocaleString()}`;
}

export default function FlightsPage() {
  const [selectedOrigin, setSelectedOrigin] = useState<keyof typeof routes>("uk");
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  
  // Search form state
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDepartureDate, setSearchDepartureDate] = useState("");
  const [searchReturnDate, setSearchReturnDate] = useState("");
  const [searchResults, setSearchResults] = useState<FlightResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const currentRoutes = routes[selectedOrigin];
  const selectedRoute = selectedDestination 
    ? currentRoutes.destinations.find(d => d.code === selectedDestination)
    : null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchOrigin || !searchDestination || !searchDepartureDate) {
      setSearchError("Please fill in origin, destination, and departure date");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: searchOrigin,
          destination: searchDestination,
          departure_date: searchDepartureDate,
          return_date: searchReturnDate || undefined,
          passengers: 1,
          cabin_class: 'economy'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to search flights');
      }

      const data = await response.json();
      setSearchResults(data.data || []);
      
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Failed to search flights');
    } finally {
      setIsSearching(false);
    }
  };

  const generateBookingUrl = (flight: FlightResult): string => {
    return `https://www.skyscanner.net/transport/flights/${flight.departure.airport}/${flight.arrival.airport}/`;
  };

  // Get min departure date (today)
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="text-gold hover:text-gold-light text-sm mb-4 inline-block">
            ← Back to CaribCompare
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            ✈️ Caribbean Flight Finder
          </h1>
          <p className="mt-3 text-gray-300 max-w-2xl">
            Find the cheapest flights to the Caribbean from the UK, USA, Canada, France, and Netherlands.
          </p>
          
          {/* AI Finder CTA */}
          <Link
            href="/flights/finder"
            className="mt-6 inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <span className="text-xl">🤖</span>
            Try AI Flight Finder
            <span className="text-xs bg-navy/20 px-2 py-0.5 rounded">Live Prices</span>
          </Link>
        </div>
      </section>

      {/* Real-time Flight Search */}
      <section className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
            🔍 Search Live Flight Prices
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <select
                  value={searchOrigin}
                  onChange={(e) => setSearchOrigin(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="">Select origin</option>
                  {originOptions.map(option => (
                    <option key={option.code} value={option.code}>
                      {option.name}, {option.country}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <select
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="">Select destination</option>
                  {destinationOptions.map(option => (
                    <option key={option.code} value={option.code}>
                      {option.flag} {option.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure
                </label>
                <input
                  type="date"
                  value={searchDepartureDate}
                  onChange={(e) => setSearchDepartureDate(e.target.value)}
                  min={today}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return (optional)
                </label>
                <input
                  type="date"
                  value={searchReturnDate}
                  onChange={(e) => setSearchReturnDate(e.target.value)}
                  min={searchDepartureDate || today}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-gold hover:bg-gold-light disabled:bg-gray-200 text-navy font-semibold px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Search Flights"}
              </button>
              
              {searchError && (
                <p className="text-red-600 text-sm">{searchError}</p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              ✈️ Live Flight Results
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {searchResults.length} flights found
              </span>
            </h3>
            
            <div className="space-y-4">
              {searchResults.map(flight => (
                <div key={flight.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {flight.airlineLogo && (
                          <img 
                            src={flight.airlineLogo} 
                            alt={flight.airline}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-navy text-sm">{flight.airline}</p>
                          <p className="text-xs text-gray-500">{flight.airlineCode}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <p className="font-medium">{flight.departure.airport}</p>
                          <p className="text-xs text-gray-500">{flight.departure.time}</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="text-xs text-gray-500">{flight.duration}</p>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-navy rounded-full"></div>
                            {flight.stops > 0 && (
                              <>
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                {flight.stops > 1 && (
                                  <>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                  </>
                                )}
                              </>
                            )}
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <div className="w-2 h-2 bg-navy rounded-full"></div>
                          </div>
                          {flight.stops > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{flight.arrival.airport}</p>
                          <p className="text-xs text-gray-500">{flight.arrival.time}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="font-bold text-green-600 text-lg">
                        {formatCurrency(flight.price.amount, flight.price.currency)}
                      </p>
                      <a
                        href={generateBookingUrl(flight)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 bg-gold hover:bg-gold-light text-navy font-medium px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Book Direct
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Prices shown are live from airlines and may change quickly. 
                Book soon if you find a good deal! Prices include taxes and fees.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Popular Routes Section */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-xl font-bold text-navy mb-6">Popular Caribbean Routes</h2>
        
        {/* Origin Selection */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-navy mb-4">Browse by departure region:</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(routes).map(([key, data]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedOrigin(key as keyof typeof routes);
                  setSelectedDestination(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                  selectedOrigin === key
                    ? "bg-navy text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-navy"
                }`}
              >
                <span className="text-xl">{data.flag}</span>
                <span className="font-medium">{data.name}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Flying from: {currentRoutes.cities.join(", ")}
          </p>
        </div>

        {/* Destination Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRoutes.destinations.map((dest) => (
            <div
              key={dest.code}
              onClick={() => setSelectedDestination(dest.code)}
              className={`bg-white rounded-xl border p-5 cursor-pointer transition-all ${
                selectedDestination === dest.code
                  ? "border-gold shadow-md ring-2 ring-gold/20"
                  : "border-gray-100 hover:border-gold hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{dest.flag}</span>
                <div>
                  <h3 className="font-bold text-navy">{dest.name}</h3>
                  <p className="text-xs text-gray-500">{dest.code}</p>
                </div>
                {dest.direct && (
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Direct
                  </span>
                )}
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500">Typical price range</p>
                  <p className="text-lg font-bold text-navy">
                    {selectedOrigin === "us" || selectedOrigin === "canada" ? "$" : 
                     selectedOrigin === "france" || selectedOrigin === "netherlands" ? "€" : "£"}
                    {dest.typicalLow} – {dest.typicalHigh}
                  </p>
                </div>
                <p className="text-xs text-gray-400">return</p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Airlines:</p>
                <p className="text-sm text-navy">{dest.airlines.slice(0, 3).join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search Panel */}
      {selectedRoute && (
        <section className="max-w-6xl mx-auto px-4 mt-8">
          <div className="bg-gradient-to-r from-navy to-navy-light rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">
              Route Guide: {currentRoutes.cities[0]} → {selectedRoute.name}
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              Compare prices across multiple search engines to find the best deal.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href={`https://www.skyscanner.net/transport/flights/${currentRoutes.cities[0].split(" ")[0].toLowerCase()}/${selectedRoute.code.toLowerCase()}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
              >
                <p className="text-2xl mb-1">🔍</p>
                <p className="font-semibold">Skyscanner</p>
                <p className="text-xs text-gray-300">Best for flexible dates</p>
              </a>
              
              <a
                href={`https://www.kayak.com/flights/${currentRoutes.cities[0].split(" ")[0].toLowerCase()}-${selectedRoute.code.toLowerCase()}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
              >
                <p className="text-2xl mb-1">🛫</p>
                <p className="font-semibold">Kayak</p>
                <p className="text-xs text-gray-300">Price alerts & tracking</p>
              </a>
              
              <a
                href={`https://www.google.com/travel/flights?q=flights%20from%20${currentRoutes.cities[0].split(" ")[0]}%20to%20${selectedRoute.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
              >
                <p className="text-2xl mb-1">✈️</p>
                <p className="font-semibold">Google Flights</p>
                <p className="text-xs text-gray-300">Calendar view</p>
              </a>
            </div>

            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <p className="text-sm">
                <strong>💡 Tip:</strong> {selectedRoute.name} flights are typically cheapest 
                {selectedOrigin === "uk" ? " in September–November (avoid school holidays)" :
                 selectedOrigin === "france" ? " outside French school holidays (avoid July–August)" :
                 " 6-8 weeks before departure"}. 
                Set up price alerts on Skyscanner for the best deals.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Best Time to Book */}
      <section className="max-w-6xl mx-auto px-4 mt-12 mb-8">
        <h2 className="text-xl font-bold text-navy mb-4">When to Book Caribbean Flights</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-3xl mb-2">📅</p>
            <h3 className="font-bold text-navy">Book 6-8 weeks ahead</h3>
            <p className="text-sm text-gray-600 mt-1">
              Sweet spot for most Caribbean routes. Earlier for Christmas/Easter.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-3xl mb-2">🌴</p>
            <h3 className="font-bold text-navy">Cheapest: Sep–Nov</h3>
            <p className="text-sm text-gray-600 mt-1">
              Shoulder season = lower prices. Still great weather (end of hurricane season).
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-3xl mb-2">🔔</p>
            <h3 className="font-bold text-navy">Set price alerts</h3>
            <p className="text-sm text-gray-600 mt-1">
              Use Skyscanner or Google Flights to track prices. Jump when they drop.
            </p>
          </div>
        </div>
      </section>

      {/* Airlines by Region */}
      <section className="max-w-6xl mx-auto px-4 mt-8 mb-12">
        <h2 className="text-xl font-bold text-navy mb-4">Airlines by Route</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-navy">From</th>
                <th className="text-left p-4 font-semibold text-navy">Key Airlines</th>
                <th className="text-left p-4 font-semibold text-navy">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-4">🇬🇧 UK</td>
                <td className="p-4">British Airways, Virgin Atlantic, TUI</td>
                <td className="p-4">Direct flights, frequent service</td>
              </tr>
              <tr>
                <td className="p-4">🇺🇸 USA</td>
                <td className="p-4">JetBlue, American, Caribbean Airlines</td>
                <td className="p-4">Budget options, most routes</td>
              </tr>
              <tr>
                <td className="p-4">🇨🇦 Canada</td>
                <td className="p-4">WestJet, Air Canada, Sunwing</td>
                <td className="p-4">Charter deals, winter escapes</td>
              </tr>
              <tr>
                <td className="p-4">🇫🇷 France</td>
                <td className="p-4">Air France, Corsair, Air Caraïbes</td>
                <td className="p-4">French Caribbean direct</td>
              </tr>
              <tr>
                <td className="p-4">🇳🇱 Netherlands</td>
                <td className="p-4">KLM, TUI Netherlands</td>
                <td className="p-4">Dutch Caribbean direct</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}