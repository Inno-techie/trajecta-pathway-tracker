import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AuthLayout } from "@/components/trajecta/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — TRAJECTA" },
      {
        name: "description",
        content: "Create a free TRAJECTA account and start tracking your placement preparation.",
      },
      { property: "og:title", content: "Create your account — TRAJECTA" },
      {
        property: "og:description",
        content: "Create a free TRAJECTA account and start tracking your placement preparation.",
      },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    email: z.string().trim().email("Enter a valid email address").max(255),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be under 72 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.fullName },
      },
    });
    setLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      toast.error(
        msg.includes("already registered") || msg.includes("already been registered")
          ? "An account with this email already exists."
          : error.message,
      );
      return;
    }

    if (data.session) {
      toast.success("Welcome to TRAJECTA.");
      void navigate({ to: "/dashboard", replace: true });
    } else {
      toast.success("Account created. Check your email to confirm, then sign in.");
      void navigate({ to: "/login", replace: true });
    }
  }

  async function googleSignIn() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/dashboard", replace: true });
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start recording your preparation from today."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            autoComplete="name"
            maxLength={80}
          />
          {errors["fullName"] && <p className="text-xs text-destructive">{errors["fullName"]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
          {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={values.password}
            onChange={(e) => set("password", e.target.value)}
            autoComplete="new-password"
          />
          {errors["password"] ? (
            <p className="text-xs text-destructive">{errors["password"]}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              At least 8 characters, with a letter and a number.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            value={values.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            autoComplete="new-password"
          />
          {errors["confirm"] && <p className="text-xs text-destructive">{errors["confirm"]}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" className="w-full" onClick={() => void googleSignIn()}>
        Continue with Google
      </Button>
    </AuthLayout>
  );
}
