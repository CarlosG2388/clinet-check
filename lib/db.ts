import { sql } from "@vercel/postgres";

// 1️⃣ run once per cold-start, but only when called
let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
      await sql`
        CREATE TABLE IF NOT EXISTS reports (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ DEFAULT now(),
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          address TEXT NOT NULL,
          amount NUMERIC NOT NULL,
          description TEXT,
          proof_urls JSONB
        );
      `;
    })();
  }
  return schemaReady;
}

export async function insertReport(r: any) {
  await ensureSchema();
  await sql`
    INSERT INTO reports (name, phone, email, address, amount, description, proof_urls)
    VALUES (${r.name}, ${r.phone}, ${r.email}, ${r.address}, ${r.amount},
            ${r.description}, ${r.proof_urls});
  `;
}

export async function searchReports(q: string) {
  await ensureSchema();
  return sql`
    SELECT * FROM reports
    WHERE lower(name) LIKE ${"%" + q.toLowerCase() + "%"}
       OR lower(address) LIKE ${"%" + q.toLowerCase() + "%"}
    ORDER BY created_at DESC
    LIMIT 50;
  `;
}