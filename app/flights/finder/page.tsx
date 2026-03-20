"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
  flightResults?: FlightResult[];
  isSearching?: boolean;
};

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

// IATA code mappings
const cityToIata: Record<string, string> = {
  london: "LHR",
  manchester: "MAN", 
  newyork: "JFK",
  "new york": "JFK",
  nyc: "JFK",
  miami: "MIA",
  toronto: "YYZ",
  paris: "CDG",
  amsterdam: "AMS"
};

const caribbeanDestinations: Record<string, string> = {
  barbados: "BGI",
  jamaica: "KIN",
  "trinidad": "POS",
  "tobago": "POS", 
  antigua: "ANU",
  "st lucia": "UVF",
  "saint lucia": "UVF",
  grenada: "GND", 
  "st vincent": "SVD",
  "saint vincent": "SVD",
  dominica: "DOM",
  "st kitts": "SKB",
  "saint kitts": "SKB",
  "nevis": "SKB",
  bahamas: "NAS",
  nassau: "NAS",
  bermuda: "BDA",
  "cayman": "GCM",
  "cayman islands": "GCM",
  "turks and caicos": "PLS",
  "turks caicos": "PLS",
  aruba: "AUA",
  "curacao": "CUR",
  "curaçao": "CUR",
  "sint maarten": "SXM",
  "st maarten": "SXM",
  "saint martin": "SXM",
  martinique: "FDF",
  guadeloupe: "PTP",
  "dominican republic": "SDQ",
  "santo domingo": "SDQ",
  "punta cana": "PUJ",
  "puerto rico": "SJU",
  "san juan": "SJU"
};

// Flight search conversation states
type ConversationState = 'initial' | 'need_origin' | 'need_destination' | 'need_dates' | 'searching' | 'results';

interface SearchParams {
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  passengers?: number;
}

function parseUserInput(input: string): {
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  passengers?: number;
  intent?: string;
} {
  const text = input.toLowerCase().trim();
  
  // Look for origin cities
  let origin: string | undefined;
  for (const [city, code] of Object.entries(cityToIata)) {
    if (text.includes(city)) {
      origin = code;
      break;
    }
  }
  
  // Look for Caribbean destinations
  let destination: string | undefined;
  for (const [place, code] of Object.entries(caribbeanDestinations)) {
    if (text.includes(place)) {
      destination = code;
      break;
    }
  }
  
  // Look for dates (very basic parsing)
  let departure_date: string | undefined;
  let return_date: string | undefined;
  
  // Look for specific date formats
  const dateMatches = text.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december|\w{3})\s+\d{4})/gi);
  if (dateMatches) {
    departure_date = dateMatches[0];
    if (dateMatches.length > 1) {
      return_date = dateMatches[1];
    }
  }
  
  // Look for relative dates
  if (text.includes('tomorrow')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    departure_date = tomorrow.toISOString().split('T')[0];
  } else if (text.includes('next week')) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    departure_date = nextWeek.toISOString().split('T')[0];
  }
  
  // Look for passengers
  let passengers: number | undefined;
  const passengerMatch = text.match(/(\d+)\s*(passenger|person|people|adult)/);
  if (passengerMatch) {
    passengers = parseInt(passengerMatch[1]);
  }
  
  // Determine intent
  let intent: string | undefined;
  if (text.includes('search') || text.includes('find') || text.includes('look')) {
    intent = 'search';
  } else if (text.includes('flexible') || text.includes('any date')) {
    intent = 'flexible';
  } else if (text.includes('return') || text.includes('round trip')) {
    intent = 'return';
  } else if (text.includes('one way') || text.includes('single')) {
    intent = 'oneway';
  }
  
  return { origin, destination, departure_date, return_date, passengers, intent };
}

async function searchFlights(params: SearchParams): Promise<FlightResult[]> {
  const response = await fetch('/api/flights/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departure_date,
      return_date: params.return_date,
      passengers: params.passengers || 1,
      cabin_class: 'economy'
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Failed to search flights');
  }

  const data = await response.json();
  return data.data || [];
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
    // Parse duration for comparison
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
  
  // Normalize price (lower is better)
  const priceScore = priceRange > 0 ? 1 - ((parseFloat(flight.price.amount) - minPrice) / priceRange) : 1;
  
  // Convenience score (fewer stops is better, shorter duration is better)
  const stopsScore = flight.stops === 0 ? 1 : flight.stops === 1 ? 0.7 : 0.3;
  const durationMinutes = parseDurationToMinutes(flight.duration);
  const durationScore = Math.max(0, 1 - (durationMinutes - 300) / 600); // 5-15 hour scale
  
  // Weighted combination
  return priceScore * 0.6 + stopsScore * 0.25 + durationScore * 0.15;
}

function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount);
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  return `${symbol}${num.toLocaleString()}`;
}

export default function FlightFinderPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "🛫 Hi! I'm your Caribbean flight finder.\n\nI'll help you find real-time flights to the Caribbean. Just tell me:\n\n• Where you're flying from (London, Manchester, New York, Miami, Toronto, Paris, Amsterdam)\n• Where you want to go in the Caribbean\n• Your travel dates\n\nTry: \"Flights from London to Barbados on March 25th\""
    },
  ]);
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>('initial');
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSearching) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    // Parse user input
    const parsed = parseUserInput(userMessage);
    const updatedParams = { ...searchParams, ...parsed };
    setSearchParams(updatedParams);

    // Determine next step in conversation
    await handleConversationFlow(userMessage, updatedParams, parsed);
  };

  const handleConversationFlow = async (userMessage: string, params: SearchParams, parsed: any) => {
    setIsSearching(true);

    try {
      // Check if we have everything needed to search
      if (params.origin && params.destination && params.departure_date) {
        // We have enough to search!
        setConversationState('searching');
        
        const searchingMessage: Message = {
          role: "assistant",
          content: "🔍 Searching for real-time flights...\n\nI'm checking with airlines for the best prices. This may take a moment.",
          isSearching: true
        };
        
        setMessages(prev => [...prev, searchingMessage]);

        try {
          const flights = await searchFlights(params);
          const categorizedFlights = categorizeFlights(flights);
          
          setConversationState('results');
          
          let resultMessage = "";
          if (flights.length > 0) {
            const returnText = params.return_date ? "return" : "one-way";
            resultMessage = `✈️ Found ${flights.length} ${returnText} flights from ${params.origin} to ${params.destination}!\n\n**Prices are live from airlines** 🔥`;
          } else {
            resultMessage = "😔 No flights found for those dates. Try different dates or check if there are alternative nearby airports.";
          }
          
          // Remove the searching message and add results
          setMessages(prev => prev.slice(0, -1).concat([{
            role: "assistant",
            content: resultMessage,
            flightResults: categorizedFlights
          }]));
          
        } catch (error) {
          setMessages(prev => prev.slice(0, -1).concat([{
            role: "assistant",
            content: `❌ Sorry, I encountered an error searching for flights: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again or check your search parameters.`
          }]));
        }
        
      } else {
        // Guide user through missing information
        await provideMissingInfoGuidance(params, parsed);
      }
      
    } finally {
      setIsSearching(false);
    }
  };

  const provideMissingInfoGuidance = async (params: SearchParams, parsed: any) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay

    let response = "";
    
    if (!params.origin) {
      setConversationState('need_origin');
      response = "👋 I need to know where you're flying from!\n\n**Choose your departure city:**\n• 🇬🇧 London (LHR)\n• 🇬🇧 Manchester (MAN)\n• 🇺🇸 New York (JFK)\n• 🇺🇸 Miami (MIA)\n• 🇨🇦 Toronto (YYZ)\n• 🇫🇷 Paris (CDG)\n• 🇳🇱 Amsterdam (AMS)\n\nJust say the city name!";
    } else if (!params.destination) {
      setConversationState('need_destination');
      response = `Great! Flying from ${params.origin} ✈️\n\n**Where in the Caribbean would you like to go?**\n\n🏝️ **Popular destinations:**\n• Barbados\n• Jamaica\n• Trinidad\n• Aruba\n• Curaçao\n• St Lucia\n• Antigua\n• Bahamas\n\nJust tell me the island or country!`;
    } else if (!params.departure_date) {
      setConversationState('need_dates');
      response = `Perfect! ${params.origin} to ${params.destination} 🌴\n\n**When would you like to travel?**\n\nYou can say:\n• \"March 25th\"\n• \"2024-03-25\" \n• \"Tomorrow\"\n• \"Next week\"\n• \"I'm flexible with dates\"\n\nWould you like a return flight too?`;
    }
    
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
  };

  const generateBookingUrl = (flight: FlightResult): string => {
    // For demo purposes, create a search URL since we don't have Duffel booking links yet
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
            Chat with our AI to find real-time flights to the Caribbean
          </p>
          <p className="text-sm text-gold">
            ✨ Prices are live from airlines
          </p>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-navy text-white rounded-br-sm"
                      : "bg-gray-100 text-navy rounded-bl-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {msg.content.split("**").map((part, j) =>
                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                  </div>
                  
                  {/* Loading indicator for searching */}
                  {msg.isSearching && (
                    <div className="flex space-x-1 mt-3">
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  )}
                  
                  {/* Flight Results */}
                  {msg.flightResults && msg.flightResults.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {/* Category sections */}
                      {['cheapest', 'fastest', 'best-value'].map(category => {
                        const categoryFlights = msg.flightResults?.filter(f => f.category === category) || [];
                        if (categoryFlights.length === 0) return null;
                        
                        const categoryIcon = category === 'cheapest' ? '🏆' : category === 'fastest' ? '✈️' : '💡';
                        const categoryName = category === 'cheapest' ? 'Cheapest' : category === 'fastest' ? 'Fastest' : 'Best Value';
                        
                        return (
                          <div key={category}>
                            <h4 className="text-xs font-semibold text-navy mb-2 flex items-center gap-1">
                              {categoryIcon} {categoryName}
                            </h4>
                            {categoryFlights.slice(0, 1).map(flight => (
                              <FlightCard key={`cat-${flight.id}`} flight={flight} generateBookingUrl={generateBookingUrl} />
                            ))}
                          </div>
                        );
                      })}
                      
                      {/* All other flights */}
                      {msg.flightResults.filter(f => !f.category).slice(0, 6).map(flight => (
                        <FlightCard key={flight.id} flight={flight} generateBookingUrl={generateBookingUrl} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  conversationState === 'need_origin' ? "e.g. London" :
                  conversationState === 'need_destination' ? "e.g. Barbados" :
                  conversationState === 'need_dates' ? "e.g. March 25th" :
                  "e.g. London to Barbados on March 25th"
                }
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={!input.trim() || isSearching}
                className="bg-gold hover:bg-gold-light disabled:bg-gray-200 text-navy font-semibold px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isSearching ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Quick searches:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "London to Barbados tomorrow",
              "New York to Jamaica next week",
              "Miami to Aruba",
              "Paris to Martinique",
              "Amsterdam to Curaçao",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                disabled={isSearching}
                className="text-xs bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-navy px-3 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>
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