import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Meter, SectionCard } from "@/components/trajecta/primitives";
import { TopicTracker } from "@/components/trajecta/TopicTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePracticeLogs, useTogglePractice } from "@/lib/data";
import {
  APTITUDE_TOPICS,
  DAILY_CATEGORIES,
  GENERAL_TOPIC,
  INTERVIEW_TOPICS,
  TECHNICAL_TOPICS,
  pct,
  toDateKey,
} from "@/lib/trajecta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/preparation")({
  head: () => ({
    meta: [
      { title: "Preparation — TRAJECTA" },
      {
        name: "description",
        content: "Record daily aptitude, technical and interview preparation.",
      },
      { property: "og:title", content: "Preparation — TRAJECTA" },
      {
        property: "og:description",
        content: "Record daily aptitude, technical and interview preparation.",
      },
    ],
  }),
  component: PreparationPage,
});

function TodaysPreparation() {
  const { data: logs = [] } = usePracticeLogs();
  const toggle = useTogglePractice();
  const today = toDateKey();
  const done = new Set(
    logs
      .filter((l) => l.practice_date === today && l.topic === GENERAL_TOPIC)
      .map((l) => l.category),
  );

  return (
    <SectionCard title="Today's Preparation">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Today's progress</span>
        <span className="font-medium text-foreground">
          {done.size} / {DAILY_CATEGORIES.length}
        </span>
      </div>
      <Meter value={pct(done.size, DAILY_CATEGORIES.length)} />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {DAILY_CATEGORIES.map((cat) => {
          const isDone = done.has(cat.key);
          return (
            <button
              key={cat.key}
              type="button"
              aria-pressed={isDone}
              disabled={toggle.isPending}
              onClick={() =>
                toggle.mutate(
                  { category: cat.key, topic: GENERAL_TOPIC, practiced: !isDone },
                  {
                    onSuccess: () =>
                      toast.success(isDone ? `${cat.label} unmarked` : `${cat.label} practiced`),
                    onError: (e) => toast.error(e.message),
                  },
                )
              }
              className={cn(
                "flex items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/60",
                isDone && "border-accent/40 bg-accent/5",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-all",
                  isDone ? "border-accent bg-accent text-accent-foreground" : "border-input",
                )}
              >
                {isDone && <Check className="h-3.5 w-3.5" />}
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">{cat.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {isDone ? "Practiced today" : cat.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}

function PreparationPage() {
  return (
    <div className="rise">
      <PageHeader
        title="Preparation"
        subtitle="Mark what you practiced today. No answers, no submissions — just your record."
      />

      <TodaysPreparation />

      <div className="mt-8">
        <Tabs defaultValue="aptitude">
          <TabsList className="mb-6">
            <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
          </TabsList>
          <TabsContent value="aptitude">
            <TopicTracker category="aptitude" topics={APTITUDE_TOPICS} />
          </TabsContent>
          <TabsContent value="technical">
            <TopicTracker category="technical" topics={TECHNICAL_TOPICS} />
          </TabsContent>
          <TabsContent value="interview">
            <TopicTracker category="interview" topics={INTERVIEW_TOPICS} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
