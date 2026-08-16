import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STATUSES, PLATFORMS, toDateKey } from "@/lib/trajecta";
import { useSaveApplication, type JobApplication } from "@/lib/data";

const schema = z.object({
  company: z.string().trim().min(1, "Company is required").max(100),
  role: z.string().trim().min(1, "Role is required").max(100),
  platform: z.string().trim().min(1, "Platform is required").max(60),
  application_date: z.string().min(1, "Date is required"),
  status: z.string().min(1),
});

const empty = {
  company: "",
  role: "",
  platform: "LinkedIn",
  application_date: toDateKey(),
  status: "Applied",
};

export function ApplicationDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: JobApplication | null;
}) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const save = useSaveApplication();

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setValues(
      editing
        ? {
            company: editing.company,
            role: editing.role,
            platform: editing.platform,
            application_date: editing.application_date,
            status: editing.status,
          }
        : { ...empty, application_date: toDateKey() },
    );
  }, [open, editing]);

  function set(key: keyof typeof empty, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    save.mutate(
      { ...(editing ? { id: editing.id } : {}), values: parsed.data },
      {
        onSuccess: () => {
          toast.success(editing ? "Application updated." : "Application added.");
          onOpenChange(false);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit application" : "Add application"}</DialogTitle>
          <DialogDescription>
            Record where you applied so nothing slips through the cracks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={values.company}
              onChange={(e) => set("company", e.target.value)}
              maxLength={100}
              placeholder="Google"
            />
            {errors["company"] && <p className="text-xs text-destructive">{errors["company"]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role / Position</Label>
            <Input
              id="role"
              value={values.role}
              onChange={(e) => set("role", e.target.value)}
              maxLength={100}
              placeholder="Software Engineer Intern"
            />
            {errors["role"] && <p className="text-xs text-destructive">{errors["role"]}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={values.platform} onValueChange={(v) => set("platform", v)}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_date">Application Date</Label>
              <Input
                id="application_date"
                type="date"
                value={values.application_date}
                onChange={(e) => set("application_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={values.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
