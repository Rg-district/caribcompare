"use client";

import { useState } from "react";

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

// Build Google Flights URL with dates
function buildBookingUrl(from: string, to: string, departDate: string, returnDate?: string): string {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();
  
  // Format dates for Google Flights (YYYY-MM-DD)
  let url = `https://www.google.com/travel/flights?q=Flights+from+${fromCode}+to+${toCode}`;
  
  if (departDate) {
    url += `+on+${departDate}`;
  }
  if (returnDate) {
    url += `+returning+${returnDate}`;
  }
  
  url += "&curr=GBP";
  return url;
}

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Get date 7 days from now
function getDefaultReturnDate(departDate: string): string {
  const date = new Date(departDate);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
}

export default function FlightWidget() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState<"return" | "oneway">("return");
  const [fromCaribbean, setFromCaribbean] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination && departDate) {
      const url = buildBookingUrl(
        origin, 
        destination, 
        departDate, 
        tripType === "return" ? returnDate : undefined
      );
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggle = () => {
    setFromCaribbean(!fromCaribbean);
    setOrigin("");
    setDestination("");
  };

  const handleDepartDateChange = (date: string) => {
    setDepartDate(date);
    // Auto-set return date if not set or if it's before new depart date
    if (tripType === "return" && (!returnDate || returnDate < date)) {
      setReturnDate(getDefaultReturnDate(date));
    }
  };

  const availableOrigins = fromCaribbean ? caribbeanCities : internationalCities;
  const availableDestinations = fromCaribbean ? internationalCities : caribbeanCities;

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 max-w-md w-full">
      <div className="flex items-center justify-between mb-3">
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
      
      {/* Trip Type Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setTripType("return")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            tripType === "return" 
              ? "bg-navy text-white" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Return
        </button>
        <button
          type="button"
          onClick={() => setTripType("oneway")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            tripType === "oneway" 
              ? "bg-navy text-white" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          One-way
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-3">
        {/* Origin */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold text-navy"
          >
            <option value="">Select origin</option>
            {availableOrigins.map(city => (
              <option key={city.code} value={city.code}>
                {'flag' in city ? `${city.flag} ${city.name}` : city.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Destination */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold text-navy"
          >
            <option value="">Select destination</option>
            {availableDestinations.map(dest => (
              <option key={dest.code} value={dest.code}>
                {'flag' in dest ? `${dest.flag} ${dest.name}` : dest.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Dates Row */}
        <div className={`grid gap-2 ${tripType === "return" ? "grid-cols-2" : "grid-cols-1"}`}>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Depart</label>
            <input
              type="date"
              value={departDate}
              onChange={(e) => handleDepartDateChange(e.target.value)}
              min={getTodayDate()}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold text-navy"
            />
          </div>
          
          {tripType === "return" && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Return</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departDate || getTodayDate()}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold text-navy"
              />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!origin || !destination || !departDate || (tripType === "return" && !returnDate)}
          className="w-full bg-gold hover:bg-gold-light disabled:bg-gray-200 text-navy font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Search Flights →
        </button>
        
        <p className="text-xs text-center text-gray-400">
          Opens Google Flights with live prices
        </p>
      </form>
    </div>
  );
}
