// Applies the push_tokens v2 migration: adds timezone and sober_date columns.
const SUPABASE_URL = "https://rczzdvfrjgofrxvhzmmj.supabase.co";
const SERVICE_KEY  = "REDACTED";

// Use the Management API to run raw SQL
const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: "POST",
  headers: {
    "apikey": SERVICE_KEY,
    "Authorization": `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      alter table push_tokens add column if not exists timezone text not null default 'Europe/London';
      alter table push_tokens add column if not exists sober_date date;
    `
  }),
});

// exec_sql may not exist — fall back to direct column check via REST
if (!res.ok) {
  // Try adding via a dummy upsert that forces the columns to exist
  console.log("exec_sql not available, checking columns via REST...");
  const check = await fetch(`${SUPABASE_URL}/rest/v1/push_tokens?limit=1&select=timezone,sober_date`, {
    headers: { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` }
  });
  if (check.ok) {
    console.log("Columns already exist.");
  } else {
    console.log("Columns missing — apply 005_push_tokens_v2.sql via Supabase dashboard SQL editor.");
  }
} else {
  console.log("Migration applied.");
}
