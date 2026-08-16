import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useProfile, usePracticeLogs } from "@/lib/data";
import { DAILY_CATEGORIES, GENERAL_TOPIC, firstName, toDateKey } from "@/lib/trajecta";

const SESSION_KEY = "trajecta:reminder-dismissed";

/** Subtle once-per-session daily nudge shown after sign-in. */
export function DailyReminder() {
  const { data: profile } = useProfile();
  const { data: logs } = usePracticeLogs();
  const [visible, setVisible] = useState(false);

  const today = toDateKey();
  const doneToday = (logs ?? []).filter(
    (l) => l.practice_date === today && l.topic === GENERAL_TOPIC,
  ).length;
  const total = DAILY_CATEGORIES.length;
  const complete = doneToday >= total;

  useEffect(() => {
    if (!profile || !logs) return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY) === today) return;
    setVisible(true);
  }, [profile, logs, today]);

  function dismiss() {
    setVisible(false);
    if (typeof window !== "undefined") window.sessionStorage.setItem(SESSION_KEY, today);
  }

  if (!visible || !profile) return null;
  const name = firstName(profile.full_name);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4">
      <div className="rise pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lift">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {complete ? `Great work, ${name} 🎉` : `Hello, ${name} 👋`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {complete
              ? "You've completed today's preparation."
              : `You've completed ${doneToday} of ${total} of today's preparation.`}
          </p>
          {!complete && (
            <Link
              to="/preparation"
              onClick={dismiss}
              className="mt-2 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              Start today's preparation →
            </Link>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
