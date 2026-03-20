"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Origins and destinations for search form
const internationalCities = [
  { code: "LHR", name: "London" },
  { code: "JFK", name: "New York" },
  { code: "MIA", name: "Miami" },
  { code: "YYZ", name: "Toronto" },
  { code: "CDG", name: "Paris" },
  { code: "AMS", name: "Amsterdam" }
];

const caribbeanCities = [
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
  { code: "BDA", name: "Bermuda", flag: "🇧🇲" }
];

export default function FlightWidget() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [fromCaribbean, setFromCaribbean] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      router.push(`/flights?from=${origin}&to=${destination}`);
    }
  };

  const handleToggle = () => {
    setFromCaribbean(!fromCaribbean);
    setOrigin("");
    setDestination("");
  };

  const availableOrigins = fromCaribbean ? caribbeanCities : internationalCities;
  const availableDestinations = fromCaribbean ? internationalCities : caribbeanCities;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          ✈️ Find Flights
        </h3>
        <button
          type="button"
          onClick={handleToggle}
          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
        >
          {fromCaribbean ? "🏝️ From Caribbean" : "🌍 To Caribbean"}
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Flying from</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold text-navy"
          >
            <option value="">Select origin</option>
            {availableOrigins.map(city => (
              <option key={city.code} value={city.code}>
                {'flag' in city ? `${city.flag} ${city.name}` : city.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Flying to</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold text-navy"
          >
            <option value="">Select destination</option>
            {availableDestinations.map(dest => (
              <option key={dest.code} value={dest.code}>
                {'flag' in dest ? `${dest.flag} ${dest.name}` : dest.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={!origin || !destination}
          className="w-full bg-gold hover:bg-gold-light disabled:bg-gray-200 text-navy font-semibold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
}