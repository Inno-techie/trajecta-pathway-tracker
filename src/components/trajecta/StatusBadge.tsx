import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  Applied: "bg-secondary text-secondary-foreground",
  Assessment: "bg-warning/15 text-warning-foreground",
  Interview: "bg-accent/15 text-accent",
  Selected: "bg-success/15 text-success",
  Rejected: "bg-destructive/10 text-destructive",
  Withdrawn: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status] ?? "bg-secondary text-secondary-foreground",
      )}
    >
      {status}
    </span>
  );
}
