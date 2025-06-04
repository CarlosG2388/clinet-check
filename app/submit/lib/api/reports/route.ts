import { NextRequest, NextResponse } from "next/server";
import { insertReport, searchReports } from "@/lib/db";

// GET /api/reports?q=keyword
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const { rows } = await searchReports(q);
  return NextResponse.json(rows);
}

// POST /api/reports  (body = report)
export async function POST(req: NextRequest) {
  const body = await req.json();
  await insertReport({ ...body, amount: Number(body.amount) });
  return NextResponse.json({ ok: true });
}