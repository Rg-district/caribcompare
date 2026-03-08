import { NextResponse } from "next/server";

let cache: { rate: number; fetchedAt: string } | null = null;
let cacheTime = 0;
const TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const now = Date.now();

  if (cache && now - cacheTime < TTL) {
    return NextResponse.json(cache);
  }

  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=GBP&to=BBD",
      { cache: "no-store" }
    );
    const data = await res.json();
    const rate = data.rates?.BBD;

    if (!rate) {
      throw new Error("BBD rate not found");
    }

    cache = { rate, fetchedAt: new Date().toISOString() };
    cacheTime = now;

    return NextResponse.json(cache);
  } catch {
    // Fallback rate if API is unavailable
    const fallback = { rate: 2.53, fetchedAt: new Date().toISOString() };
    return NextResponse.json(fallback);
  }
}
