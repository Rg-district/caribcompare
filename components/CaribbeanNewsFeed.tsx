"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

// Caribbean news topics (positive content only)
const NEWS_CATEGORIES = [
  { key: "travel", emoji: "✈️", label: "Travel" },
  { key: "tourism", emoji: "🏝️", label: "Tourism" },
  { key: "events", emoji: "🎉", label: "Events" },
  { key: "food", emoji: "🍽️", label: "Food" },
  { key: "sports", emoji: "🏏", label: "Sports" },
];

// Simulated news data (will be replaced with API)
const SAMPLE_NEWS: NewsItem[] = [
  {
    title: "Barbados Crop Over Festival 2026 Dates Announced",
    description: "The iconic Caribbean festival returns July-August with new international headliners and expanded cultural events across the island.",
    url: "https://visitbarbados.org",
    source: "Visit Barbados",
    publishedAt: "2026-03-22",
    category: "events"
  },
  {
    title: "Jamaica Welcomes Record Tourist Numbers in Q1 2026",
    description: "Tourism Ministry reports 15% increase in visitors, with UK arrivals leading growth as new direct routes launch.",
    url: "https://visitjamaica.com",
    source: "Jamaica Tourist Board",
    publishedAt: "2026-03-21",
    category: "tourism"
  },
  {
    title: "New Direct Flight Route: Manchester to Antigua Launches",
    description: "Virgin Atlantic announces new weekly service starting June 2026, making the Eastern Caribbean more accessible for UK travellers.",
    url: "https://virginatlantic.com",
    source: "Virgin Atlantic",
    publishedAt: "2026-03-20",
    category: "travel"
  },
  {
    title: "Trinidad Carnival 2027 Early Bird Tickets Now Available",
    description: "Bands release first costume packages for the world's greatest street party. Registration opens for international masqueraders.",
    url: "https://gotrinidadandtobago.com",
    source: "Trinidad Tourism",
    publishedAt: "2026-03-20",
    category: "events"
  },
  {
    title: "St Lucia Food & Rum Festival Returns November 2026",
    description: "Celebrity chefs from across the Caribbean and UK confirmed for the island's premier culinary celebration.",
    url: "https://stlucia.org",
    source: "St Lucia Tourism",
    publishedAt: "2026-03-19",
    category: "food"
  },
  {
    title: "West Indies Cricket: Home Series Schedule Released",
    description: "Full calendar of matches announced including Tests against England and India at grounds across the Caribbean.",
    url: "https://windiescricket.com",
    source: "Cricket West Indies",
    publishedAt: "2026-03-19",
    category: "sports"
  },
  {
    title: "Grenada Spice Mas 2026: New Carnival Routes Unveiled",
    description: "Organisers reveal expanded parade routes and new mas camps joining the August celebrations.",
    url: "https://puregrenada.com",
    source: "Grenada Tourism",
    publishedAt: "2026-03-18",
    category: "events"
  },
  {
    title: "Aruba Named Top Caribbean Destination for 2026",
    description: "Travel awards recognise One Happy Island for beaches, dining, and sustainable tourism initiatives.",
    url: "https://aruba.com",
    source: "Aruba Tourism",
    publishedAt: "2026-03-18",
    category: "tourism"
  },
  {
    title: "Cayman Islands Launches New Marine Wildlife Tours",
    description: "Eco-tourism initiative offers responsible swimming with stingrays and sea turtle encounters.",
    url: "https://visitcaymanislands.com",
    source: "Cayman Tourism",
    publishedAt: "2026-03-17",
    category: "tourism"
  },
  {
    title: "Bahamas Junkanoo Summer Festival Dates Confirmed",
    description: "Traditional Bahamian festival expands with new parade routes in Nassau and Grand Bahama.",
    url: "https://bahamas.com",
    source: "Bahamas Ministry of Tourism",
    publishedAt: "2026-03-17",
    category: "events"
  }
];

export default function CaribbeanNewsFeed() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>(SAMPLE_NEWS);
  const [isLoading, setIsLoading] = useState(false);

  const filteredNews = activeCategory 
    ? news.filter(item => item.category === activeCategory)
    : news;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getCategoryEmoji = (category: string) => {
    const cat = NEWS_CATEGORIES.find(c => c.key === category);
    return cat?.emoji || "📰";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          🌴 Caribbean News & Events
        </h2>
        <span className="text-xs text-gray-400">Updated live</span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeCategory === null
              ? "bg-navy text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {NEWS_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat.key
                ? "bg-navy text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* News Items */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredNews.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{getCategoryEmoji(item.category)}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-navy group-hover:text-gold transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <p className="text-center text-gray-500 py-8">No news in this category</p>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          Travel • Tourism • Events • Food • Sports • Culture
        </p>
      </div>
    </div>
  );
}
