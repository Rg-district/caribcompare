"use client";

import StarRating from "./StarRating";

interface ProviderCardProps {
  name: string;
  badge?: string;
  rating: number;
  details: { label: string; value: string }[];
  ctaLabel: string;
  affiliateUrl: string;
  highlight?: string;
}

export default function ProviderCard({
  name,
  badge,
  rating,
  details,
  ctaLabel,
  affiliateUrl,
  highlight,
}: ProviderCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-navy">{name}</h3>
          <StarRating rating={rating} />
        </div>
        {badge && (
          <span className="bg-gold/10 text-gold text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {highlight && (
        <p className="text-2xl font-bold text-navy mb-3">{highlight}</p>
      )}

      <div className="space-y-2 mb-4">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{d.label}</span>
            <span className="font-medium text-gray-900">{d.value}</span>
          </div>
        ))}
      </div>

      <a
        href={affiliateUrl}
        onClick={() => console.log(`CTA clicked: ${name}`)}
        className="block w-full text-center bg-gold hover:bg-gold-light text-navy font-semibold py-3 rounded-lg text-sm transition-colors"
      >
        {ctaLabel}
      </a>
    </div>
  );
}
