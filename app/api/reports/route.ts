// app/api/reports/route.ts
-import { insertReport, searchReports } from "@/lib/db";
+import { insertReport, searchReports } from "@/lib/db";
// GET /api/reports?q=foo
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const { rows } = await searchReports(q);
  return NextResponse.json(rows);
}

// POST /api/reports
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await insertReport({ ...body, amount: Number(body.amount) });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("insert failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}