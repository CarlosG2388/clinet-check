// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";   // helper that returns a configured client

// ───────────────────────────────────────────────────────────
// GET /api/reports?q=searchTerm
// Returns all reports, filtered (case-insensitive) by name or address
// ───────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  const db = supabase();
  let query = db
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    // ilike → case-insensitive wildcard search
    query = query
      .ilike("name", `%${q}%`)
      .ilike("address", `%${q}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json(data);
}

// ───────────────────────────────────────────────────────────
// POST /api/reports
// Body: JSON { name, address, amount, phone, email, description }
// Inserts a new record and returns it
// ───────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const body = await request.json();
  const db   = supabase();

  const { data, error } = await db
    .from("reports")
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json(data);
}