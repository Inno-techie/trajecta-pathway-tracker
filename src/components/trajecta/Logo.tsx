import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-6 text-accent", className)}
    >
      <path
        d="M3 19C6.5 19 8.5 15.5 11 11.5C13.5 7.5 16 4.5 21 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="21" cy="4.5" r="2.2" fill="currentColor" />
      <circle cx="11" cy="11.5" r="1.4" className="text-primary" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="font-display text-[0.95rem] font-extrabold uppercase tracking-[0.22em] text-foreground">
        Trajecta
      </span>
    </span>
  );
}
