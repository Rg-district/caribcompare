"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  region: string;
  publishedAt: string;
  category: string;
}

// Caribbean news topics
const NEWS_CATEGORIES = [
  { key: "travel", emoji: "✈️", label: "Travel" },
  { key: "tourism", emoji: "🏝️", label: "Tourism" },
  { key: "events", emoji: "🎉", label: "Events" },
  { key: "food", emoji: "🍽️", label: "Food" },
  { key: "sports", emoji: "🏏", label: "Sports" },
];

// Fallback sample data if API fails
const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Barbados Crop Over Festival 2026 Dates Announced",
    description: "The iconic Caribbean festival returns July-August with new international headliners and expanded cultural events.",
    url: "https://visitbarbados.org",
    source: "Visit Barbados",
    region: "Barbados",
    publishedAt: new Date().toISOString(),
    category: "events"
  },
  {
    title: "Jamaica Welcomes Record Tourist Numbers in Q1 2026",
    description: "Tourism Ministry reports 15% increase in visitors, with UK arrivals leading growth.",
    url: "https://visitjamaica.com",
    source: "Jamaica Tourist Board",
    region: "Jamaica",
    publishedAt: new Date().toISOString(),
    category: "tourism"
  },
];

export default function CaribbeanNewsFeed() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/news');
        const data = await response.json();
        
        if (data.news && data.news.length > 0) {
          setNews(data.news);
          setLastUpdated(data.lastUpdated);
          setError(null);
        } else {
          // Use fallback if no news returned
          setNews(FALLBACK_NEWS);
          setError("Using sample data");
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setNews(FALLBACK_NEWS);
        setError("Using sample data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews = activeCategory 
    ? news.filter(item => item.category === activeCategory)
    : news;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getCategoryEmoji = (category: string) => {
    const cat = NEWS_CATEGORIES.find(c => c.key === category);
    return cat?.emoji || "📰";
  };

  const getRegionFlag = (region: string) => {
    const flags: Record<string, string> = {
      "Barbados": "🇧🇧",
      "Jamaica": "🇯🇲",
      "Trinidad": "🇹🇹",
      "Bahamas": "🇧🇸",
      "Caribbean": "🌴",
    };
    return flags[region] || "🌴";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          🌴 Caribbean News & Events
        </h2>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
          )}
          {!isLoading && lastUpdated && (
            <span className="text-xs text-gray-400">
              Updated {formatDate(lastUpdated)}
            </span>
          )}
        </div>
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

      {/* Loading State */}
      {isLoading && news.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse p-3 rounded-lg bg-gray-50">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* News Items */}
      {!isLoading && (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
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
                    <span>{getRegionFlag(item.region)}</span>
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!isLoading && filteredNews.length === 0 && (
        <p className="text-center text-gray-500 py-8">No news in this category</p>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          Aggregated from Caribbean news sources • Travel • Tourism • Events • Food • Sports
        </p>
      </div>
    </div>
  );
}
