import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface OrderSession {
  id: string;
  otp: string;
  room_number: string | null;
  table_number: string | null;
  created_by: string | null;
  expires_at: string;
  status: "active" | "closed";
  created_at: string;
}

export function useOrderSession(sessionId: string | null) {
  const [session, setSession] = useState<OrderSession | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!sessionId) {
      setSession(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("order_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !data) {
      setSession(null);
    } else {
      setSession(data as OrderSession);
    }
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!sessionId) return;
    const channel = supabase
      .channel(`order-session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_sessions",
          filter: `id=eq.${sessionId}`,
        },
        fetch
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetch]);

  return { session, loading, refetch: fetch };
}
