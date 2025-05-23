"use client";
import React from "react";
import Link from "next/link";

export default function Home() {
  const [query, setQuery] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSearch = () => {
    setMessage(
      !query.trim()
        ? "Please enter a name, company, or address to search."
        : `Searching for: "${query}"`
    );
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
        className="w-full bg-blue-600 text-white py-2 rounded mb-4"
      >
        Search
      </button>

      {message && <p className="mb-8 italic">{message}</p>}

      <Link
        href="/submit"
        className="inline-block bg-green-600 text-white px-6 py-3 rounded"
      >
        Submit a Report
      </Link>
    </main>
  );
}