import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — not initialized until first call so build-time imports
// don't fail when env vars are absent.
let _admin: SupabaseClient | undefined;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _admin;
}
