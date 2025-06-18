import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Supabase direct URL
  ssl: { rejectUnauthorized: false },         // Supabase requires TLS
});

/** Ensures the reports table exists (runs only on first call). */
async function ensureSchema() {
  await pool.query(`
    create extension if not exists "uuid-ossp";

    create table if not exists reports (
      id          uuid primary key default uuid_generate_v4(),
      name        text,
      address     text,
      amount      numeric,
      phone       text,
      email       text,
      description text,
      created_at  timestamptz default now()
    );
  `);
}

/** INSERT one report and return the row. */
export async function insertReport(report: {
  name: string;
  address: string;
  amount: number;
  phone: string;
  email?: string;
  description?: string;
}) {
  await ensureSchema();
  const { rows } = await pool.query(
    `insert into reports (name,address,amount,phone,email,description)
     values ($1,$2,$3,$4,$5,$6) returning *`,
    [
      report.name,
      report.address,
      report.amount,
      report.phone,
      report.email ?? null,
      report.description ?? null,
    ],
  );
  return rows[0];
}

/** Simple case-insensitive search by name / address. */
export async function searchReports(q: string) {
  await ensureSchema();
  const { rows } = await pool.query(
    `select * from reports
     where name    ilike '%'||$1||'%'
        or address ilike '%'||$1||'%'
     order by created_at desc
     limit 50`,
    [q],
  );
  return rows;
}