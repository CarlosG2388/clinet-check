import { sql } from "@vercel/postgres";

/* 1️⃣  runs once on first import – creates table if absent */
await sql`
  CREATE TABLE IF NOT EXISTS reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ     DEFAULT now(),
    name        TEXT  NOT NULL,
    phone       TEXT  NOT NULL,
    email       TEXT,
    address     TEXT  NOT NULL,
    amount      NUMERIC NOT NULL,
    description TEXT,
    proof_urls  JSONB
  );
`;

const toNull = (v: any) => (v === undefined ? null : v);

/* 2️⃣  insert helper */
export async function insertReport(r: {
  name: string;
  phone: string;
  email?: string;
  address: string;
  amount: number;
  description?: string;
  proof_urls?: any;
}) {
  await sql`
    INSERT INTO reports (name, phone, email, address, amount, description, proof_urls)
    VALUES (
      ${r.name},
      ${r.phone},
      ${toNull(r.email)},
      ${r.address},
      ${r.amount},
      ${toNull(r.description)},
      ${toNull(r.proof_urls)}
    );
  `;
}

/* 3️⃣  search helper */
export async function searchReports(q: string) {
  return sql`
    SELECT * FROM reports
    WHERE lower(name)    LIKE ${"%" + q.toLowerCase() + "%"}
       OR lower(address) LIKE ${"%" + q.toLowerCase() + "%"}
    ORDER BY created_at DESC
    LIMIT 50;
  `;
}