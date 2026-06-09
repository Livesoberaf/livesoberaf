export type ContentSlot = {
  id: string;
  timeLabel: string;
  title: string;
  duration: string;
  context: string;
  talkingPoints: string[];
};

export type ContentStage = {
  id: string;
  label: string;
  days: string;
  order: number;
  slots: ContentSlot[];
};

export const ALCOHOL_CONTENT: ContentStage[] = [
  {
    id: "d1-3",
    label: "Days 1–3",
    days: "Acute withdrawal",
    order: 1,
    slots: [
      {
        id: "d1-3-morning",
        timeLabel: "Morning",
        title: "Getting through the morning",
        duration: "2–4 min",
        context: "The person watching this has just woken up on one of their first sober mornings. They may be shaky, anxious, and haven't slept well. This is one of the hardest moments.",
        talkingPoints: [
          "Tell them what YOUR first few mornings were like — the honesty matters more than the polish",
          "Acknowledge how hard the morning is without minimising it",
          "Give them one simple action: drink water, eat something small, sit outside for a minute",
          "Remind them that the worst of the physical withdrawal peaks within 72 hours — they're getting through it",
        ],
      },
      {
        id: "d1-3-afternoon",
        timeLabel: "Afternoon",
        title: "Managing the afternoon",
        duration: "2–4 min",
        context: "The person is in the middle of the afternoon — often when cravings and physical symptoms peak. They need validation and practical support.",
        talkingPoints: [
          "Name what they might be feeling: shaking, sweating, anxiety, restlessness — normalise it",
          "Share what you did in YOUR first afternoons to get through",
          "The 20-minute rule: cravings typically pass within 20 minutes — give them something to do for those 20 minutes",
          "Remind them this is temporary, even though it doesn't feel like it",
        ],
      },
      {
        id: "d1-3-evening",
        timeLabel: "Evening",
        title: "Getting through tonight",
        duration: "2–4 min",
        context: "Evening is the highest-risk time in early recovery — when drinking was habitual. The person needs to get to tomorrow morning.",
        talkingPoints: [
          "Acknowledge that evenings were probably when they used to drink — that habit is trying to reassert itself",
          "Share what specifically helped you get through those first evenings",
          "Give them tactics: change rooms, call someone, make a hot drink, watch something — anything to get through",
          "End with a simple message: just get to sleep. Tomorrow morning is the goal.",
        ],
      },
      {
        id: "d1-3-craving",
        timeLabel: "Craving support",
        title: "When the urge hits",
        duration: "1–3 min",
        context: "The person is watching this in the middle of a craving. They need immediate, grounding support. Keep this short and direct — they may only watch 60 seconds.",
        talkingPoints: [
          "Open with 'I know exactly what you're feeling right now' — immediate recognition",
          "Tell them cravings peak and pass — 20 minutes. Give them something specific to do for those 20 minutes",
          "What did you say to yourself when cravings hit in your early recovery?",
          "End with: 'You're not weak for feeling this. You're doing the hardest thing.'",
        ],
      },
    ],
  },
  {
    id: "d4-7",
    label: "Days 4–7",
    days: "First week",
    order: 2,
    slots: [
      {
        id: "d4-7-morning",
        timeLabel: "Morning",
        title: "Past the hardest stretch",
        duration: "2–4 min",
        context: "The acute withdrawal is easing. The person got through the worst of the physical phase. They may feel unexpectedly okay, or still flat — both are normal.",
        talkingPoints: [
          "Acknowledge that they got through the hardest physical part — that's real",
          "Explain the 'pink cloud' — some people feel unexpectedly good now, some still feel rough. Both are normal.",
          "What did YOUR mornings feel like in your first week?",
          "Suggest building one simple morning routine this week — one small consistent habit",
        ],
      },
      {
        id: "d4-7-afternoon",
        timeLabel: "Afternoon",
        title: "Cravings this week",
        duration: "2–4 min",
        context: "Physical symptoms are easing but cravings are still frequent. The person is managing the middle of the day in week one.",
        talkingPoints: [
          "Cravings are still coming but they're getting shorter — share that",
          "Practical things to do when a craving hits this week: walk, call someone, change location",
          "Your experience of afternoons in week one",
          "One thing to focus on today — keep it small and achievable",
        ],
      },
      {
        id: "d4-7-evening",
        timeLabel: "Evening",
        title: "Building an evening routine",
        duration: "2–4 min",
        context: "Evenings are still high-risk but the person is starting to build new habits to fill the time.",
        talkingPoints: [
          "Evenings this week are still high-risk — acknowledge that honestly",
          "What helped you build a new evening routine? What specifically did you do?",
          "Give concrete examples: walk, TV series, gym, cooking, calling someone — specifics land better than general advice",
          "Share how different your evenings feel even just a few weeks later",
        ],
      },
      {
        id: "d4-7-sleep",
        timeLabel: "Sleep support",
        title: "Why sleep feels worse",
        duration: "2–3 min",
        context: "Sleep is badly disrupted in week one. Many people expect to sleep better without alcohol — instead it gets worse initially, which is alarming.",
        talkingPoints: [
          "Explain simply: alcohol suppresses deep REM sleep. Stopping it throws the brain into 'REM rebound' — sleep gets worse before it gets better",
          "What did you do when you couldn't sleep in the first week?",
          "When did sleep start improving for you? Give them a realistic timeframe.",
          "Practical tip: same bedtime every night, cool room, no screens for an hour before bed",
        ],
      },
    ],
  },
  {
    id: "d8-14",
    label: "Days 8–14",
    days: "Second week",
    order: 3,
    slots: [
      {
        id: "d8-14-morning",
        timeLabel: "Morning",
        title: "The emotional stretch",
        duration: "2–4 min",
        context: "Week two is often emotionally harder than the physical first week. The person may be experiencing low mood and wondering if they're going backwards.",
        talkingPoints: [
          "The physical withdrawal is behind them — but emotions can hit harder now. That's normal.",
          "This is not going backwards — it's the brain recalibrating its reward system",
          "What did week two feel like for YOU emotionally? Be specific and honest.",
          "Post-acute withdrawal (PAWS) — the brain finding a new normal. It passes.",
        ],
      },
      {
        id: "d8-14-afternoon",
        timeLabel: "Afternoon",
        title: "Flat or irritable",
        duration: "2–4 min",
        context: "Low mood, irritability and emotional flatness are very common in week two. The person may be questioning whether recovery is working.",
        talkingPoints: [
          "Name it: feeling flat, irritable, or short-tempered this week is very normal",
          "Why it happens: dopamine system recalibrating — the brain expected alcohol's reward and isn't getting it",
          "What you did when you felt this way in week two",
          "One small thing that helped you lift the mood when you were in this stretch",
        ],
      },
      {
        id: "d8-14-evening",
        timeLabel: "Evening",
        title: "Getting through week two evenings",
        duration: "2–4 min",
        context: "Second-week evenings can feel emotionally heavier than the first week. Connection is important and isolation is a risk.",
        talkingPoints: [
          "Evenings this week might feel more emotionally heavy than physically",
          "Your honest experience of second-week evenings",
          "The importance of not isolating — who did you reach out to? What did that do for you?",
          "The routine is working even when it doesn't feel like it",
        ],
      },
    ],
  },
  {
    id: "d15-30",
    label: "Days 15–30",
    days: "First month",
    order: 4,
    slots: [
      {
        id: "d15-30-morning",
        timeLabel: "Morning",
        title: "The habit is forming",
        duration: "2–4 min",
        context: "The person is approaching one month. The daily habit of not drinking is becoming more real.",
        talkingPoints: [
          "Acknowledge the progress — two weeks, three weeks, nearly a month. That's genuinely significant.",
          "The morning habit is forming even if it doesn't feel automatic yet",
          "What mornings felt like for you at this stage — the contrast from week one",
          "What reaching one month meant to you personally",
        ],
      },
      {
        id: "d15-30-midday",
        timeLabel: "Midday",
        title: "Noticing what's changing",
        duration: "2–4 min",
        context: "Physical and mental changes are becoming noticeable. The person may not be connecting what they see to the recovery.",
        talkingPoints: [
          "The changes they might be noticing: energy, skin, digestion, mental clarity",
          "What changes surprised you at this stage — what came back first?",
          "Recovery is happening even when it doesn't feel dramatic day to day",
          "Looking ahead to one month — what you felt when you hit it",
        ],
      },
      {
        id: "d15-30-evening",
        timeLabel: "Evening",
        title: "Evenings are getting easier",
        duration: "2–4 min",
        context: "Evenings at this stage are genuinely easier for most people. The person may not have noticed the shift yet.",
        talkingPoints: [
          "Evenings are getting easier by now — prompt them to notice that",
          "What your evenings looked like at this stage",
          "The new habits that were forming for you",
          "The one-month milestone is worth marking — encourage them to celebrate it in some small way",
        ],
      },
    ],
  },
  {
    id: "m2",
    label: "Month 2",
    days: "Days 31–60",
    order: 5,
    slots: [
      {
        id: "m2-morning",
        timeLabel: "Morning",
        title: "Post-acute withdrawal",
        duration: "2–4 min",
        context: "Weeks 5-8 often bring unexpected mood dips — post-acute withdrawal syndrome (PAWS). Many people relapse here because they weren't warned it was coming.",
        talkingPoints: [
          "Warn them: weeks 5-8 can bring unexpected dips in energy and mood. Knowing it's coming makes it survivable.",
          "This is PAWS — post-acute withdrawal syndrome. Real, common, and it passes.",
          "Your experience of month two — was there a dip? How did you get through it?",
          "What kept you going when month two got hard",
        ],
      },
      {
        id: "m2-evening",
        timeLabel: "Evening",
        title: "Building new habits",
        duration: "2–4 min",
        context: "Month two is about building, not just avoiding. New habits are taking shape and relationships are starting to shift.",
        talkingPoints: [
          "Recovery at this stage is about what you're building, not just what you've stopped",
          "What new habits you were building in month two",
          "How relationships started to change — what you noticed",
          "Three months is ahead — what reaching it felt like for you",
        ],
      },
    ],
  },
  {
    id: "m3",
    label: "Month 3",
    days: "Days 61–90",
    order: 6,
    slots: [
      {
        id: "m3-morning",
        timeLabel: "Morning",
        title: "Three months",
        duration: "2–4 min",
        context: "Three months is a significant milestone. Brain function is largely restored for most people. This should feel like a real celebration.",
        talkingPoints: [
          "Three months is real and it matters — share what it meant to you when you hit it",
          "What becomes possible at three months that wasn't possible at day one",
          "Your experience of reaching this point — what surprised you",
          "What you want them to know about what's ahead",
        ],
      },
      {
        id: "m3-evening",
        timeLabel: "Evening",
        title: "Recovery as a practice",
        duration: "2–4 min",
        context: "At three months, recovery shifts from crisis management to daily practice. This is an important reframe.",
        talkingPoints: [
          "Recovery isn't something you finish — it's a practice. What does that mean to you?",
          "What does your life look like now compared to before — in concrete terms",
          "The triggers that still come and how you handle them now",
          "What you would tell yourself on Day 1 if you could go back",
        ],
      },
    ],
  },
  {
    id: "ongoing",
    label: "Month 4+",
    days: "Ongoing",
    order: 7,
    slots: [
      {
        id: "ongoing-monthly",
        timeLabel: "Monthly",
        title: "Staying connected",
        duration: "2–4 min",
        context: "A monthly touchpoint for people in longer-term recovery. The consistency of your voice showing up matters as much as the content.",
        talkingPoints: [
          "Check in — not as a lecture, but as someone who's been there and is still in it",
          "Share what's working in your own recovery right now — authenticity over polish",
          "A message for someone who might be struggling this particular month",
          "'You're still here' — the power of persistence through the hard months",
        ],
      },
    ],
  },
];

export function getSlotById(slotId: string): ContentSlot | null {
  for (const stage of ALCOHOL_CONTENT) {
    const slot = stage.slots.find((s) => s.id === slotId);
    if (slot) return slot;
  }
  return null;
}

export function getStageForSlot(slotId: string): ContentStage | null {
  return ALCOHOL_CONTENT.find((stage) => stage.slots.some((s) => s.id === slotId)) ?? null;
}

export const ALL_SLOT_IDS = ALCOHOL_CONTENT.flatMap((stage) =>
  stage.slots.map((s) => s.id)
);
