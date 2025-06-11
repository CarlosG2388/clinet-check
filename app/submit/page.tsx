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

  /* ---------- handlers ---------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.files && setFiles(Array.from(e.target.files));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, address, amount, phone } = form;
    if (!name || !address || !amount || !phone) {
      setMsg({ type: "err", text: "Please fill in all required fields." });
      return;
    }

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(amount) }),
      });
      if (!res.ok) throw new Error("Server error");

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
    } catch (err) {
      setMsg({ type: "err", text: "Submit failed – try again." });
    }
  };

  /* ---------- UI ---------- */

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
        {/* Name / Company */}
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

        {/* Phone */}
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

        {/* Email (optional) */}
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

        {/* Address */}
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

        {/* Amount */}
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

        {/* Description */}
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

        {/* Proof upload */}
        <label className="block">
          <span className="font-medium">Upload Proof (optional)</span>
          <input
            type="file"
            multiple
            onChange={handleFile}
            className="w-full mt-1"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Submit Report
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