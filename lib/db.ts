import { sql } from "@vercel/postgres";

// make sure uuid generator exists, then table
await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
await sql`
  CREATE TABLE IF NOT EXISTS reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ DEFAULT now(),
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

export const insertReport = async (r: any) => {
  await sql`
    INSERT INTO reports (name, phone, email, address, amount, description, proof_urls)
    VALUES (
      ${r.name}, ${r.phone}, ${toNull(r.email)},
      ${r.address}, ${r.amount},
      ${toNull(r.description)}, ${toNull(r.proof_urls)}
    );
  `;
};

export const searchReports = (q: string) =>
  sql`
    SELECT * FROM reports
    WHERE lower(name)    LIKE ${"%" + q.toLowerCase() + "%"}
       OR lower(address) LIKE ${"%" + q.toLowerCase() + "%"}
    ORDER BY created_at DESC
    LIMIT 50;
  `;