"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-navy">You&apos;re signed up!</p>
        <p className="text-gray-600 mt-1">
          We&apos;ll send you weekly rate alerts and Caribbean finance news.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h3 className="text-xl font-bold text-navy text-center">
        Get weekly rate alerts and Caribbean finance news
      </h3>
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="submit"
          className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
        >
          Subscribe
        </button>
      </form>
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
    </div>
  );
}
