"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReflectionRecorderModal from "../components/ReflectionRecorderModal";

import {
  Heart,
  CalendarDays,
  CircleCheckBig,
  Play,
  ShieldAlert,
  MessageCircle,
  CheckCircle2,
  TimerReset,
  ChevronRight,
  User,
  Sparkles,
  Lock,
  Trophy,
  Flame,
  RotateCcw,
  CreditCard,
  Check,
} from "lucide-react";

type PublishedStory = {
  fileId: string;
  name: string;
  substance: string;
  stage: string;
  answers: Record<number, string>;
};

type WearableState = {
  connected: boolean;
  elevatedHeartRate: boolean;
  lowHRV: boolean;
  lowMovement: boolean;
  poorSleep: boolean;
};

const shares = [

  {
    name: "Dan",
    status: "142 days sober",
    theme: "Starting again",
    summary:
      "A story about stopping, slipping, and coming back stronger without pretending it was easy.",
  },
  {
    name: "Sarah",
    status: "1 year sober",
    theme: "Finding herself again",
    summary:
      "On confidence, motherhood, anxiety, and what changed when the noise finally started to lift.",
  },
  {
    name: "Chris",
    status: "38 days sober",
    theme: "One day at a time",
    summary:
      "A raw share about cravings, routines, and why honest progress beats perfect progress.",
  },
];

const questions = [
  "Why did you decide to stop?",
  "What did using or drinking give you at the time?",
  "When did you realise it was taking more than it was giving?",
  "What was the hardest part about stopping?",
  "What helped you most in the early days?",
  "What do you wish people understood about recovery?",
];

const nudges = [
  "Pause. Breathe. This feeling will pass.",
  "Text one safe person before you do anything else.",
  "Go for ten minutes, not forever.",
  "You do not need to win the whole week tonight.",
];

const substanceOptions = [
  "Alcohol",
  "Cocaine",
  "Cannabis",
  "Ketamine",
  "MDMA / Ecstasy",
  "Amphetamines / Speed",
  "Heroin / Opiates",
  "Prescription pills",
  "Nicotine / Vaping",
  "Sugar",
  "Multiple substances",
  "Other",
];

const ageRangeOptions = [
  "18–25",
  "26–35",
  "36–45",
  "46–55",
  "56–65",
  "65+",
  "Prefer not to say",
];

const triggerOptions = [
  "Stress",
  "Loneliness",
  "Boredom",
  "Relationships",
  "Social situations",
  "Work pressure",
  "Anxiety",
  "Anger",
  "Low mood",
  "Weekends",
];

const milestoneDays = [7, 30, 60, 90, 180, 365];

const recoveryPlanDays = [
  {
    day: 1,
    title: "Know your triggers",
    text: "Identify what normally starts the spiral. Stress, boredom, loneliness, certain people or certain places.",
  },
  {
    day: 2,
    title: "Create friction",
    text: "Put distance between you and the substance. Delete numbers, remove access, change routine, avoid the easy route back.",
  },
  {
    day: 3,
    title: "Build a cravings plan",
    text: "Have a simple response ready: breathe, move, message someone, drink water, leave the room, buy time.",
  },
  {
    day: 4,
    title: "Stabilise your body",
    text: "Focus on sleep, food, hydration and nervous system regulation. Recovery gets harder when your body is on the floor.",
  },
  {
    day: 5,
    title: "Change the story",
    text: "Start separating who you are from what you used. You are not the habit. You are the person getting out.",
  },
  {
    day: 6,
    title: "Prepare for wobble moments",
    text: "Assume cravings will come. Build a defence plan for evenings, weekends, social pressure and emotional dips.",
  },
  {
    day: 7,
    title: "Build week two",
    text: "Turn this from survival into momentum. Decide what stays, what changes, and what support you need next.",
  },
];

const dayOneTimeline = [
  {
    id: 1,
    time: "7:00 AM",
    title: "Wake-up reset",
    statusLabel: "Start here",
    abbyTitle: "Abby: Codeine Day 1 support",
    abbyNote:
      "A short message from Abby for people starting Day 1 without codeine.",
    substanceMatch: "Codeine",
    videoPath: "/videos/Abby/Codeine/Day-1/abby-codeine-day1-Day-10am.mp4",
    mattTitle: "Matt: Why mornings feel unstable",
    mattNote:
      "Your brain is adjusting. Feeling off early in recovery is expected and temporary.",
    mattVideoPath: "/videos/Matt/Day-1/matt-morning-unstable-day1.mp4",
    medicalPrompt:
      "Your nervous system begins stabilising the moment the pattern changes.",
    action:
      "Drink water, open the curtains, stand up, and take 3 slow breaths.",
  },
  {
    id: 2,
    time: "10:00 AM",
    title: "Morning wobble",
    statusLabel: "Support point",
    abbyTitle: "Abby: Morning wobble",
    abbyNote:
      "Interrupt the spiral early. You only need to get through this next window.",
    mattTitle: "Matt: Boredom is not a signal to use",
    mattNote:
      "Boredom is often the brain searching for stimulation, not relief.",
    medicalPrompt:
      "Cravings rise and fall like waves. They peak and pass.",
    action:
      "Leave the room, walk for 5 minutes, message one safe person.",
  },
  {
    id: 3,
    time: "1:00 PM",
    title: "Midday dip",
    statusLabel: "Keep going",
    abbyTitle: "Abby: Midday reset",
    abbyNote:
      "Energy dips can feel like failure. They are not.",
    mattTitle: "Matt: Hunger and fatigue increase risk",
    mattNote:
      "Low blood sugar and tiredness increase relapse risk dramatically.",
    medicalPrompt:
      "Recovery improves when the body is fed, hydrated and rested.",
    action:
      "Eat properly, drink water, reset physically before thinking further.",
  },
  {
    id: 4,
    time: "4:30 PM",
    title: "Afternoon danger zone",
    statusLabel: "High-risk window",
    abbyTitle: "Abby: Get ahead of the evening",
    abbyNote:
      "Prepare before cravings arrive instead of reacting late.",
    mattTitle: "Matt: Anticipation loops",
    mattNote:
      "Your brain rehearses old behaviour before urges become conscious.",
    medicalPrompt:
      "Interrupting patterns early weakens them quickly.",
    action:
      "Plan the evening now. Remove access. Choose a safe activity.",
  },
  {
    id: 5,
    time: "7:30 PM",
    title: "Evening cravings",
    statusLabel: "Live support",
    abbyTitle: "Abby: Evening cravings",
    abbyNote:
      "This is the hardest window. Stay inside the next 10 minutes only.",
    mattTitle: "Matt: What cravings really are",
    mattNote:
      "Cravings are temporary brain-body signals, not instructions.",
    medicalPrompt:
      "Short survival windows build long-term change.",
    action:
      "Use SOS. Move away from access. Slow breathing.",
  },
  {
    id: 6,
    time: "10:00 PM",
    title: "Bedtime reset",
    statusLabel: "Close the day",
    abbyTitle: "Abby: Bedtime reset",
    abbyNote:
      "End the day steady instead of fearing tomorrow.",
    mattTitle: "Matt: Why one day matters",
    mattNote:
      "Brains change through repetition. Today counts.",
    
      medicalPrompt:
    "A completed day is evidence of change.",
    action:
    "Lower lights, reduce stimulation, recognise progress.",
  },
];
 const reflectionQuestionsDays1to14 = [
  "What was hardest today?",
  "What nearly knocked you off course?",
  "What helped more than you expected?",
  "What time of day felt most difficult?",
  "What would you tell someone starting today?",
];

const reflectionQuestionsDays15to28 = [
  "What feels different now compared with week one?",
  "What trigger has changed the most?",
  "Where have you surprised yourself?",
  "What still needs attention?",
  "What would you tell your day-one self?",
];

function getReflectionQuestion(day: number) {
  const list =
    day <= 14
      ? reflectionQuestionsDays1to14
      : reflectionQuestionsDays15to28;

  return list[(Math.max(day, 1) - 1) % list.length];
}
 

 
type DailyReflection = {
  id: string;
  day: number;
  question: string;
  substance: string;
  trigger: string;
  sex: string;
  ageRange: string;
  videoUrl?: string;
  createdAt: string;
};

type UserProfile = {
  substances: string[];
  soberDays: string;
  sex: string;
  ageRange: string;
  triggers: string[];
  streak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckInDate: string;
  dayOneVoiceText: string;
  dayOneVoicePrivacy: string;
  milestonesUnlocked: number[];
  hasPaid: boolean;
  completedRecoveryDays: number[];
  dayOneCompletedSteps: number[];

  communityVoices?: {
    id: number;
    day: number;
    title: string;
    note: string;
    mood: string;
    substance: string;
    videoUrl: string;
    createdAt: string;
  }[];

  dailyReflections?: DailyReflection[];
};

const defaultProfile: UserProfile = {
  substances: [],
  soberDays: "0",
  sex: "",
  ageRange: "",
  triggers: [],
  streak: 0,
  longestStreak: 0,
  totalCheckIns: 0,
  lastCheckInDate: "",
  dayOneVoiceText: "",
  dayOneVoicePrivacy: "Share with similar users",
  milestonesUnlocked: [],
  hasPaid: false,
  completedRecoveryDays: [],
  dayOneCompletedSteps: [],
  communityVoices: [],

  dailyReflections: [],
};

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function getDateOffsetString(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

function isSameDay(a: string, b: string) {
  return a === b;
}

function getNewMilestones(streak: number, unlocked: number[]) {
  return milestoneDays.filter((day) => streak >= day && !unlocked.includes(day));
}

function TopNav({
  current,
  setCurrent,
}: {
  current: string;
  setCurrent: (value: string) => void;
}) {
  const items = ["Home", "Pathway", "Shares", "Check-In", "SOS", "Progress"];
const [wearable, setWearable] = useState<WearableState>({
  connected: false,
  elevatedHeartRate: false,
  lowHRV: false,
  lowMovement: false,
  poorSleep: false,
});
useEffect(() => {
  // simulate wearable connection
  setTimeout(() => {
    setWearable({
      connected: true,
      elevatedHeartRate: true,
      lowHRV: false,
      lowMovement: true,
      poorSleep: false,
    });
  }, 2000);
}, []);
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">
            LiveSoberAF
          </p>
{wearable.connected && wearable.elevatedHeartRate && (
  <p className="mt-1 text-xs text-amber-400">
    Elevated stress detected — support available now
  </p>
)}
          <h1 className="text-xl font-semibold">
            The ultimate guide to giving up — or getting started.
          </h1>
        </div>
        <nav className="hidden gap-2 md:flex">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => setCurrent(item)}
              className={`rounded-2xl px-4 py-2 text-sm transition ${
                current === item
                  ? "bg-white text-black"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function OnboardingScreen({
  onFinish,
  profile,
  setProfile,
}: {
  onFinish: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}) {
  const [step, setStep] = useState(1);
  const progress = (step / 4) * 100;

  const toggleSubstance = (substance: string) => {
    setProfile((prev) => ({
      ...prev,
      substances: prev.substances.includes(substance)
        ? prev.substances.filter((item) => item !== substance)
        : [...prev.substances, substance],
    }));
  };

  const toggleTrigger = (trigger: string) => {
    setProfile((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter((item) => item !== trigger)
        : [...prev.triggers, trigger],
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-300/70">
              LiveSoberAF onboarding
            </p>
            <h1 className="mt-2 text-4xl font-semibold md:text-5xl">
              Let’s make this personal
            </h1>
            <p className="mt-3 max-w-xl text-white/70">
              LiveSoberAF is built to help people give up, cut through the
              noise, and get real support from people who have actually been
              there.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            Step {step} of 4
          </div>
        </div>

        <div className="mb-8 h-2 w-full rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
          {step === 1 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <User className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">
                  What are you trying to give up?
                </h2>
              </div>

              <label className="mb-3 block text-sm text-white/60">
                Pick one or more
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                {substanceOptions.map((option) => {
                  const active = profile.substances.includes(option);
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => toggleSubstance(option)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        active
                          ? "border-white bg-white text-black"
                          : "border-white/10 bg-black text-white hover:bg-white/5"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm text-white/60">
                  How many sober days do you have right now?
                </label>
                <input
                  type="number"
                  min="0"
                  value={profile.soberDays}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, soberDays: e.target.value }))
                  }
                  placeholder="0"
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">A little about you</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/60">Sex</label>
                  <select
                    value={profile.sex}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, sex: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
                  >
                    <option value="">Select</option>
                                        <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Age range
                  </label>
                  <select
                    value={profile.ageRange}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        ageRange: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none"
                  >
                    <option value="">Select</option>
                    {ageRangeOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Heart className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">
                  What tends to trigger you?
                </h2>
              </div>

              <p className="mb-5 text-white/70">
                Pick the ones that hit hardest. This helps LiveSoberAF tailor
                support before cravings build.
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {triggerOptions.map((trigger) => {
                  const active = profile.triggers.includes(trigger);

                  return (
                    <button
                      type="button"
                      key={trigger}
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          triggers: active
                            ? prev.triggers.filter((t) => t !== trigger)
                            : [...prev.triggers, trigger],
                        }))
                      }
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        active
                          ? "border-white bg-white text-black"
                          : "border-white/10 bg-black text-white hover:bg-white/5"
                      }`}
                    >
                      {trigger}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
                     {step === 4 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Lock className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">
                  Your LiveSoberAF plan starts here
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-white/50">Recovery focus</p>
                  <p className="mt-1 text-lg font-medium">
                    {profile.substances.length > 0
                      ? profile.substances.join(", ")
                      : "Not selected yet"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-white/50">
                    Current sober days
                  </p>
                  <p className="mt-1 text-lg font-medium">
                    {profile.soberDays}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-white/50">Age range</p>
                  <p className="mt-1 text-lg font-medium">
                    {profile.ageRange || "Not selected yet"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm text-white/50">Top triggers</p>
                  <p className="mt-1 text-lg font-medium">
                    {profile.triggers.length > 0
                      ? profile.triggers.join(", ")
                      : "None selected yet"}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-white/70">
                Next, this is where the paywall or sign-up flow can sit before
                unlocking the full LiveSoberAF experience.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="rounded-2xl border border-white/10 px-5 py-3 text-white/80 transition hover:bg-white/10"
            >
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.min(4, prev + 1))}
                className="rounded-2xl bg-white px-5 py-3 font-medium text-black"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinish}
                className="rounded-2xl bg-white px-5 py-3 font-medium text-black"
              >
                Enter LiveSoberAF
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
function PaywallScreen({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const features = [
    "Full LiveSoberAF recovery system",
    "Personalised coaching based on your triggers",
    "Real talking-head stories from addicts who made it out",
    "Daily check-ins and streak tracking",
    "SOS support for cravings, spirals and hard nights",
    "Progress tracking, milestones and relapse reset tools",
  ];

  return (
    <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 text-white">
      <div className="grid w-full gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
            LiveSoberAF premium
          </p>

          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
            Get full access to LiveSoberAF.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/70">
            LiveSoberAF is a premium recovery product built to help people get
            clean and keep going. Real stories. Real support. Real structure.
            Available anytime, for a fraction of the cost of most recovery
            support.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-white/82">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black p-8 md:p-10">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5" />
            <p className="text-sm uppercase tracking-[0.35em] text-white/45">
              Launch offer
            </p>
          </div>

          <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/55">Start with a free trial</p>

            <div className="mt-3">
              <p className="text-5xl font-semibold">3 days free</p>
              <p className="mt-2 text-white/60">
                Then £9.99 per month. Cancel anytime.
              </p>
            </div>

            <p className="mt-5 text-white/70">
              Unlock the full LiveSoberAF system and start building real
              momentum from day one.
            </p>

            <button
              onClick={onUnlock}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:opacity-90"
            >
              Start 3-day free trial
            </button>

            <p className="mt-4 text-center text-sm text-white/50">
              Premium recovery support. No fluff. Just help that works.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/65">
              This is the prototype paywall for now. Next step is connecting
              this button to Stripe so trial and billing work for real.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeScreen({
  setCurrent,
  profile,
  checkedInToday,
  onDailyCheckIn,
  onResetStreak,
}: {
  setCurrent: (value: string) => void;
  profile: UserProfile;
  checkedInToday: boolean;
  onDailyCheckIn: () => void;
  onResetStreak: () => void;
}) {
  const primarySubstance =
    profile.substances.length > 0
      ? profile.substances[0]
      : "your recovery";

  const primaryTrigger =
    profile.triggers.length > 0
      ? profile.triggers[0]
      : "stress moments";

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
        LiveSoberAF dashboard
      </p>

      <h2 className="mt-2 text-5xl font-semibold leading-tight">
        Welcome back.
      </h2>

      <p className="mt-4 max-w-2xl text-lg text-white/70">
        You’re working on <strong>{primarySubstance}</strong>.
        Today is day <strong>{profile.streak}</strong>.
        Keep moving forward.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/50">Current streak</p>
          <p className="mt-2 text-5xl font-semibold">{profile.streak}</p>
          <p className="text-white/60">days</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/50">Longest streak</p>
          <p className="mt-2 text-5xl font-semibold">
            {profile.longestStreak}
          </p>
          <p className="text-white/60">days</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/50">Main trigger</p>
          <p className="mt-2 text-2xl font-semibold">{primaryTrigger}</p>
          <p className="text-white/60">focus area</p>
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-black p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-white/45">
          Today’s focus
        </p>

        <h3 className="mt-2 text-2xl font-semibold">
          Reduce risk around {primaryTrigger}
        </h3>

        <p className="mt-3 max-w-xl text-white/70">
          Watch one recovery share related to this trigger or check in
          before the evening window when cravings usually rise.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setCurrent("Shares")}
            className="rounded-2xl bg-white px-5 py-3 font-medium text-black"
          >
            Watch a recovery share
          </button>

          <button
            onClick={() => setCurrent("SOS")}
            className="rounded-2xl border border-white/15 px-5 py-3 font-medium hover:bg-white/10"
          >
            Open SOS support
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/50">Daily streak check-in</p>

          <h3 className="mt-2 text-2xl font-semibold">
            {checkedInToday
              ? "You’re checked in today"
              : "Keep your streak alive"}
          </h3>

          <button
            onClick={onDailyCheckIn}
            disabled={checkedInToday}
            className={`mt-4 rounded-2xl px-5 py-3 font-medium ${
              checkedInToday
                ? "bg-white/10 text-white/40"
                : "bg-white text-black"
            }`}
          >
            {checkedInToday
              ? "Already checked in"
              : "Check in now"}
          </button>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/50">Reset after relapse</p>

          <h3 className="mt-2 text-2xl font-semibold">
            Honest reset is progress
          </h3>

          <button
            onClick={onResetStreak}
            className="mt-4 rounded-2xl border border-white/15 px-5 py-3 font-medium hover:bg-white/10"
          >
            Reset streak
          </button>
        </div>
      </div>
    </section>
  );
}
 function SharesScreen() {
  const [stories, setStories] = useState<PublishedStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const res = await fetch("/api/published-stories", {
          cache: "no-store",
        });
        const data = await res.json();
        setStories(data.sessions || []);
      } catch {
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/45">
            LiveSoberAF shares
          </p>
          <h2 className="text-4xl font-semibold">
            Real stories, not polished nonsense
          </h2>
          <p className="mt-3 max-w-3xl text-white/70">
            Completed stories recorded on the website now appear here inside the app.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
          Website ↔ App connected
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold">Recorded on the website</h3>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {loading ? (
          <p className="text-white/50">Loading stories…</p>
        ) : stories.length === 0 ? (
          <p className="text-white/50">No completed stories available yet.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {stories.map((story) => {
              const firstAnswer = story.answers?.[0];

              return (
                <div
                  key={story.fileId}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/45">
                      {story.stage || "Recorded story"}
                    </p>

                    <a
                      href={`/the-app/story/${story.fileId}`}
                      className="rounded-full border border-white/10 p-2 transition hover:bg-white/10"
                    >
                      <Play className="h-4 w-4" />
                    </a>
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold">{story.name}</h3>

                  <p className="mt-1 text-sm text-red-200/80">
                    {story.substance}
                  </p>

                  <p className="mt-4 text-white/72">
                    A full 20-question recovery story recorded on the website.
                  </p>

                  {firstAnswer ? (
                    <video
                      src={firstAnswer}
                      controls
                      playsInline
                      className="mt-5 aspect-video w-full rounded-2xl border border-white/10 bg-black"
                    />
                  ) : null}

                  <a
                    href={`/the-app/story/${story.fileId}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
                  >
                    Watch full story <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold">Foundation shares</h3>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {shares.map((share) => (
            <div
              key={share.name}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/45">{share.status}</p>

                <button className="rounded-full border border-white/10 p-2 hover:bg-white/10">
                  <Play className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mt-3 text-2xl font-semibold">{share.name}</h3>
              <p className="mt-1 text-sm text-red-200/80">{share.theme}</p>
              <p className="mt-4 text-white/72">{share.summary}</p>

              <button className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                Watch share <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/45">
            Interview structure
          </p>
          <h3 className="mt-2 text-2xl font-semibold">
            Question-led storytelling
          </h3>

          <div className="mt-5 grid gap-3">
            {questions.map((question, index) => (
              <div
                key={question}
                className="flex items-start gap-3 rounded-2xl border border-white/10 px-4 py-3"
              >
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
                  {index + 1}
                </span>
                <p className="text-white/80">{question}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/45">
            LiveSoberAF content model
          </p>
          <h3 className="mt-2 text-2xl font-semibold">
            One interview, lots of useful content
          </h3>

          <div className="mt-5 space-y-3 text-white/72">
            <p>• Full-length share for the main story</p>
            <p>• Short clips by topic: cravings, family, anxiety, relapse, sleep</p>
            <p>• Quote cards and captions for social</p>
            <p>• Transcript and takeaway notes inside LiveSoberAF</p>
            <p>• Topic tags so users can find the story they need that day</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckInScreen() {
  const [selected, setSelected] = useState("Anxious");

  const moodCopy = useMemo(() => {
    const map: Record<string, string> = {
      Anxious:
        "You do not need to solve everything tonight. Start with one safe action.",
      Triggered:
        "Distance yourself from the trigger if you can. Buy time first.",
      Flat: "Low energy days still count. Gentle is enough.",
      Hopeful: "Hold onto what is working and keep the next step simple.",
    };

    return map[selected] || map.Anxious;
  }, [selected]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.35em] text-white/45">
        LiveSoberAF check-in
      </p>
      <h2 className="mt-2 text-4xl font-semibold">A simple daily reset</h2>
      <p className="mt-3 max-w-2xl text-white/70">
        Quick emotional check-ins, reflection and a useful next step instead of
        endless tracking for the sake of it.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/45">How are you feeling?</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Anxious", "Triggered", "Flat", "Hopeful"].map((item) => (
              <button
                key={item}
                onClick={() => setSelected(item)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  selected === item
                    ? "border-white bg-white text-black"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-sm text-white/45">Suggested next step</p>
            <p className="mt-2 text-white/80">{moodCopy}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black p-6">
          <p className="text-sm text-white/45">Today’s reflection</p>
          <h3 className="mt-2 text-2xl font-semibold">
            What helped yesterday, even a bit?
          </h3>
          <div className="mt-5 space-y-3">
            {[
              "Went to bed earlier",
              "Messaged someone",
              "Didn’t isolate",
              "Ate properly",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-4 text-white/80"
              >
                <CheckCircle2 className="h-5 w-5 text-white/50" />
                {item}
              </label>
            ))}
          </div>

          <button className="mt-6 rounded-2xl bg-white px-5 py-3 font-medium text-black">
            Save check-in
          </button>
        </div>
      </div>
    </section>
  );
}

function SOSScreen() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-red-200/80">
          LiveSoberAF SOS
        </p>
        <h2 className="mt-2 text-4xl font-semibold">For the ten hard minutes</h2>
        <p className="mt-3 max-w-2xl text-white/75">
          This section is for when someone is spiralling, craving, panicking or
          close to giving in. No clutter. No lectures. Just immediate help.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black p-6">
          <div className="flex items-center gap-3">
            <TimerReset className="h-5 w-5" />
            <h3 className="text-2xl font-semibold">Do this now</h3>
          </div>
          <div className="mt-5 space-y-3">
            {nudges.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 px-4 py-4 text-white/82"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Reach out</h3>
            </div>
            <p className="mt-3 text-white/72">
              Call or message one safe person. Keep it simple: “I’m having a
              wobble. Can you stay with me for ten minutes?”
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Ground yourself</h3>
            </div>
            <p className="mt-3 text-white/72">
              Cold water, walk outside, change rooms, snack, breathe. The aim
              is to reduce the wave, not have a perfect evening.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Emergency support</h3>
            </div>
            <p className="mt-3 text-white/72">
              This area can later hold helplines, local services and urgent
              support info in a cleaner dedicated flow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressScreen({ profile }: { profile: UserProfile }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.35em] text-white/45">
        LiveSoberAF progress
      </p>
      <h2 className="mt-2 text-4xl font-semibold">Small wins still count</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/45">Current streak</p>
          <p className="mt-2 text-5xl font-semibold">{profile.streak}</p>
          <p className="mt-2 text-white/68">days</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/45">Longest streak</p>
          <p className="mt-2 text-5xl font-semibold">{profile.longestStreak}</p>
          <p className="mt-2 text-white/68">days</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/45">Check-ins completed</p>
          <p className="mt-2 text-5xl font-semibold">{profile.totalCheckIns}</p>
          <p className="mt-2 text-white/68">lifetime</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/45">Recovery focus</p>
          <p className="mt-2 text-2xl font-semibold">
            {profile.substances.length > 0 ? profile.substances[0] : "Not set"}
          </p>
          <p className="mt-2 text-white/68">primary starting point</p>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-white/45">
          Milestones
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {milestoneDays.map((day) => {
            const unlocked = profile.milestonesUnlocked.includes(day);

            return (
              <div
                key={day}
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  unlocked
                    ? "border-white bg-white text-black"
                    : "border-white/10 text-white/60"
                }`}
              >
                {day} days
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RecoveryPlanScreen({
  profile,
  onCompleteDay,
  onOpenLesson,
}: {
  profile: UserProfile;
  onCompleteDay: (day: number) => void;
  onOpenLesson: (lesson: string) => void;
}) {
  const completed = profile.completedRecoveryDays || [];
  const nextUnlockedDay =
    completed.length === 0 ? 1 : Math.min(Math.max(...completed) + 1, 7);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
        LiveSoberAF recovery pathway
      </p>

      <h2 className="mt-2 text-5xl font-semibold leading-tight">
        Your first 7 days clean plan.
      </h2>

      <p className="mt-4 max-w-3xl text-lg text-white/70">
        One day at a time. One clear job each day. Real progress, not overwhelm.
      </p>

      <div className="mt-10 grid gap-4">
        {recoveryPlanDays.map((item) => {
          const isCompleted = completed.includes(item.day);
          const isUnlocked = item.day <= nextUnlockedDay;

          return (
            <div
              key={item.day}
              className={`rounded-[2rem] border p-6 transition ${
                isCompleted
                  ? "border-white bg-white text-black"
                  : isUnlocked
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-white/5 bg-white/[0.03] text-white/35"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.25em]">
                    Day {item.day}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold">
                    {item.title}
                  </h3>

                  <p
                    className={`mt-3 ${
                      isCompleted ? "text-black/75" : "text-white/70"
                    }`}
                  >
                    {item.text}
                  </p>
                </div>

                <div>
                  {item.day === 1 ? (
                    <button
                      onClick={() => onOpenLesson("day-one")}
                      className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
                    >
                      Open Day 1
                    </button>
                  ) : isCompleted ? (
                    <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-medium">
                      Completed
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onCompleteDay(item.day)}
                      className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
                    >
                      Mark complete
                    </button>
                  ) : (
                    <div className="rounded-2xl border border-white/10 px-4 py-3 text-sm">
                      Locked
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
function DayOneTimelineScreen({
  profile,
  wearableState,
  isRecordingReflection,
  setIsRecordingReflection,
  setProfile,
}: {
  profile: UserProfile;
  wearableState: WearableState;
  isRecordingReflection: boolean;
  setIsRecordingReflection: React.Dispatch<React.SetStateAction<boolean>>;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}) {

  const selectedSubstance = profile.substances?.[0] || "";
const selectedTrigger = profile.triggers?.[0] || "";

const wearableStressDetected =
  wearableState.connected &&
  (wearableState.elevatedHeartRate || wearableState.lowHRV);

const wearableBoredomDetected =
  wearableState.connected && wearableState.lowMovement;

const showAbby = selectedSubstance === "Codeine";
const showAdam = selectedSubstance === "Alcohol";

const showMatt =
  selectedTrigger === "Stress" ||
  selectedTrigger === "Boredom" ||
  wearableStressDetected ||
  wearableBoredomDetected;

  const todayReflectionQuestion = getReflectionQuestion(
  Number(profile?.soberDays || 1)
);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">
        Day 1 support timeline
      </p>

      <h2 className="mt-2 text-4xl font-semibold">
        Stay steady today. One window at a time.
      </h2>

      <div className="mt-8 space-y-5">
        {dayOneTimeline.map((block) => {
         const shouldShowAbby = showAbby;
const shouldShowAdam = showAdam;
const shouldShowMatt = showMatt; 

const todayReflectionQuestion = getReflectionQuestion(
  Number(profile?.soberDays || 1)
);
          return (
            <div
              key={block.id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">{block.time}</p>
                  <h3 className="mt-1 text-2xl font-semibold">
                    {block.title}
                  </h3>
                </div>

                <div className="rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-wider text-white/60">
                  {block.statusLabel}
                </div>
              </div>

              <p className="mt-4 text-white/70">{block.medicalPrompt}</p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black px-4 py-4 text-white/80">
                {block.action}
              </div>

              {shouldShowAbby && block.videoPath && (
                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                    Abby support
                  </p>

                  <h4 className="mt-2 text-lg font-semibold">
                    {block.abbyTitle}
                  </h4>

                  <p className="mt-1 text-white/70">{block.abbyNote}</p>

                  <video
                    controls
                    className="mt-4 w-full rounded-2xl border border-white/10"
                  >
                    <source src={block.videoPath} type="video/mp4" />
                  </video>
                </div>
              )}
{showAdam && (
  <div className="mt-6">
    <p className="text-sm uppercase tracking-[0.3em] text-white/40">
      Adam support
    </p>

    <h4 className="mt-2 text-lg font-semibold">
      Adam: Alcohol support for this window
    </h4>

    <p className="mt-1 text-white/70">
      Adam’s alcohol-specific support clip will appear here once uploaded.
    </p>

    <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-black/30 p-8 text-white/50">
      Adam video placeholder
    </div>
  </div>
)}
              {showMatt && block.mattVideoPath && (
                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                    Matt explains
                  </p>

                  <h4 className="mt-2 text-lg font-semibold">
                    {block.mattTitle}
                  </h4>

                  <p className="mt-1 text-white/70">{block.mattNote}</p>

                  <video
                    controls
                    className="mt-4 w-full rounded-2xl border border-white/10"
                  >
                    <source src={block.mattVideoPath} type="video/mp4" />
                  </video>
                </div>
              )}
             </div>
          );
        })}
      

<div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
  <h3 className="text-lg font-semibold">
    Today's reflection
  </h3>

  <p className="mt-2 text-white/70">
    {todayReflectionQuestion}
  </p>

 <button
  onClick={() => setIsRecordingReflection(true)}
  className="mt-4 rounded-lg bg-white px-4 py-2 text-black"
>
  Record your message
</button>
</div>
      </div>
      {isRecordingReflection && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-lg">
      <h3 className="text-lg font-semibold mb-4">
        Record today's reflection
      </h3>

      <video
        id="reflectionPreview"
        autoPlay
        muted
        className="w-full rounded-lg mb-4"
      />

      <div className="flex gap-3">
        <button
          onClick={() => setIsRecordingReflection(false)}
          className="px-4 py-2 rounded bg-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            const fakeUrl = "/sample-reflection.mp4";

            setProfile({
              ...profile,
              dailyReflections: [
                ...(profile.dailyReflections || []),
                {
                  id: crypto.randomUUID(),
                  day: profile.streak || 1,
                  question: getReflectionQuestion(profile.streak || 1),
                  substance: profile.substances[0],
                  trigger: profile.triggers[0],
                  sex: profile.sex,
                  ageRange: profile.ageRange,
                  videoUrl: fakeUrl,
                  createdAt: new Date().toISOString(),
                },
              ],
            });

            setIsRecordingReflection(false);
          }}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Save reflection
        </button>
      </div>
    </div>
  </div>
)}
    </section>
  );
}

export default function Page() {
  const [current, setCurrent] = useState("Home");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isRecordingReflection, setIsRecordingReflection] = useState(false);
const [reflectionVideoUrl, setReflectionVideoUrl] = useState<string | null>(null);
  const [wearableState, setWearableState] = useState({
    connected: true,
    elevatedHeartRate: false,
    lowHRV: false,
    lowMovement: false,
    poorSleep: false,
  });
  
  useEffect(() => {
    const savedProfile = window.localStorage.getItem("livesoberaf-profile");
    const savedOnboardingState = window.localStorage.getItem(
      "livesoberaf-onboarding-complete"
    );

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);

      setProfile({
        ...defaultProfile,
        ...parsed,
        substances: Array.isArray(parsed.substances) ? parsed.substances : [],
        triggers: Array.isArray(parsed.triggers) ? parsed.triggers : [],
        milestonesUnlocked: Array.isArray(parsed.milestonesUnlocked)
          ? parsed.milestonesUnlocked
          : [],
        completedRecoveryDays: Array.isArray(parsed.completedRecoveryDays)
          ? parsed.completedRecoveryDays
          : [],
        dayOneCompletedSteps: Array.isArray(parsed.dayOneCompletedSteps)
          ? parsed.dayOneCompletedSteps
          : [],
        communityVoices: Array.isArray(parsed.communityVoices)
          ? parsed.communityVoices
          : [],
        streak: Number(parsed.streak ?? parsed.soberDays ?? 0) || 0,
        longestStreak:
          Number(parsed.longestStreak ?? parsed.streak ?? parsed.soberDays ?? 0) || 0,
        totalCheckIns: Number(parsed.totalCheckIns ?? 0) || 0,
        hasPaid: Boolean(parsed.hasPaid),
      });
    }

    if (savedOnboardingState === "true") {
      setShowOnboarding(false);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(
      "livesoberaf-profile",
      JSON.stringify(profile)
    );
  }, [profile, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(
      "livesoberaf-onboarding-complete",
      showOnboarding ? "false" : "true"
    );
  }, [showOnboarding, isLoaded]);

  const today = getTodayString();
  const yesterday = getDateOffsetString(-1);
  const checkedInToday = isSameDay(profile.lastCheckInDate, today);

  const handleFinishOnboarding = () => {
    const initialStreak = Number(profile.soberDays || 0) || 0;
    const unlocked = [
      ...profile.milestonesUnlocked,
      ...getNewMilestones(initialStreak, profile.milestonesUnlocked),
    ];

    setProfile((prev) => ({
      ...prev,
      streak: initialStreak,
      longestStreak: Math.max(prev.longestStreak, initialStreak),
      milestonesUnlocked: Array.from(new Set(unlocked)).sort((a, b) => a - b),
    }));

    setShowOnboarding(false);
  };

  const handleCompleteRecoveryDay = (day: number) => {
    setProfile((prev) => {
      const existing = prev.completedRecoveryDays || [];

      if (existing.includes(day)) {
        return prev;
      }

      return {
        ...prev,
        completedRecoveryDays: [...existing, day].sort((a, b) => a - b),
      };
    });
  };

  const handleDailyCheckIn = () => {
    setProfile((prev) => {
      const alreadyDone = isSameDay(prev.lastCheckInDate, today);
      if (alreadyDone) return prev;

      const isYesterday = isSameDay(prev.lastCheckInDate, yesterday);
      const nextStreak = prev.lastCheckInDate
        ? isYesterday
          ? prev.streak + 1
          : 1
        : Math.max(prev.streak, Number(prev.soberDays || 0) || 0);

      const nextLongest = Math.max(prev.longestStreak, nextStreak);
      const newMilestones = getNewMilestones(
        nextStreak,
        prev.milestonesUnlocked
      );

      return {
        ...prev,
        streak: nextStreak,
        longestStreak: nextLongest,
        totalCheckIns: prev.totalCheckIns + 1,
        soberDays: String(nextStreak),
        lastCheckInDate: today,
        milestonesUnlocked: Array.from(
          new Set([...prev.milestonesUnlocked, ...newMilestones])
        ).sort((a, b) => a - b),
      };
    });
  };

  const handleResetStreak = () => {
    setProfile((prev) => ({
      ...prev,
      streak: 0,
      soberDays: "0",
      lastCheckInDate: "",
    }));
  };

  const handleUnlockPaywall = () => {
    setProfile((prev) => ({
      ...prev,
      hasPaid: true,
    }));
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-neutral-950" />;
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        profile={profile}
        setProfile={setProfile}
        onFinish={handleFinishOnboarding}
      />
    );
  }

  if (!profile.hasPaid) {
    return <PaywallScreen onUnlock={handleUnlockPaywall} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <TopNav current={current} setCurrent={setCurrent} />

      {current === "Home" && (
        <HomeScreen
          setCurrent={setCurrent}
          profile={profile}
          checkedInToday={checkedInToday}
          onDailyCheckIn={handleDailyCheckIn}
          onResetStreak={handleResetStreak}
        />
      )}

      {current === "Shares" && <SharesScreen />}

      {current === "Check-In" && <CheckInScreen />}

      {current === "SOS" && <SOSScreen />}

      {current === "Progress" && <ProgressScreen profile={profile} />}

      {current === "Pathway" &&
        (selectedLesson === "day-one" ? (
<DayOneTimelineScreen
  profile={profile}
  wearableState={wearableState}
  isRecordingReflection={isRecordingReflection}
  setIsRecordingReflection={setIsRecordingReflection}
  setProfile={setProfile}
/>
        ) : (
          <RecoveryPlanScreen
            profile={profile}
            onCompleteDay={handleCompleteRecoveryDay}
            onOpenLesson={setSelectedLesson}
          />
        ))}
     {current === "Pathway" &&
  (selectedLesson === "day-one" ? (
    <DayOneTimelineScreen
      profile={profile}
      wearableState={wearableState}
      isRecordingReflection={isRecordingReflection}
      setIsRecordingReflection={setIsRecordingReflection}
      setProfile={setProfile}
    />
  ) : (
    <RecoveryPlanScreen
      profile={profile}
      onCompleteDay={handleCompleteRecoveryDay}
      onOpenLesson={setSelectedLesson}
    />
  ))}

      <ReflectionRecorderModal
        isOpen={isRecordingReflection}
        onClose={() => setIsRecordingReflection(false)}
        profile={profile}
        setProfile={setProfile}
        question={getReflectionQuestion(Number(profile.soberDays || 1))}
      />
    </div>
  );
}   
