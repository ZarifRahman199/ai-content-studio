import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[SUPABASE] CRITICAL: Missing env vars!", {
    url: supabaseUrl ? "set" : "NOT SET",
    key: supabaseAnonKey ? "set" : "NOT SET",
  });
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
