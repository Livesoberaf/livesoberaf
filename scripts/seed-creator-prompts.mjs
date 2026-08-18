// Seeds creator prompts for Days 2–30, 7 moments each.
// Also updates Day 1 lunch → late_evening to match the 8pm slot.
// Moment → local hour: morning=8, mid_morning=10, afternoon=15,
//   late_afternoon=16, evening=18, late_evening=20, before_bed=22

const URL = "https://rczzdvfrjgofrxvhzmmj.supabase.co/rest/v1/prompts";
const KEY  = "REDACTED";
const HDR  = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" };

// ── Fix Day 1: change "lunch" moment → "late_evening" ────────────────────────

const day1LunchRes = await fetch(
  `${URL}?role=eq.creator&day_number=eq.1&moment=eq.lunch&select=id`,
  { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
);
const day1Lunch = await day1LunchRes.json();

if (day1Lunch[0]?.id) {
  await fetch(`${URL}?id=eq.${day1Lunch[0].id}`, {
    method: "PATCH",
    headers: HDR,
    body: JSON.stringify({
      moment: "late_evening",
      title:  "Getting through the evening",
      brief:  "It's 8pm on Day One. Tell them this is the danger hour — when using used to happen. Encourage them to change their environment or call someone right now. They've made it this far today.",
      sequence: 6,
    }),
  });
  console.log("Day 1 lunch → late_evening updated.");
}

// ── Day themes ────────────────────────────────────────────────────────────────

const DAY_THEMES = {
   2: { label: "Two",          context: "The adrenaline of Day One is gone. Today is quieter and harder in a different way." },
   3: { label: "Three",        context: "Often the hardest physical day. The body is working its hardest. Nearly through the worst." },
   4: { label: "Four",         context: "The fog is starting to lift. Small improvements are beginning." },
   5: { label: "Five",         context: "The acute withdrawal phase is largely behind them. Building basics now." },
   6: { label: "Six",          context: "First new routine starts here. The habit space needs filling." },
   7: { label: "Seven",        context: "One week. A real milestone. Different challenges begin now." },
   8: { label: "Eight",        context: "Second week. Physical urgency is gone. Psychological work begins." },
   9: { label: "Nine",         context: "Sleep starting to return. Emotional patterns becoming visible." },
  10: { label: "Ten",          context: "Double digits. The gap between craving and acting is widening." },
  11: { label: "Eleven",       context: "Relationships and old environments are showing their colours." },
  12: { label: "Twelve",       context: "The body is still doing its work. Identity questions are arriving." },
  13: { label: "Thirteen",     context: "Nearly two weeks. The addiction will try one more time before the milestone." },
  14: { label: "Fourteen",     context: "Two weeks done. Emotional recovery is the main event now." },
  15: { label: "Fifteen",      context: "Halfway through the first month. Building sustainable habits." },
  16: { label: "Sixteen",      context: "Thinking more clearly. Old anxieties surfacing as the fog lifts." },
  17: { label: "Seventeen",    context: "Memory and sleep improving. Loneliness can be a trigger here." },
  18: { label: "Eighteen",     context: "Recovery is not linear. A hard day doesn't cancel what's been built." },
  19: { label: "Nineteen",     context: "Getting more honest with yourself. Understanding what using was doing." },
  20: { label: "Twenty",       context: "Three weeks approaching. Social anxiety without the substance is real." },
  21: { label: "Twenty-One",   context: "Three weeks. Real momentum. Emotions catching up with the body." },
  22: { label: "Twenty-Two",   context: "Building a new normal. Surviving is shifting to building." },
  23: { label: "Twenty-Three", context: "The new relationship with time — what fills the evening now?" },
  24: { label: "Twenty-Four",  context: "Nearly four weeks. The body has done enormous healing." },
  25: { label: "Twenty-Five",  context: "Nearly a month. In the minority of people who get this far." },
  26: { label: "Twenty-Six",   context: "Recovery is making space for things that were crowded out." },
  27: { label: "Twenty-Seven", context: "Three days from a month. Hold today the same way as every other." },
  28: { label: "Twenty-Eight", context: "Two days. The addiction will try to sabotage before the milestone." },
  29: { label: "Twenty-Nine",  context: "Tomorrow is a month. Today delivers tomorrow." },
  30: { label: "Thirty",       context: "A month. The foundation is built. Not the finish line — the start." },
};

const MOMENT_BRIEFS = {
  morning: (day, label, context) =>
    `Good morning on Day ${day}. ${context} Open with something true about where they are right now — name the day, acknowledge it, give them one thing to hold onto for today.`,
  mid_morning: (day, label, context) =>
    `Mid-morning check-in on Day ${day}. They've been up for a couple of hours. ${context} Give them a practical tip or observation for getting through the rest of the morning.`,
  afternoon: (day, label, context) =>
    `Afternoon message for Day ${day}. ${context} A reset for the middle of the day — acknowledge what they've already done today and help them focus on the next few hours.`,
  late_afternoon: (day, label, context) =>
    `Late afternoon on Day ${day} — the hardest window is approaching. ${context} Prepare them for the evening: one concrete thing they can do in the next hour to set themselves up.`,
  evening: (day, label, context) =>
    `Evening message for Day ${day}. ${context} This is when cravings peak for most people. Be direct about that and give them something real — a grounding thought, a specific action, or a reminder of why today matters.`,
  late_evening: (day, label, context) =>
    `8pm on Day ${day}. ${context} They're in the danger zone of the evening. Tell them to change location, call someone, or do something physical right now. Almost through tonight.`,
  before_bed: (day, label, context) =>
    `Close of Day ${day}. ${context} They made it through another day. Acknowledge that specifically — what getting through today means. Help them wind down and face tomorrow with something to hold onto.`,
};

// ── Seed Days 2–30 ────────────────────────────────────────────────────────────

const MOMENTS = ["morning", "mid_morning", "afternoon", "late_afternoon", "evening", "late_evening", "before_bed"];
const SEQ     = { morning: 1, mid_morning: 2, afternoon: 3, late_afternoon: 4, evening: 5, late_evening: 6, before_bed: 7 };

let inserted = 0, skipped = 0, errors = 0;

for (const [dayStr, theme] of Object.entries(DAY_THEMES)) {
  const day = parseInt(dayStr);

  for (const moment of MOMENTS) {
    const brief = MOMENT_BRIEFS[moment](day, theme.label, theme.context);
    const title = moment === "morning"
      ? `Day ${theme.label} — morning`
      : moment === "before_bed"
      ? `Day ${theme.label} — close`
      : `Day ${theme.label} — ${moment.replace("_", " ")}`;

    const r = await fetch(URL, {
      method: "POST",
      headers: { ...HDR, "Prefer": "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({
        role: "creator", trigger_type: "day",
        day_number: day, moment, pathway: "alcohol",
        title, brief, sequence: SEQ[moment], active: true,
      }),
    });

    if (r.status === 201 || r.status === 200) { inserted++; }
    else if (r.status === 409) { skipped++; }
    else { errors++; console.error(`Day ${day} ${moment}:`, r.status, await r.text()); }
  }
}

console.log(`Done. Inserted: ${inserted}, Skipped (already exist): ${skipped}, Errors: ${errors}`);
