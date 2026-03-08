import { NextResponse } from 'next/server'

// In-memory cache
let cache: { rate: number; fetchedAt: string } | null = null
let cacheTime = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export async function GET() {
  const now = Date.now()
  
  // Return cached rate if fresh
  if (cache && now - cacheTime < CACHE_TTL) {
    return NextResponse.json({ ...cache, cached: true })
  }

  try {
    // BBD is pegged to USD at exactly 2:1
    // So GBP/BBD = GBP/USD * 2
    // Using fawazahmed0 free currency API (200+ currencies, no rate limits)
    const res = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/gbp.json',
      { next: { revalidate: 3600 } }
    )
    
    if (!res.ok) throw new Error('API error')
    
    const data = await res.json()
    const gbpUsd = data.gbp?.usd
    
    if (!gbpUsd) throw new Error('Rate not found')
    
    // BBD is pegged 2:1 to USD
    const gbpBbd = gbpUsd * 2
    
    cache = {
      rate: Math.round(gbpBbd * 10000) / 10000,
      fetchedAt: new Date().toISOString()
    }
    cacheTime = now
    
    return NextResponse.json(cache)
  } catch (err) {
    // Fallback to approximate rate if API fails
    console.error('Rate fetch error:', err)
    return NextResponse.json({
      rate: 2.67,
      fetchedAt: new Date().toISOString(),
      fallback: true
    })
  }
}
