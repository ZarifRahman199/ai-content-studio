import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const USE_SUPABASE = !!(supabaseUrl && supabaseAnonKey);

export const supabase = USE_SUPABASE ? createClient(supabaseUrl!, supabaseAnonKey!) : null;
