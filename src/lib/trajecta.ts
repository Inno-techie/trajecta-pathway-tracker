export const APTITUDE_TOPICS = [
  "Quantitative Aptitude",
  "Logical Reasoning",
  "Verbal Ability",
  "Data Interpretation",
  "Probability",
  "Permutations & Combinations",
  "Percentages",
  "Profit & Loss",
  "Time & Work",
  "Time, Speed & Distance",
  "Number Systems",
  "Averages",
  "Ratios & Proportions",
] as const;

export const TECHNICAL_TOPICS = [
  "Data Structures",
  "Algorithms",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "SQL",
  "Java / Python / C++",
  "Web Development",
  "Software Engineering",
] as const;

export const INTERVIEW_TOPICS = [
  "HR Interview",
  "Technical Interview",
  "Behavioral Questions",
  "Resume Preparation",
  "Self Introduction",
  "Communication",
  "Mock Interview",
] as const;

export const CODING_TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Trees",
  "Graphs",
  "Recursion",
  "Sorting",
  "Searching",
  "Dynamic Programming",
  "Greedy",
  "Hashing",
  "Two Pointers",
  "Sliding Window",
] as const;

export const DAILY_CATEGORIES = [
  { key: "aptitude", label: "Aptitude", hint: "Practice aptitude today" },
  { key: "coding", label: "Coding", hint: "Practice coding today" },
  { key: "technical", label: "Technical", hint: "Revise technical concepts today" },
  { key: "interview", label: "Interview", hint: "Practice interview preparation today" },
] as const;

export const APPLICATION_STATUSES = [
  "Applied",
  "Assessment",
  "Interview",
  "Selected",
  "Rejected",
  "Withdrawn",
] as const;

export const PLATFORMS = [
  "LinkedIn",
  "Naukri",
  "Company Website",
  "Indeed",
  "Internshala",
  "Referral",
  "Other",
] as const;

export const GENERAL_TOPIC = "general";

/** Local (not UTC) YYYY-MM-DD for a given date. */
export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function formatShortDate(key: string | null | undefined): string {
  if (!key) return "—";
  return parseDateKey(key).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatLongDate(date: Date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function firstName(fullName: string | null | undefined): string {
  if (!fullName) return "there";
  return fullName.trim().split(/\s+/)[0] || "there";
}

/** Current consecutive-day streak ending today or yesterday. */
export function currentStreak(dateKeys: string[]): number {
  const set = new Set(dateKeys);
  if (set.size === 0) return 0;
  const cursor = new Date();
  if (!set.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(toDateKey(cursor))) return 0;
  }
  let streak = 0;
  while (set.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function longestStreak(dateKeys: string[]): number {
  const sorted = Array.from(new Set(dateKeys)).sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of sorted) {
    const d = parseDateKey(key);
    if (prev && Math.round((d.getTime() - prev.getTime()) / 86400000) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    prev = d;
    best = Math.max(best, run);
  }
  return best;
}

export function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

/** Target number of solved problems that counts as full coding coverage. */
export const CODING_TARGET = 300;
