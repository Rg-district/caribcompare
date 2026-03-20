import { NextRequest, NextResponse } from "next/server";

// Types for Duffel API
interface DuffelSlice {
  id: string;
  origin: {
    iata_code: string;
    name: string;
  };
  destination: {
    iata_code: string;
    name: string;
  };
  departure_datetime: string;
  arrival_datetime: string;
  duration: string;
  segments: DuffelSegment[];
}

interface DuffelSegment {
  id: string;
  origin: {
    iata_code: string;
    name: string;
  };
  destination: {
    iata_code: string;
    name: string;
  };
  departing_at: string;
  arriving_at: string;
  duration: string;
  marketing_carrier: {
    iata_code: string;
    name: string;
    logo_symbol_url?: string;
    logo_lockup_url?: string;
  };
  operating_carrier: {
    iata_code: string;
    name: string;
  };
}

interface DuffelOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  slices: DuffelSlice[];
  passengers: Array<{
    id: string;
    type: string;
  }>;
  created_at: string;
  expires_at: string;
}

interface DuffelOfferRequest {
  id: string;
  offers: DuffelOffer[];
  created_at: string;
  expires_at: string;
}

interface FlightSearchRequest {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passengers?: number;
  cabin_class?: string;
}

interface ParsedFlightResult {
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
}

// Simple in-memory cache
interface CacheEntry {
  data: ParsedFlightResult[];
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

function generateCacheKey(params: FlightSearchRequest): string {
  return `${params.origin}-${params.destination}-${params.departure_date}-${params.return_date || 'oneway'}-${params.passengers || 1}-${params.cabin_class || 'economy'}`;
}

function isValidCache(entry: CacheEntry): boolean {
  return Date.now() < entry.expiresAt;
}

function parseDateTime(datetime: string): { time: string; date: string } {
  const date = new Date(datetime);
  return {
    time: date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    date: date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  };
}

function calculateDuration(durationStr: string): string {
  // Duffel returns duration in ISO 8601 format like "PT5H30M" or "P1DT6H40M"
  const match = durationStr.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return durationStr;
  
  const days = match[1] ? parseInt(match[1]) : 0;
  const hours = match[2] ? parseInt(match[2]) : 0;
  const minutes = match[3] ? parseInt(match[3]) : 0;
  
  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;
  
  return result.trim() || durationStr;
}

function parseOffer(offer: DuffelOffer): ParsedFlightResult {
  // Determine if this is a return flight (has multiple slices)
  const isReturnFlight = offer.slices.length > 1;
  
  // Use the outbound slice for main flight info
  const outboundSlice = offer.slices[0];
  const outboundSegments = outboundSlice.segments || [];
  
  if (outboundSegments.length === 0) {
    throw new Error('No segments found in offer slice');
  }
  
  // Get the first segment to determine airline
  const firstSegment = outboundSegments[0];
  const airline = firstSegment.marketing_carrier;
  
  // Get departure and arrival from the first and last segments
  const lastSegment = outboundSegments[outboundSegments.length - 1];
  
  const departure = parseDateTime(firstSegment.departing_at);
  const arrival = parseDateTime(lastSegment.arriving_at);
  
  // Calculate stops (number of segments - 1)
  const stops = Math.max(0, outboundSegments.length - 1);
  
  // Parse segments for detailed info
  const segments = outboundSegments.map(seg => ({
    departure: seg.origin.iata_code,
    arrival: seg.destination.iata_code,
    duration: calculateDuration(seg.duration),
    airline: seg.marketing_carrier.name
  }));

  return {
    id: offer.id,
    airline: airline.name,
    airlineCode: airline.iata_code,
    airlineLogo: airline.logo_symbol_url || airline.logo_lockup_url,
    price: {
      amount: offer.total_amount,
      currency: offer.total_currency
    },
    departure: {
      airport: outboundSlice.origin.iata_code,
      ...departure
    },
    arrival: {
      airport: outboundSlice.destination.iata_code,
      ...arrival
    },
    duration: calculateDuration(outboundSlice.duration),
    stops,
    segments,
    isReturnFlight
  };
}

async function searchFlights(params: FlightSearchRequest): Promise<ParsedFlightResult[]> {
  const apiToken = process.env.DUFFEL_API_TOKEN;
  if (!apiToken) {
    throw new Error('Duffel API token not configured');
  }

  // Build request payload
  const requestPayload = {
    data: {
      passengers: Array(params.passengers || 1).fill({ type: "adult" }),
      slices: [
        {
          origin: params.origin,
          destination: params.destination,
          departure_date: params.departure_date
        }
      ],
      cabin_class: params.cabin_class || "economy",
      return_offers: true
    }
  };

  // Add return slice if return date provided
  if (params.return_date) {
    requestPayload.data.slices.push({
      origin: params.destination,
      destination: params.origin,
      departure_date: params.return_date
    });
  }

  console.log('Duffel API request:', JSON.stringify(requestPayload, null, 2));

  const response = await fetch('https://api.duffel.com/air/offer_requests', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'Duffel-Version': 'v2',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestPayload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Duffel API error:', response.status, errorText);
    throw new Error(`Duffel API error: ${response.status} ${errorText}`);
  }

  const data: { data: DuffelOfferRequest } = await response.json();
  console.log('Duffel API response offers count:', data.data.offers?.length || 0);

  // Check if we got any offers
  if (!data.data.offers || data.data.offers.length === 0) {
    console.log('No offers returned from Duffel API');
    return [];
  }

  // Parse offers with error handling
  const parsedOffers: ParsedFlightResult[] = [];
  
  for (const offer of data.data.offers) {
    try {
      const parsed = parseOffer(offer);
      parsedOffers.push(parsed);
    } catch (error) {
      console.error('Error parsing offer:', error, 'Offer:', JSON.stringify(offer, null, 2));
      // Continue with other offers instead of failing completely
    }
  }

  console.log('Successfully parsed offers:', parsedOffers.length);

  // Filter out Duffel Airways test results
  const filtered = parsedOffers.filter(offer => !offer.airline.toLowerCase().includes('duffel'));
  console.log('After filtering Duffel Airways:', filtered.length);

  // Sort by price (ascending)
  filtered.sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount));

  // Return top 10 results
  return filtered.slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body: FlightSearchRequest = await request.json();
    
    // Validate required fields
    if (!body.origin || !body.destination || !body.departure_date) {
      return NextResponse.json(
        { error: 'Missing required fields: origin, destination, departure_date' },
        { status: 400 }
      );
    }

    // Validate IATA codes (3 letters)
    const iataRegex = /^[A-Z]{3}$/;
    if (!iataRegex.test(body.origin) || !iataRegex.test(body.destination)) {
      return NextResponse.json(
        { error: 'Origin and destination must be valid 3-letter IATA codes' },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = generateCacheKey(body);
    
    // Check cache first
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry && isValidCache(cachedEntry)) {
      console.log('Returning cached result for:', cacheKey);
      return NextResponse.json({
        data: cachedEntry.data,
        cached: true,
        cacheExpires: new Date(cachedEntry.expiresAt).toISOString()
      });
    }

    // Search flights via Duffel API
    const results = await searchFlights(body);

    // Cache the results
    const now = Date.now();
    cache.set(cacheKey, {
      data: results,
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    });

    // Clean up expired cache entries (basic cleanup)
    for (const [key, entry] of cache.entries()) {
      if (!isValidCache(entry)) {
        cache.delete(key);
      }
    }

    return NextResponse.json({
      data: results,
      cached: false,
      searchParams: body,
      totalResults: results.length
    });

  } catch (error) {
    console.error('Flight search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search flights', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Flight search API',
    endpoints: {
      POST: '/api/flights/search'
    },
    parameters: {
      origin: 'string (IATA code, e.g. "LHR")',
      destination: 'string (IATA code, e.g. "BGI")',
      departure_date: 'string (YYYY-MM-DD)',
      return_date: 'string (optional, YYYY-MM-DD)',
      passengers: 'number (optional, default: 1)',
      cabin_class: 'string (optional, default: "economy")'
    }
  });
}