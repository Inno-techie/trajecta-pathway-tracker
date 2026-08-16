import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader, SectionCard } from "@/components/trajecta/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useUpdateProfile } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — TRAJECTA" },
      { name: "description", content: "Manage your TRAJECTA account details." },
      { property: "og:title", content: "Profile — TRAJECTA" },
      { property: "og:description", content: "Manage your TRAJECTA account details." },
    ],
  }),
  component: ProfilePage,
});

const nameSchema = z.string().trim().min(2, "Enter your full name").max(80);

function ProfilePage() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) setName(profile.full_name);
  }, [profile]);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  return (
    <div className="rise max-w-xl">
      <PageHeader title="Profile" subtitle="Your account details." />

      <SectionCard title="Account">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const parsed = nameSchema.safeParse(name);
            if (!parsed.success) {
              setError(parsed.error.issues[0]?.message ?? "Invalid name");
              return;
            }
            setError("");
            update.mutate(parsed.data, {
              onSuccess: () => toast.success("Profile updated."),
              onError: (err) => toast.error(err.message),
            });
          }}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} readOnly disabled />
            <p className="text-xs text-muted-foreground">Your sign-in email cannot be changed.</p>
          </div>
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </SectionCard>
    </div>
  );
}
