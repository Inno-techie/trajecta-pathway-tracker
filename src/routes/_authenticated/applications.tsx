import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApplications, useDeleteApplication, type JobApplication } from "@/lib/data";
import { APPLICATION_STATUSES, formatShortDate } from "@/lib/trajecta";
import { EmptyState, PageHeader } from "@/components/trajecta/primitives";
import { StatusBadge } from "@/components/trajecta/StatusBadge";
import { ApplicationDialog } from "@/components/trajecta/ApplicationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/applications")({
  head: () => ({
    meta: [
      { title: "Applications — TRAJECTA" },
      {
        name: "description",
        content: "Track every job and internship application you have submitted.",
      },
      { property: "og:title", content: "Applications — TRAJECTA" },
      {
        property: "og:description",
        content: "Track every job and internship application you have submitted.",
      },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { data: applications = [], isLoading } = useApplications();
  const remove = useDeleteApplication();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      const matchesStatus = status === "all" || a.status === status;
      const matchesQuery =
        !q || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [applications, search, status]);

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(app: JobApplication) {
    setEditing(app);
    setDialogOpen(true);
  }

  return (
    <div className="rise">
      <PageHeader
        title="Applications"
        subtitle="Every job and internship you've applied for, newest first."
        action={
          <Button onClick={openAdd}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Application
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by company or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxLength={100}
          className="sm:max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="surface p-10 text-center text-sm text-muted-foreground">Loading…</div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet."
          description="Start tracking your first application."
          action={<Button onClick={openAdd}>+ Add Application</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching applications."
          description="Try a different search or status filter."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="surface hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Platform</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((app) => (
                  <tr key={app.id} className="transition-colors hover:bg-secondary/50">
                    <td className="px-5 py-3.5 font-medium text-foreground">{app.company}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{app.role}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{app.platform}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {formatShortDate(app.application_date)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${app.company}`}
                          onClick={() => openEdit(app)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${app.company}`}
                          onClick={() => setPendingDelete(app)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((app) => (
              <div key={app.id} className="surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{app.company}</p>
                    <p className="truncate text-sm text-muted-foreground">{app.role}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {app.platform} · {formatShortDate(app.application_date)}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(app)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPendingDelete(app)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `${pendingDelete.role} at ${pendingDelete.company} will be permanently removed.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingDelete) return;
                remove.mutate(pendingDelete.id, {
                  onSuccess: () => toast.success("Application deleted."),
                  onError: (e) => toast.error(e.message),
                });
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
