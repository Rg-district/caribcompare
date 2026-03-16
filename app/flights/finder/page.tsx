"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
  flightResults?: FlightResult[];
};

type FlightResult = {
  destination: string;
  flag: string;
  price: string;
  airline: string;
  route: string;
  searchUrl: string;
  tip?: string;
};

// Flight data for AI recommendations
const flightData = {
  uk: {
    london: {
      BGI: { low: 450, high: 900, airlines: ["British Airways", "Virgin Atlantic"], direct: true, bestMonths: "Sep-Nov" },
      KIN: { low: 480, high: 950, airlines: ["British Airways", "Virgin Atlantic"], direct: true, bestMonths: "Sep-Nov" },
      POS: { low: 520, high: 1000, airlines: ["British Airways", "Caribbean Airlines"], direct: true, bestMonths: "Sep-Nov" },
      GEO: { low: 580, high: 1100, airlines: ["British Airways", "Caribbean Airlines"], direct: false, bestMonths: "Sep-Nov" },
      ANU: { low: 480, high: 900, airlines: ["British Airways", "Virgin Atlantic"], direct: true, bestMonths: "Sep-Nov" },
      UVF: { low: 500, high: 950, airlines: ["British Airways", "Virgin Atlantic", "TUI"], direct: true, bestMonths: "Sep-Nov" },
      GND: { low: 550, high: 1000, airlines: ["British Airways"], direct: true, bestMonths: "Sep-Nov" },
      DOM: { low: 580, high: 1050, airlines: ["British Airways"], direct: false, bestMonths: "Sep-Nov" },
      SVD: { low: 600, high: 1100, airlines: ["British Airways"], direct: false, bestMonths: "Sep-Nov" },
      SKB: { low: 520, high: 980, airlines: ["British Airways"], direct: true, bestMonths: "Sep-Nov" },
      NAS: { low: 500, high: 950, airlines: ["British Airways", "Virgin Atlantic"], direct: true, bestMonths: "Sep-Nov" },
      BDA: { low: 480, high: 900, airlines: ["British Airways"], direct: true, bestMonths: "Sep-Nov" },
      GCM: { low: 550, high: 1050, airlines: ["British Airways", "Cayman Airways"], direct: true, bestMonths: "Sep-Nov" },
      PLS: { low: 550, high: 1000, airlines: ["British Airways", "TUI"], direct: true, bestMonths: "Sep-Nov" },
      HAV: { low: 500, high: 950, airlines: ["Virgin Atlantic"], direct: true, bestMonths: "Sep-Nov" },
    },
  },
  us: {
    miami: {
      BGI: { low: 280, high: 550, airlines: ["JetBlue", "American"], direct: true, bestMonths: "Apr-Jun" },
      KIN: { low: 180, high: 400, airlines: ["JetBlue", "American", "Spirit"], direct: true, bestMonths: "Apr-Jun" },
      POS: { low: 320, high: 600, airlines: ["Caribbean Airlines", "American"], direct: true, bestMonths: "Apr-Jun" },
      NAS: { low: 120, high: 300, airlines: ["American", "Bahamasair", "Silver"], direct: true, bestMonths: "Apr-Jun" },
      AUA: { low: 200, high: 450, airlines: ["JetBlue", "American"], direct: true, bestMonths: "Apr-Jun" },
      CUR: { low: 250, high: 500, airlines: ["American", "JetBlue"], direct: true, bestMonths: "Apr-Jun" },
      SXM: { low: 220, high: 480, airlines: ["JetBlue", "American"], direct: true, bestMonths: "Apr-Jun" },
      SDQ: { low: 180, high: 400, airlines: ["JetBlue", "American", "Spirit"], direct: true, bestMonths: "Apr-Jun" },
      PUJ: { low: 200, high: 450, airlines: ["JetBlue", "American"], direct: true, bestMonths: "Apr-Jun" },
      SJU: { low: 150, high: 350, airlines: ["JetBlue", "American", "Spirit"], direct: true, bestMonths: "Apr-Jun" },
      STT: { low: 200, high: 450, airlines: ["American", "JetBlue", "Spirit"], direct: true, bestMonths: "Apr-Jun" },
      GCM: { low: 180, high: 400, airlines: ["Cayman Airways", "American"], direct: true, bestMonths: "Apr-Jun" },
      PAP: { low: 280, high: 550, airlines: ["American", "JetBlue"], direct: true, bestMonths: "Apr-Jun" },
    },
    newyork: {
      BGI: { low: 350, high: 700, airlines: ["JetBlue", "Caribbean Airlines"], direct: true, bestMonths: "Apr-Jun" },
      KIN: { low: 280, high: 550, airlines: ["JetBlue", "Delta"], direct: true, bestMonths: "Apr-Jun" },
      POS: { low: 380, high: 750, airlines: ["Caribbean Airlines", "JetBlue"], direct: true, bestMonths: "Apr-Jun" },
      ANU: { low: 350, high: 700, airlines: ["JetBlue", "American"], direct: true, bestMonths: "Apr-Jun" },
      UVF: { low: 380, high: 750, airlines: ["JetBlue", "American"], direct: true, bestMonths: "Apr-Jun" },
      AUA: { low: 320, high: 650, airlines: ["JetBlue", "United"], direct: true, bestMonths: "Apr-Jun" },
      SXM: { low: 300, high: 600, airlines: ["JetBlue", "American"], direct: true, bestMonths: "Apr-Jun" },
      SDQ: { low: 280, high: 550, airlines: ["JetBlue", "Delta"], direct: true, bestMonths: "Apr-Jun" },
      SJU: { low: 200, high: 450, airlines: ["JetBlue", "Delta", "United"], direct: true, bestMonths: "Apr-Jun" },
    },
  },
  france: {
    paris: {
      FDF: { low: 350, high: 700, airlines: ["Air France", "Corsair", "Air Caraïbes"], direct: true, bestMonths: "May, Sep-Oct" },
      PTP: { low: 350, high: 700, airlines: ["Air France", "Corsair", "Air Caraïbes"], direct: true, bestMonths: "May, Sep-Oct" },
      SFG: { low: 400, high: 800, airlines: ["Air France", "Air Caraïbes"], direct: true, bestMonths: "May, Sep-Oct" },
      SBH: { low: 550, high: 1000, airlines: ["Air France", "Air Caraïbes"], direct: false, bestMonths: "May, Sep-Oct" },
      CAY: { low: 500, high: 950, airlines: ["Air France", "Air Caraïbes"], direct: true, bestMonths: "May, Sep-Oct" },
      PAP: { low: 550, high: 1000, airlines: ["Air France"], direct: false, bestMonths: "May, Sep-Oct" },
    },
  },
  netherlands: {
    amsterdam: {
      AUA: { low: 500, high: 950, airlines: ["KLM", "TUI"], direct: true, bestMonths: "Apr-Jun, Sep-Nov" },
      CUR: { low: 500, high: 950, airlines: ["KLM", "TUI"], direct: true, bestMonths: "Apr-Jun, Sep-Nov" },
      SXM: { low: 520, high: 980, airlines: ["KLM", "TUI"], direct: true, bestMonths: "Apr-Jun, Sep-Nov" },
      BON: { low: 550, high: 1000, airlines: ["KLM", "TUI"], direct: true, bestMonths: "Apr-Jun, Sep-Nov" },
      PBM: { low: 600, high: 1100, airlines: ["KLM", "Surinam Airways"], direct: true, bestMonths: "Apr-Jun, Sep-Nov" },
    },
  },
  canada: {
    toronto: {
      BGI: { low: 550, high: 1100, airlines: ["WestJet", "Air Canada", "Sunwing"], direct: true, bestMonths: "Jan-Mar" },
      KIN: { low: 400, high: 850, airlines: ["WestJet", "Air Canada", "Sunwing"], direct: true, bestMonths: "Jan-Mar" },
      POS: { low: 600, high: 1200, airlines: ["Caribbean Airlines", "Air Canada"], direct: true, bestMonths: "Jan-Mar" },
      ANU: { low: 580, high: 1150, airlines: ["Air Canada", "WestJet"], direct: true, bestMonths: "Jan-Mar" },
      CUR: { low: 650, high: 1300, airlines: ["WestJet", "Air Canada"], direct: false, bestMonths: "Jan-Mar" },
      AUA: { low: 600, high: 1200, airlines: ["WestJet", "Air Canada"], direct: true, bestMonths: "Jan-Mar" },
      SDQ: { low: 450, high: 900, airlines: ["WestJet", "Air Canada", "Sunwing"], direct: true, bestMonths: "Jan-Mar" },
      PUJ: { low: 480, high: 950, airlines: ["WestJet", "Sunwing", "Air Transat"], direct: true, bestMonths: "Jan-Mar" },
      HAV: { low: 400, high: 850, airlines: ["Air Canada", "Sunwing", "Air Transat"], direct: true, bestMonths: "Jan-Mar" },
    },
  },
};

const destinationNames: Record<string, { name: string; flag: string }> = {
  // Anglophone
  BGI: { name: "Barbados", flag: "🇧🇧" },
  KIN: { name: "Jamaica", flag: "🇯🇲" },
  POS: { name: "Trinidad", flag: "🇹🇹" },
  TAB: { name: "Tobago", flag: "🇹🇹" },
  GEO: { name: "Guyana", flag: "🇬🇾" },
  ANU: { name: "Antigua", flag: "🇦🇬" },
  BBQ: { name: "Barbuda", flag: "🇦🇬" },
  UVF: { name: "St Lucia", flag: "🇱🇨" },
  GND: { name: "Grenada", flag: "🇬🇩" },
  CRU: { name: "Carriacou", flag: "🇬🇩" },
  DOM: { name: "Dominica", flag: "🇩🇲" },
  SVD: { name: "St Vincent", flag: "🇻🇨" },
  BQU: { name: "Bequia", flag: "🇻🇨" },
  MUB: { name: "Mustique", flag: "🇻🇨" },
  SKB: { name: "St Kitts", flag: "🇰🇳" },
  NEV: { name: "Nevis", flag: "🇰🇳" },
  NAS: { name: "Bahamas", flag: "🇧🇸" },
  BZE: { name: "Belize", flag: "🇧🇿" },
  BDA: { name: "Bermuda", flag: "🇧🇲" },
  EIS: { name: "British Virgin Islands", flag: "🇻🇬" },
  GCM: { name: "Cayman Islands", flag: "🇰🇾" },
  PLS: { name: "Turks & Caicos", flag: "🇹🇨" },
  AXA: { name: "Anguilla", flag: "🇦🇮" },
  MNI: { name: "Montserrat", flag: "🇲🇸" },
  
  // French
  FDF: { name: "Martinique", flag: "🇲🇶" },
  PTP: { name: "Guadeloupe", flag: "🇬🇵" },
  SFG: { name: "Saint Martin", flag: "🇲🇫" },
  SBH: { name: "St Barthélemy", flag: "🇧🇱" },
  CAY: { name: "French Guiana", flag: "🇬🇫" },
  
  // Dutch
  AUA: { name: "Aruba", flag: "🇦🇼" },
  CUR: { name: "Curaçao", flag: "🇨🇼" },
  SXM: { name: "Sint Maarten", flag: "🇸🇽" },
  BON: { name: "Bonaire", flag: "🇧🇶" },
  SAB: { name: "Saba", flag: "🇧🇶" },
  EUX: { name: "Sint Eustatius", flag: "🇧🇶" },
  PBM: { name: "Suriname", flag: "🇸🇷" },
  
  // Spanish
  SDQ: { name: "Dominican Republic", flag: "🇩🇴" },
  PUJ: { name: "Punta Cana", flag: "🇩🇴" },
  SJU: { name: "Puerto Rico", flag: "🇵🇷" },
  HAV: { name: "Cuba", flag: "🇨🇺" },
  
  // Other
  PAP: { name: "Haiti", flag: "🇭🇹" },
  STT: { name: "US Virgin Islands", flag: "🇻🇮" },
};

// Map city names to Skyscanner IATA codes
const cityToIata: Record<string, string> = {
  london: "lhr",      // London Heathrow
  miami: "mia",       // Miami International
  newyork: "jfk",     // JFK
  paris: "cdg",       // Charles de Gaulle
  amsterdam: "ams",   // Amsterdam Schiphol
  toronto: "yyz",     // Toronto Pearson
};

function generateSearchUrl(origin: string, dest: string): string {
  const originCode = cityToIata[origin.toLowerCase()] || origin.toLowerCase();
  return `https://www.skyscanner.net/transport/flights/${originCode}/${dest.toLowerCase()}/`;
}

function parseUserQuery(query: string): { origin?: string; city?: string; destination?: string; budget?: number } {
  const q = query.toLowerCase();
  
  let origin: string | undefined;
  let city: string | undefined;
  
  if (q.includes("london") || q.includes("uk") || q.includes("england") || q.includes("britain")) {
    origin = "uk";
    city = "london";
  } else if (q.includes("miami")) {
    origin = "us";
    city = "miami";
  } else if (q.includes("new york") || q.includes("nyc") || q.includes("jfk")) {
    origin = "us";
    city = "newyork";
  } else if (q.includes("paris") || q.includes("france") || q.includes("french")) {
    origin = "france";
    city = "paris";
  } else if (q.includes("amsterdam") || q.includes("netherlands") || q.includes("dutch") || q.includes("holland")) {
    origin = "netherlands";
    city = "amsterdam";
  } else if (q.includes("toronto") || q.includes("canada") || q.includes("canadian")) {
    origin = "canada";
    city = "toronto";
  }
  
  let destination: string | undefined;
  // Anglophone
  if (q.includes("barbados")) destination = "BGI";
  else if (q.includes("jamaica")) destination = "KIN";
  else if (q.includes("trinidad")) destination = "POS";
  else if (q.includes("tobago")) destination = "TAB";
  else if (q.includes("guyana")) destination = "GEO";
  else if (q.includes("antigua")) destination = "ANU";
  else if (q.includes("barbuda")) destination = "BBQ";
  else if (q.includes("st lucia") || q.includes("saint lucia")) destination = "UVF";
  else if (q.includes("grenada")) destination = "GND";
  else if (q.includes("carriacou")) destination = "CRU";
  else if (q.includes("dominica") && !q.includes("dominican")) destination = "DOM";
  else if (q.includes("st vincent") || q.includes("saint vincent")) destination = "SVD";
  else if (q.includes("bequia")) destination = "BQU";
  else if (q.includes("mustique")) destination = "MUB";
  else if (q.includes("st kitts") || q.includes("saint kitts")) destination = "SKB";
  else if (q.includes("nevis")) destination = "NEV";
  else if (q.includes("bahamas") || q.includes("nassau")) destination = "NAS";
  else if (q.includes("belize")) destination = "BZE";
  else if (q.includes("bermuda")) destination = "BDA";
  else if (q.includes("british virgin") || q.includes("bvi") || q.includes("tortola")) destination = "EIS";
  else if (q.includes("cayman")) destination = "GCM";
  else if (q.includes("turks") || q.includes("caicos")) destination = "PLS";
  else if (q.includes("anguilla")) destination = "AXA";
  else if (q.includes("montserrat")) destination = "MNI";
  // French
  else if (q.includes("martinique")) destination = "FDF";
  else if (q.includes("guadeloupe")) destination = "PTP";
  else if (q.includes("saint martin") || q.includes("st martin")) destination = "SFG";
  else if (q.includes("st barth") || q.includes("saint barth") || q.includes("st barts")) destination = "SBH";
  else if (q.includes("french guiana") || q.includes("guyane")) destination = "CAY";
  // Dutch
  else if (q.includes("aruba")) destination = "AUA";
  else if (q.includes("curacao") || q.includes("curaçao")) destination = "CUR";
  else if (q.includes("sint maarten") || q.includes("st maarten")) destination = "SXM";
  else if (q.includes("bonaire")) destination = "BON";
  else if (q.includes("saba")) destination = "SAB";
  else if (q.includes("statia") || q.includes("sint eustatius") || q.includes("st eustatius")) destination = "EUX";
  else if (q.includes("suriname") || q.includes("paramaribo")) destination = "PBM";
  // Spanish
  else if (q.includes("dominican") || q.includes("santo domingo")) destination = "SDQ";
  else if (q.includes("punta cana")) destination = "PUJ";
  else if (q.includes("puerto rico") || q.includes("san juan")) destination = "SJU";
  else if (q.includes("cuba") || q.includes("havana")) destination = "HAV";
  // Other
  else if (q.includes("haiti") || q.includes("port-au-prince")) destination = "PAP";
  else if (q.includes("us virgin") || q.includes("usvi") || q.includes("st thomas") || q.includes("st croix")) destination = "STT";
  
  let budget: number | undefined;
  const budgetMatch = q.match(/(\d+)/);
  if (budgetMatch && (q.includes("budget") || q.includes("under") || q.includes("less than") || q.includes("£") || q.includes("$") || q.includes("€"))) {
    budget = parseInt(budgetMatch[1]);
  }
  
  return { origin, city, destination, budget };
}

function generateAIResponse(query: string): { response: string; results: FlightResult[] } {
  const parsed = parseUserQuery(query);
  const results: FlightResult[] = [];
  
  if (!parsed.origin || !parsed.city) {
    return {
      response: "I'd love to help you find cheap flights! 🛫\n\nCould you tell me where you're flying from? I can search flights from:\n\n• 🇬🇧 London (UK)\n• 🇺🇸 Miami or New York (USA)\n• 🇨🇦 Toronto (Canada)\n• 🇫🇷 Paris (France)\n• 🇳🇱 Amsterdam (Netherlands)\n\nJust say something like \"flights from London to Barbados\" or \"cheapest flights from Amsterdam\"",
      results: [],
    };
  }
  
  const cityData = (flightData as any)[parsed.origin]?.[parsed.city];
  if (!cityData) {
    return {
      response: "I don't have flight data for that route yet. Try asking about flights from London, Miami, New York, Paris, Amsterdam, or Toronto!",
      results: [],
    };
  }
  
  const currency = parsed.origin === "uk" ? "£" : parsed.origin === "france" || parsed.origin === "netherlands" ? "€" : parsed.origin === "canada" ? "CA$" : "$";
  const cityName = parsed.city.charAt(0).toUpperCase() + parsed.city.slice(1);
  
  // If specific destination requested
  if (parsed.destination && cityData[parsed.destination]) {
    const flight = cityData[parsed.destination];
    const dest = destinationNames[parsed.destination];
    
    results.push({
      destination: dest.name,
      flag: dest.flag,
      price: `${currency}${flight.low} - ${currency}${flight.high}`,
      airline: flight.airlines[0],
      route: `${cityName} → ${dest.name}`,
      searchUrl: generateSearchUrl(parsed.city, parsed.destination),
      tip: `Best time to book: ${flight.bestMonths}. ${flight.direct ? "Direct flights available!" : "Usually requires a connection."}`,
    });
    
    return {
      response: `Here's what I found for ${cityName} to ${dest.name} ${dest.flag}:\n\nTypical prices: **${currency}${flight.low} - ${currency}${flight.high}** return\n\n✈️ Airlines: ${flight.airlines.join(", ")}\n📅 Best time to book: ${flight.bestMonths}\n${flight.direct ? "✅ Direct flights available" : "🔄 Usually requires a connection"}\n\n💡 **Pro tip:** Set up price alerts on Skyscanner. Prices can drop ${currency}100+ during sales!`,
      results,
    };
  }
  
  // Show cheapest options from origin
  let response = `Here are the cheapest Caribbean flights from ${cityName}:\n\n`;
  
  const sortedDests = Object.entries(cityData)
    .map(([code, data]: [string, any]) => ({
      code,
      ...data,
      ...destinationNames[code],
    }))
    .sort((a, b) => a.low - b.low);
  
  // Filter by budget if specified
  const filteredDests = parsed.budget 
    ? sortedDests.filter(d => d.low <= parsed.budget!)
    : sortedDests;
  
  if (filteredDests.length === 0) {
    return {
      response: `No flights found under ${currency}${parsed.budget}. The cheapest option from ${cityName} starts at ${currency}${sortedDests[0].low} to ${sortedDests[0].name}. Would you like to see all options?`,
      results: [],
    };
  }
  
  filteredDests.slice(0, 5).forEach((dest, i) => {
    results.push({
      destination: dest.name,
      flag: dest.flag,
      price: `from ${currency}${dest.low}`,
      airline: dest.airlines[0],
      route: `${cityName} → ${dest.name}`,
      searchUrl: generateSearchUrl(parsed.city!, dest.code),
    });
    
    response += `${i + 1}. ${dest.flag} **${dest.name}** — from ${currency}${dest.low}\n`;
  });
  
  response += `\n💡 **Tip:** September to November usually has the best prices. Avoid school holidays!`;
  
  if (parsed.budget) {
    response = `Flights under ${currency}${parsed.budget} from ${cityName}:\n\n` + response.split("\n\n").slice(1).join("\n\n");
  }
  
  return { response, results };
}

export default function FlightFinderPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your Caribbean flight finder.\n\nTell me where you're flying from and where you want to go, and I'll find you the best deals!\n\nFor example:\n• \"Flights from London to Barbados\"\n• \"Cheapest flights from Miami\"\n• \"Flights under £500 from UK\"\n• \"Amsterdam to Curaçao\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { response, results } = generateAIResponse(userMessage);
    
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response, flightResults: results },
    ]);
    setIsTyping(false);
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
            Chat with our AI to find the cheapest flights to the Caribbean
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
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
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
                  
                  {/* Flight Results */}
                  {msg.flightResults && msg.flightResults.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.flightResults.map((flight, j) => (
                        <a
                          key={j}
                          href={flight.searchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-white rounded-lg p-3 hover:shadow-md transition-shadow border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{flight.flag}</span>
                              <div>
                                <p className="font-semibold text-navy text-sm">{flight.destination}</p>
                                <p className="text-xs text-gray-500">{flight.airline}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600 text-sm">{flight.price}</p>
                              <p className="text-xs text-gold">Search →</p>
                            </div>
                          </div>
                          {flight.tip && (
                            <p className="text-xs text-gray-500 mt-2 border-t border-gray-100 pt-2">
                              💡 {flight.tip}
                            </p>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Flights from London to Jamaica..."
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-gold hover:bg-gold-light disabled:bg-gray-200 text-navy font-semibold px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Prices are estimates based on typical fares. Click results to search live prices.
            </p>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Quick searches:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Flights from London to Barbados",
              "Cheapest flights from Miami",
              "Paris to Martinique",
              "Amsterdam to Aruba",
              "Flights under £500 from UK",
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-navy px-3 py-2 rounded-lg transition-colors"
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
