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

type Step = 1 | 2 | 3 | 4;

interface SearchForm {
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  passengers: number;
}

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
  const [currentStep, setCurrentStep] = useState<Step>(1);
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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSearch = async () => {
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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return searchForm.origin !== "";
      case 2:
        return searchForm.destination !== "";
      case 3:
        return searchForm.departure_date !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  const generateBookingUrl = (flight: FlightResult): string => {
    return `https://www.skyscanner.net/transport/flights/${flight.departure.airport}/${flight.arrival.airport}/`;
  };

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/flights" className="text-gold hover:text-gold-light text-sm mb-3 inline-block">
            ← Back to Flights
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            AI Flight Finder
          </h1>
          <p className="mt-2 text-gray-300">
            Find flights with our step-by-step guide
          </p>
          <p className="text-sm text-gold">
            ✨ Live prices from airlines
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? "bg-gold text-navy"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 w-16 md:w-24 ml-2 ${
                      currentStep > step ? "bg-gold" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-navy">
              Step {currentStep} of 4
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {currentStep === 1 && "Where are you flying from?"}
              {currentStep === 2 && "Where are you flying to?"}
              {currentStep === 3 && "When do you want to travel?"}
              {currentStep === 4 && "How many passengers?"}
            </p>
          </div>

          {/* Step 1: Origin */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select your departure city
                </label>
                <select
                  value={searchForm.origin}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, origin: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="">Choose departure city</option>
                  <optgroup label="🌍 International">
                    {originCities.filter(city => city.country !== "Caribbean").map(city => (
                      <option key={city.code} value={city.code}>
                        {city.name} ({city.code}) - {city.country}
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
            </div>
          )}

          {/* Step 2: Destination */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select your destination
                </label>
                <select
                  value={searchForm.destination}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="">Choose destination</option>
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
            </div>
          )}

          {/* Step 3: Dates */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure date *
                  </label>
                  <input
                    type="date"
                    value={searchForm.departure_date}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, departure_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return date (optional)
                  </label>
                  <input
                    type="date"
                    value={searchForm.return_date}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, return_date: e.target.value }))}
                    min={searchForm.departure_date || new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Passengers */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of passengers
                </label>
                <select
                  value={searchForm.passengers}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} passenger{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-navy mb-2">Search Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>From:</strong> {getOriginName(searchForm.origin)} ({searchForm.origin})</p>
                  <p><strong>To:</strong> {getDestinationName(searchForm.destination)} ({searchForm.destination})</p>
                  <p><strong>Departure:</strong> {searchForm.departure_date}</p>
                  {searchForm.return_date && (
                    <p><strong>Return:</strong> {searchForm.return_date}</p>
                  )}
                  <p><strong>Passengers:</strong> {searchForm.passengers}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2 bg-gold hover:bg-gold-light disabled:bg-gray-200 text-navy font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSearch}
                disabled={isSearching || !canProceed()}
                className="px-8 py-2 bg-gold hover:bg-gold-light disabled:bg-gray-200 text-navy font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Search Flights"}
              </button>
            )}
          </div>

          {/* Search Error */}
          {searchError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">❌ {searchError}</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-bold text-navy mb-4">
                ✈️ {getOriginName(searchForm.origin)} → {getDestinationName(searchForm.destination)} 
                ({searchResults.length} results)
              </h3>
              
              <div className="space-y-3">
                {['cheapest', 'fastest', 'best-value'].map(category => {
                  const categoryFlights = searchResults.filter(f => f.category === category);
                  if (categoryFlights.length === 0) return null;
                  
                  const categoryIcon = category === 'cheapest' ? '🏆' : category === 'fastest' ? '✈️' : '💡';
                  const categoryName = category === 'cheapest' ? 'Cheapest' : category === 'fastest' ? 'Fastest' : 'Best Value';
                  
                  return (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-navy mb-2 flex items-center gap-1">
                        {categoryIcon} {categoryName}
                      </h4>
                      {categoryFlights.slice(0, 1).map(flight => (
                        <FlightCard key={`cat-${flight.id}`} flight={flight} generateBookingUrl={generateBookingUrl} />
                      ))}
                    </div>
                  );
                })}
                
                {searchResults.filter(f => !f.category).slice(0, 6).map(flight => (
                  <FlightCard key={flight.id} flight={flight} generateBookingUrl={generateBookingUrl} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FlightCard({ 
  flight, 
  generateBookingUrl 
}: { 
  flight: FlightResult; 
  generateBookingUrl: (flight: FlightResult) => string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
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
          <p className="font-bold text-green-600">
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
      
      {flight.category && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            flight.category === 'cheapest' ? 'bg-green-100 text-green-700' :
            flight.category === 'fastest' ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {flight.category === 'cheapest' ? '🏆 Cheapest' :
             flight.category === 'fastest' ? '✈️ Fastest' : '💡 Best Value'}
          </span>
        </div>
      )}
    </div>
  );
}