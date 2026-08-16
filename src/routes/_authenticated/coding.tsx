import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/trajecta/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCodingTopics, useSaveCodingTopic } from "@/lib/data";
import { CODING_TOPICS, formatShortDate } from "@/lib/trajecta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/coding")({
  head: () => ({
    meta: [
      { title: "Coding — TRAJECTA" },
      {
        name: "description",
        content: "Track problems solved by topic and difficulty over time.",
      },
      { property: "og:title", content: "Coding — TRAJECTA" },
      {
        property: "og:description",
        content: "Track problems solved by topic and difficulty over time.",
      },
    ],
  }),
  component: CodingPage,
});

function TopicRow({
  topic,
  easy,
  medium,
  hard,
  lastPracticed,
}: {
  topic: string;
  easy: number;
  medium: number;
  hard: number;
  lastPracticed: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({ easy, medium, hard });
  const save = useSaveCodingTopic();
  const total = easy + medium + hard;

  function open() {
    setValues({ easy, medium, hard });
    setEditing(true);
  }

  function clamp(v: string) {
    const n = Number.parseInt(v || "0", 10);
    if (Number.isNaN(n) || n < 0) return 0;
    return Math.min(n, 9999);
  }

  return (
    <div className={cn("surface lift p-5", total > 0 && "border-accent/30")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">{topic}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Problems solved: {total}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => (editing ? setEditing(false) : open())}>
          {editing ? "Cancel" : "Update"}
        </Button>
      </div>

      {editing ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(
              { topic, ...values },
              {
                onSuccess: () => {
                  toast.success(`${topic} updated.`);
                  setEditing(false);
                },
                onError: (err) => toast.error(err.message),
              },
            );
          }}
        >
          <div className="grid grid-cols-3 gap-3">
            {(["easy", "medium", "hard"] as const).map((key) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={`${topic}-${key}`} className="capitalize">
                  {key}
                </Label>
                <Input
                  id={`${topic}-${key}`}
                  type="number"
                  min={0}
                  max={9999}
                  value={values[key]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [key]: clamp(e.target.value) }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total: {values.easy + values.medium + values.hard}
            </p>
            <Button type="submit" size="sm" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span>Easy: {easy}</span>
          <span>Medium: {medium}</span>
          <span>Hard: {hard}</span>
          <span>Last practiced: {formatShortDate(lastPracticed)}</span>
        </div>
      )}
    </div>
  );
}

function CodingPage() {
  const { data: rows = [] } = useCodingTopics();
  const byTopic = new Map(rows.map((r) => [r.topic, r]));

  const totals = rows.reduce(
    (acc, r) => ({
      easy: acc.easy + r.easy,
      medium: acc.medium + r.medium,
      hard: acc.hard + r.hard,
    }),
    { easy: 0, medium: 0, hard: 0 },
  );
  const solved = totals.easy + totals.medium + totals.hard;

  return (
    <div className="rise">
      <PageHeader
        title="Coding"
        subtitle="Update how many problems you've solved per topic. Problems solved = easy + medium + hard."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total solved" value={solved} />
        <StatCard label="Easy" value={totals.easy} />
        <StatCard label="Medium" value={totals.medium} />
        <StatCard label="Hard" value={totals.hard} />
      </div>

      {solved === 0 && (
        <div className="mb-6 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="font-display text-base font-semibold text-foreground">
            No coding progress yet.
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Solve your first problem and start your journey.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {CODING_TOPICS.map((topic) => {
          const row = byTopic.get(topic);
          return (
            <TopicRow
              key={topic}
              topic={topic}
              easy={row?.easy ?? 0}
              medium={row?.medium ?? 0}
              hard={row?.hard ?? 0}
              lastPracticed={row?.last_practiced ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}
