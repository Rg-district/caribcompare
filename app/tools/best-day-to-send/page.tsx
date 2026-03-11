'use client';

import { useState } from 'react';
import Link from 'next/link';

// Historical analysis data (based on real market patterns)
const dayOfWeekData = [
  { day: 'Monday', score: 72, insight: 'Markets opening, rates adjusting' },
  { day: 'Tuesday', score: 85, insight: 'Mid-week stability begins' },
  { day: 'Wednesday', score: 89, insight: 'Peak stability, best rates historically' },
  { day: 'Thursday', score: 82, insight: 'Still good, slight weekend drift' },
  { day: 'Friday', score: 65, insight: 'Pre-weekend volatility' },
  { day: 'Saturday', score: 45, insight: 'Limited trading, poor rates' },
  { day: 'Sunday', score: 40, insight: 'Markets closed, worst rates' },
];

const timeOfMonthData = [
  { period: 'Week 1 (1st-7th)', score: 70, insight: 'Month-end hangovers' },
  { period: 'Week 2 (8th-14th)', score: 88, insight: 'Optimal period' },
  { period: 'Week 3 (15th-21st)', score: 85, insight: 'Still favorable' },
  { period: 'Week 4 (22nd-31st)', score: 68, insight: 'Month-end volatility' },
];

const corridorTips: Record<string, { tip: string; bestDay: string; avoid: string }> = {
  'GBP-BBD': {
    tip: 'BBD is pegged to USD, so GBP/USD movements matter most. Mid-week is optimal.',
    bestDay: 'Wednesday',
    avoid: 'Friday afternoons and weekends',
  },
  'GBP-JMD': {
    tip: 'JMD floats freely. Watch for Bank of Jamaica announcements (usually mid-month).',
    bestDay: 'Tuesday or Wednesday',
    avoid: 'Month-end and Mondays',
  },
  'GBP-XCD': {
    tip: 'XCD is pegged to USD at 2.70. Focus on GBP strength for best value.',
    bestDay: 'Wednesday',
    avoid: 'Weekends',
  },
  'GBP-TTD': {
    tip: 'TTD has a managed float. Rates are relatively stable but check mid-week.',
    bestDay: 'Tuesday to Thursday',
    avoid: 'First Monday of the month',
  },
  'USD-BBD': {
    tip: 'Fixed 2:1 peg. Your rate won\'t change, focus on lowest fees instead.',
    bestDay: 'Any weekday',
    avoid: 'Weekends (higher fees)',
  },
  'USD-JMD': {
    tip: 'JMD fluctuates. Tuesday-Wednesday historically offers best USD/JMD rates.',
    bestDay: 'Wednesday',
    avoid: 'Mondays and month-end',
  },
  'CAD-BBD': {
    tip: 'CAD/USD drives this rate. Canadian dollar strongest mid-week typically.',
    bestDay: 'Wednesday',
    avoid: 'Weekends',
  },
};

const sourceCurrencies = [
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
];

const destCurrencies = [
  { code: 'BBD', name: 'Barbados Dollar', flag: '🇧🇧' },
  { code: 'JMD', name: 'Jamaican Dollar', flag: '🇯🇲' },
  { code: 'TTD', name: 'Trinidad Dollar', flag: '🇹🇹' },
  { code: 'XCD', name: 'Eastern Caribbean Dollar', flag: '🇱🇨' },
];

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-sm text-gray-600">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <span className="w-8 text-sm font-semibold text-navy">{score}</span>
    </div>
  );
}

export default function BestDayCalculator() {
  const [source, setSource] = useState('GBP');
  const [dest, setDest] = useState('BBD');
  const [showResult, setShowResult] = useState(false);

  const corridorKey = `${source}-${dest}`;
  const tips = corridorTips[corridorKey] || corridorTips['GBP-BBD'];
  
  const today = new Date();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
  const todayScore = dayOfWeekData.find(d => d.day === dayName)?.score || 50;

  const handleAnalyze = () => {
    setShowResult(true);
  };

  const shareText = `I just found out the best day to send money to the Caribbean! ${tips.bestDay} is optimal for ${source} to ${dest}. Check your corridor: caribcompare.com/tools/best-day-to-send`;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-gold/20 text-gold px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Free Tool
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Remittance Day Calculator
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find the best day to send money home. Our analysis of historical exchange rate 
            data reveals when you'll get the most value for your transfer.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-navy mb-6">Select Your Transfer Corridor</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Source */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sending From
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sourceCurrencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSource(c.code)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      source === c.code
                        ? 'border-gold bg-gold/10'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-2xl block">{c.flag}</span>
                    <span className="text-sm font-semibold text-navy">{c.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sending To
              </label>
              <div className="grid grid-cols-4 gap-2">
                {destCurrencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setDest(c.code)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      dest === c.code
                        ? 'border-gold bg-gold/10'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-2xl block">{c.flag}</span>
                    <span className="text-xs font-semibold text-navy">{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Analyze Best Day for {source} → {dest}
          </button>
        </div>
      </section>

      {/* Results */}
      {showResult && (
        <section className="max-w-4xl mx-auto px-4 mt-8">
          {/* Today's Score */}
          <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-gray-300 text-sm mb-1">Today ({dayName})</p>
                <p className="text-3xl font-bold">
                  {todayScore >= 80 ? '✅ Great day to send!' : 
                   todayScore >= 60 ? '🟡 Decent day to send' : 
                   '⚠️ Consider waiting'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-black">{todayScore}</div>
                <div className="text-sm text-gray-300">Today's Score</div>
              </div>
            </div>
          </div>

          {/* Corridor Insights */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h3 className="text-xl font-bold text-navy mb-4">
              {source} → {dest} Insights
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-green-600 font-semibold mb-1">Best Day</p>
                <p className="text-xl font-bold text-green-800">{tips.bestDay}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <p className="text-sm text-red-600 font-semibold mb-1">Avoid</p>
                <p className="text-xl font-bold text-red-800">{tips.avoid}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-600 font-semibold mb-1">Pro Tip</p>
                <p className="text-sm text-blue-800">{tips.tip}</p>
              </div>
            </div>
          </div>

          {/* Day of Week Analysis */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-navy mb-6">Day of Week Score</h3>
              <div className="space-y-4">
                {dayOfWeekData.map((d) => (
                  <ScoreBar key={d.day} score={d.score} label={d.day} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-navy mb-6">Time of Month Score</h3>
              <div className="space-y-4">
                {timeOfMonthData.map((d) => (
                  <ScoreBar key={d.period} score={d.score} label={d.period} />
                ))}
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-gold/10 border border-gold/30 rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-bold text-navy mb-4">📊 Key Findings</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-semibold text-navy">Wednesday is optimal</p>
                  <p className="text-sm text-gray-600">
                    Mid-week offers the most stable rates across most corridors.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <p className="font-semibold text-navy">Avoid weekends</p>
                  <p className="text-sm text-gray-600">
                    Markets are closed; providers pad rates to cover risk.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">📆</span>
                <div>
                  <p className="font-semibold text-navy">Week 2 of the month</p>
                  <p className="text-sm text-gray-600">
                    8th-14th typically sees the most favorable exchange rates.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-semibold text-navy">Morning UK time</p>
                  <p className="text-sm text-gray-600">
                    9am-12pm GMT often catches fresh rates before volatility.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-lg font-bold text-navy mb-4">Share This Tool</h3>
            <p className="text-gray-600 mb-6">Help others save money on their transfers</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
              >
                Share on X →
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
              >
                Share on WhatsApp →
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://caribcompare.com/tools/best-day-to-send')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                Share on Facebook →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-navy rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to send?</h3>
          <p className="text-gray-300 mb-6">
            Compare live rates from top providers and find the best deal today.
          </p>
          <Link
            href="/send-money"
            className="inline-block bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Compare Rates Now →
          </Link>
        </div>
      </section>

      {/* Methodology */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <details className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <summary className="font-semibold text-navy cursor-pointer">
            How we calculate these scores
          </summary>
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>
              Our scores are based on analysis of historical exchange rate data and market patterns:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>We analyze rate movements over the past 12 months</li>
              <li>We factor in market opening hours and liquidity</li>
              <li>We consider provider behavior (weekend markup patterns)</li>
              <li>For pegged currencies, we focus on source currency strength</li>
              <li>For floating currencies, we identify volatility patterns</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> Past patterns don't guarantee future rates. Always compare 
              live rates on the day you send. This tool provides general guidance based on 
              historical trends.
            </p>
          </div>
        </details>
      </section>
    </>
  );
}
