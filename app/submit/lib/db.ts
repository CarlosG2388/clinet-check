import { sql } from "@vercel/postgres";

// Run once: create table if it doesn't exist
await sql`
  CREATE TABLE IF NOT EXISTS reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    name        TEXT  NOT NULL,
    phone       TEXT  NOT NULL,
    email       TEXT,
    address     TEXT  NOT NULL,
    amount      NUMERIC NOT NULL,
    description TEXT,
    proof_urls  JSONB
  );
`;

// Insert a new report
export const insertReport = async (r: {
  name: string;
  phone: string;
  email?: string;
  address: string;
  amount: number;
  description?: string;
  proof_urls?: any;
}) => {
  await sql`
    INSERT INTO reports (name, phone, email, address, amount, description, proof_urls)
    VALUES (${r.name}, ${r.phone}, ${r.email}, ${r.address}, ${r.amount}, ${r.description}, ${r.proof_urls})
  `;
};

// Search reports by name or address
export const searchReports = async (q: string) =>
  sql`
    SELECT * FROM reports
    WHERE lower(name)    LIKE ${"%" + q.toLowerCase() + "%"}
       OR lower(address) LIKE ${"%" + q.toLowerCase() + "%"}
    ORDER BY created_at DESC
    LIMIT 50;
  `;