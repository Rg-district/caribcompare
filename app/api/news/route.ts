import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'CaribCompare News Aggregator/1.0',
  },
});

// Caribbean news RSS feeds
const RSS_FEEDS = [
  // Regional
  { url: "https://www.loopnewsbarbados.com/rss.xml", source: "Loop Barbados", region: "Barbados" },
  { url: "https://www.loopjamaica.com/rss.xml", source: "Loop Jamaica", region: "Jamaica" },
  { url: "https://www.looptrinidad.com/rss.xml", source: "Loop Trinidad", region: "Trinidad" },
  { url: "https://barbadostoday.bb/feed/", source: "Barbados Today", region: "Barbados" },
  { url: "https://www.jamaicaobserver.com/feed/", source: "Jamaica Observer", region: "Jamaica" },
  { url: "https://trinidadexpress.com/search/?f=rss&t=article&c=news&l=50&s=start_time&sd=desc", source: "Trinidad Express", region: "Trinidad" },
  { url: "https://www.caribbean360.com/feed", source: "Caribbean 360", region: "Caribbean" },
  { url: "https://caribbeannewsglobal.com/feed/", source: "Caribbean News Global", region: "Caribbean" },
  // Travel/Tourism focused
  { url: "https://www.travelpulse.com/rss/caribbean", source: "Travel Pulse", region: "Caribbean" },
];

// Words to filter OUT (crime-related)
const EXCLUDE_KEYWORDS = [
  "murder", "killed", "shooting", "shot", "stabbed", "crime", "criminal",
  "robbery", "robbed", "assault", "arrested", "prison", "jail", "court case",
  "sentenced", "convicted", "homicide", "violence", "violent", "gang",
  "drug bust", "trafficking", "kidnap", "rape", "abuse", "death", "dead",
  "accident", "crash", "fatal", "victim", "police", "suspect", "investigation"
];

// Words to prioritize (travel/positive content)
const INCLUDE_KEYWORDS = [
  "tourism", "tourist", "travel", "flight", "airline", "hotel", "resort",
  "festival", "carnival", "crop over", "junkanoo", "event", "concert",
  "food", "restaurant", "cuisine", "rum", "beach", "cruise",
  "cricket", "sports", "athletics", "olympics",
  "culture", "music", "reggae", "soca", "calypso",
  "investment", "business", "economy", "growth",
  "wildlife", "nature", "diving", "snorkeling", "hiking",
  "wedding", "honeymoon", "vacation", "holiday", "getaway",
  "award", "recognition", "celebration", "opening", "launch"
];

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  region: string;
  publishedAt: string;
  category: string;
}

function categorizeArticle(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase();
  
  // First, check if it should be excluded
  for (const keyword of EXCLUDE_KEYWORDS) {
    if (text.includes(keyword)) {
      return null; // Filter out
    }
  }
  
  // Categorize based on content
  if (/festival|carnival|crop over|junkanoo|concert|event|celebration|parade/.test(text)) {
    return "events";
  }
  if (/flight|airline|airport|travel|cruise|tourism|tourist|vacation|holiday/.test(text)) {
    return "travel";
  }
  if (/hotel|resort|accommodation|airbnb|villa|stay/.test(text)) {
    return "tourism";
  }
  if (/food|restaurant|cuisine|rum|chef|dining|culinary/.test(text)) {
    return "food";
  }
  if (/cricket|football|soccer|sports|athletics|olympics|game|match|team/.test(text)) {
    return "sports";
  }
  if (/beach|diving|snorkeling|hiking|wildlife|nature|eco/.test(text)) {
    return "tourism";
  }
  if (/music|reggae|soca|calypso|culture|art|museum/.test(text)) {
    return "events";
  }
  
  // Check if it has any positive keywords
  const hasPositiveContent = INCLUDE_KEYWORDS.some(kw => text.includes(kw));
  if (hasPositiveContent) {
    return "travel"; // Default positive category
  }
  
  return null; // Filter out if no positive match
}

function cleanDescription(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  // Trim and limit length
  text = text.trim();
  if (text.length > 200) {
    text = text.substring(0, 197) + '...';
  }
  return text;
}

async function fetchFeed(feedConfig: typeof RSS_FEEDS[0]): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(feedConfig.url);
    const items: NewsItem[] = [];
    
    for (const item of feed.items.slice(0, 10)) { // Max 10 per feed
      const title = item.title || '';
      const description = cleanDescription(item.contentSnippet || item.content || item.description || '');
      const category = categorizeArticle(title, description);
      
      if (category) { // Only include if it passes filtering
        items.push({
          title,
          description,
          url: item.link || '',
          source: feedConfig.source,
          region: feedConfig.region,
          publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
          category,
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Error fetching ${feedConfig.source}:`, error);
    return [];
  }
}

// Cache for news items
let cachedNews: NewsItem[] = [];
let lastFetch = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  const now = Date.now();
  
  // Return cached if fresh
  if (cachedNews.length > 0 && (now - lastFetch) < CACHE_DURATION) {
    return NextResponse.json({
      news: cachedNews,
      cached: true,
      lastUpdated: new Date(lastFetch).toISOString(),
      count: cachedNews.length,
    });
  }
  
  try {
    // Fetch all feeds in parallel
    const feedPromises = RSS_FEEDS.map(feed => fetchFeed(feed));
    const results = await Promise.allSettled(feedPromises);
    
    // Combine all successful results
    const allNews: NewsItem[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value);
      }
    }
    
    // Sort by date (newest first)
    allNews.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Deduplicate by title similarity
    const seen = new Set<string>();
    const uniqueNews = allNews.filter(item => {
      const key = item.title.toLowerCase().substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    // Limit to 20 items
    cachedNews = uniqueNews.slice(0, 20);
    lastFetch = now;
    
    return NextResponse.json({
      news: cachedNews,
      cached: false,
      lastUpdated: new Date(now).toISOString(),
      count: cachedNews.length,
      feedsChecked: RSS_FEEDS.length,
    });
    
  } catch (error) {
    console.error('News fetch error:', error);
    
    // Return cached data if available, even if stale
    if (cachedNews.length > 0) {
      return NextResponse.json({
        news: cachedNews,
        cached: true,
        stale: true,
        lastUpdated: new Date(lastFetch).toISOString(),
        count: cachedNews.length,
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch news', news: [] },
      { status: 500 }
    );
  }
}
