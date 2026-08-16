import { Check } from "lucide-react";
import { usePracticeLogs, useTogglePractice } from "@/lib/data";
import {
  currentStreak,
  formatShortDate,
  toDateKey,
  pct,
} from "@/lib/trajecta";
import { Meter } from "./primitives";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Reusable per-topic daily practice tracker used by Aptitude, Technical
 * and Interview preparation. No answers, no submission — only "practiced today".
 */
export function TopicTracker({
  category,
  topics,
}: {
  category: string;
  topics: readonly string[];
}) {
  const { data: logs, isLoading } = usePracticeLogs();
  const toggle = useTogglePractice();
  const today = toDateKey();

  const byTopic = new Map<string, string[]>();
  for (const log of logs ?? []) {
    if (log.category !== category) continue;
    const list = byTopic.get(log.topic) ?? [];
    list.push(log.practice_date);
    byTopic.set(log.topic, list);
  }

  const doneToday = topics.filter((t) => (byTopic.get(t) ?? []).includes(today)).length;

  return (
    <div className="space-y-5">
      <div className="surface p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Today's topics</span>
          <span className="text-muted-foreground">
            {doneToday} / {topics.length}
          </span>
        </div>
        <Meter className="mt-3" value={pct(doneToday, topics.length)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => {
          const dates = byTopic.get(topic) ?? [];
          const practicedToday = dates.includes(today);
          const last = dates.slice().sort().at(-1) ?? null;
          const streak = currentStreak(dates);
          return (
            <div
              key={topic}
              className={cn(
                "surface lift flex items-start gap-3 p-4",
                practicedToday && "border-accent/40",
              )}
            >
              <button
                type="button"
                disabled={isLoading || toggle.isPending}
                aria-pressed={practicedToday}
                aria-label={`Mark ${topic} as practiced`}
                onClick={() =>
                  toggle.mutate(
                    { category, topic, practiced: !practicedToday },
                    {
                      onSuccess: () =>
                        toast.success(
                          practicedToday ? `${topic} unmarked` : `${topic} practiced today`,
                        ),
                      onError: (e) => toast.error(e.message),
                    },
                  )
                }
                className={cn(
                  "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-all duration-200",
                  practicedToday
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-input hover:border-accent",
                )}
              >
                {practicedToday && <Check className="h-3.5 w-3.5" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{topic}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {practicedToday ? "Practiced today" : "Mark as practiced"}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Last: {formatShortDate(last)}</span>
                  <span>Streak: {streak}d</span>
                  <span>Days: {new Set(dates).size}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
