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
              {r.amount !== null && (
                <p className="text-sm">Owes ${r.amount}</p>
              )}
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

// app/submit/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function SubmitReport() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    amount: "",
    phone: "",
    email: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.files && setFiles(Array.from(e.target.files));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const { name, address, amount, phone } = form;
    if (!name || !address || !amount || !phone) {
      setMsg({ type: "err", text: "Please fill in all required fields." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(amount) }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || "Server error");
      }

      setMsg({ type: "ok", text: "Report submitted!" });
      setForm({
        name: "",
        address: "",
        amount: "",
        phone: "",
        email: "",
        description: "",
      });
      setFiles([]);
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Submission failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Submit a Report</h1>

      {msg && (
        <p
          className={`mb-4 ${
            msg.type === "ok" ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="font-medium">Client Name / Company</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-1"
            required
          />
        </label>
        <label className="block">
          <span className="font-medium">Phone Number</span>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-1"
            required
          />
        </label>
        <label className="block">
          <span className="font-medium">E-mail Address (optional)</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-1"
          />
        </label>
        <label className="block">
          <span className="font-medium">Job Address</span>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-1"
            required
          />
        </label>
        <label className="block">
          <span className="font-medium">Amount Owed (USD)</span>
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-1"
            min="0"
            step="0.01"
            required
          />
        </label>
        <label className="block">
          <span className="font-medium">Description / What happened</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-1"
            rows={4}
          />
        </label>
        <label className="block">
          <span className="font-medium">Upload Proof</span>
          <input
            type="file"
            multiple
            onChange={handleFile}
            className="w-full mt-1"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting…" : "Submit Report"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/" className="text-blue-600 underline">
          Back to Home
        </Link>
      </div>
    </main>
  );
}