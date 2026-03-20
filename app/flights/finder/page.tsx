"use client";

import { useState } from "react";
import Link from "next/link";

type FlightResult = {
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
  bookingUrl?: string;
  isReturnFlight: boolean;
  category?: 'cheapest' | 'fastest' | 'best-value';
};

// Origin cities including Caribbean for outbound travel
const originCities = [
  // International origins
  { code: "LHR", name: "London", country: "UK" },
  { code: "MAN", name: "Manchester", country: "UK" },
  { code: "JFK", name: "New York", country: "USA" },
  { code: "MIA", name: "Miami", country: "USA" },
  { code: "YYZ", name: "Toronto", country: "Canada" },
  { code: "CDG", name: "Paris", country: "France" },
  { code: "AMS", name: "Amsterdam", country: "Netherlands" },
  // Caribbean origins  
  { code: "BGI", name: "Barbados", country: "Caribbean" },
  { code: "KIN", name: "Jamaica", country: "Caribbean" },
  { code: "POS", name: "Trinidad", country: "Caribbean" },
  { code: "ANU", name: "Antigua", country: "Caribbean" },
  { code: "UVF", name: "St Lucia", country: "Caribbean" },
  { code: "GND", name: "Grenada", country: "Caribbean" },
  { code: "NAS", name: "Bahamas", country: "Caribbean" },
  { code: "GCM", name: "Cayman Islands", country: "Caribbean" },
  { code: "SXM", name: "Sint Maarten", country: "Caribbean" },
  { code: "AUA", name: "Aruba", country: "Caribbean" },
  { code: "CUR", name: "Curaçao", country: "Caribbean" },
  { code: "BDA", name: "Bermuda", country: "Caribbean" }
];

// All destinations (Caribbean + International)
const allDestinations = [
  // Caribbean destinations
  { code: "BGI", name: "Barbados", flag: "🇧🇧", type: "Caribbean" },
  { code: "KIN", name: "Jamaica", flag: "🇯🇲", type: "Caribbean" },
  { code: "POS", name: "Trinidad", flag: "🇹🇹", type: "Caribbean" },
  { code: "ANU", name: "Antigua", flag: "🇦🇬", type: "Caribbean" },
  { code: "UVF", name: "St Lucia", flag: "🇱🇨", type: "Caribbean" },
  { code: "GND", name: "Grenada", flag: "🇬🇩", type: "Caribbean" },
  { code: "NAS", name: "Bahamas", flag: "🇧🇸", type: "Caribbean" },
  { code: "GCM", name: "Cayman Islands", flag: "🇰🇾", type: "Caribbean" },
  { code: "SXM", name: "Sint Maarten", flag: "🇸🇽", type: "Caribbean" },
  { code: "AUA", name: "Aruba", flag: "🇦🇼", type: "Caribbean" },
  { code: "CUR", name: "Curaçao", flag: "🇨🇼", type: "Caribbean" },
  { code: "BDA", name: "Bermuda", flag: "🇧🇲", type: "Caribbean" },
  { code: "PLS", name: "Turks & Caicos", flag: "🇹🇨", type: "Caribbean" },
  { code: "SDQ", name: "Dominican Republic", flag: "🇩🇴", type: "Caribbean" },
  { code: "SJU", name: "Puerto Rico", flag: "🇵🇷", type: "Caribbean" },
  { code: "FDF", name: "Martinique", flag: "🇲🇶", type: "Caribbean" },
  { code: "PTP", name: "Guadeloupe", flag: "🇬🇵", type: "Caribbean" },
  // International destinations
  { code: "LHR", name: "London", flag: "🇬🇧", type: "International" },
  { code: "MAN", name: "Manchester", flag: "🇬🇧", type: "International" },
  { code: "JFK", name: "New York", flag: "🇺🇸", type: "International" },
  { code: "MIA", name: "Miami", flag: "🇺🇸", type: "International" },
  { code: "YYZ", name: "Toronto", flag: "🇨🇦", type: "International" },
  { code: "CDG", name: "Paris", flag: "🇫🇷", type: "International" },
  { code: "AMS", name: "Amsterdam", flag: "🇳🇱", type: "International" }
];

interface SearchForm {
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  passengers: number;
}

type ResultsTab = 'cheapest' | 'fastest' | 'best-value';

function categorizeFlights(flights: FlightResult[]): FlightResult[] {
  if (flights.length === 0) return flights;
  
  // Sort by price for cheapest
  const sortedByPrice = [...flights].sort((a, b) => 
    parseFloat(a.price.amount) - parseFloat(b.price.amount)
  );
  
  // Sort by stops then duration for fastest
  const sortedBySpeed = [...flights].sort((a, b) => {
    if (a.stops !== b.stops) return a.stops - b.stops;
    const aDuration = parseDurationToMinutes(a.duration);
    const bDuration = parseDurationToMinutes(b.duration);
    return aDuration - bDuration;
  });
  
  // Calculate best value (price vs convenience score)
  const withValueScore = flights.map(flight => ({
    ...flight,
    valueScore: calculateValueScore(flight, flights)
  }));
  const sortedByValue = [...withValueScore].sort((a, b) => b.valueScore - a.valueScore);
  
  // Assign categories to top flights in each category
  if (sortedByPrice[0]) sortedByPrice[0].category = 'cheapest';
  if (sortedBySpeed[0] && sortedBySpeed[0].id !== sortedByPrice[0]?.id) {
    sortedBySpeed[0].category = 'fastest';
  }
  if (sortedByValue[0] && sortedByValue[0].id !== sortedByPrice[0]?.id && sortedByValue[0].id !== sortedBySpeed[0]?.id) {
    sortedByValue[0].category = 'best-value';
  }
  
  return flights;
}

function parseDurationToMinutes(duration: string): number {
  const hourMatch = duration.match(/(\d+)h/);
  const minuteMatch = duration.match(/(\d+)m/);
  
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  
  return hours * 60 + minutes;
}

function calculateValueScore(flight: FlightResult, allFlights: FlightResult[]): number {
  const prices = allFlights.map(f => parseFloat(f.price.amount));
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice;
  
  const priceScore = priceRange > 0 ? 1 - ((parseFloat(flight.price.amount) - minPrice) / priceRange) : 1;
  const stopsScore = flight.stops === 0 ? 1 : flight.stops === 1 ? 0.7 : 0.3;
  const durationMinutes = parseDurationToMinutes(flight.duration);
  const durationScore = Math.max(0, 1 - (durationMinutes - 300) / 600);
  
  return priceScore * 0.6 + stopsScore * 0.25 + durationScore * 0.15;
}

function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount);
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  return `${symbol}${num.toLocaleString()}`;
}

export default function FlightFinderPage() {
  const [searchForm, setSearchForm] = useState<SearchForm>({
    origin: "",
    destination: "",
    departure_date: "",
    return_date: "",
    passengers: 1
  });
  const [searchResults, setSearchResults] = useState<FlightResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ResultsTab>('cheapest');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchForm.origin || !searchForm.destination || !searchForm.departure_date) {
      setSearchError("Please complete all required fields");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: searchForm.origin,
          destination: searchForm.destination,
          departure_date: searchForm.departure_date,
          return_date: searchForm.return_date || undefined,
          passengers: searchForm.passengers,
          cabin_class: "economy"
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to search flights');
      }

      const data = await response.json();
      const categorizedFlights = categorizeFlights(data.data || []);
      setSearchResults(categorizedFlights);
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error instanceof Error ? error.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getOriginName = (code: string): string => {
    const origin = originCities.find(o => o.code === code);
    return origin ? origin.name : code;
  };

  const getDestinationName = (code: string): string => {
    const dest = allDestinations.find(d => d.code === code);
    return dest ? dest.name : code;
  };

  const getFlightsByTab = (tab: ResultsTab): FlightResult[] => {
    switch (tab) {
      case 'cheapest':
        return [...searchResults].sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount));
      case 'fastest':
        return [...searchResults].sort((a, b) => {
          if (a.stops !== b.stops) return a.stops - b.stops;
          return parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration);
        });
      case 'best-value':
        return [...searchResults].sort((a, b) => 
          calculateValueScore(b, searchResults) - calculateValueScore(a, searchResults)
        );
      default:
        return searchResults;
    }
  };

  const currentResults = getFlightsByTab(activeTab);

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/flights" className="text-gold hover:text-gold-light text-sm mb-3 inline-block">
            ← Back to Flights
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">
            ✈️ Flight Search
          </h1>
          <p className="mt-2 text-gray-300">
            Find and compare flights with direct airline booking
          </p>
          <p className="text-sm text-gold">
            ✨ Live prices from airlines
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  value={searchForm.origin}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, origin: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="">Select origin</option>
                  <optgroup label="🌍 International">
                    {originCities.filter(city => city.country !== "Caribbean").map(city => (
                      <option key={city.code} value={city.code}>
                        {city.name} ({city.code})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏝️ Caribbean">
                    {originCities.filter(city => city.country === "Caribbean").map(city => (
                      <option key={city.code} value={city.code}>
                        {city.name} ({city.code})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={searchForm.destination}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="">Select destination</option>
                  <optgroup label="🏝️ Caribbean">
                    {allDestinations.filter(dest => dest.type === "Caribbean").map(dest => (
                      <option key={dest.code} value={dest.code}>
                        {dest.flag} {dest.name} ({dest.code})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌍 International">
                    {allDestinations.filter(dest => dest.type === "International").map(dest => (
                      <option key={dest.code} value={dest.code}>
                        {dest.flag} {dest.name} ({dest.code})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <input
                  type="date"
                  value={searchForm.departure_date}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, departure_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                <input
                  type="date"
                  value={searchForm.return_date}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, return_date: e.target.value }))}
                  min={searchForm.departure_date || new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Optional"
                />
              </div>

              {/* Passengers */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <select
                  value={searchForm.passengers}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSearching || !searchForm.origin || !searchForm.destination || !searchForm.departure_date}
                className="w-full md:w-auto bg-gold hover:bg-gold-light disabled:bg-gray-200 text-navy font-bold px-12 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Search Flights"}
              </button>
            </div>
          </form>

          {/* Search Error */}
          {searchError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">❌ {searchError}</p>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy">
                ✈️ {getOriginName(searchForm.origin)} → {getDestinationName(searchForm.destination)}
              </h3>
              <p className="text-sm text-gray-500">
                {searchResults.length} flights found
              </p>
            </div>

            {/* Results Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {[
                { key: 'cheapest', label: '🏆 Cheapest', icon: '🏆' },
                { key: 'fastest', label: '✈️ Fastest', icon: '✈️' },
                { key: 'best-value', label: '💡 Best Value', icon: '💡' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as ResultsTab)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-navy'
                  }`}
                >
                  {tab.icon} {tab.label.replace(/^.+ /, '')}
                </button>
              ))}
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {currentResults.slice(0, 10).map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>

            {searchResults.length === 0 && !isSearching && (
              <div className="text-center py-8">
                <p className="text-gray-500">No flights found for these dates. Try different dates.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function FlightCard({ flight }: { flight: FlightResult }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {flight.airlineLogo && (
              <img 
                src={flight.airlineLogo} 
                alt={flight.airline}
                className="w-8 h-8 object-contain"
              />
            )}
            <div>
              <p className="font-semibold text-navy">{flight.airline}</p>
              <p className="text-xs text-gray-500">{flight.airlineCode}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="font-bold text-navy text-lg">{flight.departure.airport}</p>
              <p className="text-gray-600">{flight.departure.time}</p>
            </div>
            
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500 mb-1">{flight.duration}</p>
              <div className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 bg-navy rounded-full"></div>
                <div className="flex-1 h-px bg-gray-300 relative">
                  {flight.stops > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {Array.from({length: flight.stops}, (_, i) => (
                        <div key={i} className="w-2 h-2 bg-gray-400 rounded-full mx-1"></div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-3 h-3 bg-navy rounded-full"></div>
              </div>
              <div className="mt-1">
                {flight.stops === 0 ? (
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Direct
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">
                    {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-bold text-navy text-lg">{flight.arrival.airport}</p>
              <p className="text-gray-600">{flight.arrival.time}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right ml-6">
          <p className="font-bold text-2xl text-navy mb-2">
            {formatCurrency(flight.price.amount, flight.price.currency)}
          </p>
          <a
            href={flight.bookingUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold hover:bg-gold-light text-navy font-bold px-6 py-2 rounded-lg transition-colors"
          >
            Book with {flight.airline}
          </a>
        </div>
      </div>
    </div>
  );
}