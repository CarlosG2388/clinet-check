// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { insertReport, searchReports } from "@/lib/db";

// GET /api/reports?q=foo
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const rows = await searchReports(q);
  return NextResponse.json(rows);
}

// POST /api/reports  (JSON body)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await insertReport(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error("insert failed:", err);
    return NextResponse.json(
      { error: "insert failed" },
      { status: 500 },
    );
  }
}