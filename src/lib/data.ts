import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toDateKey } from "./trajecta";

export type Profile = { id: string; full_name: string; created_at: string };

export type JobApplication = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  platform: string;
  application_date: string;
  status: string;
  created_at: string;
};

export type PracticeLog = {
  id: string;
  category: string;
  topic: string;
  practice_date: string;
};

export type CodingTopic = {
  id: string;
  topic: string;
  easy: number;
  medium: number;
  hard: number;
  last_practiced: string | null;
};

export const qk = {
  profile: ["profile"] as const,
  applications: ["applications"] as const,
  practice: ["practice"] as const,
  coding: ["coding"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: qk.profile,
    queryFn: async (): Promise<Profile | null> => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, created_at")
        .eq("id", auth.user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as Profile;
      const fallback = {
        id: auth.user.id,
        full_name:
          (auth.user.user_metadata?.["full_name"] as string | undefined) ??
          auth.user.email ??
          "",
      };
      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .insert(fallback)
        .select("id, full_name, created_at")
        .single();
      if (insertError) throw insertError;
      return created as Profile;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fullName: string) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", auth.user.id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.profile }),
  });
}

export function useApplications() {
  return useQuery({
    queryKey: qk.applications,
    queryFn: async (): Promise<JobApplication[]> => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("application_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JobApplication[];
    },
  });
}

export type ApplicationInput = {
  company: string;
  role: string;
  platform: string;
  application_date: string;
  status: string;
};

export function useSaveApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: ApplicationInput }) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not signed in");
      if (id) {
        const { error } = await supabase.from("job_applications").update(values).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("job_applications")
          .insert({ ...values, user_id: auth.user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.applications }),
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.applications }),
  });
}

export function usePracticeLogs() {
  return useQuery({
    queryKey: qk.practice,
    queryFn: async (): Promise<PracticeLog[]> => {
      const { data, error } = await supabase
        .from("practice_logs")
        .select("id, category, topic, practice_date")
        .order("practice_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PracticeLog[];
    },
  });
}

export function useTogglePractice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      category,
      topic,
      practiced,
      date = toDateKey(),
    }: {
      category: string;
      topic: string;
      practiced: boolean;
      date?: string;
    }) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not signed in");
      if (practiced) {
        // Unique(user, category, topic, date) prevents duplicate day records.
        const { error } = await supabase
          .from("practice_logs")
          .upsert(
            { user_id: auth.user.id, category, topic, practice_date: date },
            { onConflict: "user_id,category,topic,practice_date", ignoreDuplicates: true },
          );
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("practice_logs")
          .delete()
          .eq("user_id", auth.user.id)
          .eq("category", category)
          .eq("topic", topic)
          .eq("practice_date", date);
        if (error) throw error;
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.practice }),
  });
}

export function useCodingTopics() {
  return useQuery({
    queryKey: qk.coding,
    queryFn: async (): Promise<CodingTopic[]> => {
      const { data, error } = await supabase
        .from("coding_topics")
        .select("id, topic, easy, medium, hard, last_practiced");
      if (error) throw error;
      return (data ?? []) as CodingTopic[];
    },
  });
}

export function useSaveCodingTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      topic,
      easy,
      medium,
      hard,
    }: {
      topic: string;
      easy: number;
      medium: number;
      hard: number;
    }) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not signed in");
      const { error } = await supabase.from("coding_topics").upsert(
        {
          user_id: auth.user.id,
          topic,
          easy,
          medium,
          hard,
          last_practiced: toDateKey(),
        },
        { onConflict: "user_id,topic" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.coding });
      void qc.invalidateQueries({ queryKey: qk.practice });
    },
  });
}
