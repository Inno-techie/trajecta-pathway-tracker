import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, CalendarCheck, Code2, LineChart } from "lucide-react";
import { Wordmark } from "@/components/trajecta/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRAJECTA — Track your journey. Shape your future." },
      {
        name: "description",
        content:
          "One place to track your job applications, build consistent preparation habits, and see how far you've come.",
      },
      { property: "og:title", content: "TRAJECTA — Track your journey. Shape your future." },
      {
        property: "og:description",
        content:
          "A calm placement-preparation tracker for students: applications, daily practice, coding progress and insights.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Briefcase,
    title: "Career Tracking",
    body: "Never lose track of a job or internship application again.",
  },
  {
    icon: CalendarCheck,
    title: "Daily Preparation",
    body: "Build a consistent preparation routine and record your progress every day.",
  },
  {
    icon: Code2,
    title: "Coding Progress",
    body: "Track coding practice and problem-solving progress over time.",
  },
  {
    icon: LineChart,
    title: "Progress Insights",
    body: "See your preparation journey through simple, meaningful statistics.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Wordmark />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="rise mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent">
              Placement preparation tracker
            </p>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-7xl">
              TRAJECTA
            </h1>
            <p className="mt-5 text-lg text-foreground/80 sm:text-xl">
              Track your journey. Shape your future.
            </p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              One place to track your applications, build consistent preparation habits, and see
              how far you've come.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-card/60">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Preparation, quietly organised
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                TRAJECTA is not a quiz platform. It is a personal record of the work you already
                do — every application you send, every day you practice, every problem you solve.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <article key={f.title} className="surface lift p-6">
                  <f.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Record applications",
                body: "Company, role, platform, date and status — from LinkedIn to Internshala.",
              },
              {
                step: "02",
                title: "Mark daily practice",
                body: "Aptitude, coding, technical and interview prep, tracked by date.",
              },
              {
                step: "03",
                title: "Watch progress build",
                body: "Streaks, weekly activity and preparation percentages from your real data.",
              },
            ].map((s) => (
              <div key={s.step}>
                <span className="font-display text-sm font-bold tracking-[0.2em] text-accent">
                  {s.step}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6">
          <Wordmark />
          <p>Track your journey. Shape your future.</p>
        </div>
      </footer>
    </div>
  );
}
