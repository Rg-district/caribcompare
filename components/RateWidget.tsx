"use client";

import { useState, useEffect, useCallback } from "react";

export default function RateWidget() {
  const [gbp, setGbp] = useState("100");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRate = useCallback(async () => {
    try {
      const res = await fetch("/api/rates");
      const data = await res.json();
      setRate(data.rate);
    } catch {
      setRate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const gbpNum = parseFloat(gbp) || 0;
  const bbd = rate ? gbpNum * rate : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Live GBP &rarr; BBD Rate
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">You send (GBP)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              &pound;
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={gbp}
              onChange={(e) => setGbp(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            They receive (BBD)
          </label>
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-2xl font-bold text-navy">
              {loading ? "..." : `$${bbd.toFixed(2)}`}
            </span>
          </div>
        </div>
        {rate && (
          <p className="text-xs text-gray-400 text-center">
            Mid-market rate: 1 GBP = {rate.toFixed(4)} BBD
          </p>
        )}
      </div>
    </div>
  );
}
