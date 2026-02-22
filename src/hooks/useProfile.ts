import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "@/types/restaurant";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setProfile(null);
        } else {
          console.error("Profile fetch error:", error);
        }
      } else {
        setProfile(data as Profile);
      }
      setIsLoading(false);
    };

    fetchProfile();

    const subscribe = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      channel = supabase
        .channel("profile-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `user_id=eq.${session.user.id}`,
          },
          () => {
            fetchProfile();
          }
        )
        .subscribe();
    };

    subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { profile, role: profile?.role ?? null, isLoading };
}
