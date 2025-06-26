// app/page.tsx
"use client";
import React from "react";
import Link from "next/link";

export default function Home() {
  const [query, setQuery] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setMessage("Please enter a name, company, or address to search.");
      setResults([]);
      return;
    }
    setMessage("Searching…");
    try {
      const res = await fetch(`/api/reports?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResults(data);
      setMessage(data.length ? "" : "No reports found.");
    } catch {
      setMessage("Error fetching reports. Try again later.");
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-2">Client Check</h1>
      <p className="text-sm text-gray-600 mb-4">Protect your labor</p>
      <p className="text-lg mb-8">
        Search for contractors or homeowners reported for non-payment.
      </p>

      <input
        type="text"
        placeholder="Search by name, company, or address"
        className="w-full p-3 border rounded mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white py-2 rounded mb-6"
      >
        Search
      </button>

      {message && <p className="mb-6 italic text-gray-700">{message}</p>}

      {results.length > 0 && (
        <ul className="space-y-4 text-left">
          {results.map((r) => (
            <li key={r.id} className="border rounded p-4">
              <p className="font-bold text-lg">{r.name}</p>
              <p className="text-sm text-gray-600">{r.address}</p>
              <p className="text-sm">Owes ${r.amount}</p>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/submit"
        className="inline-block bg-green-600 text-white px-6 py-3 rounded mt-8"
      >
        Submit a Report
      </Link>
    </main>
  );
}