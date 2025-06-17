import { NextResponse } from "next/server";

export async function GET() {
  // Never log the full password; just show the host + db name.
  const url = process.env.POSTGRES_URL || "";
  let parsedHost = "not-set";
  try {
    const { hostname, pathname } = new URL(url);
    parsedHost = `${hostname}${pathname}`;
  } catch {}

  return NextResponse.json({
    POSTGRES_URL_present: Boolean(url),
    POSTGRES_URL_host: parsedHost,
  });
}