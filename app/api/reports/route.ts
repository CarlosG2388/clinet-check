import { NextRequest, NextResponse } from "next/server";
import { insertReport, searchReports } from "../../../lib/db";

/* GET /api/reports?q=abc  -> array of rows */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const { rows } = await searchReports(q);
  return NextResponse.json(rows);
}

/* POST /api/reports  body = report JSON */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await insertReport({ ...body, amount: Number(body.amount) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DB insert failed:", err);
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }
}