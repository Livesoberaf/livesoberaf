import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.");
  process.exit(1);
}
const supabase = createClient(url, key);

// ── 1. Create Abby as a creator ───────────────────────────────────────────────

const { data: existing } = await supabase
  .from("creators")
  .select("id")
  .eq("name", "Abby")
  .eq("pathway", "codeine")
  .maybeSingle();

let abbyId;

if (existing) {
  abbyId = existing.id;
  console.log("Abby already exists, id:", abbyId);
} else {
  const { data: creator, error } = await supabase
    .from("creators")
    .insert({
      name:        "Abby",
      role:        "creator",
      pathway:     "codeine",
      region:      "UK",
      sex:         "female",
      age_range:   "30-40",
      access_code: "Abby2025!",
    })
    .select("id")
    .single();

  if (error) { console.error("Failed to create Abby:", error); process.exit(1); }
  abbyId = creator.id;
  console.log("Created Abby, id:", abbyId);
}

// ── 2. Check existing prompts ─────────────────────────────────────────────────

const { data: existingPrompts } = await supabase
  .from("prompts")
  .select("id")
  .eq("pathway", "codeine")
  .eq("role", "creator");

if (existingPrompts?.length) {
  console.log(`${existingPrompts.length} Codeine prompts already exist — skipping insert.`);
  process.exit(0);
}

// ── 3. Codeine prompts — Days 1–7, 7 moments each ────────────────────────────
//
// Codeine/opioid withdrawal: peaks 48–72 hours, flu-like symptoms,
// muscle aches, restlessness, insomnia. PAWS common. Shame around
// prescription addiction is specific and needs to be named directly.

const moments = [
  "morning", "mid_morning", "afternoon",
  "late_afternoon", "evening", "late_evening", "before_bed",
];

const prompts = [

  // ── DAY 1 ──────────────────────────────────────────────────────────────────
  {
    day: 1, moment: "morning", seq: 1,
    title: "The first morning",
    brief: "Tell them they only need to get through this morning. Not forever — just the next few hours. Share what YOUR first morning felt like.",
  },
  {
    day: 1, moment: "mid_morning", seq: 2,
    title: "What's happening in your body",
    brief: "Name the early symptoms — restlessness, anxiety, maybe a bit achy. Explain this is the body recalibrating after codeine, not them breaking. It's biology.",
  },
  {
    day: 1, moment: "afternoon", seq: 3,
    title: "It was just a prescription",
    brief: "Speak directly to the shame. Many Codeine users feel they should have seen it coming — 'it was just a painkiller.' Name that feeling and explain why it's not their fault.",
  },
  {
    day: 1, moment: "late_afternoon", seq: 4,
    title: "The crawling feeling",
    brief: "Restless legs and skin-crawling are common on Day 1 with opioids. Tell them what it is, that it peaks and passes, and one thing that helped you.",
  },
  {
    day: 1, moment: "evening", seq: 5,
    title: "Get through tonight",
    brief: "Evening is hardest on Day 1. Tell them to put distance between themselves and any remaining pills or triggers. One hour at a time is enough.",
  },
  {
    day: 1, moment: "late_evening", seq: 6,
    title: "Sleep might not come",
    brief: "Insomnia is almost guaranteed on night one. Tell them not to fight it — resting is enough. What helped you get through that first night.",
  },
  {
    day: 1, moment: "before_bed", seq: 7,
    title: "You did Day 1",
    brief: "This is the hardest day. They did it. Keep it short and honest — you're proud of them, and tomorrow the physical stuff starts to peak but they now know they can handle it.",
  },

  // ── DAY 2 ──────────────────────────────────────────────────────────────────
  {
    day: 2, moment: "morning", seq: 1,
    title: "Day 2 — the body fights back",
    brief: "Day 2 is when withdrawal hits hardest for opioids. Name it: muscle aches, sweating, anxiety, no sleep. Tell them this is peak and it will turn.",
  },
  {
    day: 2, moment: "mid_morning", seq: 2,
    title: "You're not ill — you're healing",
    brief: "The flu-like feeling today is the body flooding with natural chemicals it suppressed for months. It's a sign of healing, not failure. Explain what's actually happening.",
  },
  {
    day: 2, moment: "afternoon", seq: 3,
    title: "One hour",
    brief: "Don't ask them to think about tomorrow. Just this hour. Tell them what you did hour by hour on your worst withdrawal day to get through it.",
  },
  {
    day: 2, moment: "late_afternoon", seq: 4,
    title: "Reach out to someone",
    brief: "Day 2 is when people relapse because they're alone with it. Tell them to text or call one person right now — not to explain everything, just to not be alone.",
  },
  {
    day: 2, moment: "evening", seq: 5,
    title: "The hardest hours",
    brief: "Evening on Day 2 is the low point for most opioid withdrawal. Tell them where you were at this exact point and that you're here now. Keep it real.",
  },
  {
    day: 2, moment: "late_evening", seq: 6,
    title: "Your body is working overtime",
    brief: "Sweating, goosebumps, aches — the nervous system is recalibrating. Practical things that helped you: hot bath, hot water bottle, paracetamol. Share what actually worked.",
  },
  {
    day: 2, moment: "before_bed", seq: 7,
    title: "Tonight you rest",
    brief: "They've made it through the worst day. Tomorrow starts the turn. Tell them sleep or rest is all they need to do tonight — nothing else is required of them.",
  },

  // ── DAY 3 ──────────────────────────────────────────────────────────────────
  {
    day: 3, moment: "morning", seq: 1,
    title: "The turn begins",
    brief: "Day 3 is when physical withdrawal starts to ease — not gone, but starting to turn. Tell them what that shift felt like for you. The worst is behind them.",
  },
  {
    day: 3, moment: "mid_morning", seq: 2,
    title: "Eat something",
    brief: "Appetite is gone but the body needs fuel. Practical and real: what you could stomach on Day 3, why it mattered, and how a small meal changed your energy.",
  },
  {
    day: 3, moment: "afternoon", seq: 3,
    title: "The anxiety underneath",
    brief: "As the physical symptoms ease, anxiety often steps up. Codeine masked a lot of feelings. Name that — they're going to start feeling things they numbed. That's the work.",
  },
  {
    day: 3, moment: "late_afternoon", seq: 4,
    title: "Three days is real",
    brief: "Most people who relapse do it in the first 72 hours. They just passed that. Tell them what three days meant to you and why it matters more than it sounds.",
  },
  {
    day: 3, moment: "evening", seq: 5,
    title: "What you were medicating",
    brief: "Often Codeine started as pain relief — physical or emotional. Gently open the door to that: the recovery isn't just stopping the pill, it's understanding what the pill was for.",
  },
  {
    day: 3, moment: "late_evening", seq: 6,
    title: "Sleep is returning",
    brief: "Night three usually brings slightly better sleep than night one or two. Tell them what the first decent night felt like and why rest is part of the recovery, not a break from it.",
  },
  {
    day: 3, moment: "before_bed", seq: 7,
    title: "72 hours",
    brief: "72 hours. Name the milestone, celebrate it genuinely. What 72 hours clean from Codeine meant to you. Short, warm, real.",
  },

  // ── DAY 4 ──────────────────────────────────────────────────────────────────
  {
    day: 4, moment: "morning", seq: 1,
    title: "The body is settling",
    brief: "Physical symptoms are mostly through. What comes next is the emotional work. Tell them they've handled the hardest physical part — what they'll face now is different but manageable.",
  },
  {
    day: 4, moment: "mid_morning", seq: 2,
    title: "The grey feeling",
    brief: "Anhedonia — nothing feels good or interesting. The brain's reward system is rebuilding. Name it, explain it's normal and temporary, and give them a realistic timeline.",
  },
  {
    day: 4, moment: "afternoon", seq: 3,
    title: "Watch for the pull",
    brief: "Days 4–7 are when the physical relief creates a false sense of being fine — and people relapse 'just once.' Tell them what that pull felt like and how you saw it coming.",
  },
  {
    day: 4, moment: "late_afternoon", seq: 4,
    title: "Small wins count",
    brief: "Name something tiny — showered, ate a meal, made a call. These are the building blocks of recovery. Tell them what your small wins looked like on Day 4.",
  },
  {
    day: 4, moment: "evening", seq: 5,
    title: "Tell someone the truth",
    brief: "Codeine addiction often stays hidden because it starts with a prescription. Encourage them to tell one person the real story — not all of it, just one true thing.",
  },
  {
    day: 4, moment: "late_evening", seq: 6,
    title: "What recovery actually looks like",
    brief: "It's not dramatic. It's quiet evenings, getting through another day, not reaching for the pills. Tell them what a normal Day 4 evening looked like for you.",
  },
  {
    day: 4, moment: "before_bed", seq: 7,
    title: "Four days",
    brief: "Short and warm. Four days is four days. What it meant to you to reach this point.",
  },

  // ── DAY 5 ──────────────────────────────────────────────────────────────────
  {
    day: 5, moment: "morning", seq: 1,
    title: "Five days clean",
    brief: "Name where they are. Five days from Codeine is significant — most people who reach day 5 go on to complete a month. Tell them that.",
  },
  {
    day: 5, moment: "mid_morning", seq: 2,
    title: "Energy is coming back",
    brief: "Small signs: clearer head, more energy than Day 2. Tell them what returning energy felt like and what you started doing with it.",
  },
  {
    day: 5, moment: "afternoon", seq: 3,
    title: "The prescription narrative",
    brief: "Many people rationalise going back: 'I have real pain, I need it.' Talk directly to this. How you separated the pain from the dependence. What actually helped the pain.",
  },
  {
    day: 5, moment: "late_afternoon", seq: 4,
    title: "Build one habit",
    brief: "One small daily habit replaces the routine of taking the pill. What you built — a walk, a drink, a call — and why the timing mattered.",
  },
  {
    day: 5, moment: "evening", seq: 5,
    title: "Notice what's different",
    brief: "Compare this evening to Day 1 evening. What's genuinely different — energy, mood, body, clarity. Ask them to notice it rather than wait to feel it.",
  },
  {
    day: 5, moment: "late_evening", seq: 6,
    title: "The quiet is uncomfortable",
    brief: "Without the pill to look forward to or rely on, evenings can feel empty. Name that. The discomfort is real — and it's part of finding out what they actually enjoy.",
  },
  {
    day: 5, moment: "before_bed", seq: 7,
    title: "Another night done",
    brief: "Keep it brief. Another night. Another day. That's the whole job right now.",
  },

  // ── DAY 7 ──────────────────────────────────────────────────────────────────
  {
    day: 7, moment: "morning", seq: 1,
    title: "One week",
    brief: "One full week. The physical withdrawal is over. Tell them what one week meant to you and what changes you started to notice.",
  },
  {
    day: 7, moment: "mid_morning", seq: 2,
    title: "PAWS is coming — be ready",
    brief: "Post-acute withdrawal: dips in energy and mood over weeks and months. Name it now so they're not blindsided. It passes but it needs naming.",
  },
  {
    day: 7, moment: "afternoon", seq: 3,
    title: "You broke a physical dependence",
    brief: "One week ago their body needed codeine to feel normal. Today it doesn't. That's a physical change that took seven days of real work. Name the scale of it.",
  },
  {
    day: 7, moment: "late_afternoon", seq: 4,
    title: "What's next",
    brief: "Week one is survival. Week two is about building. Tell them what you shifted focus to at day 7 — what became possible that wasn't on Day 1.",
  },
  {
    day: 7, moment: "evening", seq: 5,
    title: "The shame is lifting",
    brief: "Prescription addiction carries its own stigma. Ask them if the shame is starting to shift — and tell them when yours did and what changed it.",
  },
  {
    day: 7, moment: "late_evening", seq: 6,
    title: "Seven evenings without it",
    brief: "Seven evenings where they didn't reach for the pills. What that routine looked like for you at the end of week one.",
  },
  {
    day: 7, moment: "before_bed", seq: 7,
    title: "Week one done",
    brief: "End of week one. Genuine, short, warm. What you'd say to yourself on this night if you could go back.",
  },

  // ── DAY 14 ─────────────────────────────────────────────────────────────────
  {
    day: 14, moment: "morning", seq: 1,
    title: "Two weeks",
    brief: "Two weeks. The brain is starting to produce natural endorphins again. Tell them what started to feel good — genuinely good — around this time.",
  },
  {
    day: 14, moment: "mid_morning", seq: 2,
    title: "Sleep is changing",
    brief: "By week two, sleep usually improves noticeably. Tell them what returning to real sleep felt like and why it matters for the rest of recovery.",
  },
  {
    day: 14, moment: "afternoon", seq: 3,
    title: "The pain that started it",
    brief: "Two weeks in is when people start being honest about why they started. Encourage them to think — gently — about what the Codeine was covering. That's where the real work begins.",
  },
  {
    day: 14, moment: "late_afternoon", seq: 4,
    title: "The middle is the danger zone",
    brief: "Week two is when people feel better enough to think they're fine — and test it. Tell them about the false confidence and how you recognised it in yourself.",
  },
  {
    day: 14, moment: "evening", seq: 5,
    title: "What's becoming normal",
    brief: "Evenings without Codeine are starting to have their own shape. What that looked like for you — what became the new normal and how it felt different to what you feared.",
  },
  {
    day: 14, moment: "late_evening", seq: 6,
    title: "You're rebuilding",
    brief: "Not just stopping — rebuilding. The brain, the routines, the relationship with pain and feeling. Tell them what rebuilding felt like at two weeks.",
  },
  {
    day: 14, moment: "before_bed", seq: 7,
    title: "Fourteen days",
    brief: "Short. Genuine. What fourteen days means, and what's ahead.",
  },
];

// ── 4. Insert prompts ─────────────────────────────────────────────────────────

const rows = prompts.map((p) => ({
  role:         "creator",
  trigger_type: "day",
  pathway:      "codeine",
  day_number:   p.day,
  moment:       p.moment,
  mood:         null,
  event:        null,
  title:        p.title,
  brief:        p.brief,
  sequence:     p.seq,
  active:       true,
}));

const { error: insertError } = await supabase.from("prompts").insert(rows);
if (insertError) {
  console.error("Failed to insert prompts:", insertError);
  process.exit(1);
}

console.log(`Inserted ${rows.length} Codeine prompts for Abby.`);
console.log("\nAbby's login:");
console.log("  URL:      https://www.livesoberaf.com/sponsor/login");
console.log("  Password: Abby2025!");
