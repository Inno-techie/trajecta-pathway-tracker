import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Meter, PageHeader, SectionCard, StatCard } from "@/components/trajecta/primitives";
import { useApplications, useCodingTopics, usePracticeLogs } from "@/lib/data";
import { useOverallProgress } from "@/lib/progress";
import {
  DAILY_CATEGORIES,
  currentStreak,
  formatShortDate,
  longestStreak,
  toDateKey,
} from "@/lib/trajecta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Progress — TRAJECTA" },
      {
        name: "description",
        content: "Visualise your preparation trends, streaks and application outcomes.",
      },
      { property: "og:title", content: "Progress — TRAJECTA" },
      {
        property: "og:description",
        content: "Visualise your preparation trends, streaks and application outcomes.",
      },
    ],
  }),
  component: ProgressPage,
});

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function lastNDays(n: number) {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(toDateKey(d));
  }
  return out;
}

function ProgressPage() {
  const { data: logs = [] } = usePracticeLogs();
  const { data: applications = [] } = useApplications();
  const { data: coding = [] } = useCodingTopics();
  const progress = useOverallProgress();

  const activeDays = useMemo(() => [...new Set(logs.map((l) => l.practice_date))], [logs]);
  const streak = currentStreak(activeDays);
  const best = longestStreak(activeDays);

  const daily = useMemo(() => {
    const days = lastNDays(14);
    const counts = new Map<string, number>();
    for (const log of logs) counts.set(log.practice_date, (counts.get(log.practice_date) ?? 0) + 1);
    return days.map((d) => ({
      date: d,
      label: formatShortDate(d).replace(/,.*$/, ""),
      count: counts.get(d) ?? 0,
    }));
  }, [logs]);

  const categoryData = useMemo(
    () =>
      DAILY_CATEGORIES.map((c) => ({
        name: c.label,
        value: logs.filter((l) => l.category === c.key).length,
      })),
    [logs],
  );

  const statusData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of applications) counts.set(a.status, (counts.get(a.status) ?? 0) + 1);
    return [...counts.entries()].map(([name, value]) => ({ name, value }));
  }, [applications]);

  const codingData = useMemo(
    () =>
      coding
        .map((t) => ({ name: t.topic, solved: t.easy + t.medium + t.hard }))
        .filter((t) => t.solved > 0)
        .sort((a, b) => b.solved - a.solved)
        .slice(0, 8),
    [coding],
  );

  const solved = coding.reduce((s, t) => s + t.easy + t.medium + t.hard, 0);

  const tooltipStyle = {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "var(--color-foreground)",
  } as const;

  return (
    <div className="rise">
      <PageHeader title="Progress" subtitle="Everything you've recorded, at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall preparation" value={`${progress.overall}%`} />
        <StatCard label="Current streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} />
        <StatCard label="Longest streak" value={`${best} ${best === 1 ? "day" : "days"}`} />
        <StatCard label="Problems solved" value={solved} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Preparation breakdown">
          <div className="space-y-4">
            {(
              [
                ["Aptitude", progress.aptitude],
                ["Coding", progress.coding],
                ["Technical", progress.technical],
                ["Interview", progress.interview],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}%</span>
                </div>
                <Meter value={value} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Last 14 days of activity">
          {logs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No activity recorded yet.
            </p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={daily} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Entries"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Practice by category">
          {logs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Mark a category as practiced to see this chart.
            </p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-secondary)" }} />
                  <Bar dataKey="value" name="Entries" radius={[6, 6, 0, 0]}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Applications by status">
          {statusData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No applications tracked yet.
            </p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      {codingData.length > 0 && (
        <div className="mt-6">
          <SectionCard title="Top coding topics">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={codingData}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 40, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-secondary)" }} />
                  <Bar dataKey="solved" name="Solved" radius={[0, 6, 6, 0]} fill="var(--color-accent)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      )}

      <div className="mt-6">
        <SectionCard title="Daily activity history">
          {logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Your daily history will appear here once you start tracking.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {[...activeDays]
                .sort((a, b) => b.localeCompare(a))
                .slice(0, 12)
                .map((day) => {
                  const entries = logs.filter((l) => l.practice_date === day);
                  const cats = [...new Set(entries.map((e) => e.category))];
                  return (
                    <li key={day} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {formatShortDate(day)}
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {cats.join(" · ")}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground",
                        )}
                      >
                        {entries.length} {entries.length === 1 ? "entry" : "entries"}
                      </span>
                    </li>
                  );
                })}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
