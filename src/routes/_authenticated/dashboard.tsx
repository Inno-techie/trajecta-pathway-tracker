import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { useApplications, useCodingTopics, usePracticeLogs, useProfile } from "@/lib/data";
import { useTogglePractice } from "@/lib/data";
import {
  DAILY_CATEGORIES,
  GENERAL_TOPIC,
  formatLongDate,
  formatShortDate,
  greeting,
  firstName,
  toDateKey,
  pct,
} from "@/lib/trajecta";
import { useOverallProgress } from "@/lib/progress";
import { EmptyState, Meter, SectionCard, StatCard } from "@/components/trajecta/primitives";
import { StatusBadge } from "@/components/trajecta/StatusBadge";
import { ApplicationDialog } from "@/components/trajecta/ApplicationDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TRAJECTA" },
      { name: "description", content: "Your preparation and application overview in TRAJECTA." },
      { property: "og:title", content: "Dashboard — TRAJECTA" },
      { property: "og:description", content: "Your preparation and application overview." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: profile } = useProfile();
  const { data: applications = [] } = useApplications();
  const { data: logs = [] } = usePracticeLogs();
  const { data: coding = [] } = useCodingTopics();
  const toggle = useTogglePractice();
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = toDateKey();
  const progress = useOverallProgress();

  const aptitudeDays = new Set(
    logs.filter((l) => l.category === "aptitude").map((l) => l.practice_date),
  ).size;
  const problemsSolved = coding.reduce((sum, t) => sum + t.easy + t.medium + t.hard, 0);

  const dailyDone = new Set(
    logs.filter((l) => l.practice_date === today && l.topic === GENERAL_TOPIC).map((l) => l.category),
  );

  const recent = applications.slice(0, 5);

  return (
    <div className="rise">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {formatLongDate()}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
          {greeting()}, {firstName(profile?.full_name)}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Keep moving forward. Every small step counts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applications" value={applications.length} hint="Total recorded" />
        <StatCard label="Aptitude" value={aptitudeDays} hint="Days practiced" />
        <StatCard label="Coding" value={problemsSolved} hint="Problems solved" />
        <StatCard
          label="Overall Progress"
          value={`${progress.overall}%`}
          hint="Across all preparation"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <SectionCard title="Today's Preparation" className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's progress</span>
            <span className="font-medium text-foreground">
              {dailyDone.size} / {DAILY_CATEGORIES.length}
            </span>
          </div>
          <Meter value={pct(dailyDone.size, DAILY_CATEGORIES.length)} />

          <ul className="mt-5 space-y-2">
            {DAILY_CATEGORIES.map((cat) => {
              const done = dailyDone.has(cat.key);
              return (
                <li key={cat.key}>
                  <button
                    type="button"
                    aria-pressed={done}
                    disabled={toggle.isPending}
                    onClick={() =>
                      toggle.mutate(
                        { category: cat.key, topic: GENERAL_TOPIC, practiced: !done },
                        {
                          onSuccess: () =>
                            toast.success(done ? `${cat.label} unmarked` : `${cat.label} practiced`),
                          onError: (e) => toast.error(e.message),
                        },
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary/60",
                      done && "border-accent/40 bg-accent/5",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-all",
                        done ? "border-accent bg-accent text-accent-foreground" : "border-input",
                      )}
                    >
                      {done && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{cat.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {done ? "Practiced today" : cat.hint}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          title="Recent Applications"
          className="lg:col-span-3"
          action={
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setDialogOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" /> Add Application
              </Button>
            </div>
          }
        >
          {recent.length === 0 ? (
            <EmptyState
              title="No applications yet."
              description="Start tracking your first application."
              action={<Button onClick={() => setDialogOpen(true)}>+ Add Application</Button>}
            />
          ) : (
            <>
              <ul className="divide-y divide-border">
                {recent.map((app) => (
                  <li
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{app.company}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {app.role} · {app.platform} · {formatShortDate(app.application_date)}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <Link
                  to="/applications"
                  className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  View all →
                </Link>
              </div>
            </>
          )}
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Aptitude", value: progress.aptitude },
          { label: "Coding", value: progress.coding },
          { label: "Technical", value: progress.technical },
          { label: "Interview", value: progress.interview },
        ].map((row) => (
          <div key={row.label} className="surface p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{row.label}</span>
              <span className="text-muted-foreground">{row.value}%</span>
            </div>
            <Meter className="mt-3" value={row.value} />
          </div>
        ))}
      </div>

      <ApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
