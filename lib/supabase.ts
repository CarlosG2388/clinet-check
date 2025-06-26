import { createClient } from "@supabase/supabase-js";
export function supabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}