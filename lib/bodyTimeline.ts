// bodyTimeline.ts
// "What's happening to your body today" — first 30 days of sobriety.
// General education, not medical advice. Timings are approximate and vary per person.
//
// Each day maps to an animation `scene`. Reuse the six original scenes
// (bac, liver, brain, heart, hydration, sugar) and add lightweight variants
// (gut, sleep, liverheal, skin, mood, clarity, immune, milestone).

export type SceneKey =
  | 'bac'        // gauge draining — blood alcohol falling
  | 'liver'      // alcohol -> acetaldehyde -> acetate conversion
  | 'brain'      // GABA (calm) vs glutamate (excitatory) waves
  | 'heart'      // beating heart + ECG
  | 'hydration'  // glass refilling with water
  | 'sugar'      // jagged blood-sugar line flattening
  | 'gut'        // stomach/gut settling
  | 'sleep'      // sleep cycle deepening (moon + slow wave)
  | 'liverheal'  // liver regenerating / shedding fat (soft glow pulse)
  | 'skin'       // skin + eyes brightening (radiating glow)
  | 'mood'       // dopamine/serotonin rebalancing (rising, steadier wave)
  | 'clarity'    // brain fog clearing
  | 'immune'     // immune defenses strengthening (shield)
  | 'milestone'; // one-month celebration

export interface BodyDay {
  day: number;
  phase: string;   // short eyebrow label
  title: string;
  body: string;
  scene: SceneKey;
  safety?: boolean; // show the severe-withdrawal safety callout
}

export const bodyTimeline: BodyDay[] = [
  {
    day: 1,
    phase: 'The first 24 hours',
    title: 'Your blood alcohol starts falling',
    body: 'With nothing new coming in, your blood alcohol only drops. Your liver clears the toxic byproduct behind the hangover feeling, while your nervous system — used to alcohol’s calming effect — is briefly over-excited. That’s the anxiety, tremors and broken sleep. Rest and hydrate.',
    scene: 'bac',
    safety: true,
  },
  {
    day: 2,
    phase: 'Peak intensity',
    title: 'Withdrawal often feels strongest',
    body: 'As your brain keeps rebalancing its calming and excitatory signals, today can bring more anxiety, sweating, a racing heart and strong cravings. For heavy daily drinkers this is the highest-risk window — if symptoms are severe, treat it as a medical matter.',
    scene: 'brain',
    safety: true,
  },
  {
    day: 3,
    phase: 'Over the hump',
    title: 'The sharpest symptoms begin to ease',
    body: 'For many people the worst of the physical withdrawal starts settling now. Heart rate and blood pressure, revved up over the last two days, begin to come down. Cravings and irritability still spike — they pass.',
    scene: 'heart',
    safety: true,
  },
  {
    day: 4,
    phase: 'Clearing out',
    title: 'Your body catches up on water',
    body: 'Acute withdrawal is fading for most people. The alcohol is fully cleared and your body is rehydrating, so the pounding headache and dry mouth ease off. Sleep may still be patchy.',
    scene: 'hydration',
  },
  {
    day: 5,
    phase: 'Finding balance',
    title: 'Blood sugar steadies',
    body: 'Without alcohol disrupting how your liver releases glucose, blood sugar swings settle down — taking some of the shakiness and afternoon crashes with them. Sugar cravings are common as your body adjusts.',
    scene: 'sugar',
  },
  {
    day: 6,
    phase: 'Finding balance',
    title: 'Your gut settles',
    body: 'Alcohol irritates the stomach lining. As that inflammation calms, heartburn, reflux and a queasy stomach improve, and you start absorbing nutrients from food more effectively.',
    scene: 'gut',
  },
  {
    day: 7,
    phase: 'One week',
    title: 'Sleep begins to rebuild',
    body: 'A full week in. Your sleep is starting to deepen, though vivid dreams are common as REM rebounds. Blood pressure is trending down and your liver has begun shedding some of the fat alcohol left behind.',
    scene: 'sleep',
  },
  {
    day: 8,
    phase: 'Week two',
    title: 'Steadier mornings',
    body: 'The morning fog and shakiness alcohol used to leave behind are lifting. Anxiety is often lower now than in the first days, even if it still arrives in waves.',
    scene: 'clarity',
  },
  {
    day: 9,
    phase: 'Week two',
    title: 'Energy returns — unevenly',
    body: 'Your energy may swing between tired and restless as your body relearns its natural rhythm without alcohol as a crutch. This is normal, and it evens out over the coming weeks.',
    scene: 'sleep',
  },
  {
    day: 10,
    phase: 'Week two',
    title: 'Appetite regulates',
    body: 'Your stomach lining keeps healing and appetite settles. Cravings for sugar or junk are often the body asking for steady fuel — regular, balanced meals make a real difference.',
    scene: 'gut',
  },
  {
    day: 11,
    phase: 'Week two',
    title: 'Brain fog thins out',
    body: 'Concentration and memory sharpen as your brain keeps recovering. Words come more easily and you lose your train of thought less often.',
    scene: 'clarity',
  },
  {
    day: 12,
    phase: 'Week two',
    title: 'Mood on the move',
    body: 'As your dopamine and serotonin systems recalibrate, mood can dip or feel flat for a while before it lifts. This is a normal part of recovery, not a sign you’re going backwards.',
    scene: 'mood',
  },
  {
    day: 13,
    phase: 'Week two',
    title: 'Your heart eases',
    body: 'Resting heart rate and blood pressure are often measurably lower than two weeks ago, easing the load on your whole cardiovascular system.',
    scene: 'heart',
  },
  {
    day: 14,
    phase: 'Two weeks',
    title: 'Your liver lightens',
    body: 'Your liver has been quietly repairing. Fat that alcohol packed around it is clearing, and its enzyme levels are trending back toward normal.',
    scene: 'liverheal',
  },
  {
    day: 15,
    phase: 'Week three',
    title: 'Skin and eyes brighten',
    body: 'With better hydration and less inflammation, skin often looks clearer and less puffy, and the whites of your eyes look brighter.',
    scene: 'skin',
  },
  {
    day: 16,
    phase: 'Week three',
    title: 'Sleep gets deeper',
    body: 'Sleep is becoming more restorative, so you wake feeling more rested. Rough nights still happen — it’s the overall trend that matters.',
    scene: 'sleep',
  },
  {
    day: 17,
    phase: 'Week three',
    title: 'Blood sugar control improves',
    body: 'Your body’s sensitivity to insulin keeps improving, which supports steadier energy through the day and fewer sudden cravings.',
    scene: 'sugar',
  },
  {
    day: 18,
    phase: 'Week three',
    title: 'A calmer baseline',
    body: 'Your nervous system’s resting state is calmer than in week one. The constant low-grade anxiety of the early days keeps fading into the background.',
    scene: 'brain',
  },
  {
    day: 19,
    phase: 'Week three',
    title: 'Your defenses strengthen',
    body: 'Alcohol suppresses the immune system. As it clears, your body’s defenses recover and you fight off everyday bugs more easily.',
    scene: 'immune',
  },
  {
    day: 20,
    phase: 'Week three',
    title: 'Hydration locked in',
    body: 'With the water-regulating hormone alcohol suppressed now back to normal, your body holds onto fluids properly again — steadier hydration, fewer headaches, better recovery all round.',
    scene: 'hydration',
  },
  {
    day: 21,
    phase: 'Three weeks',
    title: 'Mood lifts',
    body: 'Many people notice a real mood lift around now as brain chemistry settles. Waves of low mood or cravings can still pass through — that’s normal, and they get shorter.',
    scene: 'mood',
  },
  {
    day: 22,
    phase: 'Week four',
    title: 'A sharper mind',
    body: 'Mental clarity, focus and memory are noticeably better for most people by now than they were a month ago.',
    scene: 'clarity',
  },
  {
    day: 23,
    phase: 'Week four',
    title: 'Your liver keeps regenerating',
    body: 'Liver cells continue to repair and regenerate. Early fatty-liver changes can substantially reverse with sustained time off alcohol.',
    scene: 'liverheal',
  },
  {
    day: 24,
    phase: 'Week four',
    title: 'Heart benefits compound',
    body: 'Lower blood pressure and a lower resting heart rate are becoming your new normal, cutting your long-term cardiovascular risk.',
    scene: 'heart',
  },
  {
    day: 25,
    phase: 'Week four',
    title: 'Skin glow',
    body: 'Less inflammation and steady hydration keep showing up as clearer, more even skin and brighter eyes.',
    scene: 'skin',
  },
  {
    day: 26,
    phase: 'Week four',
    title: 'Restful nights',
    body: 'Your sleep cycles are far more regular than in the early days, so a greater share of each night is genuinely restorative.',
    scene: 'sleep',
  },
  {
    day: 27,
    phase: 'Week four',
    title: 'Stable energy',
    body: 'Balanced blood sugar and better sleep add up to steadier, more reliable energy through the day.',
    scene: 'sugar',
  },
  {
    day: 28,
    phase: 'Four weeks',
    title: 'Stronger immunity',
    body: 'A month in, your immune system is markedly stronger than the day you started.',
    scene: 'immune',
  },
  {
    day: 29,
    phase: 'Four weeks',
    title: 'Calm and clear',
    body: 'Your nervous system, sleep and mood are working together far better than a month ago. Cravings still come, but they’re briefer and easier to ride out.',
    scene: 'brain',
  },
  {
    day: 30,
    phase: 'One month',
    title: 'Thirty days sober',
    body: 'Your liver has shed fat, your blood pressure and heart rate are down, hydration and sleep are restored, your skin is clearer, and your brain chemistry is far closer to balance. The biggest gains keep compounding from here.',
    scene: 'milestone',
  },
];

// Evergreen content for anyone past day 30.
export const beyondOneMonth: BodyDay = {
  day: 31,
  phase: 'Beyond one month',
  title: 'The gains keep compounding',
  body: 'Past a month, the deep repair continues: liver regeneration, cardiovascular recovery, sharper thinking and steadier mood all build over the months ahead. Cravings keep fading and get easier to handle.',
  scene: 'milestone',
};

// Returns the number of days sober, counting the start day as day 1.
export function daysSober(soberStartISO: string, now: Date = new Date()): number {
  const start = new Date(soberStartISO);
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((nowMidnight.getTime() - startMidnight.getTime()) / 86_400_000);
  return diffDays + 1; // start day is day 1
}

// Get the content to show for a given day number (1-based).
export function getBodyDay(dayNumber: number): BodyDay {
  if (dayNumber < 1) return bodyTimeline[0];
  if (dayNumber > 30) return { ...beyondOneMonth, day: dayNumber };
  return bodyTimeline[dayNumber - 1];
}
